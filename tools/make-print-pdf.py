#!/usr/bin/env python3
"""Make the print edition: a PDF of the book for turning into a physical copy.

Reads the story from story.js (the same file the website reads) and lays it
out page for page, with the master illustrations from illustrations/.

    python3 tools/make-print-pdf.py --spine 0.35      (spine width in inches, from the Mixam cart)
        -> Frog-and-Toad-and-Mr-HuggingFace-interior.pdf      (every page, 0.125 in bleed)
        -> Frog-and-Toad-and-Mr-HuggingFace-cover-front.pdf   (0.8 in bleed all round)
        -> Frog-and-Toad-and-Mr-HuggingFace-cover-back.pdf    (0.8 in bleed all round)
        -> Frog-and-Toad-and-Mr-HuggingFace-cover-spine.pdf   (spine width, 0.8 in bleed top and bottom)

Needs reportlab, qrcode and Pillow:  pip install reportlab "qrcode[pil]" pillow

Pages: a title page, a copyright page, the story (one PDF page per `---`
page in story.js, contents page left out), the final picture with "The End",
and a last page of QR codes (Learn more, and the book's accounts).
"""

import io
import os
import re
import sys

import qrcode
from PIL import Image as PILImage
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch as IN
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Flowable, Frame, Image,
                                NextPageTemplate, PageBreak, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)


class Folio(Flowable):
    """Invisible; tells the page it lands on which number to print."""
    def __init__(self, n):
        super().__init__()
        self.n = n
    def wrap(self, aw, ah):
        return 0, 0
    def draw(self):
        self.canv._folio = self.n

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'Frog-and-Toad-and-Mr-HuggingFace-interior.pdf')
OUT_FRONT = os.path.join(ROOT, 'Frog-and-Toad-and-Mr-HuggingFace-cover-front.pdf')
OUT_BACK = os.path.join(ROOT, 'Frog-and-Toad-and-Mr-HuggingFace-cover-back.pdf')
OUT_SPINE = os.path.join(ROOT, 'Frog-and-Toad-and-Mr-HuggingFace-cover-spine.pdf')

TITLE = 'Frog and Toad and Mr. HuggingFace'
TITLE_MAIN, TITLE_REST = 'Frog and Toad', 'and Mr. HuggingFace'
AUTHOR = 'Elizabeth Van Nostrand'
ARTIST = 'HungerArtist'
COPYRIGHT = '\u00a9 2026 Elizabeth Van Nostrand'

BOOK_URL = 'https://frogandtoad.ai/?source=book'
LEARN_MORE_URL = 'https://frogandtoad.ai/learn-more/book'
# (name, address, what to print under the code)
SOCIALS = [
    ('Substack', 'https://frogandtoadai.substack.com/', 'frogandtoadai.substack.com'),
    ('Twitter', 'https://x.com/frogandtoad_ai', '@frogandtoad_ai'),
    ('Facebook', 'https://www.facebook.com/people/Frog-and-Toad-Learn-About-AI/61594283794206/',
     'Frog and Toad Learn About AI'),
    ('Instagram', 'https://www.instagram.com/frogandtoad_ai/', '@frogandtoad_ai'),
]

# Trim size and margins. 8.5 x 11 in portrait.
# Set up for a Mixam hardcover (case bound): every inner page carries
# 0.125 in of bleed on all four sides (the PDF page is 8.75 x 11.25) with the
# trim box set to the 8.5 x 11 trim. The cover is a separate file with 0.8 in
# of bleed to wrap the boards, as three files: front, back, and the spine
# (its width, from the Mixam cart, given with --spine).
PAGE_W, PAGE_H = 8.5 * IN, 11 * IN
BLEED = 0.125 * IN
COVER_BLEED = 0.8 * IN
HINGE = 0.2 * IN
COVER_PAPER = '#f3ecd9'   # the back and spine: the cream of the painting's lights
MARGIN_TOP, MARGIN_BOTTOM = 0.8 * IN, 0.9 * IN
MARGIN_OUTER, MARGIN_INNER = 0.75 * IN, 0.95 * IN   # a little extra at the spine

INK = '#2a2318'
INK_SOFT = '#7b6c55'
GREEN_DEEP = '#3f4b25'

# ---------------------------------------------------------------- fonts

