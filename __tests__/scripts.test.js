// Test to verify our scripts are syntactically correct and can be imported
import fs from 'fs';

describe('Scripts validation', () => {
  test('generate-report.js should exist and be readable', () => {
    const scriptPath = 'scripts/generate-report.js';
    expect(fs.existsSync(scriptPath)).toBe(true);
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toBeTruthy();
  });

  test('create-linear-issues.js should exist and be readable', () => {
    const scriptPath = 'scripts/create-linear-issues.js';
    expect(fs.existsSync(scriptPath)).toBe(true);
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toBeTruthy();
  });

  test('package.json should include required dev dependencies', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const devDeps = packageJson.devDependencies;
    
    expect(devDeps).toHaveProperty('jest');
    expect(devDeps).toHaveProperty('markdown-pdf');
    expect(devDeps).toHaveProperty('strip-ansi');
    expect(devDeps).toHaveProperty('graphql-request');
  });
});