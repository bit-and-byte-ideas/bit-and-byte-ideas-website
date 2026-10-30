import fs from 'fs';

describe('Repository structure', () => {
  test('should have required directories', () => {
    expect(fs.existsSync('scripts')).toBe(true);
    expect(fs.existsSync('reports')).toBe(true);
  });

  test('should have package.json with required dependencies', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const devDeps = packageJson.devDependencies || {};
    
    // Check that all required dev dependencies are present
    expect(devDeps).toHaveProperty('jest');
    expect(devDeps).toHaveProperty('markdown-pdf');
    expect(devDeps).toHaveProperty('strip-ansi');
    expect(devDeps).toHaveProperty('graphql-request');
    expect(devDeps).toHaveProperty('vitest');
  });
});