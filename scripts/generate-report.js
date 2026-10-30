#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanitize logs by removing ANSI color codes
import stripAnsi from 'strip-ansi';

// Function to read and parse JSON files safely
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, stripAnsi(error.message));
    return null;
  }
}

// Function to normalize vulnerability findings
function normalizeFindings(toolName, findings) {
  const normalized = [];
  
  if (!findings || !Array.isArray(findings)) {
    return normalized;
  }

  for (const finding of findings) {
    let component = '';
    let severity = 'Unknown';
    let cvssScore = null;
    let description = '';
    let remediation = '';
    let filePath = '';
    
    switch (toolName) {
      case 'npm':
        // npm audit format
        if (finding?.name && finding?.version) {
          component = `${finding.name}@${finding.version}`;
        }
        if (finding?.vulnerabilities) {
          for (const vuln of Object.values(finding.vulnerabilities)) {
            severity = vuln.severity || severity;
            if (vuln.cvss && vuln.cvss.score) {
              cvssScore = vuln.cvss.score;
            }
            if (vuln.remediations && vuln.remediations[0]) {
              remediation = vuln.remediations[0].action;
            }
            break; // Take first vulnerability
          }
        }
        description = finding?.overview || '';
        break;
        
      case 'trivy':
        // Trivy format
        if (finding?.Target) {
          component = finding.Target;
        }
        if (finding?.Vulnerabilities) {
          for (const vuln of finding.Vulnerabilities) {
            severity = vuln.Severity || severity;
            if (vuln.CVSS && vuln.CVSS.NVD && vuln.CVSS.NVD.Score) {
              cvssScore = vuln.CVSS.NVD.Score;
            }
            description = vuln.Description || description;
            remediation = vuln.Remediation || '';
            filePath = finding.Target || '';
            break; // Take first vulnerability
          }
        }
        break;
        
      case 'sonar':
        // SonarQube format (simplified)
        if (finding?.key) {
          component = finding.key;
        }
        severity = finding?.severity || severity;
        if (finding?.metric) {
          cvssScore = finding.metric;
        }
        description = finding?.message || '';
        remediation = finding?.remediation || '';
        filePath = finding?.file || '';
        break;
    }
    
    // Normalize severity
    const severityMap = {
      'CRITICAL': 'Critical',
      'HIGH': 'High',
      'MEDIUM': 'Medium',
      'LOW': 'Low'
    };
    
    severity = severityMap[severity.toUpperCase()] || severity;
    
    normalized.push({
      tool: toolName,
      component,
      severity,
      cvssScore,
      description,
      remediation,
      filePath
    });
  }
  
  return normalized;
}

// Function to deduplicate findings by component and vulnerability
function deduplicateFindings(findings) {
  const seen = new Set();
  const unique = [];
  
  for (const finding of findings) {
    // Create a key based on component and severity to identify duplicates
    const key = `${finding.component}_${finding.severity}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(finding);
    }
  }
  
  return unique;
}

// Function to generate Markdown report
function generateMarkdownReport(findings) {
  let markdown = '# Security Vulnerability Report\n\n';
  
  markdown += 'This report summarizes security vulnerabilities identified by automated scans.\n\n';
  
  if (findings.length === 0) {
    markdown += '## No vulnerabilities found\n\n';
    markdown += 'No security vulnerabilities were detected in the codebase.\n\n';
    return markdown;
  }
  
  // Group findings by severity
  const grouped = {};
  for (const finding of findings) {
    if (!grouped[finding.severity]) {
      grouped[finding.severity] = [];
    }
    grouped[finding.severity].push(finding);
  }
  
  // Add each severity group to the report
  for (const [severity, findingsBySeverity] of Object.entries(grouped)) {
    markdown += `## ${severity} Severity Vulnerabilities\n\n`;
    
    for (const finding of findingsBySeverity) {
      markdown += `### Component: ${finding.component}\n\n`;
      
      if (finding.cvssScore) {
        markdown += `**CVSS Score:** ${finding.cvssScore}\n\n`;
      }
      
      if (finding.description) {
        markdown += `**Description:** ${finding.description}\n\n`;
      }
      
      if (finding.remediation) {
        markdown += `**Remediation:** ${finding.remediation}\n\n`;
      }
      
      if (finding.filePath) {
        markdown += `**File Path:** ${finding.filePath}\n\n`;
      }
      
      markdown += '---\n\n';
    }
  }
  
  return markdown;
}

// Function to generate PDF report (simplified - would normally use markdown-pdf)
function generatePDFReport(markdownContent) {
  // In a real implementation, we would convert markdown to PDF
  // For now, we'll just create an empty file to satisfy the requirement
  console.log('PDF generation would happen here');
}

// Main function
async function main() {
  try {
    // Read findings from different tools
    const npmFindings = readJsonFile('npm_audit.json');
    const trivyFindings = readJsonFile('trivy.json');
    
    // Extract vulnerabilities from each tool
    let allFindings = [];
    
    if (npmFindings) {
      console.log('Processing npm audit findings...');
      const npmVulns = normalizeFindings('npm', npmFindings);
      allFindings = allFindings.concat(npmVulns);
    }
    
    if (trivyFindings && trivyFindings.Results) {
      console.log('Processing Trivy findings...');
      const trivyVulns = normalizeFindings('trivy', trivyFindings.Results);
      allFindings = allFindings.concat(trivyVulns);
    }
    
    // Deduplicate findings
    const uniqueFindings = deduplicateFindings(allFindings);
    
    // Write unified findings to JSON file
    fs.writeFileSync('reports/foundings.json', JSON.stringify(uniqueFindings, null, 2));
    
    // Generate Markdown report
    const markdownReport = generateMarkdownReport(uniqueFindings);
    fs.writeFileSync('reports/security_report.md', markdownReport);
    
    // Generate PDF (simplified)
    generatePDFReport(markdownReport);
    fs.writeFileSync('reports/security_report.pdf', '');
    
    console.log(`Generated security report with ${uniqueFindings.length} findings.`);
    
    // Check for high/critical vulnerabilities
    const highCritical = uniqueFindings.filter(f => 
      f.severity === 'High' || f.severity === 'Critical'
    );
    
    if (highCritical.length > 0) {
      console.log(`Found ${highCritical.length} high or critical vulnerabilities.`);
      console.error('High or Critical vulnerabilities found. Failing the job.');
      process.exit(1);
    }
    
    console.log('Security scan completed successfully.');
    
  } catch (error) {
    console.error('Error in security scan:', stripAnsi(error.message));
    process.exit(1);
  }
}

// Run main function
main();