"""Genera el resumen del proyecto en PDF (una página, tipografías estándar, ~6 KB).
Uso: python3 scripts/resumen_pdf.py docs/resumen-datos.json salida.pdf
"""
import json, sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.lib.colors import HexColor, white

W, H = A4
M = 34
BLUE, OK, WARN, INK, MUTED = HexColor('#0C71C3'), HexColor('#23864F'), HexColor('#AE5E0E'), HexColor('#22282F'), HexColor('#646B73')
LINE, SOFT, BG, WARNBG = HexColor('#E1E7ED'), HexColor('#E6F3FD'), HexColor('#F3F6F9'), HexColor('#FDF0DD')
F, FB = 'Helvetica', 'Helvetica-Bold'


def lines(text, font, size, width):
    return simpleSplit(text, font, size, width)


def card(c, x, y_top, w, h):
    c.setFillColor(white); c.setStrokeColor(LINE); c.setLineWidth(0.8)
    c.roundRect(x, y_top - h, w, h, 10, fill=1, stroke=1)


def item_height(it, width):
    h = len(lines(it['t'], FB, 10, width)) * 12.5
    if it.get('s'):
        h += len(lines(it['s'], F, 8, width)) * 10 + 1
    return h + 7


def draw_item(c, x, y, width, it, kind, n):
    r = 8
    cy = y - 6
    c.setFillColor(OK if kind == 'ok' else BLUE)
    c.circle(x + r, cy, r, fill=1, stroke=0)
    c.setStrokeColor(white); c.setFillColor(white); c.setLineWidth(1.8)
    if kind == 'ok':
        p = c.beginPath(); p.moveTo(x + 4, cy); p.lineTo(x + 7, cy - 3); p.lineTo(x + 12.5, cy + 3.5)
        c.drawPath(p, stroke=1, fill=0)
    else:
        c.setFont(FB, 8); c.drawCentredString(x + r, cy - 3, str(n))
    tx, tw = x + 2 * r + 8, width
    c.setFillColor(INK); c.setFont(FB, 10)
    for ln in lines(it['t'], FB, 10, tw):
        c.drawString(tx, y - 9, ln); y -= 12.5
    if it.get('s'):
        c.setFillColor(MUTED); c.setFont(F, 8)
        for ln in lines(it['s'], F, 8, tw):
            c.drawString(tx, y - 8, ln); y -= 10
        y -= 1
    return y - 7


def paw(c, cx, cy, s):
    c.setFillColor(white)
    for dx, dy in ((-9, 4), (-3.5, 11), (3.5, 11), (9, 4)):
        c.ellipse(cx + (dx - 2.4) * s, cy + (dy - 3) * s, cx + (dx + 2.4) * s, cy + (dy + 3) * s, fill=1, stroke=0)
    c.ellipse(cx - 7 * s, cy - 9 * s, cx + 7 * s, cy + 4 * s, fill=1, stroke=0)


