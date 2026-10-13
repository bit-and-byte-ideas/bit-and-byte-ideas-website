/** Labels for elements rendered from Markdown content (any collection). */
export const contentLabels = {
  /** Scrollable table container; names the columns when the table has a header row. */
  table: (columns: readonly string[]) =>
    columns.length > 0 ? `Table: ${columns.join(', ')}` : 'Table',
  code: (language: string) => `Code example: ${language}`,
  headingLink: (heading: string) => `Link to section ${heading}`,
};

/** Display names for the fence languages authors may use (docs/website/CONTENT.md). */
export const codeLanguageNames: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TSX',
  js: 'JavaScript',
  go: 'Go',
  bash: 'Bash',
  json: 'JSON',
  yaml: 'YAML',
  http: 'HTTP',
  sql: 'SQL',
  css: 'CSS',
  hcl: 'HCL',
  dockerfile: 'Dockerfile',
  text: 'Text',
};
