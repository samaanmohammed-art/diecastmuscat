// PDF invoice generator for Diecast Muscat orders.
// Uses pdf-lib with embedded standard fonts so we don't need external assets.

import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import type { Customer, Order, OrderItem } from "@/types/database";
import { formatCurrencyOMR, formatDate } from "@/lib/utils";

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 48;
const MARGIN_TOP = 56;
const MARGIN_BOTTOM = 64;

const GOLD = rgb(0.83, 0.69, 0.22);
const INK = rgb(0.09, 0.09, 0.1);
const SUBTLE = rgb(0.42, 0.42, 0.45);
const HAIR = rgb(0.85, 0.85, 0.88);

const COMPANY_INFO = {
  name: "Diecast Muscat",
  line1: "Curated die-cast collectibles",
  address: "Al Khuwair, Muscat",
  country: "Sultanate of Oman",
  email: "concierge@diecastmuscat.om",
  phone: "+968 2200 0000",
};

interface DrawContext {
  page: PDFPage;
  font: PDFFont;
  bold: PDFFont;
  pageNumber: number;
  totalPages: number;
}

interface TextOpts {
  size?: number;
  font?: PDFFont;
  color?: ReturnType<typeof rgb>;
}

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  defaultFont: PDFFont,
  opts: TextOpts = {}
) {
  page.drawText(text, {
    x,
    y,
    size: opts.size ?? 9.5,
    font: opts.font ?? defaultFont,
    color: opts.color ?? INK,
  });
}

function drawHairline(page: PDFPage, y: number, color = HAIR, thickness = 0.5) {
  page.drawLine({
    start: { x: MARGIN_X, y },
    end: { x: PAGE_WIDTH - MARGIN_X, y },
    thickness,
    color,
  });
}

function drawHeader(ctx: DrawContext, order: Order): number {
  const { page, font, bold } = ctx;
  let y = PAGE_HEIGHT - MARGIN_TOP;

  // Wordmark
  drawText(page, "DIECAST MUSCAT", MARGIN_X, y, font, {
    font: bold,
    size: 18,
    color: GOLD,
  });

  // Right-side label
  const invoiceLabel = "INVOICE";
  const labelWidth = bold.widthOfTextAtSize(invoiceLabel, 11);
  drawText(page, invoiceLabel, PAGE_WIDTH - MARGIN_X - labelWidth, y + 4, font, {
    font: bold,
    size: 11,
    color: INK,
  });

  y -= 8;
  drawText(
    page,
    "Curated die-cast collectibles",
    MARGIN_X,
    y - 8,
    font,
    { size: 9, color: SUBTLE }
  );

  // Invoice meta block (right)
  const invoiceNo = order.invoice_number ?? order.id;
  const metaLines = [
    `Invoice No.  ${invoiceNo}`,
    `Date  ${formatDate(order.created_at)}`,
    `Status  ${order.status.toUpperCase()}`,
  ];
  let metaY = y - 8;
  for (const line of metaLines) {
    const w = font.widthOfTextAtSize(line, 9);
    drawText(page, line, PAGE_WIDTH - MARGIN_X - w, metaY, font, {
      size: 9,
      color: SUBTLE,
    });
    metaY -= 12;
  }

  y -= 32;
  drawHairline(page, y, GOLD, 0.8);
  return y - 24;
}

function drawAddressBlocks(
  ctx: DrawContext,
  customer: Customer,
  order: Order,
  startY: number
): number {
  const { page, font, bold } = ctx;
  const colWidth = (PAGE_WIDTH - MARGIN_X * 2) / 2 - 16;

  drawText(page, "BILLED TO", MARGIN_X, startY, font, {
    font: bold,
    size: 8,
    color: SUBTLE,
  });
  drawText(page, "FROM", MARGIN_X + colWidth + 32, startY, font, {
    font: bold,
    size: 8,
    color: SUBTLE,
  });

  const ship = order.shipping_address;
  const billLines = [
    customer.name,
    customer.email,
    customer.phone ?? "",
    ship?.address ?? customer.address ?? "",
    [ship?.city ?? customer.city ?? "", ship?.postal_code ?? customer.postal_code ?? ""]
      .filter(Boolean)
      .join("  "),
    ship?.country ?? customer.country,
  ].filter((l) => l.trim().length > 0);

  const fromLines = [
    COMPANY_INFO.name,
    COMPANY_INFO.line1,
    COMPANY_INFO.address,
    COMPANY_INFO.country,
    COMPANY_INFO.phone,
    COMPANY_INFO.email,
  ];

  let leftY = startY - 14;
  for (const line of billLines) {
    drawText(page, line, MARGIN_X, leftY, font, { size: 9.5 });
    leftY -= 12;
  }

  let rightY = startY - 14;
  for (const line of fromLines) {
    drawText(page, line, MARGIN_X + colWidth + 32, rightY, font, { size: 9.5 });
    rightY -= 12;
  }

  return Math.min(leftY, rightY) - 12;
}

