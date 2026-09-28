#!/usr/bin/env bash
# Prepares a worktree for an autonomous task (skill working-autonomously-in-a-worktree).
#
#   scripts/prepare-worktree.sh <branch>            e.g. scripts/prepare-worktree.sh feat/my-feature
#
# Leaves .claude/worktrees/<branch-with-dashes>/ ready with:
#   - a worktree of the main checkout on <branch>, created from origin/<base>: the default branch of
#     origin, freshly fetched, never the local branch, which may be behind or hold unpushed work.
#     With no remote, or a remote with no default branch yet (nothing pushed), from the main checkout's branch.
#   - the git-ignored files the repository needs to run (each package's .env, .claude/settings.local.json)
#   - node_modules installed and the husky hooks active
# Then write .plans/regime.md in the worktree and launch from the main checkout with
# `claude -w <branch-with-dashes>`, which reuses this worktree and keeps its branch.
set -euo pipefail
BRANCH=${1:?usage: scripts/prepare-worktree.sh <branch>}
MAIN=$(git rev-parse --show-toplevel)
NAME=${BRANCH//\//-}
TARGET=$MAIN/.claude/worktrees/$NAME
[ -e "$TARGET" ] && { echo "already exists: $TARGET" >&2; exit 1; }

default_branch_of_origin() {
  local base
  base=$(git -C "$MAIN" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || true)
  base=${base#origin/}
  [ -n "$base" ] || base=$(git -C "$MAIN" ls-remote --symref origin HEAD | awk '$1=="ref:" {sub("refs/heads/", "", $2); print $2}')
  echo "$base"
}

BASE=""
[ -n "$(git -C "$MAIN" remote)" ] && BASE=$(default_branch_of_origin)
if [ -n "$BASE" ]; then
  git -C "$MAIN" fetch -q origin "$BASE"
  FROM=origin/$BASE
else
  FROM=$(git -C "$MAIN" branch --show-current)
  echo "no default branch on origin: basing the worktree on the main checkout's branch, $FROM" >&2
fi
git -C "$MAIN" worktree add -q -b "$BRANCH" "$TARGET" "$FROM"
cd "$TARGET"
for file in $(git -C "$MAIN" status --ignored --short | awk '$1=="!!" && $2 ~ /\.env$/ {print $2}'); do
  mkdir -p "$(dirname "$file")"; cp "$MAIN/$file" "$file"
done
mkdir -p .claude
if [ -f "$MAIN/.claude/settings.local.json" ]; then cp "$MAIN/.claude/settings.local.json" .claude/; else echo '{}' > .claude/settings.local.json; fi
yarn install --immutable
# husky creates .husky/_ in this worktree; core.hooksPath (shared) is the relative `.husky/_`, which git
# resolves per worktree. Without this step git finds no hooks here and runs none, silently.
./node_modules/.bin/husky
echo "worktree ready: $TARGET (branch $BRANCH from $FROM)"
echo "launch from $MAIN, after writing .plans/regime.md in the worktree: claude -w $NAME"
