import { jsPDF } from "jspdf";
import * as XLSX from "@e965/xlsx";

export type BursaryPdfData = {
  reference: string;
  term?: string | null;
  student_name: string;
  registration_number?: string | null;
  dob?: string | null;
  gender?: string | null;
  current_grade: string;
  birth_cert_number?: string | null;
  father_alive?: boolean | null;
  mother_alive?: boolean | null;
  father_name?: string | null;
  father_phone?: string | null;
  father_occupation?: string | null;
  father_national_id?: string | null;
  mother_name?: string | null;
  mother_phone?: string | null;
  mother_occupation?: string | null;
  mother_national_id?: string | null;
  student_disability?: boolean | null;
  student_disability_detail?: string | null;
  student_outstanding_ability?: string | null;
  student_annual_fee?: number | null;
  outstanding_balance?: number | null;

  school_name: string;
  school_category?: string | null;
  school_county?: string | null;
  school_sub_county?: string | null;
  year_of_admission?: string | null;
  school_bank_account?: string | null;

  guardian_name: string;
  guardian_phone: string;
  parent_national_id?: string | null;
  parent_occupation?: string | null;
  parent_residence_sub_county?: string | null;
  ward?: string | null;
  polling_station?: string | null;
  parent_disability?: boolean | null;
  parent_disability_detail?: string | null;
  siblings_in_school?: number | null;
  monthly_budget?: number | null;
  amount_requested?: number | null;
  received_bursary_before?: boolean | null;
  previous_bursary_source?: string | null;
  previous_bursary_amount?: number | null;
  reason?: string | null;
};

const bool = (v?: boolean | null) => (v ? "Yes" : "No");
const dash = (v: string | number | null | undefined) =>
  v === null || v === undefined || v === "" ? "—" : String(v);
const money = (v?: number | null) =>
  v ? `KSh ${Number(v).toLocaleString()}` : "—";

// Vertical rhythm constants for the application form. Centralized here so
// the field-grid row height and the space reserved for it (rowHeight)
// never drift out of sync with each other.
const KV_ROW_H = 7.6;
// How close to the physical page bottom (297mm on A4) content is allowed
// to get before a section is pushed onto a fresh page instead of being
// squeezed in or spilling past the edge.
const PAGE_SAFE_BOTTOM = 282;

// Reserves `needed` mm of vertical space starting at `y`; if it won't fit
// before PAGE_SAFE_BOTTOM, starts a new page first. Used before every major
// section on page 1 so the extra breathing room added below can never
// silently push content off the bottom of the page — it just continues
// cleanly on the next one instead.
function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_SAFE_BOTTOM) {
    doc.addPage();
    return 16;
  }
  return y;
}