interface Column {
  label: string;
  x: number;
  width: number;
  align: "left" | "right";
}

function buildColumns(): Column[] {
  const usable = PAGE_WIDTH - MARGIN_X * 2;
  const skuW = 80;
  const qtyW = 36;
  const unitW = 80;
  const subW = 90;
  const itemW = usable - skuW - qtyW - unitW - subW;
  const x0 = MARGIN_X;
  return [
    { label: "SKU", x: x0, width: skuW, align: "left" },
    { label: "Item", x: x0 + skuW, width: itemW, align: "left" },
    { label: "Qty", x: x0 + skuW + itemW, width: qtyW, align: "right" },
    { label: "Unit Price", x: x0 + skuW + itemW + qtyW, width: unitW, align: "right" },
    {
      label: "Subtotal",
      x: x0 + skuW + itemW + qtyW + unitW,
      width: subW,
      align: "right",
    },
  ];
}

function drawCell(
  page: PDFPage,
  text: string,
  col: Column,
  y: number,
  font: PDFFont,
  opts: TextOpts = {}
) {
  const size = opts.size ?? 9.5;
  if (col.align === "right") {
    const w = (opts.font ?? font).widthOfTextAtSize(text, size);
    drawText(page, text, col.x + col.width - w, y, font, opts);
  } else {
    drawText(page, text, col.x + 2, y, font, opts);
  }
}

function truncateForWidth(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 1 && font.widthOfTextAtSize(trimmed + "…", size) > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed + "…";
}

function drawTableHeader(
  ctx: DrawContext,
  columns: Column[],
  startY: number
): number {
  const { page, font, bold } = ctx;
  drawText(page, "ITEMS", MARGIN_X, startY, font, {
    font: bold,
    size: 8,
    color: SUBTLE,
  });
  const headerY = startY - 14;
  for (const col of columns) {
    drawCell(page, col.label.toUpperCase(), col, headerY, font, {
      font: bold,
      size: 8.5,
      color: SUBTLE,
    });
  }
  drawHairline(page, headerY - 6);
  return headerY - 18;
}

function drawTotals(
  ctx: DrawContext,
  order: Order,
  startY: number,
  itemsSubtotal: number
): number {
  const { page, font, bold } = ctx;
  const subtotal = order.subtotal || itemsSubtotal;
  const shipping = order.shipping_cost ?? 0;
  const tax = order.tax_amount ?? +(subtotal * 0.05).toFixed(3);
  const grandTotal = order.total_amount || +(subtotal + shipping + tax).toFixed(3);

  const labelX = PAGE_WIDTH - MARGIN_X - 200;
  const valueRight = PAGE_WIDTH - MARGIN_X;

  const rows: { label: string; value: string; bold?: boolean }[] = [
    { label: "Subtotal", value: formatCurrencyOMR(subtotal) },
    { label: "Shipping", value: formatCurrencyOMR(shipping) },
    { label: "VAT (5%)", value: formatCurrencyOMR(tax) },
    { label: "Grand Total", value: formatCurrencyOMR(grandTotal), bold: true },
  ];

  let y = startY;
  for (const row of rows) {
    const useFont = row.bold ? bold : font;
    const size = row.bold ? 11 : 9.5;
    const color = row.bold ? INK : SUBTLE;

    drawText(page, row.label, labelX, y, font, {
      font: useFont,
      size,
      color,
    });

    const valWidth = useFont.widthOfTextAtSize(row.value, size);
    drawText(page, row.value, valueRight - valWidth, y, font, {
      font: useFont,
      size,
      color: row.bold ? GOLD : INK,
    });

    if (row.bold) {
      drawHairline(page, y + 14, GOLD, 0.8);
    }
    y -= row.bold ? 18 : 14;
  }

  return y;
}

