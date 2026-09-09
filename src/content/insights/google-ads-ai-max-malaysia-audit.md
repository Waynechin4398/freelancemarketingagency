---
title: Did Google Ads switch on AI Max in your account? A September 2026 audit for Malaysian SMEs
category: Paid Media & Measurement
excerpt: Google’s September migration does not mean every AI Max control was switched on. Use this practical audit to see what changed and decide what to test next.
publishDate: 2026-09-09
authorName: Wayne
authorRole: Strategist and builder, Wayne Omni
draft: false
seoTitle: "Google Ads AI Max Malaysia: September 2026 Audit"
seoDescription: Check whether Google migrated your Search campaigns to AI Max in September 2026, then audit matching, assets, URLs, brand controls and tracking.
---

AI Max has appeared in Google Ads accounts during September 2026. That does not automatically mean Google switched on every AI Max feature in every Search campaign.

Google’s documented migration applies to Search campaigns that were already using campaign-level broad match or standalone Automatically Created Assets. The settings carried into AI Max depend on which of those features the campaign used before migration.

That distinction matters. “AI Max is now visible” and “all automation is on” are not the same finding.

## Table of contents

- [The short answer](#the-short-answer)
- [What Google changed in September 2026](#what-google-changed-in-september-2026)
- [Why the AI Max label is not enough](#why-the-ai-max-label-is-not-enough)
- [A 15-minute AI Max account audit](#a-15-minute-ai-max-account-audit)
- [The checks that matter for Malaysian SMEs](#the-checks-that-matter-for-malaysian-smes)
- [Keep, constrain or switch off?](#keep-constrain-or-switch-off)
- [How to test AI Max without losing control](#how-to-test-ai-max-without-losing-control)
- [What not to confuse with this migration](#what-not-to-confuse-with-this-migration)
- [Frequently asked questions](#frequently-asked-questions)
- [Turn the label into a decision](#turn-the-label-into-a-decision)

## The short answer

Google confirmed that it would progressively upgrade two legacy Search campaign configurations to AI Max during September 2026:

1. campaigns using the campaign-level broad match setting; and
2. campaigns using standalone Automatically Created Assets, now called Text Customization.

The [Google Ads Developer Blog migration notice](https://ads-developers.googleblog.com/2026/08/migrate-campaign-level-broad-match-and.html) says the campaigns are migrated in place. It also documents different default AI Max settings for the two paths.

| Previous campaign configuration | Search Term Matching | Text Customization | Final URL Expansion |
| --- | --- | --- | --- |
| Campaign-level broad match | On | Off | Off |
| Standalone Automatically Created Assets | On | On | Off |

Existing brand inclusions and exclusions are preserved when campaign-level broad match is moved into the new setup.

So yes, Google may have moved an eligible campaign into AI Max. No, that does not prove Text Customization or Final URL Expansion is active. Open the campaign and audit the controls that are actually set now.

Dynamic Search Ads are not part of this September migration. Google moved that transition to February 2027.

## What Google changed in September 2026

AI Max is not a new campaign type. Google describes it as an optimization layer for existing Search campaigns. Its two main components are:

- **Search Term Matching**, which can extend reach through broad-match and keywordless technology; and
- **Asset optimization**, which contains Text Customization and Final URL Expansion.

The current [Google Ads explanation of AI Max](https://support.google.com/google-ads/answer/15910187) says that manually turning on AI Max turns on Search Term Matching, Text Customization and Final URL Expansion. Text Customization and Final URL Expansion can then be toggled individually, while Search Term Matching has ad-group-level control.

The migration notice describes a more conservative in-place conversion for the legacy settings. That is why advice such as “Google enabled everything” is too broad. The normal enablement flow and the migration defaults are different situations.

Google has also consolidated familiar features under new names and controls:

- campaign-level broad match becomes part of Search Term Matching;
- Automatically Created Assets becomes Text Customization;
- brand settings move into the AI Max setup; and
- reporting adds AI Max-specific match, source, landing-page and asset information.

The practical question is no longer whether the label exists. It is which parts of the bundle are active, what changed when they arrived, and whether the campaign is producing better business outcomes.

## Why the AI Max label is not enough

An account screenshot showing “AI Max” proves very little by itself.

Two campaigns can carry the same label while behaving differently. One may have only Search Term Matching on. Another may also generate text and choose different landing pages. A third may have URL exclusions, brand controls or ad-group settings that make its reach materially narrower.

The label also does not tell you whether the campaign was migrated automatically, upgraded by a user, or changed later. Start with evidence from the campaign and its change history. Then write down the current setting values before touching them.

That simple snapshot prevents a common reporting problem: a team changes several controls at once, performance moves, and nobody can reconstruct which change mattered.

## A 15-minute AI Max account audit

Google Ads labels and navigation can change. Use the campaign’s current settings and reports as the source of truth rather than relying on a remembered menu path.

### 1. Identify the campaigns in scope

Filter to Search campaigns and list every campaign showing AI Max. For each one, record:

- campaign name and status;
- whether it previously used campaign-level broad match;
- whether standalone Automatically Created Assets was enabled;
- whether a user intentionally upgraded it; and
- the migration or change evidence visible in settings, change history or your account records.

Do not include Performance Max just because both products contain “Max”. Do not classify a Dynamic Search Ads campaign as part of the September migration.

### 2. Record the three core controls separately

Capture the actual value of:

- Search Term Matching;
- Text Customization; and
- Final URL Expansion.

Do not reduce those fields to one note that says “AI Max on”. If the account was migrated from campaign-level broad match, Google’s documented defaults leave Text Customization and Final URL Expansion off. If it came from standalone Automatically Created Assets, Text Customization is documented as on and Final URL Expansion as off.

### 3. Check the guardrails around matching and destinations

Review the controls that shape where the campaign can go:

- brand inclusions and exclusions;
- locations of interest, where relevant;
- URL inclusions and exclusions;
- negative keywords and account-level exclusions; and
- the landing pages that are eligible to receive traffic.

A broad automated system needs clear boundaries. A clinic should not send a treatment query to a recruitment page. A local contractor should not treat location intent as proof that the job sits inside its service area. An ecommerce advertiser should not let an outdated product or policy page become the destination simply because the copy looks relevant to a query.

If location quality is the issue, use the separate guide to [diagnose Google Ads leads from the wrong location](/insights/google-ads-wrong-location-leads-malaysia/). AI Max adds controls and reporting, but it does not replace lead qualification or make geographic signals perfect.

### 4. Read the reports AI Max changes

Google documents several reporting additions:

- the Search terms report can show AI Max as a match type and identify broad-match expansion or keywordless matching as the source;
- a combined view can connect the query, headline and URL;
- the Keywords report includes AI Max summary rows;
- the Landing pages report can show pages selected by AI Max; and
- the Asset report can show performance against outcomes such as spend and conversions.

Use those reports together. A new query may look relevant until you see the headline and landing page that accompanied it. A landing page may produce conversions until the sales team confirms that the enquiries were for the wrong service.

### 5. Test tracking before enabling Final URL Expansion

Final URL Expansion can send a user to a different relevant page on the same domain. Google warns that incompatible tracking templates can produce broken expanded landing pages, including 404 errors.

Before enabling it, test representative landing pages with the campaign’s real tracking template. Check that:

- the final page loads;
- the query parameters survive as intended;
- analytics and conversion tags fire;
- forms, calls and WhatsApp actions still attribute correctly; and
- URL exclusions block pages that should never receive paid traffic.

Google’s guidance recommends using supported `{lpurl}` patterns when dynamic landing pages are involved. If the current template hard-codes a static URL or wraps `{lpurl}` in a nonstandard way, repair the tracking design before asking automation to choose destinations.

### 6. Compare qualified outcomes, not only platform volume

An AI Max test should support a business decision. Decide the primary outcome before reading the result: a completed purchase, a booked appointment, a qualified lead, or another outcome the business can verify.

Then monitor useful guardrails alongside it:

- cost per qualified outcome;
- lead or order quality;
- wrong-location rate;
- search-term relevance;
- landing-page suitability; and
- tracking completeness.

If offline sales or WhatsApp conversations never return to Google Ads, the system is optimizing with an incomplete picture. Fixing that handoff may matter more than changing a matching toggle.

This is why a campaign should [connect to the wider lead system](/insights/campaign-needs-a-system/) before the team scales spend.

## The checks that matter for Malaysian SMEs

AI Max is the same Google Ads product in Malaysia, but the operating context can expose different weaknesses.

### Location intent is not service eligibility

Locations of interest can help a property, education, travel or destination business reach people researching a place from elsewhere. The same reach can be unhelpful for an on-site service limited to one city.

Write the business rule first: where can the service actually be delivered, and can the buyer live elsewhere? Then align the campaign, landing page and qualification question to that rule.

### Multilingual searches need a coherent journey

Malaysian demand often crosses English, Bahasa Melayu and Chinese search terms. Expanded matching can uncover useful queries, but relevance does not end at the keyword. Read the actual query, the generated or selected headline, the page language and the offer together.

A technically relevant landing page can still be a poor experience when its language, proof or next step does not match what the person expected.

### Small datasets make confident stories easy

Many SME campaigns have modest budgets, delayed sales and uneven conversion volume. A handful of leads can make a weekly percentage look dramatic.

Do not judge the change from one cheap lead or one bad enquiry. Use a window long enough for the normal sales cycle, wait for leads to be qualified, and separate major promotions or stock issues from the campaign effect.

### Conversion quality may live outside Google Ads

If the sales process finishes in WhatsApp, a phone call, a showroom or a spreadsheet, the platform may see the first action but not the commercial result.

Record the source evidence and qualified outcome consistently. Good [paid media strategy and management](/services/paid-media/) connects campaign decisions to the downstream evidence the business already uses.

## Keep, constrain or switch off?

There is no responsible universal answer.

### Keep and test a component when

- conversion tracking reflects a meaningful business outcome;
- the campaign has enough budget and conversion evidence to evaluate;
- search terms, generated text and landing pages can be reviewed;
- the website has clear, current pages for the services being promoted; and
- brand, location and URL controls can protect the important boundaries.

### Constrain the setup when

- only certain brands, places or page sections are acceptable;
- the site contains irrelevant destinations that need URL exclusions;
- matching is finding plausible queries but lead quality is inconsistent; or
- Text Customization is useful only after legal or brand-sensitive wording is reviewed.

### Switch off an individual component when

- it creates a verified risk that the available controls cannot contain;
- tracking breaks when dynamic landing pages are used;
- generated text repeatedly conflicts with the offer or required wording; or
- a controlled comparison shows worse qualified outcomes after normal sales-cycle delay and other major variables are accounted for.

Avoid switching off the whole bundle simply because one component needs work. AI Max exposes separate controls for a reason. Equally, do not keep every component active because the campaign reports more conversions if the business cannot verify their quality.

## How to test AI Max without losing control

Google announced broader AI Max testing and planning capabilities for September, including tests that can compare budget and ROI-target changes across multiple Search campaigns and experiments that retain brand or location controls. The [Google Ads testing and planning announcement](https://blog.google/products/ads-commerce/ai-max-testing-planning-tools/) is useful context, but the measurement design still belongs to the advertiser.

Use a simple test plan:

1. Define one primary qualified outcome and the minimum acceptable economics.
2. Record the current AI Max component settings and guardrails.
3. Change one meaningful variable or use a clean experiment where available.
4. Keep pricing, landing pages and promotions stable when practical.
5. Review query, creative and landing-page paths—not only the summary conversion total.
6. Wait for the usual qualification or sales delay before deciding.
7. Document the decision and the evidence that supported it.

If volume is too low for a confident comparison, say so. “Promising but inconclusive” is a better operating decision than a precise percentage built on three conversions.

## What not to confuse with this migration

### AI Max is not Performance Max

AI Max is a suite of targeting and creative features inside Search campaigns. Performance Max is a different campaign type that can serve across Google inventory. Similar naming does not make their structures or controls interchangeable.

### Dynamic Search Ads did not migrate in September

Google’s migration notice excludes active legacy Dynamic Search Ads from the September phase. Their automatic transition is scheduled for February 2027. September may bring account notices encouraging a voluntary upgrade, but that is not the same as the scheduled automatic migration.

### Final URL Expansion is not automatically on in every migrated campaign

Google’s documented migration defaults keep Final URL Expansion off for both campaign-level broad match and standalone Automatically Created Assets migrations. A user can still enable it, and a campaign turned on through the normal AI Max flow may have a different starting state. Check the campaign.

## Frequently asked questions

### Did Google automatically enable AI Max on my Search campaign?

It may have migrated an eligible Search campaign during September 2026 if that campaign used campaign-level broad match or standalone Automatically Created Assets. Confirm the campaign’s previous configuration and change evidence rather than relying only on the label.

### Which AI Max settings are on after the September migration?

Google documents Search Term Matching as on for both migration paths. Text Customization is off for a campaign-level broad match migration and on for a standalone Automatically Created Assets migration. Final URL Expansion is off in both documented migration defaults. Audit the live values because users or later changes may have altered them.

### Did Google migrate Dynamic Search Ads in September 2026?

No. Google rescheduled the legacy Dynamic Search Ads automatic migration to February 2027.

### Is AI Max the same as Performance Max?

No. AI Max is an optimization layer for Search campaigns. Performance Max is a separate campaign type.

### Should a Malaysian SME turn AI Max off?

Not by default. Audit each component, the available controls, tracking quality and qualified outcomes. Test or constrain the settings that fit the business, and switch off a component when evidence shows an unresolved risk or worse business result.

### Can AI Max send traffic to the wrong landing page?

Final URL Expansion can choose a different relevant page on the advertiser’s domain when it is enabled. URL exclusions and inclusions help shape that choice. Review the Landing pages report and test tracking templates so relevant-looking pages do not create broken or unsuitable journeys.

### Can AI Max cause wrong-location leads?

AI Max can expand matching and includes location-of-interest controls, but wrong-location enquiries can also come from campaign targeting, imperfect location signals, search intent, network mix or the customer requesting service somewhere else. Diagnose the lead source and requested service location before assigning one cause.

## Turn the label into a decision

The useful response to an AI Max migration is not panic and it is not blind acceptance. It is a short, documented audit:

1. identify why the campaign is in AI Max;
2. record the three component settings;
3. check brand, location and URL guardrails;
4. verify tracking and reports; and
5. judge the result using qualified business outcomes.

If you want a second pair of eyes, [request a growth audit](/contact/#audit). Wayne Omni can review the campaign settings, destination pages, tracking and lead-quality handoffs as one system.
