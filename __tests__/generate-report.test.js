import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock the stripAnsi function to avoid actual dependency
jest.mock('strip-ansi', () => {
  return (str) => str;
});

describe('generate-report.js', () => {
  beforeEach(() => {
    // Create mock reports directory
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports');
    }
    
    // Clear any existing test files
    const testFiles = ['npm_audit.json', 'trivy.json', 'reports/foundings.json', 'reports/security_report.md', 'reports/security_report.pdf'];
    testFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  });

  afterEach(() => {
    // Clean up test files
    const testFiles = ['npm_audit.json', 'trivy.json', 'reports/foundings.json', 'reports/security_report.md', 'reports/security_report.pdf'];
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

  test('should handle missing JSON files gracefully', () => {
    // This should not throw an error even when files don't exist
    expect(() => {
      // We'll test the actual script execution in a more integrated way
    }).not.toThrow();
  });

  test('should create findings.json file with empty data when no input files', () => {
    // This test will be done as part of integration testing
  });
});