import { jsPDF } from "jspdf";
import * as XLSX from "@e965/xlsx";

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
  v === null || v === undefined || v === "" ? "â€”" : String(v);
const money = (v?: number | null) =>
  v ? `KSh ${Number(v).toLocaleString()}` : "â€”";

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
  doc.text("WARD BURSARY APPLICATION FORM â€” TERM 2 (2026/2027)", M, 16);
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
    "â€¢ Parent's National ID  â€¢ Student's Birth Certificate  â€¢ Parent's Death Certificate(s)",
    "â€¢ Current report form and fee structure  â€¢ NCPWD card or letter  â€¢ Admission letter where necessary",
    "â€¢ Any other crucial supporting documents",
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
    ["Living with Disability", d.student_disability ? `Yes â€” ${d.student_disability_detail || "specified"}` : "No"],
    ["Student's Outstanding Ability", dash(d.student_outstanding_ability)],
    ["Student Annual Fee Payable", money(d.student_annual_fee)],
    ["Student's Outstanding Balance", money(d.outstanding_balance)],
    ["Amount Applying For", money(d.amount_requested)],
    ["Received Bursary in Last 6 Months?", d.received_bursary_before ? `Yes â€” ${d.previous_bursary_source || "source unspecified"} (${money(d.previous_bursary_amount)})` : "No"],
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
    ["Living with Disability", d.parent_disability ? `Yes â€” ${d.parent_disability_detail || "specified"}` : "No"],
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
  const reason = d.reason || "â€”";
  const lines = doc.splitTextToSize(reason, W - 2 * M);
  doc.rect(M, y - 1, W - 2 * M, Math.max(14, lines.length * 4 + 2));
  doc.text(lines, M + 1, y + 3);
  y += Math.max(14, lines.length * 4 + 2) + 2;

  // Page 2 â€” Declarations & Official Use
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
    `Moha Education Kitty â€¢ Generated ${new Date().toLocaleString()} â€¢ Ref ${d.reference}`,
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

// â”€â”€â”€ SCHOOL CONFIRMATION LETTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Generates the official "Confirmation of Bursary Beneficiaries" letter sent
// to a school's Principal â€” formatted to match the Moha Education Kitty
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
  termLabel?: string;       // e.g. "2026 T2" â€” defaults to current year + "T2"
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

  // â”€â”€ RE line â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Narrative paragraph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  doc.text(".", M + boldPartW + yearLabelW + termW, y);
  y += 6;

  // â”€â”€ Total + cheque â€” rendered all on one single line for consistency â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Closing paragraph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  doc.text(`${officerName} â€“ `, M, y);
  const nameLabelW = doc.getTextWidth(`${officerName} â€“ `);
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
  /** County the school is in â€” used for County â†’ School grouping in the broadsheet */
  school_county?: string | null;
  school_sub_county?: string | null;
};

