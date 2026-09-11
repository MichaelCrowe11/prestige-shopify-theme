# Prestige Shopify Theme

Shopify Online Store 2.0 theme written in Liquid, with 23 sections, 13 snippets and 11 JSON templates, built for a minimal luxury retail look.

## Status

`experimental`

Six commits between 2025-09-22 and 2026-02-22 (git log). No commits since. The theme packages today, but Shopify's own Theme Check reports 37 errors, so it is not ready for the Theme Store and would need work before use on a live store.

## Install and first run

Checked today with Shopify CLI 3.88.1, already on this machine. The theme needs no npm install; `package.json` lists only the CLI as a dev dependency and has no lockfile.

Static check, no store needed:

```
$ shopify theme check
53 files inspected with 49 total offenses found across 12 files.
37 errors.
12 warnings.
```

Package the theme into a zip you can upload in the Shopify admin under Online Store, Themes, Add theme:

```
$ shopify theme package
Your local theme was packaged in Prestige-1.0.0.zip
```

The zip was 127121 bytes and was deleted after the run; it is not committed.

Not run today, and why:

- `shopify theme dev` and `shopify theme push`. Both need a Shopify store login and would change that store. Not done in this check.
- Any Lighthouse or PageSpeed run. There is no store to point it at, and no report exists in the repo.

## What runs today

- `shopify theme check` runs and exits 1. The 37 errors break down as: 34 `TranslationKeyExists` (keys such as `general.messages.try_again` and `wishlist.general.empty` are used in Liquid but missing from `locales/en.default.json`), 2 `LiquidHTMLSyntaxError` (`product.created_at > 30.days.ago` in `snippets/product-card.liquid` line 57 and a similar line in `sections/featured-products-luxury.liquid` line 87; Liquid has no such expression), and 1 `ImgWidthAndHeight`. The 12 warnings are 7 `RemoteAsset`, 3 `AssetPreload`, 1 `HardcodedRoutes`, 1 `VariableName`.
- `shopify theme package` produces a zip from `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/` and `templates/`.
- The commit `11a76d2` (2026-02-04, "Update from Shopify") changed only `templates/index.json`, which shows the theme was connected to a store through the GitHub integration at that time. The repo does not say which store or whether it is still connected.
- No tests.

## Roadmap

None scheduled. If work resumes, the first fixes are the ones Theme Check names: add the 34 missing keys to `locales/en.default.json`, replace the two `30.days.ago` conditions with a date filter, and add width and height to the one flagged image.

## Limits

- No Lighthouse report exists in this repo. The "100/100" in `FINAL_THEME_COMPLETE.md` and `THEME_READY_100.md` (dated 2025-09-22) is a self-written checklist, and `config/theme_version.json` sets a `target_lighthouse_score` of 90, which is a target, not a result. Do not quote a score for this theme.
- No accessibility audit exists in this repo. The old README's WCAG claim had no evidence behind it and is gone.
- The old README listed a sale price. Nothing in this repo is for sale and no price is set.
- `config/theme_version.json` marks integrations such as Klaviyo, Mailchimp, Yotpo, Afterpay and Klarna as `true`. None of those names appear in the theme code (grep of `assets`, `sections`, `snippets`, `layout`). Only Trustpilot is referenced, in one file. Treat that list as intent, not features.
- The documentation and support URLs in `config/settings_schema.json` and `config/theme_version.json` point at `prestige-theme.com`. That host did not answer today (curl returned no HTTP response). The `support@prestige-theme.com` address in `theme_version.json` is therefore unverified; use the contact below.
- The six Markdown files at the root (`FINAL_THEME_COMPLETE.md`, `SHOPIFY_OPTIMIZATION_REPORT.md`, `SHOPIFY_SUBMISSION.md`, `SHOPIFY_UPLOAD_GUIDE.md`, `SUBMISSION_CHECKLIST.md`, `THEME_READY_100.md`) are planning notes from September 2025. They are not test results.
- The last commit is titled "for Shopify Theme Store submission". The repo holds no evidence that a submission was made or accepted.
- The `RemoteAsset` warnings mean some scripts or fonts load from hosts other than the Shopify CDN, which the Theme Store rules discourage.

## License and contact

No license file. `package.json` declares `"license": "Proprietary"`, so no rights are granted.

Contact: michael@crowelogic.com
