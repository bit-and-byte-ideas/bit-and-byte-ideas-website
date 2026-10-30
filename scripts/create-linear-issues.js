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

  // Mock implementation for testing - in real usage this would call the GraphQL API
  console.log(`Would create ${findings.length} Linear issues.`);
  
  // In a real implementation, we would:
  // 1. Create a GraphQL client
  // 2. Loop through findings and create issues using CREATE_LINEAR_ISSUE mutation
  // 3. Handle errors appropriately
  
  for (const finding of findings) {
    try {
      // This is a mock - in reality, we'd call the API
      console.log(`Would create Linear issue: ${finding.component}`);
      
      // Mock issue creation with sample data
      const mockIssue = {
        id: `issue-${Math.random().toString(36).substr(2, 9)}`,
        title: finding.component,
        description: finding.description,
        severity: finding.severity,
        tool: finding.tool
      };
      
      console.log(`Mock issue created: ${mockIssue.id}`);
    } catch (error) {
      console.error('Error creating Linear issue for:', finding.component, stripAnsi(error.message));
    }
  }
  
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