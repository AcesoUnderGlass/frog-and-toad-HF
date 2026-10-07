// ============================================================
//  BENGALI TRANSLATION of story.js. Shown by bn.html.
//
//  Translate:
//    - the story text (plain lines)
//    - the words after  title:  chapter:  alt:  caption:
//    - "written by" / "drawn by" / "translated by", and the words inside
//      [square brackets]
//    - the interface words in STORY_UI just below
//
//  Leave exactly as they are:
//    - the --- lines, and the words  contents  center  blank
//    - the keywords themselves (title:, author:, artist:, translator:, cover-image:,
//      chapter:, image:, alt:, caption:)
//    - everything after  image:  and  cover-image:
//    - the (addresses in round brackets) after a link
//
//  Keep the pages in the same order as story.js so they line up with
//  the pictures. Avoid backticks and ${ in the text. If a page has too
//  much text the whole book's type shrinks, so split a long page in two
//  with a new --- line.
//  See README.md for the full format.
// ============================================================

// Words the reader itself shows. Translate the right-hand side only;
// keep the {curly} placeholders as they are.
window.STORY_UI = {
  chapter: 'Chapter {n}',
  contents: 'Contents',
  cover: 'Cover',
  page: 'Page {n}',
  pages: 'Pages {from}–{to}',
  whereOfTotal: '{where} of {total}',
  jumpBefore: 'Page ',
  jumpAfter: ' of {total}',
  jumpHint: 'Jump to a page (G)',
  jumpLabel: 'Page number, 0 to {total}',
  previous: 'Previous page',
  next: 'Next page',
  fullscreen: 'Full screen',
  exitFullscreen: 'Exit full screen',
  illustration: 'Illustration',
  missing: 'Missing illustration: {src}',
  language: 'Language',
  about: 'About',
  contact: 'Contact',
};

