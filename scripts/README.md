# Security Scan Scripts

This directory contains scripts used in the security scanning workflow.

## Files

### `generate-report.js`
Generates unified security findings from multiple tools (npm audit, Trivy, SonarQube) and produces:
- `reports/foundings.json` - Unified JSON findings
- `reports/security_report.md` - Markdown report
- `reports/security_report.pdf` - PDF report

### `create-linear-issues.js`
Creates Linear issues for each security finding from the unified findings file.

## Usage

The scripts are designed to be run as part of a GitHub Actions workflow, but can also be executed manually:

```bash
node scripts/generate-report.js
node scripts/create-linear-issues.js
```

## Dependencies

The scripts require the following Node modules:
- `strip-ansi` - For sanitizing logs
- `graphql-request` - For Linear API communication
- `markdown-pdf` - For PDF report generation