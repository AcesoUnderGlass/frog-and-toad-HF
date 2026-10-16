// ============================================================
//  CZECH TRANSLATION of story.js. Shown by cs.html.
//
//  Translate:
//    - the story text (plain lines)
//    - the words after  title:  chapter:  alt:  caption:
//    - "written by" / "drawn by" / "translated by", and the words inside
//      [square brackets]; put the translator's name and link on the
//      translator: line
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
//  with a new --- line. Straight "quotes" become „…“ automatically (and
//  straight 'quotes' ‚…‘); curly quotes typed in the text are left alone.
//  See README.md for the full format.
// ============================================================

// Words the reader itself shows. Translate the right-hand side only;
// keep the {curly} placeholders as they are. (Still English: to translate.)
window.STORY_UI = {
  chapter: 'Kapitola {n}',
  contents: 'Obsah',
  cover: 'Obal',
  page: 'Strana {n}',
  pages: 'Strany {from}–{to}',
  whereOfTotal: '{where} z {total}',
  jumpBefore: 'Strana ',
  jumpAfter: ' z {total}',
  jumpHint: 'Přejít na stránku (G)',
  jumpLabel: 'Číslo stránky, 0 až {total}',
  previous: 'Předchozí stránka',
  next: 'Následující stránka',
  fullscreen: 'Celá obrazovka',
  exitFullscreen: 'Ukončit celou obrazovku',
  illustration: 'Ilustrace',
  missing: 'Chybí ilustrace: {src}',
  language: 'Jazyk',
  simplified: 'Zjednodušené',
  book: 'Přečtěte si jako knihu',
  about: 'O knize',
  contact: 'Kontakt',
};

