<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the imported Cidade Operacional entry in `src/routes/index.tsx` and reusable original city modules in `src/components`, `src/data`, `src/types`, and `src/services`; preserve the source design and interactions while using TanStack Start's bootstrap.
- The imported app retains its original browser-local storage behavior; do not silently replace it with a shared backend during source migration.
