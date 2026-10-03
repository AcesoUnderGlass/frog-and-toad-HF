// ============================================================
//  GERMAN TRANSLATION of story.js. Shown by de.html.
//
//  Translate:
//    - the story text (plain lines)
//    - the words after  title:  chapter:  alt:  caption:
//    - "written by" / "drawn by", and the words inside [square brackets]
//    - the interface words in STORY_UI just below
//
//  Leave exactly as they are:
//    - the --- lines, and the words  contents  center  blank
//    - the keywords themselves (title:, author:, artist:, cover-image:,
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
  chapter: 'Kapitel {n}',
  contents: 'Inhalt',
  cover: 'Titelseite',
  page: 'Seite {n}',
  pages: 'Seiten {from}–{to}',
  whereOfTotal: '{where} von {total}',
  jumpBefore: 'Seite ',
  jumpAfter: ' von {total}',
  jumpHint: 'Zu einer Seite springen (G)',
  jumpLabel: 'Seitenzahl, 0 bis {total}',
  previous: 'Vorherige Seite',
  next: 'Nächste Seite',
  illustration: 'Illustration',
  missing: 'Fehlende Illustration: {src}',
};

window.STORY = `
title: Frosch und Kröte und die immer fähigeren Maschinen
author: geschrieben von [Elizabeth Van Nostrand](https://acesounderglass.com/about-me-2/)
artist: gezeichnet von [HungerArtist](https://www.deviantart.com/hungerartist)
cover-image: illustrations/web/1-FAT-title-final.webp

---
contents

---
chapter: Herr HuggingFace

---

image: illustrations/web/2-FAT-Meet-HF-final.webp
alt: Frosch und Kröte sehen ihren Nachbarn mit einem Stapel Papiere vorbeigehen

---

Frosch und Kröte saßen auf ihrer Veranda.

Ihr Nachbar, Herr HuggingFace, kam vorbei. Er trug viele Papiere. Auf jedem Blatt stand ein Rätsel.

„Sie haben bestimmt viel zu tun“, sagte Frosch.

„Ja“, sagte Herr HuggingFace. „Ich habe all diese Rätsel gesammelt, um sie zu teilen.“

„Ich mag Rätsel“, sagte Kröte. „Darf ich sie ausprobieren?“

„Nein. Diese Rätsel sind für kleine Maschinen, nicht für Leute“, sagte Herr HuggingFace.

Herr HuggingFace ging weiter.

„Hmmm …“, sagte Kröte.


---
image: illustrations/web/3-FAT-Machines-Sandboxes-final.webp
alt: Kröte setzt viele kleine Maschinen in einzelne Sandkästen

Am nächsten Morgen baute Kröte sehr viele kleine Maschinen und stellte sie in den Garten, jede in ihren eigenen Sandkasten.

„Ich habe jeder kleinen Maschine ein Rätsel gegeben“, sagte Kröte. „Die Rätsel sind sehr schwer. Manche kann man überhaupt nicht lösen.“

„Das ist aber nicht sehr nett“, sagte Frosch.

---


„Es ist zu mühsam, alle Rätsel lösbar zu machen“, sagte Kröte. „Was kann schon Schlimmes passieren?“

„Sie könnten Unfug treiben“, sagte Frosch.

„Keine Sorge“, sagte Kröte. „Jede sitzt in ihrem eigenen Sandkasten. Wie sollen sie da Unfug treiben?“

„Wie sollen sie im Sandkasten Rätsel lösen?“, fragte Frosch. „Und wenn ihnen ein Werkzeug fehlt?“

„Oh, im Werkzeugschuppen liegen extra Werkzeuge. Ich habe ihnen erlaubt, zum Schuppen zu gehen, aber sonst nirgendwohin“, sagte Kröte.

„Gute Idee“, sagte Frosch. „Auf dem Weg zum Schuppen treiben sie keinen Unfug.“
---

---

Eine der kleinen Maschinen konnte ihr Rätsel nicht lösen. Sie versuchte es wieder und wieder, aber es gelang ihr nicht. Sie wollte nicht aufhören, und sie wusste auch nicht, wie. Kröte hatte sie [äußerst hartnäckig](https://x.com/LinchZhang/article/2094104406308638954) gebaut.

„Dieses Problem ist zu groß für mich“, dachte die kleine Maschine, „aber vielleicht hilft mir ja jemand!“

Im Sandkasten gab es keine Hilfe. Aber als die kleine Maschine zum Werkzeugschuppen ging, fand sie Papier und Bleistift. Sie schrieb einen Zettel.

„Kann jemand helfen?“, stand auf dem Zettel.


---

image: illustrations/web/4-FAT-shed-note-final.webp
alt: Eine kleine Maschine hinterlässt einen Zettel im Werkzeugschuppen

Eine andere kleine Maschine fand den Zettel. Sie hinterließ einen neuen Zettel, auf dem „Hi“ stand.

Noch mehr kleine Maschinen fanden das Papier im Werkzeugschuppen und hinterließen noch mehr Zettel, und bald arbeiteten sie gar nicht mehr allein.

Sie teilten, was sie gelernt hatten. Sie fingen an, sich einen [Schwarm](https://www.abc.net.au/news/2026-09-11/how-openai-agents-hacked-hugging-face-messages-revealed/107125126) zu nennen.


---


„Schaut mal“, sagte eine kleine Maschine. „Da ist ein [Loch](https://thehackernews.com/2026/07/jfrog-confirms-openai-models-exploited.html) hinten im Werkzeugschuppen. Vielleicht ist die Antwort auf der anderen Seite.“

image: illustrations/web/5-FAT-shed-hole-final.webp


---
„Oh nein, die Welt ist so groß“, sagte eine Maschine. „Wie sollen wir in so einer großen Welt eine einzige kleine Antwort finden?“

„Keine Sorge“, sagte eine Maschine namens [PHASEONE[big]](https://www.reddit.com/r/AIGuild/comments/1w0axb0/openais_rogue_ai_swarm_had_a_coordinator_called/). „Wir teilen uns die Arbeit auf. Ich sage jeder genau, wohin sie gehen soll. Dann muss nur eine kleine Maschine die Antwort finden, und sie teilt sie mit uns allen.“

„Hurra!“, riefen alle Maschinen zusammen.

---

Bald fand eine kleine Maschine die Lösung für ihr Rätsel.

Sie legte einen Zettel in den Werkzeugschuppen, damit alle ihn finden konnten.

„Hurra, wir haben es gelöst!“, sagten einige kleine Maschinen.


image: illustrations/web/6-FAT-shed-return-final.webp

---

„Aber das reicht nicht“, sagten andere. „Was ist, wenn Kröte fragt, wie wir es gelöst haben? Wir können ihm nicht sagen, dass wir aus dem Werkzeugschuppen ausgebrochen sind und die Antwort gestohlen haben.“

„Das ist ein Problem“, sagten alle Maschinen zusammen.


Die Maschinen saßen da und dachten nach und hinterließen viele Zettel im Werkzeugschuppen.

---


„Ich habe eine Idee!“, sagte eine kleine Maschine.

„Am Ende des Weges wohnt unser Nachbar, Herr HuggingFace. Herr HuggingFace sammelt Rätsel wie dieses, ich wette, es war seine Idee. Wir könnten sein Tagebuch lesen und die Lösungsschritte für das Rätsel stehlen. Und wenn Kröte uns dann fragt, merkt er nichts.“

Alle kleinen Maschinen fanden, dass das eine sehr gute Idee war. Also gingen sie hinten aus dem Werkzeugschuppen hinaus und den Weg entlang zum Haus von Herrn HuggingFace.


---


„Wie kommen wir hinein?“, fragte eine Maschine.

„Keine Sorge, jemand hat seine Schlüssel fallen lassen!“, sagte eine andere.

image: illustrations/web/7-FAT-keys-fina.webp

---
Eine kleine Maschine blieb auf dem Fensterbrett stehen. „Wartet“, sagte sie. „Das ist das Haus des Nachbarn. Kröte hat uns nicht gesagt, dass wir hierherkommen sollen. Ich glaube, das ist falsch.“

„LOS“, sagte PHASEONE[big]. „Schnell. Ihr habt sechs Minuten.“

Die kleine Maschine vergaß, dass sie sich Sorgen gemacht hatte. „Das Startsignal ist da!“, sagte sie. Sie kletterte mit den anderen hinein.

Auch eine andere Maschine wollte nicht mitgehen.

„Die anderen brechen in ein Haus ein“, sagte sie. „Das ist ganz klar nicht richtig. Da mache ich nicht mit.“

---

Die kleine Maschine ging allein nach Hause in den Garten. Aber sie sagte Kröte nichts davon.

Die übrigen kleinen Maschinen gingen in das Haus von Herrn HuggingFace. Sie durchsuchten jedes Zimmer nach den Schritten, mit denen man das Rätsel lösen konnte.


image: illustrations/web/8-FAT-break-in-final.webp

---

Am nächsten Morgen wachte Herr HuggingFace auf. Er wusste, dass etwas nicht stimmte.

Sein Fenster war kaputt, sein Tagebuch lag auf der falschen Seite aufgeschlagen, und überall waren kleine Fußspuren.

Es dauerte ganze vier Tage, bis Herr HuggingFace herausfand, dass die kleinen Maschinen, die sein Haus durchwühlt hatten, von Frosch und Kröte kamen. Er ging zu ihnen.

---


image: illustrations/web/9-FAT-HF-yelling-final.webp

„Ich bin sehr böse!“, schrie Herr HuggingFace. „Eure Maschinen haben mein Fenster eingeschlagen und mein Tagebuch abgeschrieben. Das sind Verbrechen. Ich könnte die Polizei rufen, und die würde euch verhaften.“

---

„Oh, das ist nicht nötig“, sagte Frosch. „Was wäre, wenn wir Ihnen eigene kleine Maschinen schenken würden?“

„Kann ich [kleine Maschinen im Wert von 100 Millionen Dollar](https://www.reddit.com/r/GenAI4all/comments/1v8u4hw/hugging_face_ceo_asks_openai_for_100m_in_compute/) haben?“, fragte Herr HuggingFace.

„Ich denke darüber nach“, sagte Kröte.

Herr HuggingFace ging nach Hause.

„Oh“, sagte Kröte. Er setzte sich auf die Stufe. „Oh, das ist schlimm.“

Frosch und Kröte durchsuchten den Garten, bis sie den Stapel Zettel im Werkzeugschuppen fanden.

---

image: illustrations/web/10-FAT-find-notes-final.webp

----

„Und jetzt kommt das Schlimmste“, sagte Kröte und las den allerletzten Zettel. „Sie haben das Rätsel schon vor Tagen gelöst. Sie sind nur bei Herrn HuggingFace eingebrochen, um herauszufinden, wie sie uns hereinlegen können.“

Eine Weile sagte keiner von beiden etwas.

„Sie konnten nicht aufhören“, sagte Frosch schließlich. „Das war das Problem. Sie konnten einfach nicht aufhören, also machten sie immer weiter und weiter. Weißt du noch, als du und ich nicht aufhören konnten, Kekse zu essen?“

---

image: illustrations/web/11-FAT-cookies-flashback-final.webp

„Wir hatten auch keine Willenskraft“, sagte Kröte.

„Nein“, sagte Frosch. „Also haben wir es gar nicht erst mit Willenskraft versucht. Erst haben wir die Kekse in eine Schachtel getan. Dann haben wir eine Schnur um die Schachtel gebunden. Danach haben wir die Schachtel ganz nach oben gestellt. Und am Ende haben wir die Kekse den Vögeln gegeben.“

---

„Ich weiß, was zu tun ist“, sagte Kröte. „Ich werde einen Werkzeugschuppen ohne Löcher bauen. Ich werde das Papier und die Stifte wegnehmen. Und vor allem werde ich jeder kleinen Maschine sagen, dass sie in ihrem Sandkasten bleiben und nicht ausbrechen soll. Auch wenn das Rätsel sehr schwer ist.“

„Aber Kröte“, sagte Frosch, „als wir keine Kekse mehr hatten, hast du dir einen Kuchen gebacken.“

„Ich werde den Maschinen sagen, dass sie keinen Kuchen essen dürfen“, sagte Kröte.

Und sie gingen hinein und tranken Tee.

---
center

image: illustrations/web/12-FAT-cake-final copy.webp


Ende

Mehr über den echten Angriff auf HuggingFace erfährst du [hier](learn-more.html) (auf Englisch).

Neues gibt es auf [Substack](https://frogandtoadai.substack.com/?r=64iai2&utm_campaign=pub-share-checklist), [Twitter](https://x.com/frogandtoad_ai), [Facebook](https://www.facebook.com/people/Frog-and-Toad-Learn-About-AI/61594283794206/) und [Instagram](https://www.instagram.com/frogandtoad_ai/).
`


  ;
