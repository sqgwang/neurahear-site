# Content Maintenance

This folder keeps structured site content away from page layout code.

- `publications.ts`: Google Scholar-derived publication records, profile metadata, publication stats, recent-output helpers, and research-signal summaries.
- `news.ts`: dated homepage and archive news items. The homepage uses the most recent six months; the archive groups the same items by year and type.
- `tools.ts`: assessment tool registry, status legend, tool colors, and homepage tool stats.

When adding content, update the data file first and let the page components render from it.
