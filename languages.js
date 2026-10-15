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
//    font:  the typeface for its script, one of the names in FONTS below;
//           left out, Noto Serif (Latin, Cyrillic and Greek)
//
//  See "Translations" in README.md for adding a language.
// ============================================================

// The typefaces, one per script, all from Google Fonts: the name as CSS knows
// it, and the family part of the fonts.googleapis.com/css2 link that loads it.
// Each book page links its own in its <head> (the plain edition adds the
// link itself, see simple.js). Only the weights the book uses, 400 and 600,
// and the italic where the font has one.
window.FONTS = {
  'Noto Serif':        'Noto+Serif:ital,wght@0,400..600;1,400..600',  // Latin, Cyrillic, Greek
  'Noto Serif SC':     'Noto+Serif+SC:wght@400..600',                 // Simplified Chinese
  'Noto Serif TC':     'Noto+Serif+TC:wght@400..600',                 // Traditional Chinese
  'Noto Serif JP':     'Noto+Serif+JP:wght@400..600',                 // Japanese
  'Zen Maru Gothic':   'Zen+Maru+Gothic:wght@400;500;700',            // Japanese, the rounded face of picture books (ja.html uses this one)
  'Noto Serif KR':     'Noto+Serif+KR:wght@400..600',                 // Korean
  'Noto Serif Hebrew': 'Noto+Serif+Hebrew:wght@400..600',
  'Noto Serif Thai':   'Noto+Serif+Thai:wght@400..600',
  'Baloo Da 2':        'Baloo+Da+2:wght@400..700',                    // Bengali
  'Noto Serif Devanagari': 'Noto+Serif+Devanagari:wght@400..600',    // Hindi, Marathi, Nepali
};

window.EDITIONS = [
  // In alphabetical order of each language's own name, Latin alphabet first,
  // then Cyrillic, then other scripts.
  { lang: 'cs', name: 'Čeština', href: 'cs.html', story: 'story-cs.js' },
  { lang: 'de', name: 'Deutsch', href: 'de.html', story: 'story-de.js' },
  { lang: 'en', name: 'English', href: 'index.html', story: 'story.js' },
  { lang: 'eo', name: 'Esperanto', href: 'eo.html', story: 'story-eo.js' },
  { lang: 'sk', name: 'Slovenčina', href: 'sk.html', story: 'story-sk.js' },
  { lang: 'ru', name: 'Русский', href: 'ru.html', story: 'story-ru.js' },
  { lang: 'bn', name: 'বাংলা', href: 'bn.html', story: 'story-bn.js', font: 'Baloo Da 2' },
  { lang: 'ja', name: '日本語', href: 'ja.html', story: 'story-ja.js', font: 'Zen Maru Gothic' },
  // Hindi: a stub so far (story-hi.js is still the English text). Uncomment
  // once it is translated and hi.html's noindex is removed.
  // { lang: 'hi', name: 'हिन्दी', href: 'hi.html', story: 'story-hi.js', font: 'Noto Serif Devanagari' },
  // Simplified Chinese: a stub so far (story-zh.js is still the English text).
  // Uncomment once it is translated and zh.html's noindex is removed.
  // { lang: 'zh-Hans', name: '简体中文', href: 'zh.html', story: 'story-zh.js', font: 'Noto Serif SC' },
];
