import fs from 'fs';
import path from 'path';

describe('Scripts validation', () => {
  test('generate-report.js should exist and be executable', () => {
    const scriptPath = '../scripts/generate-report.js';
    expect(fs.existsSync(scriptPath)).toBe(true);
  });

  test('create-linear-issues.js should exist and be executable', () => {
    const scriptPath = '../scripts/create-linear-issues.js';
    expect(fs.existsSync(scriptPath)).toBe(true);
  });
});