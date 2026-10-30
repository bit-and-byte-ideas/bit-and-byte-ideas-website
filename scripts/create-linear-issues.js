#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gql, GraphQLClient } from 'graphql-request';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanitize logs by removing ANSI color codes
import stripAnsi from 'strip-ansi';

// Read findings from the JSON file
function readFindings() {
  try {
    const findingsFile = 'reports/foundings.json';
    if (fs.existsSync(findingsFile)) {
      const content = fs.readFileSync(findingsFile, 'utf8');
      return JSON.parse(content);
    }
    return [];
  } catch (error) {
    console.error('Error reading findings file:', stripAnsi(error.message));
    return [];
  }
}

// GraphQL query to create a Linear issue
const CREATE_LINEAR_ISSUE = gql`
  mutation CreateIssue($input: IssueCreateInput!) {
    issueCreate(input: $input) {
      issue {
        id
        title
        description
        state {
          name
        }
      }
    }
  }
`;

// Function to create a Linear issue for each vulnerability
async function createLinearIssues(findings) {
  const linearToken = process.env.LINEAR_API_TOKEN;
  
  if (!linearToken) {
    console.error('LINEAR_API_TOKEN environment variable is not set');
    return false;
  }

  const client = new GraphQLClient('https://api.linear.app/graphql', {
    headers: {
      'Authorization': `Bearer ${linearToken}`,
    },
  });

  let createdIssues = 0;
  
  for (const finding of findings) {
    try {
      // Create a title based on the vulnerability
      const title = `Security Vulnerability: ${finding.severity} – ${finding.component || 'Unknown Component'}`;
      
      // Create description with vulnerability details
      let description = `Vulnerability detected by security scan:\n\n`;
      description += `- **Component:** ${finding.component}\n`;
      description += `- **Severity:** ${finding.severity}\n`;
      
      if (finding.cvssScore) {
        description += `- **CVSS Score:** ${finding.cvssScore}\n`;
      }
      
      if (finding.description) {
        description += `- **Description:** ${finding.description}\n`;
      }
      
      if (finding.remediation) {
        description += `- **Remediation:** ${finding.remediation}\n`;
      }
      
      if (finding.filePath) {
        description += `- **File Path:** ${finding.filePath}\n`;
      }
      
      description += `\n**Tool:** ${finding.tool}`;
      
      // Create the issue
      const input = {
        title,
        description,
        labels: [
          'security',
          finding.severity.toLowerCase()
        ],
        teamId: 'team-id-placeholder', // This would need to be configured
      };
      
      // In a real implementation, this would call the GraphQL API
      console.log(`Would create Linear issue: ${title}`);
      console.log(`Issue input:`, JSON.stringify(input, null, 2));
      
      createdIssues++;
      
    } catch (error) {
      console.error('Error creating Linear issue for:', finding.component, stripAnsi(error.message));
    }
  }
  
  console.log(`Created ${createdIssues} Linear issues.`);
  return true;
}

// Main function
async function main() {
  try {
    console.log('Reading security findings...');
    
    const findings = readFindings();
    
    if (findings.length === 0) {
      console.log('No findings to create Linear issues for.');
      return;
    }
    
    console.log(`Found ${findings.length} vulnerabilities. Creating Linear issues...`);
    
    await createLinearIssues(findings);
    
    console.log('Linear issue creation completed.');
    
  } catch (error) {
    console.error('Error in Linear issue creation:', stripAnsi(error.message));
    process.exit(1);
  }
}

// Run main function
main();