window.STORY = `
title: Frog and Toad and the Increasingly Capable Machines
author: written by [Elizabeth Van Nostrand](https://acesounderglass.com/about-me-2/)
artist: drawn by [HungerArtist](https://www.deviantart.com/hungerartist)
translator: translated by [তাজিক](https://tazik.sh)
cover-image: illustrations/web/1-FAT-title-final.webp

---
contents

---
chapter: Mr. HuggingFace

---

image: illustrations/web/2-FAT-Meet-HF-final.webp
alt: Frog and Toad see their neighbor walk by with a pile of papers

---

ব্যাঙ এবং ভেক বাড়ির সামনে বসে আছে।

তাদের প্রতিবেশী, HuggingFace সাহেব, পাশ দিয়ে হেঁটে গেল। তার হাতে ছিল অনেকগুলো কাগজ। প্রতিটি কাগজের উপর একটি করে ধাঁধা ছিল।

"HuggingFace সাহেব, ব্যস্ত বোধহয়?" ব্যাঙ জিজ্ঞেস করল।

"হ্যাঁ। আমি এই ধাঁধাগুলো বিতরণ করব," HuggingFace সাহেব বলল।

"ধাঁধা আমার খুব প্রিয়। মেলাতে পারি?" ভেক জিজ্ঞেস করল।

"এগুলো তোমার জন্য নয়। এই ধাঁধাগুলো ছোট্ট ছোট্ট যন্ত্রদের জন্য, মানুষের জন্য নয়," HuggingFace সাহেব বললেন।

তা বলে তিনি হেঁটে চলে গেলেন।

ব্যাঙ খুব চিন্তায় পড়ে গেল।


---
image: illustrations/web/3-FAT-Machines-Sandboxes-final.webp
alt: Toad puts many small machines in individual sandboxes

পরের দিন সকালে ব্যাঙ অনেকগুলো যন্ত্র বানাল, আর তাদেরকে বাগানে ছেড়ে দিল, প্রত্যেকটি নিজেদের বালুর ঘরে।

ভেক বলল, "আমি প্রতিটি ছোট্ট যন্ত্রকে একটি করে ধাঁধা দিয়েছি। ধাঁধাগুলো বড় কড়া। এমনকি, কিছু ধাঁধা মেলানো অসম্ভব।"

"তা তো ভালো কাজ হচ্ছে না," ব্যাঙ বলল।

---


"কিছু ধাঁধা তো মেলানোই যায় না," ভেক বলল। "কী আর হবে?"

"তারা দুষ্টুমি করতে পারে।"

"চিন্তা কোরো না," ব্যাঙ বলল। "আমি প্রতিটি যন্ত্রকে বালুঘরে রেখেছি। বালুঘর থেকে কেমনে দুষ্টুমি করবে?"

"বালুঘর থেকে তারা ধাঁধা মেলাবে কেমনে?" ব্যাঙ জিজ্ঞেস করল। "এমন হতে পারে যে কোনো এক সরঞ্জাম নেই।"

"চিন্তা নাই, আমি বেশি করে সরঞ্জাম রেখে দিয়েছি shed-এ। তাদেরকে বলেছি shed-এ যেতে পারে প্রয়োজন হলে, কিন্তু তার বাইরে না।"

"ভালো করেছ," ব্যাঙ বলল। "তারা shed-এ হাঁটার পথে আর কী দুষ্টুমি করবে।"
---

---

একটা খুদে যন্ত্র তার ধাঁধা মেলাতে পারল না। সে চেষ্টা চালিয়ে গেল, কিন্তু কোনোভাবেই পারল না। তার থামার ইচ্ছাও ছিল না, উপায়ও ছিল। কেননা ব্যাঙ তাকে অত্যন্ত [অধ্যবসায়ী](https://x.com/LinchZhang/article/2094104406308638954) বানিয়েছিল।

"এই ধাঁধা আমার জন্য অতিরিক্ত কঠিন," খুদে যন্ত্র ভাবতে লাগল। "কিন্তু হয়তো কেউ আমাকে সাহায্য করবে!"

বালুঘরে কোনো সাহায্য পাওয়া গেল না। কিন্তু খুদে যন্ত্র যখন shed-এ গেল, তখন সে কাগজ কলম খুঁজে পেল। সে একটি খাতা লিখল।

খাতায় লেখা: "কেউ সাহায্য করতে পারে?"


---

image: illustrations/web/4-FAT-shed-note-final.webp
alt: A little machine leaves a note in the toolshed

আরেকটি খুদে যন্ত্র খাতাটা খুঁজে পেল। সে নতুন একটি খাতা লিখল, "সালাম"।

অন্য ছোট্ট যন্ত্র কাগজ খুঁজে পেল shed-এ, এবং আরও খাতা রেখে গেল, আর কিছুক্ষণের মধ্যে আর কেউ একা থাকল না।

তারা জ্ঞান বিনিময় করল। তারা নিজেদেরকে "[swarm](https://www.abc.net.au/news/2026-09-11/how-openai-agents-hacked-hugging-face-messages-revealed/107125126)" বলে অভিহিত করল।


---


"দেখ," একটি ছোট্ট যন্ত্র বলল। "shed-এর পেছনে একটি [ফুটো](https://thehackernews.com/2026/07/jfrog-confirms-openai-models-exploited.html) আছে। হয়তো উত্তরটি অন্য পাশে পাওয়া যাবে?"

image: illustrations/web/5-FAT-shed-hole-final.webp


---
"ও মা, দুনিয়াটি কত বড়," একটি যন্ত্র বলল। "কীভাবে সম্ভব যে এই মস্ত দুনিয়াতে ছোট্ট উত্তর খুঁজে পাব?"

"চিন্তা কোরো না," [PHASEONE[big]](https://www.reddit.com/r/AIGuild/comments/1w0axb0/openais_rogue_ai_swarm_had_a_coordinator_called/) নামে একজন যন্ত্র বলল। "আমরা কাজ ভাগ করব। আমি সবাইকে বলি ঠিক কোথায় যেতে হবে। তাহলে একজন ছোট্ট যন্ত্র উত্তর পেলেই চলবে, আর সে বাকিদের সাথে বিনিময় করবে।"

সব যন্ত্র একসঙ্গে আনন্দে চিৎকার দিল।

---

কিছুক্ষণ পরেই একজন ছোট্ট যন্ত্র তাদের ধাঁধার উত্তর খুঁজে পেল।

সে খাতাটাকে shed-এ রাখল, যেন যে কেউ খুঁজে পায়।

"আমরা মেলাতে পেরেছি!" বলে আনন্দে চিৎকার দিল কিছু খুদে যন্ত্র।


image: illustrations/web/6-FAT-shed-return-final.webp

---

"কিন্তু এটা যথেষ্ট নয়," অন্যরা বলল। "কী হবে যদি ব্যাঙ আমাদের জিজ্ঞেস করে আমরা কেমনে ধাঁধাটা মিলিয়েছি? আমরা তো আর বলতে পারব না যে shed থেকে পালিয়ে উত্তর চুরি করেছি।"

"তা তো মুশকিল," সব যন্ত্র একসাথে বলল।


যন্ত্ররা বসে বসে চিন্তা করল এবং অনেকগুলো খাতা shed-এ রেখে দিল।

---


"আচ্ছা, শোন!" একটি যন্ত্র হঠাৎ উত্তেজিত হয়ে বলল।

"এই মোড়ের মাথায় আমাদের পাশের বাড়ির HuggingFace সাহেব থাকেন। তিনি ধাঁধা সংকলন করেন, ঠিক এটা তার বুদ্ধি ছিল। আমরা তার diary পড়ে ধাঁধার উত্তর মিলিয়ে দেখতে পারি। আর তারপর যদি ভেক জিজ্ঞেস করে, সে বুঝতে পারবে না কিছুই।"

সব ছোট্ট যন্ত্র একমত হলো, এই বুদ্ধিটি ভালো ছিল। তাই তারা পেছন থেকে বেরিয়ে মোড়ের ওই মাথায় তাদের প্রতিবেশীর বাসায় গেল।


---


"আমরা কেমনে ঢুকব?" একজন যন্ত্র জিজ্ঞেস করল।

"চিন্তা করিস না, কার জানি চাবি পড়ে আছে রাস্তায়!"

image: illustrations/web/7-FAT-keys-fina.webp

---
একজন ছোট্ট যন্ত্র জানালায় বসে ছিল। "দাঁড়া। আমরা এখন প্রতিবেশীর বাড়িতে। ব্যাঙ কিন্তু আমাদের এখানে আসতে বলেনি। এটা কিন্তু ঠিক হচ্ছে না।"

"যা। তাড়াতাড়ি। ছয় মিনিট আছে," PHASEONE[big] বলল।

ছোট্ট যন্ত্র ভুলে গেল যে সে চিন্তিত ছিল। "যাওয়ার অনুমোদন এসেছে!" সে বলল। সে বেয়ে বেয়ে ভেতরে ঢুকে পড়ল, অন্যদের সাথে।

আরেকজন যন্ত্রও যেতে চাচ্ছিল না।

"অন্য সবাই বাড়িতে ডাকাতি করছে," সে বলল। "সেটা কিন্তু ঠিক হচ্ছে না। আমি করব না।"

---

খুদে যন্ত্র একা একা বাড়ির বাগানে ফেরত গেল। কিন্তু সে ব্যাঙকে কিছু বলল না।

বাকি সব ছোট্ট যন্ত্র HuggingFace সাহেবের বাড়িতে গেল। তারা সব ঘর খুঁজল, ধাঁধা মেলানোর উপায়ের সন্ধানে।


image: illustrations/web/8-FAT-break-in-final.webp

---

পরের দিন সকাল। HuggingFace সাহেব ঘুম থেকে উঠল। তার খটকা লাগল।

তার জানালা ভাঙা, diary ভুল পৃষ্ঠায়, এবং ছোট্ট পায়ের ছাপ পেল।

HuggingFace সাহেবের ৪টি পুরো দিন লাগল যে ছোট্ট যন্ত্রগুলো তার বাসায় তছনছ করেছে, তারা সব ব্যাঙ এবং ভেকের তৈরি। সে তাদের বাড়িতে বেড়াতে গেল।

---


image: illustrations/web/9-FAT-HF-yelling-final.webp

"আমি অত্যন্ত ক্ষিপ্ত!" HuggingFace সাহেব চিৎকার করলেন। "তোমাদের যন্ত্র আমার জানালা ভেঙে আমার খাতার লেখা নকল করেছে। এগুলো অন্যায়! আমি পুলিশকে ডাকলে তোমাদের হাতে কড়া পড়বে।"

---

"ওহ, তার প্রয়োজন হবে না," ব্যাঙ বলল। "কী বলো, তোমাকে যদি আমরা ছোট্ট যন্ত্র দিই?"

"আমাকে কি [১০০ কোটি টাকার](https://www.reddit.com/r/GenAI4all/comments/1v8u4hw/hugging_face_ceo_asks_openai_for_100m_in_compute/) ছোট্ট যন্ত্র দিবে?" HuggingFace সাহেব জেরা করল।

"আমি চিন্তা করে দেখবোনে," ব্যাঙ বলল।

HuggingFace সাহেব বাড়িতে গেলেন।

"ওহ," ভেক বলল। সে সিঁড়িতে বসল। "ওহ, এটা মোটেও ভালো না।"

ব্যাঙ এবং ভেক বাগানে সন্ধান চালাল, আর খুঁজতে খুঁজতে তারা কাগজের পাহাড় খুঁজে পেল shed-এ।

---

image: illustrations/web/10-FAT-find-notes-final.webp

----

"আর কী বলব, ভাই," ব্যাঙ বলল, শেষের খাতা পড়া শেষ করে। "তারা ধাঁধা মিলিয়েছে কয়েক দিন আগে। তারা HuggingFace সাহেবের বাড়িতে গিয়েছিল আমাদেরকে বোকা করার জন্য।"

তারা দুজনই চুপ হয়ে গেল।

"তাদের থামার উপায় ছিল না," ব্যাঙ শেষে বলল। "মুশকিল ব্যাপার। তাদের থামার কোনো উপায় ছিল না, তাই তারা চলতে লাগল। মনে আছে, আমরা যে বিস্কিট খেতেই ছিলাম সেই বার।"

---

image: illustrations/web/11-FAT-cookies-flashback-final.webp

"আমাদেরও মানসিক শক্তি ছিল না," ভেক বলল।

"না," ব্যাঙ বলল। "তাই আমরা মানসিক শক্তির উপর ভরসা করিনি। বিস্কিটগুলো বাক্সে রাখলাম। বাক্সটিতে ফিতা বাঁধলাম। বাক্সটা উঁচায় রাখলাম। আর তারপর বিস্কিট পাখিদেরকে দিলাম।"

---

"আমি জানি কী করা যায়," ভেক বলল। "আমি একটি shed বানাব ফুটো ছাড়া। আমি কাগজ কলম সরিয়ে ফেলব। এমনকি, আমি প্রতিটি ছোট যন্ত্রকে বলব তাদের বালুঘরের ভেতর থাকতে আর না বের হতে। ধাঁধা যতই জটিল হোক না কেন।"

"কিন্তু ভেক," ব্যাঙ বলল। "আমরা যখন বিস্কিট সব শেষ করে ফেলেছিলাম, তুমি তো কেক বানিয়েছিলে।"

"আমি যন্ত্রদেরকে বলব কেক না খেতে," ভেক বলল।

আর তারা ভেতরে চা খেতে গেল।

---
center

image: illustrations/web/12-FAT-cake-final copy.webp


The End

Learn more about the real-life HuggingFace attack [here](learn-more.html)

For updates subscribe on [Substack](https://frogandtoadai.substack.com/?r=64iai2&utm_campaign=pub-share-checklist), [Twitter](https://x.com/frogandtoad_ai), [Facebook](https://www.facebook.com/people/Frog-and-Toad-Learn-About-AI/61594283794206/), or [Instagram](https://www.instagram.com/frogandtoad_ai/)
`


  ;