function drawFooter(ctx: DrawContext) {
  const { page, font, bold } = ctx;
  const baseY = MARGIN_BOTTOM;

  drawHairline(page, baseY + 36);

  drawText(
    page,
    "Thank you for your purchase. — Diecast Muscat",
    MARGIN_X,
    baseY + 22,
    font,
    { font: bold, size: 9.5, color: INK }
  );

  drawText(
    page,
    "Each piece carries a certificate of authenticity. Treat it as you would any heirloom — out of direct sun, away from humidity.",
    MARGIN_X,
    baseY + 8,
    font,
    { size: 8.5, color: SUBTLE }
  );

  const pageLabel = `Page ${ctx.pageNumber} of ${ctx.totalPages}`;
  const w = font.widthOfTextAtSize(pageLabel, 8);
  drawText(page, pageLabel, PAGE_WIDTH - MARGIN_X - w, baseY + 8, font, {
    size: 8,
    color: SUBTLE,
  });
}

export async function generateInvoicePDF(
  order: Order,
  items: OrderItem[],
  customer: Customer
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`Invoice ${order.invoice_number ?? order.id}`);
  pdfDoc.setAuthor("Diecast Muscat");
  pdfDoc.setProducer("Diecast Muscat Storefront");
  pdfDoc.setCreator("Diecast Muscat Storefront");

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const columns = buildColumns();

  // Two-pass approach: first measure rows that will appear, then paginate.
  // We'll build pages on the fly.
  const pages: PDFPage[] = [];
  const newPage = (): PDFPage => {
    const p = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(p);
    return p;
  };

  // Page 1
  let page = newPage();
  let ctx: DrawContext = {
    page,
    font,
    bold,
    pageNumber: 1,
    totalPages: 1, // patched at end
  };

  let y = drawHeader(ctx, order);
  y = drawAddressBlocks(ctx, customer, order, y);
  y = drawTableHeader(ctx, columns, y);

  const rowHeight = 16;
  const minBodyY = MARGIN_BOTTOM + 60; // reserve space for totals/footer
  let itemsSubtotal = 0;

  for (const item of items) {
    if (y < minBodyY) {
      // new page for overflow
      page = newPage();
      ctx = { ...ctx, page, pageNumber: pages.length };
      y = PAGE_HEIGHT - MARGIN_TOP;
      drawText(page, "Items (continued)", MARGIN_X, y, font, {
        font: bold,
        size: 9,
        color: SUBTLE,
      });
      y -= 18;
      for (const col of columns) {
        drawCell(page, col.label.toUpperCase(), col, y, font, {
          font: bold,
          size: 8.5,
          color: SUBTLE,
        });
      }
      drawHairline(page, y - 6);
      y -= 18;
    }

    const subtotal = item.subtotal ?? +(item.price * item.quantity).toFixed(3);
    itemsSubtotal += subtotal;

    const itemCol = columns[1];
    const safeName = truncateForWidth(
      item.product_name,
      font,
      9.5,
      itemCol.width - 6
    );

    drawCell(page, item.product_sku, columns[0], y, font);
    drawCell(page, safeName, columns[1], y, font);
    drawCell(page, String(item.quantity), columns[2], y, font);
    drawCell(page, formatCurrencyOMR(item.price), columns[3], y, font);
    drawCell(page, formatCurrencyOMR(subtotal), columns[4], y, font, {
      font: bold,
    });

    y -= rowHeight;
  }

  drawHairline(page, y + 4);
  y -= 16;

  // If totals don't fit, push to new page
  if (y < MARGIN_BOTTOM + 110) {
    page = newPage();
    ctx = { ...ctx, page, pageNumber: pages.length };
    y = PAGE_HEIGHT - MARGIN_TOP;
  }

  drawTotals(ctx, order, y, itemsSubtotal);

  // Footer + page numbering
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    const fctx: DrawContext = {
      page: p,
      font,
      bold,
      pageNumber: idx + 1,
      totalPages,
    };
    drawFooter(fctx);
  });

  return pdfDoc.save();
}
