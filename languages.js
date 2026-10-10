// ============================================================
//  THE EDITIONS OF THE BOOK, one line per language.
//  The reader lists them in the language menu beside the page number.
//
//    lang:  the language code, the same as <html lang="..."> in that page
//    name:  the language's name, written in that language
//    href:  the page that shows it
//    plain: true for the plain edition (simple.html), the story down one
//           sheet with no book
//
//  See "Translations" in README.md for adding a language.
// ============================================================

window.EDITIONS = [
  // In alphabetical order of each language's own name, Latin alphabet first,
  // then Cyrillic, then other scripts; the plain edition last.
  { lang: 'de', name: 'Deutsch', href: 'de.html' },
  { lang: 'en', name: 'English', href: 'index.html' },
  { lang: 'eo', name: 'Esperanto', href: 'eo.html' },
  { lang: 'sk', name: 'Slovenčina', href: 'sk.html' },
  // Russian: a stub so far (story-ru.js is still the English text). Uncomment
  // once it is translated.
  // { lang: 'ru', name: 'Русский', href: 'ru.html' },
  // Bengali: story text translated, still being checked. bn.html stays
  // noindex until then; comment this line out to hide it from the menu.
  { lang: 'bn', name: 'বাংলা', href: 'bn.html' },
  { lang: 'en', name: 'English (Simple UI)', href: 'simple.html', plain: true },
];
