import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('sonar-project.properties configuration', () => {
  it('should exist at repository root', () => {
    const exists = fs.existsSync('./sonar-project.properties');
    expect(exists).toBe(true);
  });

  it('should contain required properties', () => {
    const content = fs.readFileSync('./sonar-project.properties', 'utf-8');
    
    // Check all required properties are present
    expect(content).toContain('sonar.projectKey=bitandbyte-website');
    expect(content).toContain('sonar.projectName=Bit and Byte Ideas Website');
    expect(content).toContain('sonar.sources=.');
    expect(content).toContain('sonar.host.url=http://localhost:9000');
    expect(content).toContain('sonar.login=admin');
    expect(content).toContain('sonar.projectVersion=0.0.0');
    expect(content).toContain('sonar.javascript.lcov.reportPaths=coverage/lcov.info');
    expect(content).toContain('sonar.exclusions=');
    
    // Verify coverage report path references coverage/lcov.info
    expect(content).toMatch(/sonar\.javascript\.lcov\.reportPaths=coverage\/lcov\.info/);
  });

  it('should reference coverage/lcov.info for JavaScript coverage reporting', () => {
    const content = fs.readFileSync('./sonar-project.properties', 'utf-8');
    expect(content).toContain('sonar.javascript.lcov.reportPaths=coverage/lcov.info');
  });

  it('should not be excluded from CI workflow', () => {
    // Check that the file is not in .gitignore patterns
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf-8');
    
    // The sonar-project.properties should NOT be ignored by any pattern
    // It's in the root, so it won't match any of the ignored directories like /coverage/
    expect(gitignoreContent).not.toContain('sonar-project.properties');
    expect(gitignoreContent).not.toMatch(/.*sonar-project\.properties.*/);
  });
});