FONT_DIR = '/System/Library/Fonts/Supplemental'
pdfmetrics.registerFont(TTFont('Georgia', os.path.join(FONT_DIR, 'Georgia.ttf')))
pdfmetrics.registerFont(TTFont('Georgia-Bold', os.path.join(FONT_DIR, 'Georgia Bold.ttf')))
pdfmetrics.registerFont(TTFont('Georgia-Italic', os.path.join(FONT_DIR, 'Georgia Italic.ttf')))
pdfmetrics.registerFont(TTFont('Georgia-BoldItalic', os.path.join(FONT_DIR, 'Georgia Bold Italic.ttf')))
pdfmetrics.registerFontFamily('Georgia', normal='Georgia', bold='Georgia-Bold',
                              italic='Georgia-Italic', boldItalic='Georgia-BoldItalic')

body = ParagraphStyle('body', fontName='Georgia', fontSize=16, leading=25,
                      textColor=INK, spaceAfter=11)
centered = ParagraphStyle('centered', parent=body, alignment=TA_CENTER)
the_end = ParagraphStyle('end', parent=centered, fontName='Georgia-Bold', fontSize=22,
                         leading=28, textColor=GREEN_DEEP, spaceBefore=18)
chapter_num = ParagraphStyle('chnum', parent=centered, fontSize=13, leading=18,
                             textColor=INK_SOFT, spaceAfter=6)
chapter_name = ParagraphStyle('chname', parent=centered, fontName='Georgia-Bold',
                              fontSize=26, leading=32, textColor=GREEN_DEEP)
title_main = ParagraphStyle('tmain', parent=centered, fontName='Georgia-Bold',
                            fontSize=40, leading=46, textColor=GREEN_DEEP, spaceAfter=0)
title_rest = ParagraphStyle('trest', parent=centered, fontName='Georgia-Bold',
                            fontSize=27, leading=34, textColor=GREEN_DEEP, spaceAfter=0)
credit = ParagraphStyle('credit', parent=centered, fontSize=14, leading=20,
                        textColor=INK, spaceAfter=0)
small = ParagraphStyle('small', parent=centered, fontSize=10.5, leading=15,
                       textColor=INK_SOFT, spaceAfter=0)
qr_head = ParagraphStyle('qrhead', parent=centered, fontName='Georgia-Bold',
                         fontSize=22, leading=28, textColor=GREEN_DEEP, spaceAfter=4)
qr_label = ParagraphStyle('qrlabel', parent=centered, fontName='Georgia-Bold',
                          fontSize=13, leading=17, textColor=INK, spaceAfter=2)
qr_url = ParagraphStyle('qrurl', parent=centered, fontSize=8, leading=11,
                        textColor=INK_SOFT)

# ---------------------------------------------------------------- the story

def read_story():
    src = open(os.path.join(ROOT, 'story.js'), encoding='utf-8').read()
    m = re.search(r'window\.STORY\s*=\s*`(.*?)`', src, re.S)
    if not m:
        sys.exit('story.js: no window.STORY template string found')
    return m.group(1)


def typeset(text):
    """Story text as it should print: links become plain words, straight
    quotes curly, three dots an ellipsis, and XML characters escaped."""
    # Link text may itself hold brackets ("PHASEONE[big]").
    text = re.sub(r'\[((?:[^\[\]]|\[[^\[\]]*\])+)\]\([^)]*\)', r'\1', text)
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    text = text.replace('...', '\u2026')
    # Opening quote: at the start or after whitespace/opening bracket.
    text = re.sub(r'(^|[\s(\[])"', '\\1\u201c', text)
    text = text.replace('"', '\u201d')
    text = re.sub(r"(^|[\s(\[])'", '\\1\u2018', text)
    text = text.replace("'", '\u2019')
    return text


def master_image(web_path):
    """The master PNG in illustrations/ for a story image path (which points
    at the small WebP copies in illustrations/web/)."""
    name = os.path.splitext(os.path.basename(web_path))[0] + '.png'
    path = os.path.join(ROOT, 'illustrations', name)
    if not os.path.exists(path):
        sys.exit(f'missing illustration: {path}')
    return path


