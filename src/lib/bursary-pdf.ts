import { jsPDF } from "jspdf";

export type BursaryPdfData = {
  reference: string;
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
  doc.text("WARD BURSARY APPLICATION FORM — TERM 2 (2026/2027)", M, 16);
  doc.setTextColor(0, 0, 0);

  y = 28;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`SERIAL NO: ${d.reference}`, W - M, y, { align: "right" });

  // A: Instructions
  y += 6;
  sectionTitle(doc, "A: INSTRUCTIONS", y);
  y += 5;
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
    y += 4;
  }

  // B: Student
  y += 2;
  sectionTitle(doc, "B: STUDENT'S DETAILS", y);
  y += 5;
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
    y += 2;
    sectionTitle(doc, "B1: FATHER'S DETAILS", y);
    y += 5;
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
    y += 2;
    sectionTitle(doc, "B2: MOTHER'S DETAILS", y);
    y += 5;
    kvRows(doc, y, [
      ["Mother's Name", dash(d.mother_name)],
      ["Phone", dash(d.mother_phone)],
      ["Occupation", dash(d.mother_occupation)],
      ["National ID", dash(d.mother_national_id)],
    ]);
    y += rowHeight(4);
  }


  // C: School
  y += 2;
  sectionTitle(doc, "C: SCHOOL'S DETAILS", y);
  y += 5;
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
  y += 2;
  sectionTitle(doc, "D: PARENT / GUARDIAN'S DETAILS", y);
  y += 5;
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
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Brief description of reason for application:", M, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  const reason = d.reason || "—";
  const lines = doc.splitTextToSize(reason, W - 2 * M);
  doc.rect(M, y - 1, W - 2 * M, Math.max(14, lines.length * 4 + 2));
  doc.text(lines, M + 1, y + 3);
  y += Math.max(14, lines.length * 4 + 2) + 2;

  // Page 2 — Declarations & Official Use
  doc.addPage();
  y = 14;

  sectionTitle(doc, "E: DECLARATIONS", y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.setFont("helvetica", "bold");
  doc.text("Parent / Guardian", M, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.text(
    "I declare that I have read this form / this form has been read to me and I hereby confirm that the",
    M, y,
  );
  y += 4;
  doc.text("information given herein is true to the best of my knowledge.", M, y);
  y += 7;
  signLine(doc, y, "Parent / Guardian Name", d.guardian_name);
  y += 8;
  signLine(doc, y, "Contact", d.guardian_phone);
  signLine(doc, y, "Signature", "", W / 2 + 5);
  y += 8;
  signLine(doc, y, "Date", "");

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Local Administration", M, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.text(
    "I certify that the applicant is a resident of my Village / Location, and that I have checked the",
    M, y,
  );
  y += 4;
  doc.text("information herein and confirmed it to be true to the best of my knowledge.", M, y);
  y += 7;
  signLine(doc, y, "Name", "");
  signLine(doc, y, "Signature", "", W / 2 + 5);
  y += 8;
  signLine(doc, y, "Designation", "");
  signLine(doc, y, "Date", "", W / 2 + 5);
  y += 8;
  signLine(doc, y, "Rubber Stamp", "");
  signLine(doc, y, "Phone Contact", "", W / 2 + 5);

  // F: Official Use Only
  y += 12;
  sectionTitle(doc, "F: OFFICIAL USE ONLY", y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Is the applicant's form duly filled and signed?", M, y);
  checkbox(doc, M + 95, y - 3, "YES");
  checkbox(doc, M + 115, y - 3, "NO");
  y += 7;
  doc.text("Has the applicant submitted relevant supporting documents?", M, y);
  checkbox(doc, M + 95, y - 3, "YES");
  checkbox(doc, M + 115, y - 3, "NO");
  y += 7;
  doc.text("Recommendation on level of need:", M, y);
  checkbox(doc, M + 60, y - 3, "High");
  checkbox(doc, M + 90, y - 3, "Moderate");
  checkbox(doc, M + 130, y - 3, "Low");
  y += 8;
  signLine(doc, y, "Recommended amount for bursary award (KSh)", "");
  y += 8;
  signLine(doc, y, "Reason", "");
  y += 14;

  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatures", M, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text("Committee Chairperson:", M, y);
  doc.text("Committee Secretary:", W / 2 + 5, y);
  y += 8;
  signLine(doc, y, "Name", "");
  signLine(doc, y, "Name", "", W / 2 + 5);
  y += 8;
  signLine(doc, y, "Signature", "");
  signLine(doc, y, "Signature", "", W / 2 + 5);
  y += 8;
  signLine(doc, y, "Date", "");
  y += 10;
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
  doc.rect(14, y - 4, 182, 6, "F");
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
  const rowH = 7;
  doc.setFontSize(9);
  rows.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * colW;
    const yy = startY + row * rowH;
    doc.setDrawColor(180, 180, 180);
    doc.rect(x, yy - 4, colW, rowH);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(r[0].toUpperCase(), x + 1.5, yy - 1);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const val = doc.splitTextToSize(r[1], colW - 3);
    doc.text(String(val[0] ?? ""), x + 1.5, yy + 2.5);
  });
}

