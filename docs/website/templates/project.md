---
# Copy to src/content/work/<slug>/index.md. The folder name is the slug.
# Field rules: docs/website/CONTENT.md#project-srccontentworkslugindexmd
title: 'TODO: Project title (≤ 70 chars)'
summary: 'TODO: One or two sentences on what was built and for whom (50–160 chars).'
kind: client # client | internal | concept
status: draft # stays draft until Carlos adds `review` (and `publicApproval` for client work)
category: website # website | web-application | automation | integration
services: [build] # any of: build, automate, maintain
industry: 'TODO: e.g. Dental practice'
technologies: ['TODO']
completedOn: 'TODO: YYYY-MM'
# updatedOn: YYYY-MM-DD
# liveUrl: https://example.com     # client work: only if publicApproval.scope includes live-link
# featured: 1                      # homepage rank; omit to leave off the homepage

client: # required for kind: client; delete for internal/concept
  name: 'TODO: Display name, or a description if anonymized'
  anonymized: false

images:
  - file: home-desktop.png # in ./images/
    alt: 'TODO: What the screenshot shows, specifically (10–200 chars)'
    role: cover # exactly one cover
    viewport: desktop
    capturedOn: 'TODO: YYYY-MM-DD'

# outcomes:                        # verified results only; never for kind: concept
#   - statement: 'TODO: What changed, in plain words.'
#     evidence: 'TODO: How this was verified (never rendered).'

# Added by Carlos only. Agents must never write these two blocks.
# publicApproval:
#   approvedBy: 'Name, Role at client'
#   approvedOn: YYYY-MM-DD
#   scope: [name, description, screenshots, live-link, outcomes]
#   reference: 'Where the written approval is kept'
# review:
#   approvedBy: Carlos Barajas
#   approvedOn: YYYY-MM-DD
---

## Problem

TODO: What the customer was struggling with, in their terms. Who was affected and how.

## Constraints

TODO: Budget, timeline, existing systems, content, compliance, or skills the solution
had to respect.

## Approach

TODO: How the problem was broken down and why this direction was chosen over the
alternatives.

## Solution

TODO: What was delivered and how it works for the customer day to day. Link to the live
site in frontmatter, not here.