def parse_pages(story):
    """Each page as a list of ('text', paragraph) / ('image', path) items plus
    a set of flags (contents, chapter name, center, blank)."""
    pages = []
    for raw in re.split(r'^-{3,}\s*$', story, flags=re.M):
        lines = raw.split('\n')
        page = {'items': [], 'chapter': None, 'contents': False, 'center': False, 'blank': False}
        para = []

        def flush():
            if para:
                page['items'].append(('text', ' '.join(s.strip() for s in para)))
                para.clear()

        for line in lines:
            s = line.strip()
            if not s:
                flush()
                continue
            key, _, val = s.partition(':')
            key = key.strip().lower()
            if key in ('title', 'author', 'artist', 'translator', 'cover-image'):
                continue
            if key == 'chapter':
                flush(); page['chapter'] = val.strip(); continue
            if key == 'image':
                flush(); page['items'].append(('image', master_image(val.strip()))); continue
            if key in ('alt', 'caption'):
                continue
            if s in ('contents', 'center', 'blank'):
                flush(); page[s] = True; continue
            para.append(s)
        flush()
        if page['items'] or page['chapter'] or page['contents'] or page['blank']:
            pages.append(page)
    return pages

# ---------------------------------------------------------------- layout

CONTENT_W = PAGE_W - MARGIN_OUTER - MARGIN_INNER
CONTENT_H = PAGE_H - MARGIN_TOP - MARGIN_BOTTOM


CACHE = os.path.join(ROOT, 'tools', '.print-cache')
PRINT_PX = 2400   # longest side of an embedded picture: 300 dpi across the page


def print_copy(path):
    """A JPEG of the master picture, downscaled for 300 dpi print, so the PDF
    stays a sensible size (the PNGs would go in uncompressed)."""
    os.makedirs(CACHE, exist_ok=True)
    out = os.path.join(CACHE, os.path.splitext(os.path.basename(path))[0] + '.jpg')
    if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(path):
        with PILImage.open(path) as im:
            im = im.convert('RGB')
            im.thumbnail((PRINT_PX, PRINT_PX), PILImage.LANCZOS)
            im.save(out, 'JPEG', quality=92, optimize=True, dpi=(300, 300))
    return out


def picture(path, max_w, max_h):
    path = print_copy(path)
    with PILImage.open(path) as im:
        w, h = im.size
    scale = min(max_w / w, max_h / h)
    return Image(path, width=w * scale, height=h * scale)


def set_type_size(size):
    """One type size for the whole book, like the site: leading and paragraph
    space in proportion."""
    for st in (body, centered):
        st.fontSize = size
        st.leading = size * 1.55
        st.spaceAfter = size * 0.75


def page_height(page):
    """How tall this page's flowables come out at the current type size."""
    total = 0
    for f in story_flowables(page, 0):
        w, h = f.wrap(CONTENT_W, CONTENT_H)
        total += h + getattr(f, 'getSpaceAfter', lambda: 0)()
    return total


def fit_type_size(pages):
    """The largest type size (to a quarter point) at which every text page
    fits with `comfort` to spare at the foot."""
    size = 30.0
    while size > 10:
        set_type_size(size)
        if all(page_height(p) <= CONTENT_H - COMFORT for p in pages
               if any(k == 'text' for k, _ in p['items'])):
            return size
        size -= 0.25
    sys.exit('no type size fits every page')


PICTURE_SHARE = 0.56      # of the page height, when a picture shares the page with text
PICTURE_FLOOR = 0.40      # it will shrink to this to make room for the text, no further
COMFORT = 0.4 * IN        # left clear at the foot of every text page


def story_flowables(page, number):
    """The flowables for one story page. A picture alone gets the whole page;
    one sharing the page with text gets up to PICTURE_SHARE of the height,
    less if the text needs the room (down to PICTURE_FLOOR)."""
    out = []
    items = page['items']
    style = centered if page['center'] else body
    texts = [Paragraph(typeset(v), style) for k, v in items if k == 'text']
    text_h = sum(t.wrap(CONTENT_W, CONTENT_H)[1] + t.getSpaceAfter() for t in texts)
    n_images = sum(1 for k, _ in items if k == 'image')
    if texts:
        room = CONTENT_H - COMFORT - text_h - 14 * n_images
        max_h = max(min(PICTURE_SHARE * CONTENT_H, room / max(n_images, 1)),
                    PICTURE_FLOOR * CONTENT_H)
    else:
        max_h = CONTENT_H
    texts.reverse()
    for i, (kind, val) in enumerate(items):
        if kind == 'image':
            out.append(picture(val, CONTENT_W, max_h))
            if i < len(items) - 1:
                out.append(Spacer(1, 14))
        else:
            out.append(texts.pop())
    return out


def set_page_boxes(canvas, bleed):
    """The trim box is the finished page; the PDF page (and bleed box) runs
    `bleed` beyond it on every side."""
    w, h = PAGE_W + 2 * bleed, PAGE_H + 2 * bleed
    canvas.setBleedBox([0, 0, w, h])
    canvas.setTrimBox([bleed, bleed, bleed + PAGE_W, bleed + PAGE_H])


