# Git Branching ve PR Stratejisi

## Branch Naming
- `main`: Production
- `develop`: Integration
- `feature/faz-0-domain`: Feature branches
- `hotfix/bug-123`: Urgent fixes
- `release/v1.0.0`: Releases

## PR Rules
- Base: develop (feature), main (release/hotfix)
- Template: Aşağıdaki zorunlu bölümler
- Min 1 approval
- CI pass required

## PR Template (.github/PULL_REQUEST_TEMPLATE.md)
```
## Description
[Değişiklik özeti]

## Related Issue
#123

## Changes
- [ ] File1
- [ ] Feature X

## Testing
- [ ] Local test passed
- [ ] CI green
```

Husky pre-commit ile lint enforced.