function rowHeight(itemCount: number) {
  return Math.ceil(itemCount / 2) * 7;
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

// ─── SCHOOL CONFIRMATION LETTER ────────────────────────────────────────────
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
  termLabel?: string;       // e.g. "2026 T2" — defaults to current year + "T2"
  chequeNumber?: string;    // left blank (dotted line) if not provided
  dateLabel?: string;       // left blank (dotted line) if not provided
  officerName?: string;
  officerPhone?: string;
};

export function generateConfirmationLetter(
  rows: ConfirmationLetterRow[],
  opts: ConfirmationLetterOptions,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210;
  const M = 18;
  const contentW = W - 2 * M;

  const term = opts.termLabel || `${new Date().getFullYear()} T2`;
  const officerName = opts.officerName || "Benard Omondi";
  const officerPhone = opts.officerPhone || "0725104771";
  const total = rows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);

  let y = 16;

  // ── Letterhead ───────────────────────────────────────────────────────────
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

  // ── Date ─────────────────────────────────────────────────────────────────
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

  // ── Addressee ────────────────────────────────────────────────────────────
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

  // ── RE line ──────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  const reLabel = "RE: ";
  doc.text(reLabel, M, y);
  const reLabelW = doc.getTextWidth(reLabel);
  const reText = `CONFIRMATION OF BURSARY BENEFICIARIES FOR THE YEAR ${term}`;
  doc.text(reText, M + reLabelW, y);
  const reTextW = doc.getTextWidth(reText);
  doc.setLineWidth(0.3);
  doc.line(M + reLabelW, y + 0.8, M + reLabelW + reTextW, y + 0.8);
  y += 8;

  // ── Narrative paragraph ──────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const introLine1 = "This letter serves to confirm that the following students from your school are successful beneficiaries of";
  doc.text(introLine1, M, y, { maxWidth: contentW });
  y += 6;

  doc.setFont("helvetica", "bold");
  const boldPart = "Moha Bursary Kitty";
  doc.text(boldPart, M, y);
  const boldPartW = doc.getTextWidth(boldPart);
  doc.setFont("helvetica", "normal");
  doc.text(` for the year `, M + boldPartW, y);
  const yearLabelW = doc.getTextWidth(` for the year `);
  doc.setFont("helvetica", "bold");
  doc.text(term, M + boldPartW + yearLabelW, y);
  const termW = doc.getTextWidth(term);
  doc.setFont("helvetica", "normal");
  doc.text(". The total amount is Ksh", M + boldPartW + yearLabelW + termW, y);
  y += 6;

  // Amount + cheque line — the total is always auto-calculated from the
  // student list; only the cheque number itself is left blank until the
  // admin has the physical cheque in hand.
  const amountStr = total > 0 ? `${total.toLocaleString()}.00` : "";
  doc.text(amountStr, M, y);
  if (!amountStr) {
    doc.setLineWidth(0.25);
    doc.line(M, y + 0.8, M + 50, y + 0.8);
  }
  const amountTextW = amountStr ? doc.getTextWidth(amountStr) : 50;
  doc.text(" in cheque No ", M + amountTextW + 2, y);
  const chequeStr = opts.chequeNumber || "";
  const chequeStartX = M + amountTextW + 2 + doc.getTextWidth(" in cheque No ");
  doc.text(chequeStr, chequeStartX, y);
  if (!chequeStr) {
    doc.line(chequeStartX, y + 0.8, chequeStartX + 40, y + 0.8);
  }
  y += 6;
  doc.text("distributed as below.", M, y);
  y += 10;

  // ── Table ────────────────────────────────────────────────────────────────
  const colNo = { x: M, w: 12 };
  const colName = { x: M + 12, w: 80 };
  const colAdm = { x: M + 92, w: 45 };
  const colAmt = { x: M + 137, w: contentW - 137 };
  const headerH = 8;
  const rowH = 7.6;
  const tableRows = Math.max(rows.length, 15); // always at least 15 rows like the official template

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

  for (let i = 0; i < tableRows; i++) {
    // Page break if needed (rare for 15 rows on A4 portrait, but safe to guard)
    if (y + rowH > 277) {
      doc.addPage();
      y = 20;
    }

    doc.rect(M, y, contentW, rowH);
    doc.line(colName.x, y, colName.x, y + rowH);
    doc.line(colAdm.x, y, colAdm.x, y + rowH);
    doc.line(colAmt.x, y, colAmt.x, y + rowH);

    doc.text(String(i + 1), colNo.x + colNo.w / 2, y + 5.2, { align: "center" });

    const r = rows[i];
    if (r) {
      const nameLines = doc.splitTextToSize(r.student_name, colName.w - 4);
      doc.text(String(nameLines[0] ?? ""), colName.x + 2, y + 5.2);

      const admLabel = [r.current_grade, r.registration_number].filter(Boolean).join(" / ");
      const admLines = doc.splitTextToSize(admLabel, colAdm.w - 4);
      doc.text(String(admLines[0] ?? ""), colAdm.x + 2, y + 5.2);

      if (r.amount_requested) {
        doc.text(`${Number(r.amount_requested).toLocaleString()}.00`, colAmt.x + colAmt.w - 2, y + 5.2, { align: "right" });
      }
    }

    y += rowH;
  }

  y += 8;

  // ── Closing paragraph ────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  if (y > 255) { doc.addPage(); y = 20; }
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
  doc.text(`${officerPhone} (WhatsApp)`, M + nameLabelW, y);
  y += 5.5;
  doc.setFont("helvetica", "bold");
  const fieldOfficer = "Field Operations Officer";
  doc.text(fieldOfficer, M, y);
  doc.setLineWidth(0.3);
  doc.line(M, y + 0.8, M + doc.getTextWidth(fieldOfficer), y + 0.8);

  const safeSchool = opts.schoolName.replace(/[^a-z0-9]/gi, "-").slice(0, 40);
  doc.save(`Moha-Confirmation-Letter-${safeSchool}-${Date.now()}.pdf`);
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
};

