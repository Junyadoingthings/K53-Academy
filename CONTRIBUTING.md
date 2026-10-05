# Contributing to K53 Academy

Thank you for helping. People use this app to prepare for a real test, so **getting answers right matters more than adding more of them.**

## Ways to help

- **Fix a wrong answer or an outdated rule.** Open a [content correction](https://github.com/Junyadoingthings/K53-Academy/issues/new?template=content-correction.yml) and include a source, such as the National Road Traffic Act, its regulations, the SADC Road Traffic Signs Manual or an official licensing department page.
- **Report a bug.** Use the [bug report](https://github.com/Junyadoingthings/K53-Academy/issues/new?template=bug-report.yml) template.
- **Add questions or translations.** Open an issue first so the work isn't duplicated.

## Local setup

```bash
git clone https://github.com/Junyadoingthings/K53-Academy.git
cd K53-Academy
npm install
npm run dev        # http://localhost:5300
```

## Where the content lives

| What | File |
|---|---|
| Lessons | `lib/data/rooms.ts` |
| Learning paths | `lib/data/paths.ts` |
| Hand-written questions | `lib/data/questions.ts` |
| Road sign names and meanings | `lib/data/signs.ts` |
| Sign artwork (official SADC SVGs) | `public/signs/<sign-number>.svg` |

Every sign in `lib/data/signs.ts` gets a practice question automatically from `lib/data/sign-questions.ts`. Don't write sign questions by hand.

## Before you open a pull request

1. Create a branch from `main`: `git checkout -b fix/short-description`.
2. Make sure the project type-checks with `npx tsc --noEmit`.
3. Make sure it builds with `npm run build`.
4. For content changes, link the source in the pull request description.
5. Keep each pull request focused on one fix or feature.

## Style

- TypeScript throughout. Keep the content types in `lib/data/types.ts` accurate.
- Use the existing design tokens in `tailwind.config.ts` and `app/globals.css` rather than one-off colours.
- Write in plain South African English. Say *licence* (the noun) and *learner's*, not *learners*.
