describe('Scripts validation', () => {
  test('should validate that all required scripts exist', () => {
    const fs = require('fs');
    
    // Check that scripts exist
    expect(fs.existsSync('./scripts/generate-report.js')).toBe(true);
    expect(fs.existsSync('./scripts/create-linear-issues.js')).toBe(true);
    
    // Check that package.json includes required dev dependencies
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const devDependencies = packageJson.devDependencies || {};
    
    expect(devDependencies['jest']).toBeDefined();
    expect(devDependencies['markdown-pdf']).toBeDefined();
    expect(devDependencies['strip-ansi']).toBeDefined();
    expect(devDependencies['graphql-request']).toBeDefined();
    expect(devDependencies['vitest']).toBeDefined();
  });
  
  test('should validate script structure', () => {
    const fs = require('fs');
    
    // Check generate-report.js structure
    const generateReportContent = fs.readFileSync('./scripts/generate-report.js', 'utf8');
    expect(generateReportContent).toContain('normalizeFindings');
    expect(generateReportContent).toContain('generateMarkdownReport');
    expect(generateReportContent).toContain('main');
    
    // Check create-linear-issues.js structure
    const createLinearIssuesContent = fs.readFileSync('./scripts/create-linear-issues.js', 'utf8');
    expect(createLinearIssuesContent).toContain('readFindings');
    expect(createLinearIssuesContent).toContain('createLinearIssues');
    expect(createLinearIssuesContent).toContain('CREATE_LINEAR_ISSUE');
    expect(createLinearIssuesContent).toContain('GraphQLClient');
  });
});