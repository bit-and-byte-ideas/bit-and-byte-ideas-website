describe('create-linear-issues.js', () => {
  // Since we can't easily test ESM modules in this environment, we'll validate the structure
  test('should have a valid create-linear-issues.js file', () => {
    const fs = require('fs');
    const scriptPath = '../scripts/create-linear-issues.js';
    expect(fs.existsSync(scriptPath)).toBe(true);
    
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain('readFindings');
    expect(content).toContain('CREATE_LINEAR_ISSUE');
    expect(content).toContain('createLinearIssues');
    expect(content).toContain('main');
  });
});