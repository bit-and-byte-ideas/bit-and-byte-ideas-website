import { parse, YAMLParseError } from 'yaml';

export type FrontmatterResult =
  | {
      ok: true;
      data: Record<string, unknown>;
      body: string;
      /** 1-based line in the source file where the Markdown body starts. */
      bodyStartLine: number;
    }
  | { ok: false; message: string; line?: number };

/**
 * Splits a `---` YAML frontmatter block from the Markdown body and parses it.
 * Duplicate keys are an error. YAML 1.2 core schema: dates stay strings.
 */
export function parseFrontmatter(raw: string): FrontmatterResult {
  const source = raw.replace(/\r\n?/g, '\n');
  if (!source.startsWith('---\n')) {
    return { ok: false, message: 'must start with a --- frontmatter block', line: 1 };
  }
  const close = source.indexOf('\n---', 3);
  const afterClose = close === -1 ? -1 : close + 4;
  if (close === -1 || (afterClose < source.length && source[afterClose] !== '\n')) {
    return { ok: false, message: 'frontmatter block is not closed with ---', line: 1 };
  }

  const yamlText = source.slice(4, close + 1);
  let data: unknown;
  try {
    data = parse(yamlText, { uniqueKeys: true, prettyErrors: true });
  } catch (error) {
    if (error instanceof YAMLParseError) {
      const line = error.linePos?.[0]?.line;
      return {
        ok: false,
        message: `invalid YAML: ${error.message.split('\n')[0]}`,
        line: line === undefined ? undefined : line + 1,
      };
    }
    throw error;
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, message: 'frontmatter must be a YAML mapping of fields', line: 2 };
  }

  const body = afterClose >= source.length ? '' : source.slice(afterClose + 1);
  const bodyStartLine = source.slice(0, afterClose + 1).split('\n').length;
  return { ok: true, data: data as Record<string, unknown>, body, bodyStartLine };
}
