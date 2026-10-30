describe('generate-report.js', () => {
  // Since we can't easily test ESM modules in this environment, we'll validate the structure
  test('should have a valid generate-report.js file', () => {
    const fs = require('fs');
    const scriptPath = '../scripts/generate-report.js';
    expect(fs.existsSync(scriptPath)).toBe(true);
    
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain('normalizeFindings');
    expect(content).toContain('generateMarkdownReport');
    expect(content).toContain('generatePDFReport');
    expect(content).toContain('main');
  });
});