def draw_front_art(canvas, left, bottom, width, height):
    """The cover art filling the given box, cropped as on the site's cover:
    its painted area (rows 62 to 1726 of 1800) fills the height, centred a
    little right of the middle. The box includes the bleed, so the trim
    takes a sliver of paint and never reaches the unpainted border."""
    from reportlab.lib.utils import ImageReader
    src = print_copy(os.path.join(ROOT, 'illustrations', '1-FAT-title-final.png'))
    with PILImage.open(src) as im:
        w, h = im.size
        top, bot = h * 62 / 1800, h * 1726 / 1800
        crop_h = bot - top
        crop_w = crop_h * width / height
        if crop_w > w:
            sys.exit('cover art is not wide enough for this cover')
        x = max(0, min(0.484 * w - crop_w / 2, w - crop_w))
        art = im.crop((int(x), int(top), int(x + crop_w), int(bot)))
    buf = io.BytesIO()
    art.save(buf, 'JPEG', quality=92)
    buf.seek(0)
    canvas.drawImage(ImageReader(buf), left, bottom, width, height)


def draw_front_text(canvas, left, bottom):
    """Title on the gable wall, byline on the floor, placed within the front
    cover's trim, whose lower left corner is (left, bottom)."""
    canvas.saveState()
    canvas.translate(left, bottom)
    # Title: sizes as fractions of the page width, as the site uses cqw.
    canvas.setFillColor(GREEN_DEEP)
    main_size, sub_size = PAGE_W * 0.078, PAGE_W * 0.047
    y = PAGE_H - PAGE_W * 0.169 - main_size * 0.8
    canvas.setFont('Georgia-Bold', main_size)
    canvas.drawCentredString(PAGE_W / 2, y, TITLE_MAIN)
    canvas.setFont('Georgia-Bold', sub_size)
    canvas.drawCentredString(PAGE_W / 2, y - sub_size * 1.25, TITLE_REST)
    # Byline: labels light, names bold.
    size = PAGE_W * 0.039
    y = PAGE_H * 0.034 + size * 1.4 * 1.1
    for label, name in (('Written by ', AUTHOR), ('Drawn by ', ARTIST)):
        lw = pdfmetrics.stringWidth(label, 'Georgia', size)
        nw = pdfmetrics.stringWidth(name, 'Georgia-Bold', size)
        x = PAGE_W / 2 - (lw + nw) / 2
        canvas.setFont('Georgia', size); canvas.setFillColor('#47402a')
        canvas.drawString(x, y, label)
        canvas.setFont('Georgia-Bold', size); canvas.setFillColor('#2a2414')
        canvas.drawString(x + lw, y, name)
        y -= size * 1.4
    canvas.restoreState()


def draw_cover(canvas, bleed):
    """The front cover on its own page: art out to the bleed, text in the trim."""
    draw_front_art(canvas, 0, 0, PAGE_W + 2 * bleed, PAGE_H + 2 * bleed)
    draw_front_text(canvas, bleed, bleed)


def build_covers(spine):
    """The cover as Mixam takes it for a hardcover: front, back and spine as
    separate files. Front and back carry 0.8 in of bleed on all four edges;
    the spine is its own width with 0.8 in of bleed top and bottom."""
    from reportlab.pdfgen.canvas import Canvas
    B = COVER_BLEED
    media_w, media_h = PAGE_W + 2 * B, PAGE_H + 2 * B

    c = Canvas(OUT_FRONT, pagesize=(media_w, media_h))
    c.setTitle(TITLE + ' (front cover)'); c.setAuthor(AUTHOR)
    set_page_boxes(c, B)
    draw_cover(c, B)
    c.showPage(); c.save()

    c = Canvas(OUT_BACK, pagesize=(media_w, media_h))
    c.setTitle(TITLE + ' (back cover)'); c.setAuthor(AUTHOR)
    set_page_boxes(c, B)
    c.setFillColor(COVER_PAPER)
    c.rect(0, 0, media_w, media_h, stroke=0, fill=1)
    draw_back_cover(c, B, B)
    c.showPage(); c.save()

    c = Canvas(OUT_SPINE, pagesize=(spine, media_h))
    c.setTitle(TITLE + ' (spine)'); c.setAuthor(AUTHOR)
    c.setBleedBox([0, 0, spine, media_h])
    c.setTrimBox([0, B, spine, B + PAGE_H])
    c.setFillColor(COVER_PAPER)
    c.rect(0, 0, spine, media_h, stroke=0, fill=1)
    # The title reading down the spine, if the spine is wide enough for it.
    size = min(spine * 0.55, 20)
    if size >= 8:
        c.saveState()
        c.setFillColor(GREEN_DEEP)
        c.setFont('Georgia-Bold', size)
        # Rotated, the letters rise to the right of the baseline, so the
        # baseline sits half a cap height left of centre.
        c.translate(spine / 2 - size * 0.28, B + PAGE_H / 2)
        c.rotate(-90)
        c.drawCentredString(0, 0, TITLE)
        c.restoreState()
    c.showPage(); c.save()