def main(src, out):
    d = json.load(open(src, encoding='utf-8'))
    # medir
    colw = (W - 2 * M - 14) / 2
    inner = colw - 36 - 22
    hecho_h = 46 + sum(item_height(i, inner) for i in d['hecho'])
    tuyo_h = 46 + sum(item_height(i, inner) for i in d['tuyo'])
    colh = max(hecho_h, tuyo_h)
    nuestro = d['nuestro']; half = (len(nuestro) + 1) // 2
    pend_inner = colw - 36
    pend_rows = max(sum(len(lines(t, FB, 10, pend_inner)) * 12.5 + 7 for t in nuestro[:half]),
                    sum(len(lines(t, FB, 10, pend_inner)) * 12.5 + 7 for t in nuestro[half:]))
    pend_h = 52 + pend_rows
    banner_lines = lines(d['aviso'], FB, 10.5, W - 2 * M - 36)
    banner_h = len(banner_lines) * 13.5 + 20
    steps_h = 100
    total = 30 + 52 + 14 + banner_h + 14 + colh + 14 + pend_h + 14 + steps_h + 30
    PH = max(total + 2 * M - 40, 400)

    c = canvas.Canvas(out, pagesize=(W, PH))
    c.setTitle(d['titulo']); c.setAuthor('Aleix y Claude')
    c.setFillColor(BG); c.rect(0, 0, W, PH, fill=1, stroke=0)
    y = PH - M
    # cabecera
    c.setFillColor(HexColor('#1E93E3')); c.circle(M + 24, y - 24, 24, fill=1, stroke=0); paw(c, M + 24, y - 25, 1.15)
    c.setFillColor(BLUE); c.setFont(FB, 22); c.drawString(M + 62, y - 22, d['titulo'])
    c.setFillColor(MUTED); c.setFont(F, 10.5); c.drawString(M + 62, y - 40, d['subtitulo'])
    y -= 52 + 14
    # aviso
    c.setFillColor(WARNBG); c.roundRect(M, y - banner_h, W - 2 * M, banner_h, 8, fill=1, stroke=0)
    c.setFillColor(HexColor('#7a470a')); c.setFont(FB, 10.5)
    ty = y - 17
    for ln in banner_lines:
        c.drawString(M + 18, ty, ln); ty -= 13.5
    y -= banner_h + 14
    # dos columnas
    for k, (key, title, colr, kind, x) in enumerate((
            ('hecho', 'Ya está hecho', OK, 'ok', M),
            ('tuyo', 'Lo que necesitamos de ti', BLUE, 'num', M + colw + 14))):
        card(c, x, y, colw, colh)
        c.setFillColor(colr); c.setFont(FB, 14); c.drawString(x + 16, y - 26, title)
        iy = y - 38
        for n, it in enumerate(d[key], 1):
            iy = draw_item(c, x + 16, iy, inner, it, kind, n)
    y -= colh + 14
    # pendiente
    card(c, M, y, W - 2 * M, pend_h)
    c.setFillColor(WARN); c.setFont(FB, 14); c.drawString(M + 16, y - 26, 'Pendiente por nuestra parte')
    for col, group in enumerate((nuestro[:half], nuestro[half:])):
        x = M + 16 + col * (colw + 14); iy = y - 40
        for t in group:
            c.setFillColor(WARN); c.circle(x + 5, iy - 5, 5, fill=1, stroke=0)
            c.setFillColor(white); c.circle(x + 5, iy - 5, 1.6, fill=1, stroke=0)
            c.setFillColor(INK); c.setFont(FB, 10)
            for ln in lines(t, FB, 10, pend_inner - 18):
                c.drawString(x + 18, iy - 8.5, ln); iy -= 12.5
            iy -= 7
    y -= pend_h + 14
    # pasos
    card(c, M, y, W - 2 * M, steps_h)
    c.setFillColor(INK); c.setFont(FB, 14); c.drawString(M + 16, y - 26, 'Los pasos hasta publicar')
    n = len(d['pasos']); gap = 8; bw = (W - 2 * M - 32 - gap * (n - 1)) / n
    for i, name in enumerate(d['pasos'], 1):
        x = M + 16 + (i - 1) * (bw + gap); act = (i == d['paso_actual'])
        c.setFillColor(BLUE if act else SOFT); c.roundRect(x, y - 36 - 46, bw, 46, 8, fill=1, stroke=0)
        c.setFillColor(white if act else BLUE); c.setFont(FB, 15); c.drawCentredString(x + bw / 2, y - 36 - 17, str(i))
        c.setFillColor(white if act else INK); c.setFont(FB, 8.2)
        ls = lines(name, FB, 8.2, bw - 8)
        for j, ln in enumerate(ls):
            c.drawCentredString(x + bw / 2, y - 36 - 29 - j * 9.5, ln)
    y -= steps_h + 14
    c.setFillColor(MUTED); c.setFont(F, 9); c.drawString(M, y - 10, d['pie'])
    c.showPage(); c.save()


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
