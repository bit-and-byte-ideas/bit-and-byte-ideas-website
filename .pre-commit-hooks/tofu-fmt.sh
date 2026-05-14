#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
INFRA_DIR="$REPO_ROOT/deploy/infra"

find "$INFRA_DIR" -type d -name '*.terraform' -prune -o -type f -name '*.tf' -print \
  | sed 's|/[^/]*$||' | sort -u \
  | while read -r dir; do
      echo "Checking fmt: $dir"
      docker run --rm \
        -v "$dir:/workspace" \
        -w /workspace \
        ghcr.io/opentofu/opentofu:latest \
        fmt -check -diff
    done