export function generateBursaryPdf(d: BursaryPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 14;
  let y = 14;

  // Header
  doc.setFillColor(20, 83, 45); // primary green
  doc.rect(0, 0, W, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("MOHA EDUCATION KITTY", M, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`CONSTITUENCY BURSARY APPLICATION FORM — ${(d.term || "").trim() || "CURRENT TERM"}`, M, 16);
  doc.setTextColor(0, 0, 0);

  y = 29;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`SERIAL NO: ${d.reference}`, W - M, y, { align: "right" });

  // A: Instructions
  y += 7;
  sectionTitle(doc, "A: INSTRUCTIONS", y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const instr = [
    "Attach copies of the following supportive documents:",
    "• Parent's National ID  • Student's Birth Certificate  • Parent's Death Certificate(s)",
    "• Current report form and fee structure  • NCPWD card or letter  • Admission letter where necessary",
    "• Any other crucial supporting documents",
    "Duly filled form to be returned to the Moha Coordination Office, Kiamaiko-Mathare.",
    "STUDENTS LIVING WITH DISABILITY ARE ENCOURAGED TO APPLY.",
  ];
  for (const line of instr) {
    doc.text(line, M, y);
    y += 4.4;
  }

  // B: Student
  y += 3;
  y = ensureSpace(doc, y, 15 + rowHeight(14));
  sectionTitle(doc, "B: STUDENT'S DETAILS", y);
  y += 8;
  kvRows(doc, y, [
    ["Student Name", dash(d.student_name)],
    ["Admission / Registration No.", dash(d.registration_number)],
    ["Date of Birth", dash(d.dob)],
    ["Gender", dash(d.gender)],
    ["Grade / Class", dash(d.current_grade)],
    ["Birth Certificate No.", dash(d.birth_cert_number)],
    ["Father Alive", bool(d.father_alive)],
    ["Mother Alive", bool(d.mother_alive)],
    ["Living with Disability", d.student_disability ? `Yes — ${d.student_disability_detail || "specified"}` : "No"],
    ["Student's Outstanding Ability", dash(d.student_outstanding_ability)],
    ["Student Annual Fee Payable", money(d.student_annual_fee)],
    ["Student's Outstanding Balance", money(d.outstanding_balance)],
    ["Amount Applying For", money(d.amount_requested)],
    ["Received Bursary in Last 6 Months?", d.received_bursary_before ? `Yes — ${d.previous_bursary_source || "source unspecified"} (${money(d.previous_bursary_amount)})` : "No"],
  ]);
  y += rowHeight(14);

  // B.1: Father's details (only if alive)
  if (d.father_alive) {
    y += 3;
    y = ensureSpace(doc, y, 15 + rowHeight(4));
    sectionTitle(doc, "B1: FATHER'S DETAILS", y);
    y += 8;
    kvRows(doc, y, [
      ["Father's Name", dash(d.father_name)],
      ["Phone", dash(d.father_phone)],
      ["Occupation", dash(d.father_occupation)],
      ["National ID", dash(d.father_national_id)],
    ]);
    y += rowHeight(4);
  }

  // B.2: Mother's details (only if alive)
  if (d.mother_alive) {
    y += 3;
    y = ensureSpace(doc, y, 15 + rowHeight(4));
    sectionTitle(doc, "B2: MOTHER'S DETAILS", y);
    y += 8;
    kvRows(doc, y, [
      ["Mother's Name", dash(d.mother_name)],
      ["Phone", dash(d.mother_phone)],
      ["Occupation", dash(d.mother_occupation)],
      ["National ID", dash(d.mother_national_id)],
    ]);
    y += rowHeight(4);
  }

  // C: School
  y += 3;
  y = ensureSpace(doc, y, 15 + rowHeight(6));
  sectionTitle(doc, "C: SCHOOL'S DETAILS", y);
  y += 8;
  kvRows(doc, y, [
    ["School Name", dash(d.school_name)],
    ["Category", dash(d.school_category)],
    ["County", dash(d.school_county)],
    ["Sub-County", dash(d.school_sub_county)],
    ["Year of Admission", dash(d.year_of_admission)],
    ["School Bank Account", dash(d.school_bank_account)],
  ]);
  y += rowHeight(6);

  // D: Parent/Guardian
  y += 3;
  y = ensureSpace(doc, y, 15 + rowHeight(10));
  sectionTitle(doc, "D: PARENT / GUARDIAN'S DETAILS", y);
  y += 8;
  kvRows(doc, y, [
    ["Parent / Guardian Name", dash(d.guardian_name)],
    ["Phone Contact", dash(d.guardian_phone)],
    ["National ID", dash(d.parent_national_id)],
    ["Occupation", dash(d.parent_occupation)],
    ["Residential Sub-County", dash(d.parent_residence_sub_county)],
    ["Ward", dash(d.ward)],
    ["Polling Station", dash(d.polling_station)],
    ["Living with Disability", d.parent_disability ? `Yes — ${d.parent_disability_detail || "specified"}` : "No"],
    ["Children in School / University", dash(d.siblings_in_school ?? 0)],
    ["Parent's Monthly Budget", money(d.monthly_budget)],
  ]);
  y += rowHeight(10);

  // Reason
  y += 3;
  doc.setFont("helvetica", "normal");
  const reasonPreview = doc.splitTextToSize(d.reason || "—", W - 2 * M - 2);
  const reasonBoxHeight = Math.max(16, reasonPreview.length * 4.3 + 3);
  y = ensureSpace(doc, y, 8 + reasonBoxHeight);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Brief description of reason for application:", M, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  const reason = d.reason || "—";
  const lines = doc.splitTextToSize(reason, W - 2 * M - 2);
  doc.rect(M, y - 1, W - 2 * M, reasonBoxHeight);
  doc.text(lines, M + 2, y + 3.3);
  y += reasonBoxHeight + 3;

  // Page 2 — Declarations & Official Use
  doc.addPage();
  y = 16;

  sectionTitle(doc, "E: DECLARATIONS", y);
  y += 8.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.setFont("helvetica", "bold");
  doc.text("Parent / Guardian", M, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.text(
    "I declare that I have read this form / this form has been read to me and I hereby confirm that the",
    M, y,
  );
  y += 4.5;
  doc.text("information given herein is true to the best of my knowledge.", M, y);
  y += 8;
  signLine(doc, y, "Parent / Guardian Name", d.guardian_name);
  y += 9;
  signLine(doc, y, "Contact", d.guardian_phone);
  signLine(doc, y, "Signature", "", W / 2 + 5);
  y += 9;
  signLine(doc, y, "Date", "");

  y += 11;
  doc.setFont("helvetica", "bold");
  doc.text("Local Administration", M, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.text(
    "I certify that the applicant is a resident of my Village / Location, and that I have checked the",
    M, y,
  );
  y += 4.5;
  doc.text("information herein and confirmed it to be true to the best of my knowledge.", M, y);
  y += 8;
  signLine(doc, y, "Name", "");
  signLine(doc, y, "Signature", "", W / 2 + 5);
  y += 9;
  signLine(doc, y, "Designation", "");
  signLine(doc, y, "Date", "", W / 2 + 5);
  y += 9;
  signLine(doc, y, "Rubber Stamp", "");
  signLine(doc, y, "Phone Contact", "", W / 2 + 5);

  // F: Official Use Only
  y += 13;
  y = ensureSpace(doc, y, 70);
  sectionTitle(doc, "F: OFFICIAL USE ONLY", y);
  y += 8.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Is the applicant's form duly filled and signed?", M, y);
  checkbox(doc, M + 95, y - 3, "YES");
  checkbox(doc, M + 115, y - 3, "NO");
  y += 7.5;
  doc.text("Has the applicant submitted relevant supporting documents?", M, y);
  checkbox(doc, M + 95, y - 3, "YES");
  checkbox(doc, M + 115, y - 3, "NO");
  y += 7.5;
  doc.text("Recommendation on level of need:", M, y);
  checkbox(doc, M + 60, y - 3, "High");
  checkbox(doc, M + 90, y - 3, "Moderate");
  checkbox(doc, M + 130, y - 3, "Low");
  y += 8.5;
  signLine(doc, y, "Recommended amount for bursary award (KSh)", "");
  y += 8.5;
  signLine(doc, y, "Reason", "");
  y += 15;

  y = ensureSpace(doc, y, 45);
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatures", M, y);
  y += 6.5;
  doc.setFont("helvetica", "normal");
  doc.text("Committee Chairperson:", M, y);
  doc.text("Committee Secretary:", W / 2 + 5, y);
  y += 8.5;
  signLine(doc, y, "Name", "");
  signLine(doc, y, "Name", "", W / 2 + 5);
  y += 8.5;
  signLine(doc, y, "Signature", "");
  signLine(doc, y, "Signature", "", W / 2 + 5);
  y += 8.5;
  signLine(doc, y, "Date", "");
  y += 11;
  signLine(doc, y, "Official Stamp", "");

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Moha Education Kitty • Generated ${new Date().toLocaleString()} • Ref ${d.reference}`,
    W / 2, 290, { align: "center" },
  );

  doc.save(`Moha-Bursary-${d.reference}.pdf`);
}

function sectionTitle(doc: jsPDF, label: string, y: number) {
  doc.setFillColor(212, 175, 55); // gold
  doc.rect(14, y - 4.3, 182, 6.6, "F");
  doc.setTextColor(20, 30, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(label, 16, y);
  doc.setTextColor(0, 0, 0);
}

function kvRows(doc: jsPDF, startY: number, rows: Array<[string, string]>) {
  const M = 14;
  const W = 210;
  const colW = (W - 2 * M) / 2;
  const rowH = KV_ROW_H;
  doc.setFontSize(9);
  rows.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * colW;
    const yy = startY + row * rowH;
    doc.setDrawColor(180, 180, 180);
    doc.rect(x, yy - 4.4, colW, rowH);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(r[0].toUpperCase(), x + 2, yy - 1.3);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const val = doc.splitTextToSize(r[1], colW - 4);
    doc.text(String(val[0] ?? ""), x + 2, yy + 2.9);
  });
}

function rowHeight(itemCount: number) {
  return Math.ceil(itemCount / 2) * KV_ROW_H;
}

function signLine(doc: jsPDF, y: number, label: string, value: string, xStart = 14) {
  const labelW = doc.getTextWidth(label + ": ");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`${label}:`, xStart, y);
  doc.setFont("helvetica", "normal");
  const lineStart = xStart + labelW + 1;
  const lineEnd = xStart + 90;
  doc.setDrawColor(120, 120, 120);
  doc.line(lineStart, y + 0.5, lineEnd, y + 0.5);
  if (value) doc.text(value, lineStart + 1, y - 0.5);
}

function checkbox(doc: jsPDF, x: number, y: number, label: string) {
  doc.setDrawColor(0, 0, 0);
  doc.rect(x, y, 4, 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(label, x + 5, y + 3.2);
}

// â”€â”€â”€ SCHOOL CONFIRMATION LETTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Generates the official "Confirmation of Bursary Beneficiaries" letter sent
// to a school's Principal — formatted to match the Moha Education Kitty
// letterhead exactly: address block, RE line, narrative paragraph with the
// cheque number and total, a 15-row NO/NAME/FORM-ADM NO/AMOUNT table, closing
// paragraph, and signature block.

export type ConfirmationLetterRow = {
  student_name: string;
  registration_number?: string | null;
  current_grade: string;
  amount_requested?: number | null;
};

export type ConfirmationLetterOptions = {
  schoolName: string;
  // "2026 T2", etc. — defaults to current year + "T2" if omitted entirely.
  // Pass an empty string "" (as opposed to leaving it out) to print a blank
  // dotted line instead — used for the blank/manual-fill template.
  termLabel?: string;
  chequeNumber?: string;    // left blank (dotted line) if not provided
  dateLabel?: string;       // left blank (dotted line) if not provided
  officerName?: string;
  officerPhone?: string;
  schoolCounty?: string | null;    // printed in the footer, for sorting printed letters by location
  schoolSubCounty?: string | null;
  // Upper bound on how many rows the beneficiary table should have when
  // there's no real beneficiary data (rows = []) — e.g. for a blank
  // template meant to be filled in by hand. The actual row count used is
  // whichever is smaller: this value, or however many rows actually fit on
  // a single page — so the letter can never spill onto a second page.
  // Ignored when rows.length > 0 (existing behaviour: rows.length + 3,
  // capped at 15, is used instead).
  emptyTemplateRowCount?: number;
};

export function generateConfirmationLetter(
  rows: ConfirmationLetterRow[],
  opts: ConfirmationLetterOptions,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210;
  const M = 18;
  const contentW = W - 2 * M;

  // termLabel === "" (explicitly, not just omitted) means "print a blank
  // line here instead" — used by the blank/manual-fill template.
  const termProvided = opts.termLabel !== undefined;
  const termIsBlank = termProvided && opts.termLabel!.trim() === "";
  const term = termProvided ? opts.termLabel! : `${new Date().getFullYear()} T2`;
  const officerName = opts.officerName || "Nancy Otieno";
  const officerPhone = opts.officerPhone || "0728827978";
  const total = rows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);

  let y = 16;

  // â”€â”€ Letterhead â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 83, 45); // primary green, matching the site theme
  doc.text("MOHA EDUCATION KITTY", W / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 6.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("P.O. BOX 12596-00100", W / 2, y, { align: "center" });
  y += 5;
  doc.text("JonSaga, Tavern Building, -Kiamaiko", W / 2, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "bold");
  const nairobiW = doc.getTextWidth("NAIROBI");
  doc.text("NAIROBI", W / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(W / 2 - nairobiW / 2, y + 0.8, W / 2 + nairobiW / 2, y + 0.8);
  y += 12;

  // â”€â”€ Date â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  const dateText = `Date: ${opts.dateLabel || ""}`;
  doc.text(dateText, W - M, y, { align: "right" });
  if (!opts.dateLabel) {
    const labelW = doc.getTextWidth("Date: ");
    doc.setLineWidth(0.3);
    doc.line(W - M - 45, y + 0.8, W - M, y + 0.8);
  }
  y += 12;

  // â”€â”€ Addressee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("THE PRINCIPAL,", M, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setLineWidth(0.25);
  doc.line(M, y, M + 85, y);
  doc.text(opts.schoolName, M + 1, y - 1.3);
  y += 7;
  doc.line(M, y, M + 85, y);
  y += 9;

  // â”€â”€ County / Sub-county â”€â”€ placed here, right under the addressee and
  // before the RE line, so it's immediately visible for sorting the
  // printed letters by location once they're downloaded. â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const locationBits = [opts.schoolCounty, opts.schoolSubCounty].filter(
    (v): v is string => !!v && v.trim().length > 0,
  );
  if (locationBits.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `County: ${opts.schoolCounty?.trim() || "—"}   |   Sub-County: ${opts.schoolSubCounty?.trim() || "—"}`,
      M, y,
    );
    y += 10;
  }

  // ── RE line ─────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  const reLabel = "RE: ";
  doc.text(reLabel, M, y);
  const reLabelW = doc.getTextWidth(reLabel);
  if (termIsBlank) {
    const rePrefix = "CONFIRMATION OF BURSARY BENEFICIARIES FOR THE YEAR";
    doc.text(rePrefix, M + reLabelW, y);
    const rePrefixW = doc.getTextWidth(rePrefix);
    doc.setLineWidth(0.3);
    doc.line(M + reLabelW, y + 0.8, M + reLabelW + rePrefixW, y + 0.8);
    doc.line(M + reLabelW + rePrefixW + 3, y + 0.8, M + reLabelW + rePrefixW + 38, y + 0.8);
  } else {
    const reText = `CONFIRMATION OF BURSARY BENEFICIARIES FOR THE YEAR ${term}`;
    doc.text(reText, M + reLabelW, y);
    const reTextW = doc.getTextWidth(reText);
    doc.setLineWidth(0.3);
    doc.line(M + reLabelW, y + 0.8, M + reLabelW + reTextW, y + 0.8);
  }
  y += 8;

  // â”€â”€ Narrative paragraph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const introLine1 = "This letter serves to confirm that the following student(s) from your school are successful beneficiaries of";
  doc.text(introLine1, M, y, { maxWidth: contentW });
  y += 6;

  doc.setFont("helvetica", "bold");
  const boldPart = "Moha Bursary Kitty";
  doc.text(boldPart, M, y);
  const boldPartW = doc.getTextWidth(boldPart);
  doc.setFont("helvetica", "normal");
  doc.text(` for the year `, M + boldPartW, y);
  const yearLabelW = doc.getTextWidth(` for the year `);
  if (termIsBlank) {
    doc.setLineWidth(0.25);
    doc.line(M + boldPartW + yearLabelW, y + 0.8, M + boldPartW + yearLabelW + 30, y + 0.8);
    doc.text(".", M + boldPartW + yearLabelW + 32, y);
  } else {
    doc.setFont("helvetica", "bold");
    doc.text(term, M + boldPartW + yearLabelW, y);
    const termW = doc.getTextWidth(term);
    doc.setFont("helvetica", "normal");
    doc.text(".", M + boldPartW + yearLabelW + termW, y);
  }
  y += 6;

  // â”€â”€ Total + cheque — rendered all on one single line for consistency â”€â”€â”€â”€â”€â”€
  // "The total amount is Ksh. X,XXX.00 in cheque No. YYYYYY distributed as below."
  const amountStr = total > 0 ? `${total.toLocaleString()}.00` : "";
  let cx = M;

  doc.setFont("helvetica", "normal");
  const totalLabel = "The total amount is Ksh. ";
  doc.text(totalLabel, cx, y);
  cx += doc.getTextWidth(totalLabel);

  if (amountStr) {
    doc.setFont("helvetica", "bold");
    doc.text(amountStr, cx, y);
    cx += doc.getTextWidth(amountStr);
    doc.setFont("helvetica", "normal");
  } else {
    doc.setLineWidth(0.25);
    doc.line(cx, y + 0.8, cx + 40, y + 0.8);
    cx += 42;
  }

  const chequeLabel = " in cheque No.";
  doc.text(chequeLabel, cx, y);
  cx += doc.getTextWidth(chequeLabel);

  const chequeStr = opts.chequeNumber || "";
  if (chequeStr) {
    doc.setFont("helvetica", "bold");
    doc.text(` ${chequeStr}`, cx, y);
    cx += doc.getTextWidth(` ${chequeStr}`);
    doc.setFont("helvetica", "normal");
  } else {
    doc.setLineWidth(0.25);
    doc.line(cx + 1, y + 0.8, cx + 42, y + 0.8);
    cx += 44;
  }

  doc.text(" distributed as below.", cx, y);
  y += 10;

  // â”€â”€ Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const colNo = { x: M, w: 12 };
  const colName = { x: M + 12, w: 80 };
  const colAdm = { x: M + 92, w: 45 };
  const colAmt = { x: M + 137, w: contentW - 137 };
  const headerH = 8;

  // Reserve room below the table for the closing paragraph + signature block
  // (~55mm) and a bottom margin, then size the table — row count and row
  // height — to fit exactly what's left, so the whole letter always prints
  // on a single page instead of spilling the signature onto a second one.
  const BOTTOM_MARGIN = 20;
  const CLOSING_BLOCK_HEIGHT = 55;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxTableBottom = pageHeight - BOTTOM_MARGIN - CLOSING_BLOCK_HEIGHT;
  const availableForRows = maxTableBottom - y - headerH;

  // A few blank rows below the real entries look tidy (matches the official
  // template), but never so many that they'd force a second page. When
  // there's no real data at all (the blank/manual-fill template), fill as
  // much of the remaining page as will fit at the minimum row height —
  // computed dynamically (rather than a fixed guess) so the blank template
  // is guaranteed to stay on a single page no matter how the surrounding
  // layout changes in future. A small safety margin is subtracted first so
  // the table is never sized to exactly touch the page boundary — leaving
  // zero slack would make it possible for floating-point rounding alone to
  // tip the closing signature block onto a second page.
  const DEFAULT_ROW_H = 7.6;
  const MIN_ROW_H = 5.2;
  const PAGE_FIT_SAFETY_MARGIN = 6;
  const rowSizingBudget = rows.length > 0
    ? availableForRows
    : Math.max(0, availableForRows - PAGE_FIT_SAFETY_MARGIN);
  const maxRowsThatFitOnePage = Math.max(1, Math.floor(rowSizingBudget / MIN_ROW_H));
  const idealRows = rows.length > 0
    ? Math.min(rows.length + 3, 15)
    : Math.min(opts.emptyTemplateRowCount ?? maxRowsThatFitOnePage, maxRowsThatFitOnePage);
  const tableRows = Math.max(rows.length, idealRows);

  const rowH = Math.max(MIN_ROW_H, Math.min(DEFAULT_ROW_H, rowSizingBudget / tableRows));

  const tableTop = y;

  // Header row
  doc.setLineWidth(0.35);
  doc.setDrawColor(0, 0, 0);
  doc.rect(M, y, contentW, headerH);
  doc.line(colName.x, y, colName.x, y + headerH);
  doc.line(colAdm.x, y, colAdm.x, y + headerH);
  doc.line(colAmt.x, y, colAmt.x, y + headerH);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("NO", colNo.x + colNo.w / 2, y + 5.5, { align: "center" });
  doc.text("NAME", colName.x + 2, y + 5.5);
  doc.text("FORM/ADM NO", colAdm.x + 2, y + 5.5);
  doc.text("AMOUNT", colAmt.x + 2, y + 5.5);
  y += headerH;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const rowTextY = Math.min(5.2, rowH - 2.2);

  for (let i = 0; i < tableRows; i++) {
    // Page break only as a last-resort safety net — with the sizing above
    // this should never actually trigger for a realistic beneficiary count.
    if (y + rowH > pageHeight - BOTTOM_MARGIN) {
      doc.addPage();
      y = 20;
    }

    doc.rect(M, y, contentW, rowH);
    doc.line(colName.x, y, colName.x, y + rowH);
    doc.line(colAdm.x, y, colAdm.x, y + rowH);
    doc.line(colAmt.x, y, colAmt.x, y + rowH);

    doc.text(String(i + 1), colNo.x + colNo.w / 2, y + rowTextY, { align: "center" });

    const r = rows[i];
    if (r) {
      const nameLines = doc.splitTextToSize(r.student_name, colName.w - 4);
      doc.text(String(nameLines[0] ?? ""), colName.x + 2, y + rowTextY);

      const admLabel = [r.current_grade, r.registration_number].filter(Boolean).join(" / ");
      const admLines = doc.splitTextToSize(admLabel, colAdm.w - 4);
      doc.text(String(admLines[0] ?? ""), colAdm.x + 2, y + rowTextY);

      if (r.amount_requested) {
        doc.text(`${Number(r.amount_requested).toLocaleString()}.00`, colAmt.x + colAmt.w - 2, y + rowTextY, { align: "right" });
      }
    }

    y += rowH;
  }

  y += 8;

  // ── Closing paragraph ───────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  // Only start a fresh page if the closing block genuinely won't fit above
  // the bottom margin — with the table sized against CLOSING_BLOCK_HEIGHT
  // above, this is a safety net rather than the normal path.
  if (y + 47 > pageHeight - BOTTOM_MARGIN) { doc.addPage(); y = 20; }
  doc.text(
    "We are requested to distribute the funds accordingly. For any discrepancies or confirmation of the",
    M, y, { maxWidth: contentW },
  );
  y += 5.5;
  doc.text("receipts of the cheque, please contact the undersigned.", M, y);
  y += 11;
  doc.text("Thanks for your support and cooperation.", M, y);
  y += 11;
  doc.text("Yours faithfully,", M, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.text(`${officerName} – `, M, y);
  const nameLabelW = doc.getTextWidth(`${officerName} – `);
  doc.setFont("helvetica", "bold");
  doc.text(officerPhone, M + nameLabelW, y);
  y += 5.5;
  doc.setFont("helvetica", "bold");
  const fieldOfficer = "Field Operations Officer";
  doc.text(fieldOfficer, M, y);
  doc.setLineWidth(0.3);
  doc.line(M, y + 0.8, M + doc.getTextWidth(fieldOfficer), y + 0.8);

  const safeSchool = opts.schoolName.replace(/[^a-z0-9]/gi, "-").slice(0, 40);
  const fileLabel = safeSchool || "Blank-Template";
  doc.save(`Moha-Confirmation-Letter-${fileLabel}-${Date.now()}.pdf`);
}


export type BroadsheetRow = {
  reference: string;
  student_name: string;
  registration_number?: string | null;
  current_grade: string;
  gender?: string | null;
  guardian_name: string;
  guardian_phone: string;
  ward?: string | null;
  amount_requested?: number | null;
  school_name: string;
  school_category?: string | null;
  school_bank_account?: string | null;
  /** County the school is in — used for County â†’ School grouping in the broadsheet */
  school_county?: string | null;
};

export function generateBroadsheetPdf(rows: BroadsheetRow[], title = "Approved Bursary Awards") {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const W = 297;
  const M = 8;
  const PAGE_H = 210;
  const USABLE_H = PAGE_H - 10;

  const generated = new Date().toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
  const grandTotal = rows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);

  // Sort: school name asc, then student name asc
  const sorted = [...rows].sort((a, b) => {
    const sa = a.school_name.toUpperCase().trim();
    const sb = b.school_name.toUpperCase().trim();
    if (sa !== sb) return sa.localeCompare(sb);
    return a.student_name.localeCompare(b.student_name);
  });

  // Group by school
  const bySchool = new Map<string, BroadsheetRow[]>();
  for (const r of sorted) {
    const key = r.school_name.toUpperCase().trim();
    if (!bySchool.has(key)) bySchool.set(key, []);
    bySchool.get(key)!.push(r);
  }

  let page = 1;
  let y = 0;

  // Column layout (landscape 297mm, 8mm margins = 281mm usable)
  const cols = {
    no:       { x: M,        w: 8  },
    name:     { x: M+8,      w: 52 },
    grade:    { x: M+60,     w: 20 },
    gender:   { x: M+80,     w: 14 },
    guardian: { x: M+94,     w: 42 },
    phone:    { x: M+136,    w: 28 },
    ward:     { x: M+164,    w: 26 },
    amount:   { x: M+190,    w: 30 },
    bank:     { x: M+220,    w: 69 },
  };

  const ROW_H  = 5.5;
  const HEAD_H = 6.5;
  const SCH_H  = 5.5;

  const addPageHeader = () => {
    doc.setFillColor(20, 83, 45);
    doc.rect(0, 0, W, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("MOHA EDUCATION KITTY — BURSARY AWARD BROADSHEET", M, 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      `${rows.length} students  |  ${bySchool.size} schools  |  Grand Total: KSh ${grandTotal.toLocaleString()}  |  ${generated}  |  Page ${page}`,
      W - M, 8, { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    y = 15;
  };

  const addPageFooter = () => {
    doc.setFontSize(6.5);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Moha Education Kitty • Kiamaiko-Mathare • Confidential • Page ${page}`,
      W / 2, PAGE_H - 3, { align: "center" }
    );
    doc.setTextColor(0, 0, 0);
  };

  const drawColumnHeaders = () => {
    doc.setFillColor(240, 240, 240);
    doc.rect(M, y, W - 2*M, HEAD_H, "F");
    doc.setDrawColor(180, 180, 180);
    doc.rect(M, y, W - 2*M, HEAD_H);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(60, 60, 60);
    const headers: [string, keyof typeof cols][] = [
      ["#", "no"], ["STUDENT NAME", "name"], ["GRADE", "grade"],
      ["SEX", "gender"], ["GUARDIAN", "guardian"], ["PHONE", "phone"],
      ["WARD", "ward"], ["AMOUNT (KSh)", "amount"], ["SCHOOL BANK A/C", "bank"],
    ];
    for (const [label, col] of headers) {
      doc.text(label, cols[col].x + 1, y + 4.3);
    }
    doc.setTextColor(0, 0, 0);
    y += HEAD_H;
  };

  const newPage = () => {
    addPageFooter();
    doc.addPage();
    page++;
    addPageHeader();
    drawColumnHeaders();
  };

  const checkY = (needed: number) => {
    if (y + needed > USABLE_H) newPage();
  };

  const drawRow = (r: BroadsheetRow, serial: number, shade: boolean) => {
    if (shade) {
      doc.setFillColor(250, 250, 250);
      doc.rect(M, y, W - 2*M, ROW_H, "F");
    }
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    doc.rect(M, y, W - 2*M, ROW_H);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);

    const cell = (text: string, col: keyof typeof cols, bold = false) => {
      if (bold) doc.setFont("helvetica", "bold");
      const t = doc.splitTextToSize((text || "—").trim(), cols[col].w - 2);
      doc.text(String(t[0] ?? "—"), cols[col].x + 1, y + 3.9);
      if (bold) doc.setFont("helvetica", "normal");
    };

    cell(String(serial), "no");
    cell(r.student_name, "name", true);
    cell(r.current_grade, "grade");
    cell((r.gender || "—").charAt(0).toUpperCase(), "gender");
    cell(r.guardian_name, "guardian");
    cell(r.guardian_phone, "phone");
    cell(r.ward || "—", "ward");

    const amt = r.amount_requested ? Number(r.amount_requested).toLocaleString() : "—";
    doc.setFont("helvetica", "bold");
    doc.text(amt, cols.amount.x + cols.amount.w - 1, y + 3.9, { align: "right" });
    doc.setFont("helvetica", "normal");

    cell(r.school_bank_account || "—", "bank");
    y += ROW_H;
  };

  const drawSchoolHeader = (schoolName: string, schoolRows: BroadsheetRow[]) => {
    const category = schoolRows[0].school_category ? ` · ${schoolRows[0].school_category}` : "";
    const county   = schoolRows[0].school_county    ? ` · ${schoolRows[0].school_county}`    : "";
    const subTotal = schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);

    doc.setFillColor(229, 237, 231);
    doc.rect(M, y, W - 2*M, SCH_H, "F");
    doc.setDrawColor(160, 200, 170);
    doc.rect(M, y, W - 2*M, SCH_H);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(20, 83, 45);
    doc.text(`${schoolName}${category}${county}`, M + 1.5, y + 3.9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(
      `${schoolRows.length} student${schoolRows.length !== 1 ? "s" : ""}  ·  KSh ${subTotal.toLocaleString()}`,
      W - M - 1, y + 3.9, { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    y += SCH_H;
  };

  // Render
  addPageHeader();
  drawColumnHeaders();

  let serial = 1;
  for (const [schoolKey, schoolRows] of bySchool) {
    checkY(SCH_H + ROW_H + 1);
    drawSchoolHeader(schoolKey, schoolRows);
    for (let i = 0; i < schoolRows.length; i++) {
      checkY(ROW_H + 1);
      drawRow(schoolRows[i], serial++, i % 2 === 1);
    }
  }

  // Grand total row
  checkY(7);
  doc.setFillColor(20, 83, 45);
  doc.rect(M, y, W - 2*M, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `GRAND TOTAL — ${rows.length} student${rows.length !== 1 ? "s" : ""} across ${bySchool.size} school${bySchool.size !== 1 ? "s" : ""}`,
    M + 2, y + 4.8
  );
  doc.text(`KSh ${grandTotal.toLocaleString()}`, cols.amount.x + cols.amount.w - 1, y + 4.8, { align: "right" });
  doc.setTextColor(0, 0, 0);

  addPageFooter();

  const safeTitle = title.replace(/[^a-z0-9]/gi, "-").slice(0, 40);
  doc.save(`Moha-Broadsheet-${safeTitle}-${Date.now()}.pdf`);
}

/**
 * Generates the same approved-bursary broadsheet as `generateBroadsheetPdf`,
 * but as a downloadable Excel workbook — one row per student, sorted and
 * grouped the same way (school name, then student name), with a grand-total
 * row at the bottom. A flat, sortable/filterable table is more useful in
 * Excel than trying to reproduce the PDF's printed-page layout.
 */
/**
 * Generates the approved-bursary broadsheet as an Excel "Cheque Summary" —
 * schools grouped under their county, one row per school (aggregated across
 * every approved student at that school), with a subtotal row per county
 * and a grand total at the end. This mirrors the format schools/banks are
 * used to receiving for issuing cheques, as opposed to a flat per-student
 * listing.
 */
export function generateBroadsheetExcel(rows: BroadsheetRow[], generatedAt: Date = new Date()) {
  type SchoolAgg = { school: string; bankAccount: string; count: number; total: number };

  // Group approved students by county, then by school within that county.
  const byCounty = new Map<string, Map<string, SchoolAgg>>();
  for (const r of rows) {
    const county = (r.school_county || "").trim().toUpperCase() || "UNSPECIFIED COUNTY";
    const school = (r.school_name || "").trim().toUpperCase() || "UNSPECIFIED SCHOOL";
    if (!byCounty.has(county)) byCounty.set(county, new Map());
    const schools = byCounty.get(county)!;
    if (!schools.has(school)) {
      schools.set(school, { school, bankAccount: "", count: 0, total: 0 });
    }
    const agg = schools.get(school)!;
    agg.count += 1;
    agg.total += r.amount_requested ?? 0;
    if (!agg.bankAccount && (r.school_bank_account || "").trim()) {
      agg.bankAccount = r.school_bank_account!.trim();
    }
  }

  const counties = [...byCounty.keys()].sort((a, b) => a.localeCompare(b));

  const aoa: Array<Array<string | number | null>> = [];
  const merges: Array<{ s: { r: number; c: number }; e: { r: number; c: number } }> = [];
  const mergeFullRow = (rowIndex: number) => merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 3 } });
  const mergeFirstTwoCols = (rowIndex: number) => merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 1 } });

  const dateLabel = generatedAt.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

  aoa.push(["MOHA EDUCATION KITTY — BURSARY CHEQUE SUMMARY", null, null, null]);
  mergeFullRow(0);
  aoa.push([`Generated: ${dateLabel}`, null, null, null]);
  mergeFullRow(1);
  aoa.push([null, null, null, null]);
  mergeFullRow(2);
  aoa.push(["SCHOOL NAME", "BANK ACCOUNT NO.", "NO. OF STUDENTS", "TOTAL AMOUNT (KSh)"]);

  let grandSchools = 0;
  let grandStudents = 0;
  let grandAmount = 0;

  for (const county of counties) {
    const schoolsMap = byCounty.get(county)!;
    const schoolNames = [...schoolsMap.keys()].sort((a, b) => a.localeCompare(b));

    mergeFullRow(aoa.length);
    aoa.push([`COUNTY: ${county}`, null, null, null]);

    let countyStudents = 0;
    let countyAmount = 0;
    for (const schoolName of schoolNames) {
      const agg = schoolsMap.get(schoolName)!;
      aoa.push([agg.school, agg.bankAccount || "", agg.count, agg.total]);
      countyStudents += agg.count;
      countyAmount += agg.total;
    }

    mergeFirstTwoCols(aoa.length);
    const schoolWord = schoolNames.length === 1 ? "school" : "schools";
    aoa.push([`${county} TOTAL  (${schoolNames.length} ${schoolWord})`, null, countyStudents, countyAmount]);

    aoa.push([null, null, null, null]); // blank separator row between counties

    grandSchools += schoolNames.length;
    grandStudents += countyStudents;
    grandAmount += countyAmount;
  }

  mergeFirstTwoCols(aoa.length);
  aoa.push([
    `GRAND TOTAL — ${counties.length} counties  ·  ${grandSchools} schools  ·  ${grandStudents} students`,
    null, grandStudents, grandAmount,
  ]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!merges"] = merges;
  ws["!cols"] = [{ wch: 52 }, { wch: 24 }, { wch: 16 }, { wch: 22 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "CHEQUE SUMMARY");

  const fileDate = generatedAt.toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Moha-Cheque-Summary-${fileDate}-${Date.now()}.xlsx`);
}

/**
 * Generates the "Ward List Details" Excel broadsheet — a flat, one-row-per-
 * student sheet (sorted by school, then student name) that an admin can
 * freely sort/filter/pivot in Excel, with a grand-total row at the bottom.
 * Columns: No., Reference, Student Name, Admission No., Grade, Gender,
 * School, School Category, School County, School Bank Account, Ward,
 * Guardian Name, Guardian Phone, Amount Awarded (KSh).
 */
export function generateWardListExcel(rows: BroadsheetRow[], generatedAt: Date = new Date()) {
  const sorted = [...rows].sort((a, b) => {
    const sa = a.school_name.toUpperCase().trim();
    const sb = b.school_name.toUpperCase().trim();
    if (sa !== sb) return sa.localeCompare(sb);
    return a.student_name.localeCompare(b.student_name);
  });

  const grandTotal = sorted.reduce((s, r) => s + (r.amount_requested ?? 0), 0);

  const sheetRows: Array<Record<string, string | number>> = sorted.map((r, i) => ({
    "No.": i + 1,
    "Reference": r.reference,
    "Student Name": r.student_name,
    "Admission No.": r.registration_number || "",
    "Grade": r.current_grade || "",
    "Gender": r.gender || "",
    "School": r.school_name,
    "School Category": r.school_category || "",
    "School County": r.school_county || "",
    "School Bank Account": r.school_bank_account || "",
    "Ward": r.ward || "",
    "Guardian Name": r.guardian_name || "",
    "Guardian Phone": r.guardian_phone || "",
    "Amount Awarded (KSh)": r.amount_requested ?? 0,
  }));

  // Grand-total row at the bottom.
  sheetRows.push({
    "No.": "",
    "Reference": "", "Student Name": "", "Admission No.": "", "Grade": "",
    "Gender": "", "School": "", "School Category": "", "School County": "",
    "School Bank Account": "", "Ward": "", "Guardian Name": "",
    "Guardian Phone": "GRAND TOTAL",
    "Amount Awarded (KSh)": grandTotal,
  });

  const ws = XLSX.utils.json_to_sheet(sheetRows);
  ws["!cols"] = [
    { wch: 5 },  // No.
    { wch: 12 }, // Reference
    { wch: 26 }, // Student Name
    { wch: 14 }, // Admission No.
    { wch: 10 }, // Grade
    { wch: 8 },  // Gender
    { wch: 30 }, // School
    { wch: 12 }, // School Category
    { wch: 16 }, // School County
    { wch: 18 }, // School Bank Account
    { wch: 12 }, // Ward
    { wch: 24 }, // Guardian Name
    { wch: 15 }, // Guardian Phone
    { wch: 18 }, // Amount Awarded
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Broadsheet");

  const fileDate = generatedAt.toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Moha-Ward-List-Details-${fileDate}-${Date.now()}.xlsx`);
}