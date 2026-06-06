import jsPDF from "jspdf";

export type BursaryPdfData = {
  reference: string;
  student_name: string;
  registration_number?: string | null;
  dob?: string | null;
  gender?: string | null;
  current_grade: string;
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

  school_name: string;
  school_category?: string | null;
  school_county?: string | null;
  school_sub_county?: string | null;
  year_of_admission?: string | null;
  student_outstanding?: string | null;
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
  estimated_fee_balances?: number | null;
  amount_requested?: number | null;
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
    "• Parent's National ID  • Parent's Death Certificate(s)  • Current report form and fee structure",
    "• NCPWD card or letter  • Admission letter where necessary  • Any other crucial supporting documents",
    "Duly filled form to be returned to the Moha Coordination Office, Huruma-Mathare.",
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
    ["Registration / Admission No.", dash(d.registration_number)],
    ["Date of Birth", dash(d.dob)],
    ["Grade / Class", dash(d.current_grade)],
    ["Gender", dash(d.gender)],
    ["Father Alive", bool(d.father_alive)],
    ["Mother Alive", bool(d.mother_alive)],
    ["Living with Disability", d.student_disability ? `Yes — ${d.student_disability_detail || "specified"}` : "No"],
  ]);
  y += rowHeight(8);

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
    ["Student's Outstanding", dash(d.student_outstanding)],
    ["School Bank Account", dash(d.school_bank_account)],
  ]);
  y += rowHeight(7);

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
    ["Children in High School / University", dash(d.siblings_in_school ?? 0)],
    ["Estimated Total Fee Balances", money(d.estimated_fee_balances)],
    ["Amount Applying For", money(d.amount_requested)],
  ]);
  y += rowHeight(11);

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
