# Dev Server & .next Cache Troubleshooting

This project lives on OneDrive, which syncs `.next` build cache files and causes corruption (webpack `Cannot find module` errors, stale font manifests, internal server errors).

## Fix: Delete .next and restart

```bash
rm -rf .next && npm run dev
```

## When to restart

- After a `git commit` or `git checkout` (git rewrites files that OneDrive re-syncs mid-build)
- After `npm install` or any `package.json` change
- After any "Internal Server Error" or "Cannot find module" runtime error
- After CSS disappears entirely (Tailwind JIT cache desync)
- After switching branches
- When the dev server has been idle for a long time and OneDrive has synced

## Permanent fix

Exclude `.next` and `node_modules` from OneDrive sync, or move the project outside OneDrive (e.g., `C:\Dev\MVPG-funnel`).