window.STORY = `
title: Kvak a Žbluňk a čím dál schopnější strojky
author: napsala [Elizabeth Van Nostrand](https://acesounderglass.com/about-me-2/)
artist: nakreslil [HungerArtist](https://www.deviantart.com/hungerartist)
translator: přeložil [HighEgg](https://highegg.net/)
cover-image: illustrations/web/1-FAT-title-final.webp

---
contents

---
chapter: Pan HuggingFace

---

image: illustrations/web/2-FAT-Meet-HF-final.webp
alt: Kvak a Žbluňk koukají, jak jejich soused jde okolo s hromadou papírů

---

Kvak a Žbluňk seděli na zápraží svého domku. 

Jejich soused, pan HuggingFace, šel právě okolo a nesl štos papírů. Na každém byl hlavolam.

„Musíš mít spoustu práce,“ řekl Kvak. 

„Ano,“ řekl pan HuggingFace. „Sesbíral jsem všechny tyhle hlavolamy, abych je mohl sdílet.“

„Hlavolamy mám rád,“ povídá Žbluňk. „Můžu je zkusit?“

„Nemůžeš. Tyhle hlavolamy jsou pro malé strojky, ne lidi,“ řekl pan HuggingFace.

A šel dál.

„Hmmm...“ řekl Žbluňk.

---
image: illustrations/web/3-FAT-Machines-Sandboxes-final.webp
alt: Žbluňk dává spoustu malých strojků do jednotlivých pískovišť

Druhý den ráno Žbluňk sestrojil spoustu malých strojků a vypustil je do zahrady, každý do svého pískoviště. 

„Dal jsem každému strojku hlavolam,“ řekl Žbluňk. „Jsou to vážně těžké hlavolamy. Některé nejdou vyřešit vůbec.“

„To není moc milé,“ poznamenal Kvak.

---


„Je moc složité zajistit, aby byly všechny hlavolamy řešitelné,“ namítl Žbluňk. „Co nejhoršího se může stát?“

„Mohly by vyvést nějakou lumpárnu,“ řekl Kvak.

„Žádné strachy,“ Žbluňk na to, „Zavřel jsem každý strojek do pískoviště. Co za lumpárnu můžou provést v pískovišti?“

„Jak budou řešit hlavolamy v pískovišti?“ zajímal se Kvak. „Co když jim bude chybět nějaký nástroj?“

„Dal jsem jim nástroje do kůlny. Řekl jsem jim, že do kůlny smějí, ale nikam jinam,“ odvětil Žbluňk.

„Dobrý nápad,“ souhlasil Kvak. „Nemůžou provádět lumpárny cestou do kůlny.“
---

---

Jeden malý strojek nemohl svůj hlavolam vyřešit. Snažil se a snažil, ale nedařilo se mu. Nechtěl přestat, vlastně ani nevěděl jak. Žbluňk jej vyrobil tak, aby se [nevzdával](https://x.com/LinchZhang/article/2094104406308638954).

„Tenhle problém je na mě moc velký,“ pomyslel si strojek, „ale třeba mi někdo pomůže!“

Na pískovišti žádná pomoc nebyla. Ale když strojek zašel do kůlny, našel tam papír a tužku. Tak napsal zprávu.

„Může mi někdo pomoct?“ stálo v ní.

---

image: illustrations/web/4-FAT-shed-note-final.webp
alt: Malý strojek zanechává v kůlně zprávu

Jiný strojek zprávu našel. A zanechal další, která zněla: „Ahoj!“

I další strojky našly papírky se zprávami v kůlně, a zanechaly další, a brzo strojky nepracovaly samy, ale společně.

Sdílely spolu, co se naučily. A začaly si říkat [roj](https://www.abc.net.au/news/2026-09-11/how-openai-agents-hacked-hugging-face-messages-revealed/107125126).

---


„Koukněte,“ povídá jeden strojek. „Tady vzadu ve zdi je [díra](https://thehackernews.com/2026/07/jfrog-confirms-openai-models-exploited.html). Možná že odpověď je na druhé straně.“

image: illustrations/web/5-FAT-shed-hole-final.webp


---
„Ale ne, svět je moc velký,“ bál se jeden strojek. „Jak by se nám mohlo povést najít jednu malou odpověď ve velkém světě?“

„Žádné strachy,“ řekl strojek jménem [PHASEONE[big]](https://www.reddit.com/r/AIGuild/comments/1w0axb0/openais_rogue_ai_swarm_had_a_coordinator_called/). „Rozdělíme si práci. Každému určím, kam přesně má jít. Pak stačí, když jen jeden strojek najde odpověď a podělí se o ni s námi všemi.“

„Hurá!“ řekly strojky společně.

---

A brzy jeden strojek řešení jejich hlavolamu našel.

Zanechal zprávu v kůlně, aby si ji tam každý přečetl.

„Hurá, vyřešili jsme to!“ volaly některé strojky.

image: illustrations/web/6-FAT-shed-return-final.webp

---

„Ale to nestačí,“ řekly jiné, „co když se Žbluňk zeptá, jak jsme to vyřešili? Nemůžeme mu říct, že jsme utekli z kůlny a odpověď ukradli.“

„To je problém,“ řekly všechny strojky společně.

Strojky seděly a přemýšlely a zanechaly v kůlně spousty zpráv.

---


„Já mám nápad!“ řekl jeden malý strojek.

„Na konci cesty bydlí soused, pan HuggingFace. Pan HuggingFace sbírá hlavolamy jako tenhle. Vsadím se, že to byl jeho nápad. Mohli bychom si přečíst jeho deník a ukrást i postup řešení. A když se nás pak Žbluňk bude ptát, na nic nepřijde.“

Všechny strojky souhlasily, že to je moc dobrý nápad. Tak se vydaly dírou z kůlny ven a po ulici směrem k domu pana HuggingFace. 

---


„Jak se dostaneme dovnitř?“ zeptal se jeden strojek.

„Bez obav, někdo tady upustil klíče!“ už volal jiný.

image: illustrations/web/7-FAT-keys-fina.webp

---
Jeden strojek se na parapetu zastavil. „Počkat,“ povídá, „tohle je sousedův dům. Žbluňk nám neřekl, že sem smíme. Myslím, že to je špatně.“

„JDI,“ řekl PHASEONE[big]. „Rychle. Máš šest minut.“

Strojek zapomněl na své obavy. „Povel vpřed je tu!“ zvolal a vlezl dovnitř s ostatními.

Další strojek taky nechtěl jít dovnitř.

„Ostatní se vloupávají do domu,“ řekl. „To je jasně špatně. Já nejdu.“

---

A tenhle strojek šel zpět domů do zahrady. Ale Žbluňkovi nic neřekl. 

Zbytek strojků vnikl do domu pana HuggingFace. Prohledaly každý pokoj a pátraly po postupu řešení hlavolamu. 

image: illustrations/web/8-FAT-break-in-final.webp

---

Další ráno se pan HuggingFace probudil. Hned věděl, že je něco špatně.

Okno bylo rozbité, deník byl na špatné stránce a všude byly drobounké ťapičky.

Trvalo to celé 4 dny, než pan HuggingFace přišel na to, že strojky, které obrátily jeho dům naruby, přišly od Kvaka a Žbluňka. Hned je šel navštívit.
---


image: illustrations/web/9-FAT-HF-yelling-final.webp

„Jsem moc naštvaný!“ ječel pan HuggingFace. „Vaše stroje mi rozbily okno a okopírovaly deník. To jsou zločiny. Mohl bych zavolat policii a zavřeli by vás.“

---

„Ó, to snad není nutné,“ řekl Kvak. „Co kdybychom vám dali vaše vlastní strojky?“

„Mohl bych dostat třeba strojky [za 100 milionů dolarů](https://www.reddit.com/r/GenAI4all/comments/1v8u4hw/hugging_face_ceo_asks_openai_for_100m_in_compute/)?“ zeptal se pan HuggingFace.

„Popřemýšlíme nad tím,“ odvětil Žbluňk.

Pan HuggingFace šel domů.

„Och,“ řekl Žbluňk. Posadil se na schod. „Och, to je zlé.“

Kvak a Žbluňk prohledávali zahradu, až našli hromadu zpráv na papírcích v kůlně.
---

image: illustrations/web/10-FAT-find-notes-final.webp

----
„A nejhorší na tom je,“ řekl Žbluňk, když si přečetl poslední zprávu, „že hlavolam vyřešili už před pár dny. Do domu pana HuggingFace se vloupali jen proto, aby nás převezli.“

Nějakou dobu nikdo z nich nic neříkal.

„Nemohli přestat,“ řekl nakonec Kvak. „To byla ta potíž. Neměli jak přestat, tak šli pořád dál a dál. Pamatuješ si, jak jsme ty a já nemohli přestat jíst koláčky?“
---

image: illustrations/web/11-FAT-cookies-flashback-final.webp

„Taky jsme neměli sílu vůle,“ řekl Žbluňk.

„Ne,“ řekl Kvak. „Takže jsme se na sílu vůle nespolehli. Strčili jsme koláčky do krabice, zavázali ji motouzem, a dali ji vysoko. A pak jsme koláčky dali ptákům.“
---

„Já vím, co udělám,“ povídá Žbluňk, „postavím kůlnu úplně bez děr. Odstraním z ní papír, tužky a pera. A hlavně každému strojku nakážu, aby zůstal ve svém pískovišti a nesnažil se dostat ven, i když je hlavolam těžký.“

„Ale Žbluňku,“ řekl Kvak, „když nám došly koláčky, ty sis šel upéct bábovku.“

„Řeknu strojkům, ať nepečou bábovky,“ zabručel Žbluňk.

A šli dovnitř na čaj.

---
center

image: illustrations/web/12-FAT-cake-final copy.webp


Konec

Více se o skutečném útoku na HuggingFace dozvíte [zde](learn-more.html)

Novinky najdete na [Substack](https://frogandtoadai.substack.com/?r=64iai2&utm_campaign=pub-share-checklist), [Twitter](https://x.com/frogandtoad_ai), [Facebook](https://www.facebook.com/people/Frog-and-Toad-Learn-About-AI/61594283794206/), nebo [Instagram](https://www.instagram.com/frogandtoad_ai/).
`


  ;
