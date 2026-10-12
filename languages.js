// ============================================================
//  THE EDITIONS OF THE BOOK, one line per language.
//  The reader lists them in the language menu beside the page number, and
//  the plain edition (simple.html) reads the same list to show any of them
//  down one sheet: the "Simplified" box beside the menu switches between
//  the book and the sheet.
//
//    lang:  the language code, the same as <html lang="..."> in that page
//    name:  the language's name, written in that language
//    href:  the page that shows the book
//    story: the story file (what that page's <script src="story-..."> loads)
//
//  See "Translations" in README.md for adding a language.
// ============================================================

window.EDITIONS = [
  // In alphabetical order of each language's own name, Latin alphabet first,
  // then Cyrillic, then other scripts.
  // Czech: a stub so far (story-cs.js is still the English text). Uncomment
  // once it is translated.
  // { lang: 'cs', name: 'Čeština', href: 'cs.html', story: 'story-cs.js' },
  { lang: 'de', name: 'Deutsch', href: 'de.html', story: 'story-de.js' },
  { lang: 'en', name: 'English', href: 'index.html', story: 'story.js' },
  { lang: 'eo', name: 'Esperanto', href: 'eo.html', story: 'story-eo.js' },
  { lang: 'sk', name: 'Slovenčina', href: 'sk.html', story: 'story-sk.js' },
  // Russian: a stub so far (story-ru.js is still the English text). Uncomment
  // once it is translated.
  // { lang: 'ru', name: 'Русский', href: 'ru.html', story: 'story-ru.js' },
  // Bengali: story text translated, still being checked. bn.html stays
  // noindex until then; comment this line out to hide it from the menu.
  { lang: 'bn', name: 'বাংলা', href: 'bn.html', story: 'story-bn.js' },
];
