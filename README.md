# Annual Report Trainer

A free app for learning fundamental analysis. It teaches you to read annual reports, tests you on the ratios investors use, and lets you analyse real company figures. It runs entirely in the browser, with no backend and no account. It can be installed on a phone and used offline.

## What's inside

**Learn**
- 13 lessons with worked naira examples, formulas and simple diagrams: a reading guide, the three statements, liquidity, leverage, profitability, valuation, cash flow, efficiency, red flags, banking ratios, insurance, and two full case studies (a healthy company and a struggling one).
- Each lesson ends with a quick check (3 questions) and a 10-question practice round.

**Practise**
- **Daily 5** and **Mixed practice:** random rounds across every topic.
- **Topic practice:** pick any topic. Missed questions return more often (spaced repetition).
- **Review mistakes:** replay only the handwritten questions you got wrong.
- **Weak spots:** appears once you have answered a few questions, and drills your three lowest-scoring topics.
- **Scenario:** a random fictional company with full statements, then 8 questions about it.
- **Red flag hunt:** two years of figures with hidden warning signs. Spot them and count them.
- **Compare two:** two companies side by side, six "which is better" questions.
- **Formula sheet:** every ratio in one place.

**Use it on real companies**
- **Analyse a real report:** type in figures from an annual report and get up to 19 ratios with colour-coded, plain-English readings. Your entries are saved in the browser.

**Tracking**
- Accuracy per topic and a daily streak.
- Export and import progress as a JSON file.

## Content

- 64 handwritten questions across Statements, Liquidity, Leverage, Profitability, Valuation, Cash flow, Efficiency, Red flags, Banking and Insurance.
- 21 calculation generators that create random figures and compute the answer in code, so the answer key is always correct.

## Run it locally

Download the files into one folder and double-click `index.html`. If the page is blank, open the browser console (F12) and look for a missing file.

## Host it on GitHub Pages

1. Create a public repository and upload all the files, with `index.html` at the top level.
2. Open **Settings**, then **Pages**.
3. Set the source to **Deploy from a branch**, choose **main** and **/ (root)**, then save.
4. Your site appears at `https://<your-username>.github.io/<repository-name>/` within a couple of minutes.

It also works on Netlify and Vercel by dropping in the folder.

## Install on your phone

Open the hosted link, then:
- **Android (Chrome):** menu, then **Install app**.
- **iPhone (Safari):** Share, then **Add to Home Screen**.
- **Desktop (Chrome or Edge):** click the install icon in the address bar.

After the first visit the app works offline. When you publish an update, open the app, close it and open it again to load the new version.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `style.css` | Styles, light and dark themes |
| `app.js` | Quiz engine, home screen, lessons viewer, progress |
| `questions.js` | Handwritten question bank and calculation generators |
| `lessons.js` | Lesson content |
| `scenario.js` | Scenario mode generator |
| `hunt.js` | Red flag hunt generator |
| `compare.js` | Compare two generator |
| `analyse.js` | Real report analyser |
| `sw.js`, `manifest.json`, `icon-*.png` | Offline support and install |

## Add your own content

**Conceptual question:** add an object to `BANK` in `questions.js`.

```js
{
  id: 'b65',            // unique id
  t: 'Valuation',       // topic
  q: 'Your question?',
  o: ['Option A', 'Option B', 'Option C', 'Option D'],
  a: 1,                 // index of the correct option (0 is the first)
  why: 'Explanation shown after answering.'
}
```

**Calculation question:** add an object to `GEN` in `questions.js`.

```js
{
  t: 'Valuation',
  fx: 'Earnings yield = EPS ÷ share price × 100',
  f() {
    const e = ri(2, 20), p = ri(20, 200, 5);
    return {
      q: `EPS is ₦${e} and the share price is ₦${p}. What is the earnings yield?`,
      a: e / p * 100,   // correct answer
      d: 2,             // decimal places
      u: '%',           // unit shown next to the input
      why: `${e} ÷ ${p} × 100.`
    };
  }
}
```

Numeric answers are accepted within 1% of the correct value.

**Lesson:** add an object to `LESSONS` in `lessons.js`. Each lesson is a list of blocks: `h` (heading), `p` (paragraph), `list`, `eq` (formula), `ex` (example), `tip`, `flow` (steps), `bars` (comparison) and `tbl` (table).

If you add a lesson whose `t` matches a quiz topic, it gets practice buttons automatically.

If you add new files, also list them in `sw.js` so they work offline, and bump the `V` version string to force a refresh.

## Where progress is stored

In your browser's local storage, per device and per browser. Clearing browser data erases it, so use **Export progress** before switching devices.

## Disclaimer

This is a learning tool. Colour ratings and verdicts are rules of thumb that differ by industry. Nothing here is investment advice.