export function generateBroadsheetPdf(rows: BroadsheetRow[], title = "Approved Bursary Awards") {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const W = 297;
  const M = 8;
  const PAGE_H = 210;
  const USABLE_H = PAGE_H - 10;

  const generated = new Date().toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
  const grandTotal = rows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);

  // Sort: county asc → school name asc → student name asc
  const sorted = [...rows].sort((a, b) => {
    const ca = (a.school_county || "UNSPECIFIED").toUpperCase().trim();
    const cb = (b.school_county || "UNSPECIFIED").toUpperCase().trim();
    if (ca !== cb) return ca.localeCompare(cb);
    const sa = a.school_name.toUpperCase().trim();
    const sb = b.school_name.toUpperCase().trim();
    if (sa !== sb) return sa.localeCompare(sb);
    return a.student_name.localeCompare(b.student_name);
  });

  // Group: county → Map<schoolName, rows[]>
  const byCounty = new Map<string, Map<string, BroadsheetRow[]>>();
  for (const r of sorted) {
    const countyKey = (r.school_county || "UNSPECIFIED").toUpperCase().trim();
    const schoolKey = r.school_name.toUpperCase().trim();
    if (!byCounty.has(countyKey)) byCounty.set(countyKey, new Map());
    const schoolMap = byCounty.get(countyKey)!;
    if (!schoolMap.has(schoolKey)) schoolMap.set(schoolKey, []);
    schoolMap.get(schoolKey)!.push(r);
  }

  // Total school count across all counties
  let totalSchools = 0;
  for (const sm of byCounty.values()) totalSchools += sm.size;

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

  const ROW_H    = 5.5;
  const HEAD_H   = 6.5;
  const SCH_H    = 5.5;
  const COUNTY_H = 6.5;

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
      `${rows.length} students  |  ${totalSchools} schools  |  ${byCounty.size} counties  |  Grand Total: KSh ${grandTotal.toLocaleString()}  |  ${generated}  |  Page ${page}`,
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

  const drawCountyHeader = (countyName: string, countyTotal: number, countyStudents: number, countySchoolCount: number) => {
    doc.setFillColor(20, 83, 45);
    doc.rect(M, y, W - 2*M, COUNTY_H, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`COUNTY: ${countyName}`, M + 2, y + 4.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(
      `${countySchoolCount} school${countySchoolCount !== 1 ? "s" : ""}  ·  ${countyStudents} student${countyStudents !== 1 ? "s" : ""}  ·  KSh ${countyTotal.toLocaleString()}`,
      W - M - 1, y + 4.5, { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    y += COUNTY_H;
  };

  const drawSchoolHeader = (schoolName: string, schoolRows: BroadsheetRow[]) => {
    const category = schoolRows[0].school_category ? ` · ${schoolRows[0].school_category}` : "";
    const subTotal = schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);

    doc.setFillColor(229, 237, 231);
    doc.rect(M, y, W - 2*M, SCH_H, "F");
    doc.setDrawColor(160, 200, 170);
    doc.rect(M, y, W - 2*M, SCH_H);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(20, 83, 45);
    // Indent school header slightly to show hierarchy under county
    doc.text(`  ${schoolName}${category}`, M + 1.5, y + 3.9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(
      `${schoolRows.length} student${schoolRows.length !== 1 ? "s" : ""}  ·  KSh ${subTotal.toLocaleString()}`,
      W - M - 1, y + 3.9, { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    y += SCH_H;
  };

  const drawSchoolSubtotal = (schoolRows: BroadsheetRow[]) => {
    const subTotal = schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
    doc.setFillColor(245, 255, 248);
    doc.rect(M, y, W - 2*M, 5, "F");
    doc.setDrawColor(160, 200, 170);
    doc.rect(M, y, W - 2*M, 5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(20, 83, 45);
    doc.text(
      `School Sub-total — ${schoolRows.length} student${schoolRows.length !== 1 ? "s" : ""}`,
      M + 2, y + 3.4
    );
    doc.text(
      `KSh ${subTotal.toLocaleString()}`,
      cols.amount.x + cols.amount.w - 1, y + 3.4, { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    y += 5;
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  addPageHeader();
  drawColumnHeaders();

  let serial = 1;
  for (const [countyKey, schoolMap] of byCounty) {
    // Compute county-level totals
    const countyStudents = Array.from(schoolMap.values()).reduce((s, arr) => s + arr.length, 0);
    const countyTotal    = Array.from(schoolMap.values()).reduce((s, arr) => s + arr.reduce((ss, r) => ss + (r.amount_requested ?? 0), 0), 0);

    // County header — keep it with at least one school+student row
    checkY(COUNTY_H + SCH_H + ROW_H + 1);
    drawCountyHeader(countyKey, countyTotal, countyStudents, schoolMap.size);
    drawColumnHeaders();

    for (const [, schoolRows] of schoolMap) {
      // Keep school header with at least its first student row
      checkY(SCH_H + ROW_H + 1);
      drawSchoolHeader(schoolRows[0].school_name.toUpperCase().trim(), schoolRows);

      for (let i = 0; i < schoolRows.length; i++) {
        checkY(ROW_H + 1);
        drawRow(schoolRows[i], serial++, i % 2 === 1);
      }

      // School sub-total row
      checkY(5 + 1);
      drawSchoolSubtotal(schoolRows);
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
    `GRAND TOTAL — ${rows.length} student${rows.length !== 1 ? "s" : ""} across ${totalSchools} school${totalSchools !== 1 ? "s" : ""} in ${byCounty.size} county${byCounty.size !== 1 ? "s" : ""}`,
    M + 2, y + 4.8
  );
  doc.text(`KSh ${grandTotal.toLocaleString()}`, cols.amount.x + cols.amount.w - 1, y + 4.8, { align: "right" });
  doc.setTextColor(0, 0, 0);

  addPageFooter();

  const safeTitle = title.replace(/[^a-z0-9]/gi, "-").slice(0, 40);
  doc.save(`Moha-Broadsheet-${safeTitle}-${Date.now()}.pdf`);
}



// ── CHEQUE SUMMARY EXCEL EXPORT ────────────────────────────────────────────
// Single-sheet workbook laid out for cheque-writing:
//
//   MOHA EDUCATION KITTY — BURSARY CHEQUE SUMMARY          [title row]
//   Generated: …                                            [date row]
//   (blank)
//   ┌──────────────────────────────────────────────────────────────────────┐
//   │ COUNTY: NAIROBI                                                      │  ← county header (merged)
//   ├──────────────────────┬───────────────┬──────────────┬────────────────┤
//   │ SCHOOL NAME          │ BANK ACCOUNT  │ NO. OF STDS  │ TOTAL (KSh)   │  ← column headers
//   ├──────────────────────┼───────────────┼──────────────┼────────────────┤
//   │ KANGA HIGH SCHOOL    │ 1234567890    │     3        │    45,000      │
//   │ MATHARE GIRLS        │ 0987654321    │     2        │    30,000      │
//   ├──────────────────────┴───────────────┼──────────────┼────────────────┤
//   │ NAIROBI COUNTY TOTAL (2 schools)     │     5        │    75,000      │
//   └──────────────────────────────────────┴──────────────┴────────────────┘
//   (blank)
//   … next county …
//   (blank)
//   GRAND TOTAL                            │    XX        │   XXX,000      │
//
// Individual students are NOT listed — purely for cheque-writing.

export function generateBroadsheetExcel(
  rows: BroadsheetRow[],
  title = "Moha Bursary Cheque Summary",
) {
  // ── Build county → school summaries ───────────────────────────────────────
  type SchoolSummary = {
    school: string;
    bankAccount: string;
    students: number;
    total: number;
  };
  const byCounty = new Map<string, SchoolSummary[]>();

  for (const r of rows) {
    const county = (r.school_county || "UNSPECIFIED").toUpperCase().trim();
    const school = r.school_name.toUpperCase().trim();
    const bank   = (r.school_bank_account || "—").trim();

    if (!byCounty.has(county)) byCounty.set(county, []);
    const list = byCounty.get(county)!;
    const existing = list.find((s) => s.school === school);
    if (existing) {
      existing.students += 1;
      existing.total    += r.amount_requested ?? 0;
      // Use the first non-empty bank account we find for this school
      if (existing.bankAccount === "—" && bank !== "—") existing.bankAccount = bank;
    } else {
      list.push({ school, bankAccount: bank, students: 1, total: r.amount_requested ?? 0 });
    }
  }

  // Sort counties alphabetically; schools within each county alphabetically
  const sortedCounties = Array.from(byCounty.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([county, schools]) => ({
      county,
      schools: [...schools].sort((a, b) => a.school.localeCompare(b.school)),
    }));

  const grandTotal    = rows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
  const grandStudents = rows.length;
  const totalSchools  = sortedCounties.reduce((s, { schools }) => s + schools.length, 0);

  // ── Build a single flat array of rows ─────────────────────────────────────
  // Each element: [col-A, col-B, col-C, col-D]
  //   col-A = School Name  (or county label, or total label)
  //   col-B = Bank Account
  //   col-C = No. of Students
  //   col-D = Total Amount (KSh)
  // We track which row index each "special" row lands on so we can merge cells.

  type AoaRow = (string | number)[];
  const data: AoaRow[] = [];

  // Row 0: Title
  data.push(["MOHA EDUCATION KITTY — BURSARY CHEQUE SUMMARY", "", "", ""]);
  // Row 1: Generated date
  data.push([
    `Generated: ${new Date().toLocaleDateString("en-KE", {
      day: "numeric", month: "long", year: "numeric",
    })}`,
    "", "", "",
  ]);
  // Row 2: blank
  data.push(["", "", "", ""]);
  // Row 3: global column headers
  data.push(["SCHOOL NAME", "BANK ACCOUNT NO.", "NO. OF STUDENTS", "TOTAL AMOUNT (KSh)"]);

  const FIXED_HEADER_ROWS = 4; // rows 0-3 above

  // Merges we'll accumulate (0-indexed)
  const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [
    // Title row — merge A:D
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    // Date row — merge A:D
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
    // Blank row — merge A:D
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
  ];

  for (const { county, schools } of sortedCounties) {
    const countyTotal    = schools.reduce((s, sc) => s + sc.total,    0);
    const countyStudents = schools.reduce((s, sc) => s + sc.students, 0);

    // County header row — merge A:D
    const countyRowIdx = data.length;
    data.push([`COUNTY: ${county}`, "", "", ""]);
    merges.push({ s: { r: countyRowIdx, c: 0 }, e: { r: countyRowIdx, c: 3 } });

    // School rows
    for (const sc of schools) {
      data.push([sc.school, sc.bankAccount, sc.students, sc.total]);
    }

    // County subtotal row — merge A:B for the label
    const subtotalRowIdx = data.length;
    data.push([
      `${county} TOTAL  (${schools.length} school${schools.length !== 1 ? "s" : ""})`,
      "",
      countyStudents,
      countyTotal,
    ]);
    merges.push({ s: { r: subtotalRowIdx, c: 0 }, e: { r: subtotalRowIdx, c: 1 } });

    // Blank separator
    data.push(["", "", "", ""]);
  }

  // Grand total row — merge A:B for the label
  const grandRowIdx = data.length;
  data.push([
    `GRAND TOTAL — ${byCounty.size} ${byCounty.size !== 1 ? "counties" : "county"}  ·  ${totalSchools} schools  ·  ${grandStudents} students`,
    "",
    grandStudents,
    grandTotal,
  ]);
  merges.push({ s: { r: grandRowIdx, c: 0 }, e: { r: grandRowIdx, c: 1 } });

  // ── Build worksheet ────────────────────────────────────────────────────────
  const ws = XLSX.utils.aoa_to_sheet(data);

  ws["!cols"] = [
    { wch: 52 }, // School Name / county label
    { wch: 24 }, // Bank Account
    { wch: 16 }, // No. of Students
    { wch: 22 }, // Total Amount
  ];

  ws["!merges"] = merges;

  // ── Workbook ───────────────────────────────────────────────────────────────
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "CHEQUE SUMMARY");

  const safeTitle = title.replace(/[^a-z0-9]/gi, "-").slice(0, 40);
  XLSX.writeFile(wb, `Moha-Cheque-Summary-${safeTitle}-${Date.now()}.xlsx`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  DETAILED APPROVED BROADSHEET (Excel) — matches the MOHA report template.
//
//  Layout (mirrors the uploaded SAMPLE_OF_MOHA_REPORT_TEMPLATE):
//
//    ┌───────────────────────────────────────────────────────────────────────┐
//    │                          TITLE (merged A1:H4)                          │  I1:I4 = header space
//    ├────┬────────────┬───────┬─────────────┬───────────┬──────────┬────────┤
//    │ NO │ STUDENT'S… │ GRADE │ SCHOOL NAME │ SCHOOL … │ PARENT…  │ …AMOUNT│
//    ├────┼────────────┼───────┼─────────────┼───────────┼──────────┼────────┤
//    │  1 │ …          │ …     │ …           │ …         │ …        │  …     │
//    │  … │ …          │ …     │ …           │ …         │ …        │  …     │
//    └────┴────────────┴───────┴─────────────┴───────────┴──────────┴────────┘
//    (blank)
//    WARD SUMMARIES
//      WARD  │ NO. OF SCHOOLS │ NO. OF STUDENTS │ TOTAL AMOUNT
//      …     │ …              │ …               │ …
//      GRAND TOTAL            │ …               │ …
// ═══════════════════════════════════════════════════════════════════════════

export function generateApprovedBroadsheetExcel(
  rows: BroadsheetRow[],
  title = "MOHA EDUCATION KITTY — APPROVED BURSARY BROADSHEET",
) {
  type AoaRow = (string | number)[];
  const data: AoaRow[] = [];
  const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [];

  // ── Title block: rows 0-3, merged A:H (cols 0..7). Col I (8) left blank on
  //    those rows to match the template exactly.
  const generated = new Date().toLocaleDateString("en-KE", {
    day: "numeric", month: "long", year: "numeric",
  });
  const titleLines = [
    title,
    "",
    `Generated: ${generated}   ·   ${rows.length} approved student${rows.length !== 1 ? "s" : ""}`,
    "",
  ];
  for (let i = 0; i < 4; i++) {
    data.push([titleLines[i] ?? "", "", "", "", "", "", "", "", ""]);
  }
  merges.push({ s: { r: 0, c: 0 }, e: { r: 3, c: 7 } });

  // ── Column headers (row 4) ─────────────────────────────────────────────────
  data.push([
    "NO",
    "STUDENT'S NAME",
    "GRADE",
    "SCHOOL NAME",
    "SCHOOL LOCATION",
    "PARENTS/GUARDIAN NAME",
    "PARENTS/GUARDIAN PHONE",
    "WARD",
    "AMOUNT",
  ]);

  // ── Student rows, sorted by ward then school then name ────────────────────
  const sorted = [...rows].sort((a, b) => {
    const w = (a.ward || "").localeCompare(b.ward || "");
    if (w !== 0) return w;
    const s = a.school_name.localeCompare(b.school_name);
    if (s !== 0) return s;
    return a.student_name.localeCompare(b.student_name);
  });

  sorted.forEach((r, i) => {
    const location = [r.school_sub_county, r.school_county].filter(Boolean).join(", ") || "—";
    data.push([
      i + 1,
      r.student_name,
      r.current_grade,
      r.school_name,
      location,
      r.guardian_name,
      r.guardian_phone,
      r.ward || "—",
      r.amount_requested ?? 0,
    ]);
  });

  // ── Ward summaries ─────────────────────────────────────────────────────────
  type WardStat = { schools: Set<string>; students: number; total: number };
  const wardMap = new Map<string, WardStat>();
  for (const r of sorted) {
    const key = (r.ward || "Unspecified").trim();
    if (!wardMap.has(key)) wardMap.set(key, { schools: new Set(), students: 0, total: 0 });
    const w = wardMap.get(key)!;
    w.schools.add(r.school_name.trim().toUpperCase());
    w.students += 1;
    w.total += r.amount_requested ?? 0;
  }

  data.push(["", "", "", "", "", "", "", "", ""]);
  const summaryTitleRow = data.length;
  data.push(["WARD SUMMARIES", "", "", "", "", "", "", "", ""]);
  merges.push({ s: { r: summaryTitleRow, c: 0 }, e: { r: summaryTitleRow, c: 8 } });

  data.push(["WARD", "NO. OF SCHOOLS", "NO. OF STUDENTS", "TOTAL AMOUNT (KSh)", "", "", "", "", ""]);
  const summaryHeaderRow = data.length - 1;
  merges.push({ s: { r: summaryHeaderRow, c: 3 }, e: { r: summaryHeaderRow, c: 8 } });

  const sortedWards = Array.from(wardMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  for (const [ward, stat] of sortedWards) {
    const rowIdx = data.length;
    data.push([ward, stat.schools.size, stat.students, stat.total, "", "", "", "", ""]);
    merges.push({ s: { r: rowIdx, c: 3 }, e: { r: rowIdx, c: 8 } });
  }

  const grandStudents = sorted.length;
  const grandTotal = sorted.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
  const grandSchools = new Set(sorted.map((r) => r.school_name.trim().toUpperCase())).size;

  const grandRow = data.length;
  data.push([
    "GRAND TOTAL",
    grandSchools,
    grandStudents,
    grandTotal,
    "", "", "", "", "",
  ]);
  merges.push({ s: { r: grandRow, c: 3 }, e: { r: grandRow, c: 8 } });

  // ── Build worksheet ────────────────────────────────────────────────────────
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [
    { wch: 5 },   // NO
    { wch: 28 },  // STUDENT'S NAME
    { wch: 10 },  // GRADE
    { wch: 32 },  // SCHOOL NAME
    { wch: 24 },  // SCHOOL LOCATION
    { wch: 26 },  // PARENTS/GUARDIAN NAME
    { wch: 20 },  // PARENTS/GUARDIAN PHONE
    { wch: 16 },  // WARD
    { wch: 14 },  // AMOUNT
  ];
  ws["!merges"] = merges;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "APPROVED BROADSHEET");

  const safeTitle = title.replace(/[^a-z0-9]/gi, "-").slice(0, 40);
  XLSX.writeFile(wb, `Moha-Approved-Broadsheet-${safeTitle}-${Date.now()}.xlsx`);
}