export function generateBroadsheetPdf(rows: BroadsheetRow[], title = "Approved Bursary Awards — Broadsheet") {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const W = 297;
  const M = 10;
  const PAGE_H = 210;
  const FOOTER_H = 12;
  const USABLE_H = PAGE_H - FOOTER_H;

  const generated = new Date().toLocaleString("en-KE");

  // Group by school, sorted alphabetically
  const bySchool = new Map<string, BroadsheetRow[]>();
  const sorted = [...rows].sort((a, b) =>
    a.school_name.localeCompare(b.school_name) || a.student_name.localeCompare(b.student_name)
  );
  for (const r of sorted) {
    const key = r.school_name.toUpperCase().trim();
    if (!bySchool.has(key)) bySchool.set(key, []);
    bySchool.get(key)!.push(r);
  }

  let page = 1;
  let y = 0;

  const addPageHeader = () => {
    // Dark green header bar
    doc.setFillColor(20, 83, 45);
    doc.rect(0, 0, W, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("MOHA EDUCATION KITTY — CONSTITUENCY BURSARY AWARD BROADSHEET", M, 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(title, M, 14);
    doc.text(`Generated: ${generated}  |  Page ${page}`, W - M, 14, { align: "right" });
    doc.setTextColor(0, 0, 0);
    y = 22;
  };

  const addPageFooter = () => {
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Moha Education Kitty • Kiamaiko-Mathare • ${title} • Confidential`,
      W / 2, PAGE_H - 4, { align: "center" }
    );
    doc.setTextColor(0, 0, 0);
  };

  const newPage = () => {
    addPageFooter();
    doc.addPage();
    page++;
    addPageHeader();
  };

  const checkY = (needed: number) => {
    if (y + needed > USABLE_H) newPage();
  };

  // Column widths (landscape A4 = 297mm, margins = 10mm each side → 277mm usable)
  const cols = {
    no:    { x: M,       w: 9  },
    ref:   { x: M+9,     w: 22 },
    name:  { x: M+31,    w: 50 },
    grade: { x: M+81,    w: 22 },
    gender:{ x: M+103,   w: 16 },
    guardian:{ x: M+119, w: 45 },
    phone: { x: M+164,   w: 30 },
    ward:  { x: M+194,   w: 30 },
    amount:{ x: M+224,   w: 28 },
    bank:  { x: M+252,   w: 35 },
  };
  const ROW_H = 7;
  const HEAD_H = 8;

  const drawTableHeader = () => {
    doc.setFillColor(212, 175, 55); // gold
    doc.rect(M, y, W - 2*M, HEAD_H, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(20, 30, 20);
    const headers: [string, keyof typeof cols][] = [
      ["#", "no"], ["REF", "ref"], ["STUDENT NAME", "name"], ["GRADE", "grade"],
      ["GENDER", "gender"], ["GUARDIAN / PARENT", "guardian"], ["PHONE", "phone"],
      ["WARD", "ward"], ["AMOUNT (KSh)", "amount"], ["SCHOOL BANK A/C", "bank"]
    ];
    for (const [label, col] of headers) {
      doc.text(label, cols[col].x + 1.5, y + 5.5);
    }
    doc.setTextColor(0, 0, 0);
    y += HEAD_H;
  };

  const drawRow = (r: BroadsheetRow, idx: number, serial: number, shade: boolean) => {
    if (shade) {
      doc.setFillColor(245, 245, 245);
      doc.rect(M, y, W - 2*M, ROW_H, "F");
    }
    doc.setDrawColor(210, 210, 210);
    doc.rect(M, y, W - 2*M, ROW_H);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    const cell = (text: string, col: keyof typeof cols) => {
      const t = doc.splitTextToSize(text || "—", cols[col].w - 2);
      doc.text(String(t[0] ?? "—"), cols[col].x + 1.5, y + 4.5);
    };

    cell(String(serial), "no");
    cell(r.reference, "ref");

    // Student name bold
    doc.setFont("helvetica", "bold");
    cell(r.student_name, "name");
    doc.setFont("helvetica", "normal");

    cell(r.current_grade, "grade");
    cell(r.gender || "—", "gender");
    cell(r.guardian_name, "guardian");
    cell(r.guardian_phone, "phone");
    cell(r.ward || "—", "ward");
    cell(r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—", "amount");
    cell(r.school_bank_account || "—", "bank");

    y += ROW_H;
  };

  const drawSchoolTotal = (schoolRows: BroadsheetRow[]) => {
    const total = schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
    doc.setFillColor(235, 245, 235);
    doc.rect(M, y, W - 2*M, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(20, 83, 45);
    doc.text(`School Sub-total — ${schoolRows.length} student(s)`, M + 2, y + 5);
    doc.text(`KSh ${total.toLocaleString()}`, cols.amount.x + 1.5, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 8;
  };

  // ── Start rendering ──────────────────────────────────────────────────────────

  addPageHeader();

  // Summary banner
  const grandTotal = rows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
  const schoolCount = bySchool.size;
  doc.setFillColor(240, 247, 240);
  doc.rect(M, y, W - 2*M, 11, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 83, 45);
  doc.text(
    `Total Approved: ${rows.length} students  |  Schools: ${schoolCount}  |  Grand Total: KSh ${grandTotal.toLocaleString()}`,
    W / 2, y + 7.5, { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
  y += 14;

  let serial = 1;

  for (const [schoolKey, schoolRows] of bySchool) {
    // School name header
    checkY(HEAD_H + ROW_H * 2 + 10); // ensure at least header + 2 rows fit before page break
    doc.setFillColor(20, 83, 45);
    doc.rect(M, y, W - 2*M, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    const category = schoolRows[0].school_category ? ` (${schoolRows[0].school_category})` : "";
    doc.text(`${schoolKey}${category}`, M + 2, y + 5.5);
    doc.text(`${schoolRows.length} student(s)`, W - M - 2, y + 5.5, { align: "right" });
    doc.setTextColor(0, 0, 0);
    y += 10;

    drawTableHeader();

    for (let i = 0; i < schoolRows.length; i++) {
      checkY(ROW_H + 1);
      drawRow(schoolRows[i], i, serial++, i % 2 === 1);
    }

    checkY(10);
    drawSchoolTotal(schoolRows);
    y += 4; // gap between schools
  }

  // Grand total footer block
  checkY(18);
  doc.setFillColor(20, 83, 45);
  doc.rect(M, y, W - 2*M, 12, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `GRAND TOTAL — ${rows.length} Students across ${schoolCount} School(s) — KSh ${grandTotal.toLocaleString()}`,
    W / 2, y + 8, { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
  y += 16;

  // Authorisation block
  checkY(40);
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("AUTHORISATION", M, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  const signatureLines = [
    ["Prepared by", ""],
    ["Verified by", ""],
    ["Approved by (Coordinator)", ""],
  ];
  for (const [label] of signatureLines) {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, M, y);
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(120, 120, 120);
    doc.line(M + 35, y + 0.5, M + 100, y + 0.5);
    doc.text("Signature:", M + 105, y);
    doc.line(M + 125, y + 0.5, M + 180, y + 0.5);
    doc.text("Date:", M + 185, y);
    doc.line(M + 198, y + 0.5, M + 230, y + 0.5);
    y += 9;
  }

  addPageFooter();

  const safeTitle = title.replace(/[^a-z0-9]/gi, "-").slice(0, 40);
  doc.save(`Moha-Broadsheet-${safeTitle}-${Date.now()}.pdf`);
}