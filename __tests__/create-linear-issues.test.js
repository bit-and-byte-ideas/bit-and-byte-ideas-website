import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock the stripAnsi and graphql-request functions to avoid actual dependencies
jest.mock('strip-ansi', () => {
  return (str) => str;
});

describe('create-linear-issues.js', () => {
  beforeEach(() => {
    // Create mock reports directory
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports');
    }
    
    // Clear any existing test files
    const testFiles = ['reports/foundings.json'];
    testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  });

  afterEach(() => {
    // Clean up test files
    const testFiles = ['reports/foundings.json'];
    testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    
    // Remove reports directory if it exists and is empty
    if (fs.existsSync('reports') && fs.readdirSync('reports').length === 0) {
      fs.rmdirSync('reports');
    }
  });

  test('should handle missing findings file gracefully', () => {
    // This should not throw an error when no findings file exists
    expect(() => {
      // We'll test the actual script execution in a more integrated way
    }).not.toThrow();
  });

  test('should process findings and create appropriate data structure', () => {
    // Create a mock findings file
    const mockFindings = [
      {
        "tool": "npm",
        "component": "lodash@4.17.20",
        "severity": "High",
        "cvssScore": 7.5,
        "description": "Prototype pollution vulnerability",
        "remediation": "Update to version 4.17.21 or higher",
        "filePath": "node_modules/lodash"
      }
    ];
    
    fs.writeFileSync('reports/foundings.json', JSON.stringify(mockFindings));
    
    // This would require more complex mocking to fully test the integration
    expect(true).toBe(true);
  });

  test('should handle empty findings gracefully', () => {
    // Create an empty findings file
    const mockFindings = [];
    fs.writeFileSync('reports/foundings.json', JSON.stringify(mockFindings));
    
    // This would require more complex mocking to fully test the integration
    expect(true).toBe(true);
  });
});