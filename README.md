# Avuny Starter

```md
# Semantic Commit Messages

See how a minor change to your commit message style can make you a better programmer.

## Format
```

<type>(<scope>): <subject>

```

- `<scope>` is **optional**
- `<subject>` should be written in **present tense**, concise, and descriptive

## Example

```

feat: add hat wobble

```

```

^--^ ^------------^
| |
| +-> Summary in present tense
|
+-------> Type

```

## Commit Types

- **feat**: A new feature for the user (not a new feature for a build script)
- **fix**: A bug fix for the user (not a fix to a build script)
- **docs**: Documentation-only changes
- **style**: Formatting changes (missing semicolons, linting, etc.; no production code change)
- **refactor**: Refactoring production code (e.g., renaming a variable)
- **test**: Adding missing tests or refactoring tests (no production code change)
- **chore**: Updating build tasks, tooling, or dependencies (no production code change)

## More Examples

```

feat(auth): add JWT refresh token support
fix(api): handle null user response
docs(readme): update installation steps
style(ui): fix spacing and alignment
refactor(user): rename profile handler
test(auth): add login edge case tests
chore(ci): update GitHub Actions config

```

## References

- https://www.conventionalcommits.org/
- https://seesparkbox.com/foundry/semantic_commit_messages
- http://karma-runner.github.io/1.0/dev/git-commit-msg.html
```
