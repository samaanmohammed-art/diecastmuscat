// Certificate of Authenticity PDF generator for Diecast Muscat.
// Single-page prestige document — one per order item.

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Customer, Order, OrderItem } from "@/types/database";
import { formatDate } from "@/lib/utils";

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MX = 56; // margin x
const GOLD = rgb(0.83, 0.69, 0.22);
const INK = rgb(0.07, 0.07, 0.08);
const SUBTLE = rgb(0.42, 0.42, 0.45);
const HAIR = rgb(0.85, 0.85, 0.88);

function certNumber(orderId: string, itemIndex: number): string {
  const hash = orderId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `DM-COA-${hash}-${String(itemIndex + 1).padStart(2, "0")}`;
}

function drawCentred(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  y: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  color = INK
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PAGE_WIDTH - w) / 2, y, size, font, color });
}

function drawLeft(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  x: number,
  y: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  color = INK
) {
  page.drawText(text, { x, y, size, font, color });
}

function hline(
  page: ReturnType<PDFDocument["addPage"]>,
  y: number,
  color = HAIR,
  thickness = 0.5,
  x1 = MX,
  x2 = PAGE_WIDTH - MX
) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });
}

export async function generateCertificatePDF(
  order: Order,
  item: OrderItem,
  customer: Customer,
  itemIndex: number
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const certNo = certNumber(order.id, itemIndex);
  pdfDoc.setTitle(`Certificate of Authenticity — ${item.product_name}`);
  pdfDoc.setAuthor("Diecast Muscat");
  pdfDoc.setSubject(certNo);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Outer border — double-rule luxury frame
  page.drawRectangle({
    x: 24,
    y: 24,
    width: PAGE_WIDTH - 48,
    height: PAGE_HEIGHT - 48,
    borderColor: GOLD,
    borderWidth: 0.8,
    opacity: 0,
  });
  page.drawRectangle({
    x: 30,
    y: 30,
    width: PAGE_WIDTH - 60,
    height: PAGE_HEIGHT - 60,
    borderColor: GOLD,
    borderWidth: 0.25,
    opacity: 0,
  });

  let y = PAGE_HEIGHT - 72;

  // Wordmark
  drawCentred(page, "DIECAST MUSCAT", y, bold, 13, GOLD);
  y -= 16;
  drawCentred(page, "Curated die-cast collectibles · Muscat, Sultanate of Oman", y, font, 8, SUBTLE);
  y -= 28;

  hline(page, y, GOLD, 0.8);
  y -= 32;

  // Title
  drawCentred(page, "CERTIFICATE OF AUTHENTICITY", y, bold, 16, INK);
  y -= 12;
  hline(page, y, GOLD, 0.4, PAGE_WIDTH / 2 - 60, PAGE_WIDTH / 2 + 60);
  y -= 32;

  // Product name — large display
  const nameSize = item.product_name.length > 36 ? 18 : 22;
  drawCentred(page, item.product_name.toUpperCase(), y, bold, nameSize, INK);
  y -= nameSize + 6;
  drawCentred(page, `SKU: ${item.product_sku}`, y, italic, 9, SUBTLE);
  y -= 40;

  hline(page, y);
  y -= 28;

  // Spec grid — 2-col, centred block
  const specBlockWidth = 360;
  const specX = (PAGE_WIDTH - specBlockWidth) / 2;
  const colMid = specX + specBlockWidth / 2 + 12;

  const specs: Array<[string, string]> = [
    ["Certificate No.", certNo],
    ["Collector", customer.name],
    ["Purchase Date", formatDate(order.created_at)],
    ["Order Reference", order.invoice_number ?? order.id.slice(0, 8).toUpperCase()],
    ["Quantity", String(item.quantity)],
  ];

  for (const [label, value] of specs) {
    drawLeft(page, label.toUpperCase(), specX, y, font, 8, SUBTLE);
    drawLeft(page, value, colMid, y, bold, 9, INK);
    y -= 18;
  }

  y -= 16;
  hline(page, y);
  y -= 32;

  // Authentication statement
  const STATEMENT_LINES = [
    "This document certifies that the above die-cast model has been physically inspected,",
    "authenticated, and catalogued by the Diecast Muscat atelier in Muscat, Oman.",
    "The piece has been verified to be in the described condition and sourced through",
    "authorised channels directly from the manufacturer or authorised distributor.",
  ];

  for (const line of STATEMENT_LINES) {
    drawCentred(page, line, y, italic, 8.5, SUBTLE);
    y -= 13;
  }

  y -= 28;
  hline(page, y, GOLD, 0.5);
  y -= 36;

  // Signature block — two columns
  const sigColW = 180;
  const sigL = (PAGE_WIDTH / 2) - sigColW - 16;
  const sigR = (PAGE_WIDTH / 2) + 16;

  // Signature lines
  page.drawLine({ start: { x: sigL, y }, end: { x: sigL + sigColW, y }, thickness: 0.5, color: INK });
  page.drawLine({ start: { x: sigR, y }, end: { x: sigR + sigColW, y }, thickness: 0.5, color: INK });
  y -= 12;
  drawLeft(page, "AUTHENTICATED BY", sigL, y, font, 7.5, SUBTLE);
  drawLeft(page, "COLLECTOR", sigR, y, font, 7.5, SUBTLE);
  y -= 11;
  drawLeft(page, "Diecast Muscat Atelier", sigL, y, bold, 8.5, INK);
  drawLeft(page, customer.name, sigR, y, bold, 8.5, INK);

  // Footer
  const footerY = 44;
  hline(page, footerY + 18, HAIR);
  const footerText = `${certNo}  ·  diecastmuscat.om  ·  concierge@diecastmuscat.om`;
  drawCentred(page, footerText, footerY, font, 7.5, SUBTLE);

  return pdfDoc.save();
}