def build(pages):
    doc = BaseDocTemplate(OUT, pagesize=(PAGE_W + 2 * BLEED, PAGE_H + 2 * BLEED),
                          title=TITLE, author=AUTHOR,
                          leftMargin=MARGIN_INNER, rightMargin=MARGIN_OUTER,
                          topMargin=MARGIN_TOP, bottomMargin=MARGIN_BOTTOM)

    def frame(inner_left):
        left = MARGIN_INNER if inner_left else MARGIN_OUTER
        return Frame(BLEED + left, BLEED + MARGIN_BOTTOM, CONTENT_W, CONTENT_H, id='f',
                     leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    def boxes(canvas, doc_):
        set_page_boxes(canvas, BLEED)

    def folio(canvas, doc_):
        n = getattr(canvas, '_folio', None)
        if n is not None:
            canvas.saveState()
            canvas.setFont('Georgia', 10.5)
            canvas.setFillColor(INK_SOFT)
            canvas.drawCentredString(BLEED + PAGE_W / 2, BLEED + 0.5 * IN, str(n))
            canvas.restoreState()
            canvas._folio = None

    # Odd pages are right-hand (spine on the left); even pages left-hand.
    doc.addPageTemplates([
        PageTemplate(id='odd', frames=[frame(True)], onPage=boxes, onPageEnd=folio),
        PageTemplate(id='even', frames=[frame(False)], onPage=boxes, onPageEnd=folio),
    ])

    flow = []
    pageno = [0]          # PDF page we are about to fill

    def new_page(template):
        pageno[0] += 1
        flow.append(NextPageTemplate(template))

    def template_for(n):
        return 'odd' if n % 2 == 1 else 'even'

    def end_page():
        flow.append(PageBreak())

    # 1. Copyright page, the first leaf (the cover file has the title).
    pageno[0] = 1
    flow.append(NextPageTemplate('even'))     # for the page after this one
    flow.append(Spacer(1, CONTENT_H - 2.4 * IN))
    flow.append(Paragraph(COPYRIGHT, small))
    flow.append(Paragraph('Illustrations \u00a9 2026 HungerArtist', small))
    flow.append(Spacer(1, 8))
    flow.append(Paragraph('Licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 '
                          'International License (CC BY-NC-ND 4.0). You may copy and share this book with '
                          'credit, but not sell it or change it. creativecommons.org/licenses/by-nc-nd/4.0',
                          small))
    flow.append(Spacer(1, 8))
    flow.append(Paragraph('A satire of Arnold Lobel\u2019s Frog and Toad books, with no connection to or '
                          'endorsement from Lobel\u2019s estate or publishers.', small))
    flow.append(Spacer(1, 8))
    flow.append(Paragraph('frogandtoad.ai', small))
    end_page()

    # 2. The story. Page numbers count from 1 on the first story page.
    #    The contents and chapter title pages are left out.
    story_pages = [p for p in pages if not p['contents'] and not p['chapter']]
    size = fit_type_size(story_pages[:-1])
    print(f'type size {size:g} pt')
    folio_n = 0
    n = 2
    for i, page in enumerate(story_pages):
        is_last = i == len(story_pages) - 1
        flow.append(NextPageTemplate(template_for(n + 1)))
        if page['blank']:
            flow.append(Spacer(1, 1))
        elif is_last:
            # The end: the picture and "The End", nothing else.
            img = next(v for k, v in page['items'] if k == 'image')
            flow.append(Spacer(1, 0.4 * IN))
            flow.append(picture(img, CONTENT_W, CONTENT_H - 1.6 * IN))
            flow.append(Paragraph('The End', the_end))
        else:
            folio_n += 1
            flow.append(Folio(folio_n))
            # Centred on the page top to bottom.
            slack = CONTENT_H - page_height(page)
            if slack > 1:
                flow.append(Spacer(1, slack / 2))
            flow.extend(story_flowables(page, folio_n))
        end_page()
        n += 1

    # The last story page ends the book; the QR codes are on the back cover.
    # A bound book has an even number of pages, so a blank closes it if need be.
    if (1 + len(story_pages)) % 2 == 0:
        flow.pop()      # the final PageBreak, which would add an empty page
    else:
        flow.append(Spacer(1, 1))

    doc.build(flow)
    expected = 1 + len(story_pages) + (1 + len(story_pages)) % 2
    if doc.page != expected:
        sys.exit(f'expected {expected} pages but got {doc.page}: a page overflowed')
    return doc.page


def qr_png(url, back='white'):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=1, box_size=10)
    qr.add_data(url)
    qr.make(fit=True)
    im = qr.make_image(fill_color=INK, back_color=back).convert('RGB')
    buf = io.BytesIO()
    im.save(buf, format='PNG')
    buf.seek(0)
    return buf


