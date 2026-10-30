#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanitize logs by removing ANSI color codes
import stripAnsi from 'strip-ansi';
import { GraphQLClient } from 'graphql-request';

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
const CREATE_LINEAR_ISSUE = `
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

  // Create GraphQL client
  const client = new GraphQLClient('https://api.linear.app/graphql', {
    headers: {
      'Authorization': `Bearer ${linearToken}`,
    },
  });

  let successCount = 0;
  
  for (const finding of findings) {
    try {
      // Prepare issue data
      const issueData = {
        title: `Security Vulnerability: ${finding.severity} – ${finding.component || 'Unknown Component'}`,
        description: `
          **Component:** ${finding.component || 'N/A'}
          
          **Severity:** ${finding.severity}
          
          **Tool:** ${finding.tool}
          
          **Description:** ${finding.description || 'No description available'}
          
          **Remediation:** ${finding.remediation || 'No remediation steps provided'}
          
          **CVSS Score:** ${finding.cvssScore || 'N/A'}
        `.trim(),
        labels: [
          'security',
          finding.severity.toLowerCase()
        ],
        teamId: 'security-team', // This would need to be configured
      };

      // Execute GraphQL mutation
      const response = await client.request(CREATE_LINEAR_ISSUE, { 
        input: issueData 
      });
      
      console.log(`Created Linear issue: ${response.issueCreate.issue.id} - ${finding.component}`);
      successCount++;
    } catch (error) {
      console.error('Error creating Linear issue for:', finding.component, stripAnsi(error.message));
    }
  }
  
  console.log(`Successfully created ${successCount} Linear issues out of ${findings.length}`);
  return successCount > 0;
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