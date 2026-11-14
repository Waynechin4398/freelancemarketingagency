---
title: Does ChatGPT know your business? A 30-minute AI search visibility check
category: SEO & AI Search
excerpt: A practical self-check for Malaysian businesses that want to know whether ChatGPT, Google's AI Overviews, Perplexity and Copilot can find, read and recommend them.
publishDate: 2026-11-18
authorName: Wayne
authorRole: Strategist and builder, Wayne Omni
draft: false
seoTitle: AI Search Visibility Check for Malaysian Businesses
seoDescription: Check whether ChatGPT, Google AI Overviews, Perplexity and Copilot can find and recommend your business, from buyer questions to crawler access.
---

A customer in Penang asks ChatGPT for "a reliable aircon servicing company near Bayan Lepas". Another asks Google's AI Mode which accounting firms in Johor Bahru handle SST registration. Neither of them has clicked a website yet, and the shortlist is already forming.

If your business is not in that answer, you will not see a lost click in any report. You simply never entered the conversation.

You do not need a tool subscription to find out where you stand. You need a list of real buyer questions, an hour or less, and a clear idea of what to look at. This is the check I run before recommending any AI visibility work.

## Table of contents

- [The short answer](#the-short-answer)
- [Step 1: Write down the questions your buyers actually ask](#step-1-write-down-the-questions-your-buyers-actually-ask)
- [Step 2: Ask the assistants and record what they say](#step-2-ask-the-assistants-and-record-what-they-say)
- [Step 3: Check that AI search crawlers can reach your site](#step-3-check-that-ai-search-crawlers-can-reach-your-site)
- [Step 4: Check the Google basics that AI Overviews depend on](#step-4-check-the-google-basics-that-ai-overviews-depend-on)
- [Step 5: Look at who the answers cite instead of you](#step-5-look-at-who-the-answers-cite-instead-of-you)
- [Step 6: Fix one page, then measure](#step-6-fix-one-page-then-measure)
- [What businesses often get wrong](#what-businesses-often-get-wrong)
- [Frequently asked questions](#frequently-asked-questions)

## The short answer

AI assistants can only recommend a business they can find, read and trust. To check your own AI search visibility:

1. List 10 to 15 questions a buyer asks before choosing a supplier like you, in the languages your customers use.
2. Ask those questions in ChatGPT, Google (AI Overviews or AI Mode), Perplexity and Microsoft Copilot, and record who is mentioned and which pages are cited.
3. Confirm that the search crawlers behind those assistants are not blocked by your robots.txt file or your hosting firewall.
4. Confirm your key pages are indexed in Google and allowed to show a snippet.
5. Note the third-party sources the answers rely on, such as directories, reviews and media.
6. Improve one page so it answers one question clearly, then repeat the check in four to six weeks.

None of this guarantees a mention. AI answers change with wording, location and time. The check tells you whether you are missing for a fixable reason or simply not yet the strongest source.

## Step 1: Write down the questions your buyers actually ask

Start with the questions, not your brand name. Searching "What is [your company]?" only tells you whether the assistant knows you exist. Buyers rarely ask that. They ask for a shortlist, a comparison or a recommendation.

Write questions in three groups:

- **Shortlist questions:** "Best renovation contractor in Shah Alam for condo units", "推荐吉隆坡的会计公司", "klinik gigi Seremban yang buka hari Ahad".
- **Comparison questions:** "Is it better to hire a freelancer or an agency for Google Ads in Malaysia?"
- **Problem questions:** "Why is my landing page getting clicks but no WhatsApp enquiries?"

Use your sales team's real enquiries, your Google Search Console queries and your WhatsApp messages as the source. If your customers search in English, Chinese and Bahasa Melayu, include all three. An assistant's answer in one language can be quite different from its answer in another, and translating a single question is not the same as writing the question a Chinese-speaking or Malay-speaking buyer would actually type. The same principle applies to [multilingual campaigns](/insights/multilingual-campaigns/).

Ten to fifteen questions is enough for a first pass. More than that and you will stop recording carefully.

## Step 2: Ask the assistants and record what they say

Ask each question in each assistant your buyers are likely to use. For most Malaysian businesses that means ChatGPT, Google Search (where an AI Overview or AI Mode answer appears), Perplexity and Microsoft Copilot.

Keep the test fair:

- Use a fresh chat or a private browser window, so earlier conversations do not steer the answer.
- Ask the question the way a buyer would, without your brand name in it.
- Run important questions twice. If the answer changes completely, treat it as unstable rather than as a result.

Record each answer in a simple sheet:

| Field | What to write |
| --- | --- |
| Question and language | The exact wording you used |
| Assistant and date | ChatGPT, AI Mode, Perplexity or Copilot, and when you asked |
| Businesses mentioned | Every name, in the order given |
| Your business | Mentioned, cited as a source, both or absent |
| Sources cited | The URLs or site names shown as references |
| Accuracy | Anything wrong about you: services, location, hours, prices |

The last row matters as much as the others. An assistant describing your business incorrectly can do more harm than leaving you out.

## Step 3: Check that AI search crawlers can reach your site

This is the step most businesses skip, and it is often the cheapest one to fix.

Each AI company runs different crawlers for different jobs. Blocking a **training** crawler stops your content from being used to train future models. Blocking a **search** crawler can stop your pages from appearing in that assistant's answers. They are separate decisions.

| Assistant | Search crawler to allow | Training crawler (separate choice) |
| --- | --- | --- |
| ChatGPT search | `OAI-SearchBot` ([OpenAI](https://developers.openai.com/api/docs/bots)) | `GPTBot` |
| Perplexity | `PerplexityBot` ([Perplexity](https://docs.perplexity.ai/guides/perplexitybot)) | Not applicable |
| Claude | `Claude-SearchBot` and `Claude-User` ([Anthropic](https://support.claude.com/en/articles/8896518)) | `ClaudeBot` |
| Google AI Overviews and AI Mode | `Googlebot` | `Google-Extended` does not affect Search |
| Microsoft Copilot | `bingbot` | — |

OpenAI says sites that opt out of OAI-SearchBot will not be shown in ChatGPT search answers, and that allowing GPTBot is a separate choice that does not affect search visibility. Google says AI Overviews and AI Mode use the same crawling and indexing as normal Search, and that [Google-Extended has no effect on them](https://developers.google.com/search/docs/appearance/ai-features).

### Check two places, not one

First, open `yourdomain.com/robots.txt` in a browser and look for `Disallow: /` under any of the search crawlers in the middle column.

Second, check your hosting or firewall settings. A robots.txt file is a request; a firewall rule is a lock. Many Malaysian SME sites sit behind Cloudflare, which offers [managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) entries and AI crawler blocking. Those settings can block an AI search crawler even when robots.txt looks fine.

When my Search Agent ran this check on wayneomni.com in November 2026, the robots.txt file was in order for ChatGPT and Google. But the Cloudflare AI crawler settings were refusing PerplexityBot with a 403 error, which would keep the site out of Perplexity's index. Nobody had chosen that on purpose; it came with a security setting. I changed it the same day.

If you are comfortable with a terminal, a quick request with the crawler's name as the user agent shows whether your server answers with a page (200) or a refusal (403). It is only an approximation, because some firewalls treat verified crawlers differently, but a 403 is worth a closer look in your hosting dashboard. If that sounds unfamiliar, ask whoever manages your [website](/services/website-development/) to confirm which AI crawlers are allowed.

## Step 4: Check the Google basics that AI Overviews depend on

Google is direct about this: there are no special requirements for AI Overviews or AI Mode beyond being eligible for normal Search. A page must be indexed and eligible to show a snippet. Google's [May 2026 guide to generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) adds that the site must also be included in generative AI features in Search Console, so check that setting if someone else has managed your property.

In Google Search Console:

- Use **URL Inspection** on your three most important service pages and confirm each says the page is on Google.
- Check that those pages do not carry a `noindex` tag or a `nosnippet` directive. Both can quietly remove a page from AI answers.
- Open the Performance report. Clicks from AI features are counted under the normal **Web** search type, and Google points to the **Generative AI performance report** for a closer view.

If you serve customers locally, also review your Google Business Profile. Google lists current Business Profile information as one of the ways local businesses become visible in AI responses. Wrong hours, an old address or a missing service category feed straight into a wrong answer.

## Step 5: Look at who the answers cite instead of you

Go back to the "Sources cited" column from Step 2. The pattern usually tells you where to work.

- **Competitor websites cited:** their pages answer the question more directly than yours. Read them and note what they explain that you do not.
- **Directories, review sites or marketplaces cited:** the assistant trusts third-party listings for this question. Check whether you are listed there, and whether the details are accurate.
- **Media, forums or community threads cited:** this is about reputation beyond your own site. It takes longer, but it is real work, not a trick.
- **Nothing cited, or generic advice:** the question may not trigger recommendations at all. Move it lower on your list.

Do not try to manufacture mentions. Google's guide specifically says seeking inauthentic mentions is not considered helpful, and fake reviews create other problems.

## Step 6: Fix one page, then measure

Pick the question where you have the clearest gap and the strongest real expertise. Then improve one page, not twenty.

A useful page for AI answers is, in practice, a useful page for people:

- Answer the question in the first few lines, in plain language, before adding context.
- Include the specifics an assistant can quote: what you offer, where you serve, who it is for, and what it does not cover.
- Add first-hand detail only you can provide, such as how you actually do the work, common mistakes you see and the limits of your service.
- Use clear headings so the answer to each sub-question is easy to find.
- Keep [landing pages](/insights/landing-page-friction/) easy to act on once someone arrives.

Some things are not needed. Google says it does not use `llms.txt` files, that content does not need to be split into small chunks, and that no special schema is required for its generative AI features. Spend the time on content instead.

To measure, use the tools you already have:

- **Google Search Console:** the Generative AI performance report and the standard Performance report.
- **Bing Webmaster Tools:** its [AI Performance report](https://blogs.bing.com/webmaster/) shows how often your pages are cited in Copilot and Bing AI answers. It shows citations, not clicks.
- **Google Analytics 4:** look for sessions referred by chatgpt.com, perplexity.ai and copilot.microsoft.com.

Then repeat your question list in four to six weeks, using the same wording, and compare the sheet.

## What businesses often get wrong

- **Asking about the brand instead of the problem.** "Does ChatGPT know Wayne Omni?" is a weaker test than "Who can run Google Ads for a dental clinic in Klang?"
- **Blocking every AI bot to be safe.** Blocking training crawlers is a reasonable business choice. Blocking search crawlers usually is not, if you want to be recommended.
- **Trusting a single answer.** AI responses vary. Look for patterns across repeated questions and several weeks.
- **Buying an "AI SEO" package that promises placement.** Nobody controls what an assistant says. Google itself cautions against services that promise ranking success.
- **Ignoring wrong information.** An assistant repeating an old address or a service you stopped offering is a fixable problem, usually traced to an outdated listing or page.

## Frequently asked questions

### Can I pay to appear in ChatGPT's answers?

Not in the organic answers. Some assistants are introducing separate, labelled ad placements, but the recommendations in a normal answer come from what the system finds and judges relevant.

### Is AI search visibility different from SEO?

It builds on SEO rather than replacing it. Google describes optimising for its generative AI features as still SEO. Other assistants use their own crawlers and indexes, which is why the crawler check in Step 3 matters.

### Should I block GPTBot and other training crawlers?

That is a business decision about how your content may be reused. It does not affect whether you appear in ChatGPT search, which uses OAI-SearchBot. Decide on each crawler separately.

### How often should I repeat the check?

Every one to three months is enough for most small businesses, and after any website rebuild, hosting change or security setting change, since those are the moments a crawler is most likely to be blocked by accident.

## Want a second pair of eyes?

If you run the check and are not sure what the results mean, I can review it with you. My [AI Visibility](/ai-visibility/) work starts from exactly this list of questions, with the [Search Agent](/ai-agents/) doing the repeat checks and me reviewing every recommendation.

- [Message Wayne on WhatsApp](https://wa.me/601123394398?text=Hi%20Wayne%2C%20I%20found%20Wayne%20Omni%20and%20would%20like%20to%20discuss%20a%20project.).
- [Use the guided project brief](/contact/#audit). It prepares an email draft; nothing is sent until you review and send it from your email app.
- [Email wayne@wayneomni.com](mailto:wayne@wayneomni.com).
- [Schedule a 30-minute discovery call](https://calendly.com/waynegtcfx/30min).
