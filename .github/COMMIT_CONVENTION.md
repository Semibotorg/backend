
# Commit Message Convention
> This is adapted from [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).
This project follows the conventional commit message format to ensure consistent and descriptive commit messages. The commit messages should adhere to the following rules:

## Commit Message Format

The commit message consists of a **header**, an optional **body**, and an optional **footer**. The header has a specific format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Type

The type describes the nature of the changes in the commit. It must be one of the following:

- `feat`: A new feature or enhancement.
- `fix`: A bug fix.
- `docs`: Documentation-related changes.
- `style`: Changes that do not affect the meaning of the code (e.g., formatting).
- `refactor`: Code changes that are neither a fix nor a feature.
- `test`: Adding or modifying tests.
- `chore`: Miscellaneous tasks such as build, config, etc.

### Scope (Optional)

The scope is optional and specifies the context of the changes. It can be anything that helps to identify the affected part of the codebase.

### Description

The description should be a concise summary of the changes in the commit. It should be written in the imperative mood and not exceed 100 characters.

### Body (Optional)

The body contains additional information about the changes. It is optional and can span multiple lines.

### Footer (Optional)

The footer is used to reference issues or provide other related metadata. It is optional and can span multiple lines.

## Examples

### New Feature

```
feat(users): add password reset functionality

Implemented the ability for users to reset their passwords using email verification.
```

### Bug Fix

```
fix(auth): handle expired tokens correctly

Fixed an issue where expired authentication tokens were not being properly handled,
resulting in an unexpected application behavior.
```

### Documentation Update

```
docs: update README with usage instructions

Added clear instructions on how to use the application and the available commands.
```

### Refactor

```
refactor(api): improve error handling

Refactored the API error handling to provide more detailed error messages
and improve the overall error reporting mechanism.
```

### Test Addition

```
test: add unit tests for authentication service

Wrote unit tests to verify the correct behavior of the authentication service
and improve test coverage.
```

### Chore

```
chore: update dependencies

Updated various project dependencies to their latest versions,
addressing security vulnerabilities and taking advantage of new features.
```

## Commit Message Examples

- `feat(users): add user authentication`
- `fix(bugs): fix server crash on invalid input`
- `docs: update API documentation`
- `refactor: optimize database queries`
- `test(api): add integration tests for user endpoints`
- `chore: update build configuration`

Please adhere to this commit message convention for all commits in the repository. This helps us maintain a clean and structured commit history and enables better collaboration among team members.
