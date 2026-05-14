#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
INFRA_DIR="$REPO_ROOT/deploy/infra"

find "$INFRA_DIR" -type d -name '*.terraform' -prune -o -type f -name '*.tf' -print \
  | sed 's|/[^/]*$||' | sort -u \
  | while read -r dir; do
      echo "Validating: $dir"
      docker run --rm \
        -v "$dir:/workspace" \
        -w /workspace \
        --entrypoint sh \
        ghcr.io/opentofu/opentofu:latest \
        -c "tofu init -backend=false -input=false > /dev/null && tofu validate"
    done