def qr_image(url, size):
    return Image(qr_png(url), width=size, height=size)


def draw_back_cover(canvas, left, bottom):
    """The back cover: the book's own site and 'Learn more' side by side,
    each with a QR code, then the book's accounts in a 2 x 2 grid.
    (left, bottom) is the back's trim corner; everything sits well inside
    the trim, clear of the boards' overlap."""
    from reportlab.lib.utils import ImageReader
    cx = left + PAGE_W / 2

    def heading(x, y, text, sub):
        canvas.setFillColor(GREEN_DEEP); canvas.setFont('Georgia-Bold', 22)
        canvas.drawCentredString(x, y, text)
        canvas.setFillColor(INK_SOFT); canvas.setFont('Georgia-Italic', 12)
        canvas.drawCentredString(x, y - 20, sub)

    def code(x, y, url, size, label):
        canvas.drawImage(ImageReader(qr_png(url, COVER_PAPER)), x - size / 2, y - size, size, size)
        canvas.setFillColor(INK); canvas.setFont('Georgia-Bold', 13)
        canvas.drawCentredString(x, y - size - 19, label)

    # The site and the real story, side by side.
    y = bottom + PAGE_H - 1.4 * IN
    col = 2.9 * IN
    size = 2 * IN
    for i, (head, sub, url, label) in enumerate((
            ('Read it online', 'The book, free, in every edition', BOOK_URL, 'frogandtoad.ai'),
            ('Learn more', 'The real story behind the book', LEARN_MORE_URL, 'frogandtoad.ai/learn-more'))):
        x = cx + (i - 0.5) * col
        heading(x, y, head, sub)
        code(x, y - 0.5 * IN, url, size, label)

    # The accounts in a 2 x 2 grid.
    y -= 0.5 * IN + size + 1.1 * IN
    heading(cx, y, 'Follow along', 'Updates from Frog and Toad')
    size = 1.25 * IN
    col = 2.4 * IN
    row = size + 0.6 * IN
    y -= 0.45 * IN
    for i, (name, url, shown) in enumerate(SOCIALS):
        x = cx + (i % 2 - 0.5) * col
        yy = y - (i // 2) * row
        code(x, yy, url, size, name)
        canvas.setFillColor(INK_SOFT); canvas.setFont('Georgia', 8)
        canvas.drawCentredString(x, yy - size - 31, shown)


if __name__ == '__main__':
    if '--spine' not in sys.argv:
        sys.exit('usage: make-print-pdf.py --spine WIDTH   (inches, from the Mixam cart)')
    spine = float(sys.argv[sys.argv.index('--spine') + 1]) * IN
    pages = parse_pages(read_story())
    total = build(pages)
    print(f'wrote {os.path.relpath(OUT, ROOT)}: {total} pages '
          f'({len([p for p in pages if not p["contents"] and not p["chapter"]])} story pages), {PAGE_W / IN:g} x {PAGE_H / IN:g} in trim with {BLEED / IN:g} in bleed')
    build_covers(spine)
    for path in (OUT_FRONT, OUT_BACK, OUT_SPINE):
        print(f'wrote {os.path.relpath(path, ROOT)}')
    print(f'cover files: {PAGE_W / IN:g} x {PAGE_H / IN:g} in trim, {spine / IN:g} in spine, {COVER_BLEED / IN:g} in bleed')
