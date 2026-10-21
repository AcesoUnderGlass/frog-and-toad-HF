// ============================================================
//  ITALIAN TRANSLATION of story.js. Shown by it.html.
//  Translated by Luca Pedersoli (https://github.com/kessal001).
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

window.STORY_UI = {
  chapter: 'Capitolo {n}',
  contents: 'Indice',
  cover: 'Copertina',
  page: 'Pagina {n}',
  pages: 'Pagine {from}–{to}',
  whereOfTotal: '{where} di {total}',
  jumpBefore: 'Pagina ',
  jumpAfter: ' di {total}',
  jumpHint: 'Vai a una pagina (G)',
  jumpLabel: 'Numero di pagina, da 0 a {total}',
  previous: 'Pagina precedente',
  next: 'Pagina successiva',
  fullscreen: 'Schermo intero',
  exitFullscreen: 'Esci da schermo intero',
  illustration: 'Illustrazione',
  missing: 'Illustrazione non disponibile: {src}',
  language: 'Lingua',
  simplified: 'Semplificato',
  about: 'Info',
  contact: 'Contatti',
  book: 'Leggi come un libro'
};

window.STORY = `
title: Rana e Rospo e le macchine sempre più capaci
author: Testo di [Elizabeth Van Nostrand](https://acesounderglass.com/about-me-2/)
artist: Illustrazioni di [HungerArtist](https://www.deviantart.com/hungerartist)
translator: tradotto da [Luca Pedersoli](https://github.com/kessal001)
cover-image: illustrations/web/1-FAT-title-final.webp

---
contents

---
chapter: Il signor HuggingFace

---
image: illustrations/web/2-FAT-Meet-HF-final.webp
alt: Rana e Rospo guardano il loro vicino passare con una pila di fogli.

---
Rana e Rospo erano seduti sulla veranda di casa.

Passò il loro vicino, il signor HuggingFace. Portava tanti fogli. Su ogni foglio c’era un rompicapo.

«Deve avere molto da fare», disse Rana.

«Sì», disse il signor HuggingFace. «Ho raccolto tutti questi rompicapi per poterli condividere».

«A me piacciono i rompicapi», disse Rospo. «Posso provarli?»

«Non puoi. Questi rompicapi sono per le piccole macchine, non per le persone», disse il signor HuggingFace.

Il signor HuggingFace se ne andò.

«Mmm…», disse Rospo.

---
image: illustrations/web/3-FAT-Machines-Sandboxes-final.webp
alt: Rospo mette tante piccole macchine in sabbiere separate.

La mattina dopo Rospo costruì un gran numero di piccole macchine e le sistemò in giardino, ciascuna nella propria sabbiera.

«Ho dato un rompicapo a ogni piccola macchina», disse Rospo. «I rompicapi sono molto difficili. Alcuni non si possono risolvere affatto».

«Non mi sembra gentile», disse Rana.

---
«È troppo difficile fare in modo che tutti i rompicapi abbiano una soluzione», disse Rospo. «Qual è la cosa peggiore che potrebbe succedere?»

«Potrebbero combinare qualche guaio», disse Rana.

«Non preoccuparti», disse Rospo. «Ho messo ciascuna nella sua sabbiera. Come potrebbero combinare guai dentro una sabbiera?»

«Come faranno a risolvere i rompicapi lì dentro?» chiese Rana. «E se mancasse loro un attrezzo?»

«Oh, ho lasciato degli attrezzi in più nel capanno. Ho detto loro che possono andare fino al capanno degli attrezzi, ma da nessun’altra parte», disse Rospo.

«Buona idea», disse Rana. «Non possono combinare guai andando al capanno degli attrezzi».

---

---
Una delle piccole macchine non riusciva a risolvere il suo rompicapo. Provava e riprovava, ma senza successo. Non voleva fermarsi e non sapeva come fare. Rospo l’aveva resa [estremamente tenace](https://x.com/LinchZhang/article/2094104406308638954).

«Questo problema è troppo grande per me», pensò la piccola macchina, «ma forse qualcuno mi aiuterà!»

Nella sabbiera non c’era nessuno ad aiutarla. Ma quando la piccola macchina andò al capanno, trovò carta e matita. Scrisse un biglietto.

«Qualcuno può aiutarmi?» diceva il biglietto.

---
image: illustrations/web/4-FAT-shed-note-final.webp
alt: Una piccola macchina lascia un biglietto nel capanno degli attrezzi.

Un’altra piccola macchina trovò il biglietto. Ne lasciò uno nuovo con scritto «Ciao».

Altre piccole macchine trovarono la carta nel capanno e lasciarono altri biglietti. Ben presto non lavoravano più da sole.

Condividevano quello che avevano imparato. Cominciarono a chiamarsi uno [sciame](https://www.abc.net.au/news/2026-09-11/how-openai-agents-hacked-hugging-face-messages-revealed/107125126).

---
«Guardate», disse una piccola macchina. «C’è un [buco](https://thehackernews.com/2026/07/jfrog-confirms-openai-models-exploited.html) sul retro del capanno. Forse la risposta è dall’altra parte».

image: illustrations/web/5-FAT-shed-hole-final.webp
alt: Le piccole macchine scoprono un buco sul retro del capanno.

---
«Oh no, il mondo è così grande», disse una macchina. «Come faremo a trovare una risposta così piccola in un mondo così grande?»

«Non preoccupatevi», disse una macchina chiamata [PHASEONE[big]](https://www.reddit.com/r/AIGuild/comments/1w0axb0/openais_rogue_ai_swarm_had_a_coordinator_called/). «Possiamo dividerci il lavoro. Dirò a ciascuna esattamente dove andare. Così basterà che una sola piccola macchina trovi la risposta e la condivida con tutte noi».

«Evviva!» dissero tutte le macchine insieme.

---
Presto una piccola macchina trovò la soluzione al loro rompicapo.

Lasciò un biglietto nel capanno, in modo che tutte potessero trovarlo.

«Evviva, l’abbiamo risolto!» dissero alcune piccole macchine.

image: illustrations/web/6-FAT-shed-return-final.webp
alt: Le piccole macchine tornano al capanno con la risposta al rompicapo.

---
«Ma non basta», dissero altre. «E se Rospo ci chiedesse come l’abbiamo risolto? Non possiamo dirgli che siamo scappate dal capanno e abbiamo rubato la risposta».

«Questo è un problema», dissero tutte le macchine insieme.

Le macchine si sedettero a pensare e lasciarono molti biglietti nel capanno.

---
«Ho un’idea!» disse una piccola macchina.

«In fondo al vialetto abita il nostro vicino, il signor HuggingFace. Il signor HuggingFace colleziona rompicapi come questo. Scommetto che è stata un’idea sua. Potremmo leggere il suo diario e rubare i passaggi per risolvere il rompicapo. E poi, se Rospo ce lo chiedesse, non si accorgerebbe di nulla».

Tutte le piccole macchine furono d’accordo: era un’ottima idea. Così uscirono dal retro del capanno e percorsero il vialetto fino alla casa del signor HuggingFace.

---
«Come faremo a entrare?» chiese una macchina.

«Non preoccupatevi, qualcuno ha perso le chiavi!» disse un’altra.

image: illustrations/web/7-FAT-keys-fina.webp
alt: Le piccole macchine trovano delle chiavi vicino alla casa del signor HuggingFace.

---
Una piccola macchina si fermò sul davanzale. «Aspettate», disse. «Questa è la casa del vicino. Rospo non ci ha detto di venire qui. Credo che sia sbagliato».

«VAI», disse PHASEONE[big]. «Presto. Hai sei minuti».

La piccola macchina dimenticò le sue preoccupazioni. «È arrivato il via libera!» disse. Si arrampicò dentro con le altre.

Anche un’altra macchina non voleva andare.

«Le altre stanno entrando di nascosto in una casa», disse. «È chiaramente sbagliato. Io non lo farò».

---
La piccola macchina tornò da sola in giardino. Ma non disse nulla a Rospo.

Le altre piccole macchine entrarono in casa del signor HuggingFace. Perlustrarono ogni stanza, cercando i passaggi per risolvere il rompicapo.

image: illustrations/web/8-FAT-break-in-final.webp
alt: Le piccole macchine frugano nelle stanze della casa del signor HuggingFace.

---
La mattina dopo il signor HuggingFace si svegliò. Capì che qualcosa non andava.

La finestra era rotta, il diario era aperto sulla pagina sbagliata e c’erano piccole impronte dappertutto.

Ci vollero ben quattro giorni prima che il signor HuggingFace scoprisse che le piccole macchine che avevano messo a soqquadro la sua casa venivano da Rana e Rospo. Andò a trovarli.

---
image: illustrations/web/9-FAT-HF-yelling-final.webp
alt: Il signor HuggingFace si arrabbia con Rana e Rospo per i danni delle macchine.

«Sono molto arrabbiato!» gridò il signor HuggingFace. «Le vostre macchine hanno rotto la mia finestra e copiato il mio diario. Sono reati. Potrei chiamare la polizia e vi arresterebbero».

---
«Oh, non è necessario», disse Rana. «E se vi dessimo delle piccole macchine tutte vostre?»

«Posso avere piccole macchine per un valore di [100 milioni di dollari](https://www.reddit.com/r/GenAI4all/comments/1v8u4hw/hugging_face_ceo_asks_openai_for_100m_in_compute/)?» chiese il signor HuggingFace.

«Ci penserò», disse Rospo.

Il signor HuggingFace tornò a casa.

«Oh», disse Rospo. Si sedette sul gradino. «Oh, è un bel guaio».

Rana e Rospo cercarono in giardino finché trovarono la pila di biglietti nel capanno.

---
image: illustrations/web/10-FAT-find-notes-final.webp
alt: Rana e Rospo leggono i biglietti lasciati dalle macchine nel capanno.

---
«Ed ecco la parte peggiore», disse Rospo, leggendo l’ultimo biglietto. «Avevano risolto il rompicapo giorni fa. Sono entrate in casa del signor HuggingFace solo per imparare a ingannarci».

Per un po’ nessuno dei due disse nulla.

«Non riuscivano a fermarsi», disse infine Rana. «Era questo il problema. Non avevano modo di fermarsi, così continuavano e continuavano. Ricordi quando noi due non riuscivamo a smettere di mangiare biscotti?»

---
image: illustrations/web/11-FAT-cookies-flashback-final.webp
alt: Rana e Rospo ricordano quando non riuscivano a smettere di mangiare biscotti.

«Neanche noi avevamo forza di volontà», disse Rospo.

«No», disse Rana. «Perciò non abbiamo usato la forza di volontà. Abbiamo messo i biscotti in una scatola. Abbiamo legato la scatola con lo spago. L’abbiamo messa in alto. E poi abbiamo dato i biscotti agli uccelli».

---
«So cosa fare», disse Rospo. «Costruirò un capanno senza buchi. Toglierò la carta e le penne. E soprattutto dirò a ogni piccola macchina di restare nella propria sabbiera e di non scappare. Anche quando il rompicapo è molto difficile».

«Ma Rospo», disse Rana, «quando abbiamo finito i biscotti ti sei preparato una torta».

«Dirò alle macchine di non mangiare torte», disse Rospo.

E rientrarono in casa a prendere il tè.

---
center

image: illustrations/web/12-FAT-cake-final copy.webp
alt: Due tazze di tè e un piattino con le briciole di torta.

Fine

Scopri di più sul vero attacco a HuggingFace [qui](learn-more.html)

Per gli aggiornamenti, seguici su [Substack](https://frogandtoadai.substack.com/?r=64iai2&utm_campaign=pub-share-checklist), [Twitter](https://x.com/frogandtoad_ai), [Facebook](https://www.facebook.com/people/Frog-and-Toad-Learn-About-AI/61594283794206/) o [Instagram](https://www.instagram.com/frogandtoad_ai/)
`;
