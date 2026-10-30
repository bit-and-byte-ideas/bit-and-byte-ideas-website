describe('Security Scan Implementation Validation', () => {
  test('should have all required files and directories', () => {
    const fs = require('fs');
    
    // Check that key directories exist
    expect(fs.existsSync('scripts')).toBe(true);
    expect(fs.existsSync('reports')).toBe(true);
    expect(fs.existsSync('.github/workflows')).toBe(true);
    
    // Check that scripts exist
    expect(fs.existsSync('scripts/generate-report.js')).toBe(true);
    expect(fs.existsSync('scripts/create-linear-issues.js')).toBe(true);
    
    // Check package.json has required dependencies
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const devDeps = packageJson.devDependencies || {};
    
    expect(devDeps).toHaveProperty('jest');
    expect(devDeps).toHaveProperty('markdown-pdf');
    expect(devDeps).toHaveProperty('strip-ansi');
    expect(devDeps).toHaveProperty('graphql-request');
    expect(devDeps).toHaveProperty('vitest');
    
    // Check that there's a test script
    expect(packageJson.scripts).toHaveProperty('test');
  });

  test('should have correct structure in scripts', () => {
    const fs = require('fs');
    
    // Validate generate-report.js content
    const genReportContent = fs.readFileSync('scripts/generate-report.js', 'utf8');
    expect(genReportContent).toContain('normalizeFindings');
    expect(genReportContent).toContain('deduplicateFindings');
    expect(genReportContent).toContain('generateMarkdownReport');
    expect(genReportContent).toContain('main');
    
    // Validate create-linear-issues.js content
    const createIssuesContent = fs.readFileSync('scripts/create-linear-issues.js', 'utf8');
    expect(createIssuesContent).toContain('readFindings');
    expect(createIssuesContent).toContain('CREATE_LINEAR_ISSUE');
    expect(createIssuesContent).toContain('createLinearIssues');
    expect(createIssuesContent).toContain('main');
  });
});