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
  { lang: 'en', name: 'English', href: 'index.html' },
  { lang: 'de', name: 'Deutsch', href: 'de.html' },
  // Russian: a stub so far (story-ru.js is still the English text). Uncomment
  // once it is translated.
  // { lang: 'ru', name: 'Русский', href: 'ru.html' },
  { lang: 'en', name: 'English (Simple UI)', href: 'simple.html', plain: true },
];
