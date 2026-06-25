import { j as jspdf_node_minExports } from "../_libs/jspdf.mjs";
const KENYA_COUNTIES = {
  "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Likoni", "Mvita", "Nyali"],
  "Kwale": ["Kinango", "Lungalunga", "Matuga", "Msambweni"],
  "Kilifi": ["Ganze", "Kaloleni", "Kilifi North", "Kilifi South", "Magarini", "Malindi", "Rabai"],
  "Tana River": ["Bura", "Galole", "Garsen"],
  "Lamu": ["Lamu East", "Lamu West"],
  "Taita-Taveta": ["Mwatate", "Taveta", "Voi", "Wundanyi"],
  "Garissa": ["Balambala", "Dadaab", "Fafi", "Garissa Township", "Ijara", "Lagdera"],
  "Wajir": ["Eldas", "Tarbaj", "Wajir East", "Wajir North", "Wajir South", "Wajir West"],
  "Mandera": ["Banissa", "Lafey", "Mandera East", "Mandera North", "Mandera South", "Mandera West"],
  "Marsabit": ["Laisamis", "Moyale", "North Horr", "Saku"],
  "Isiolo": ["Isiolo North", "Isiolo South"],
  "Meru": ["Buuri", "Central Imenti", "Igembe Central", "Igembe North", "Igembe South", "North Imenti", "South Imenti", "Tigania East", "Tigania West"],
  "Tharaka-Nithi": ["Chuka/Igambang'ombe", "Maara", "Tharaka"],
  "Embu": ["Manyatta", "Mbeere North", "Mbeere South", "Runyenjes"],
  "Kitui": ["Kitui Central", "Kitui East", "Kitui Rural", "Kitui South", "Kitui West", "Mwingi Central", "Mwingi North", "Mwingi West"],
  "Machakos": ["Kangundo", "Kathiani", "Machakos Town", "Masinga", "Matungulu", "Mavoko", "Mwala", "Yatta"],
  "Makueni": ["Kaiti", "Kibwezi East", "Kibwezi West", "Kilome", "Makueni", "Mbooni"],
  "Nyandarua": ["Kinangop", "Kipipiri", "Ndaragwa", "Ol Jorok", "Ol Kalou"],
  "Nyeri": ["Kieni", "Mathira", "Mukurweini", "Nyeri Town", "Othaya", "Tetu"],
  "Kirinyaga": ["Gichugu", "Kirinyaga Central", "Mwea", "Ndia"],
  "Murang'a": ["Gatanga", "Kandara", "Kangema", "Kigumo", "Kiharu", "Mathioya", "Murang'a South"],
  "Kiambu": ["Gatundu North", "Gatundu South", "Githunguri", "Juja", "Kabete", "Kiambaa", "Kiambu", "Kikuyu", "Lari", "Limuru", "Ruiru", "Thika Town"],
  "Turkana": ["Loima", "Turkana Central", "Turkana East", "Turkana North", "Turkana South", "Turkana West"],
  "West Pokot": ["Kacheliba", "Kapenguria", "Pokot South", "Sigor"],
  "Samburu": ["Samburu East", "Samburu North", "Samburu West"],
  "Trans Nzoia": ["Cherangany", "Endebess", "Kiminini", "Kwanza", "Saboti"],
  "Uasin Gishu": ["Ainabkoi", "Kapseret", "Kesses", "Moiben", "Soy", "Turbo"],
  "Elgeyo-Marakwet": ["Keiyo North", "Keiyo South", "Marakwet East", "Marakwet West"],
  "Nandi": ["Aldai", "Chesumei", "Emgwen", "Mosop", "Nandi Hills", "Tinderet"],
  "Baringo": ["Baringo Central", "Baringo North", "Baringo South", "Eldama Ravine", "Mogotio", "Tiaty"],
  "Laikipia": ["Laikipia East", "Laikipia North", "Laikipia West"],
  "Nakuru": ["Bahati", "Gilgil", "Kuresoi North", "Kuresoi South", "Molo", "Naivasha", "Nakuru Town East", "Nakuru Town West", "Njoro", "Rongai", "Subukia"],
  "Narok": ["Emurua Dikirr", "Kilgoris", "Narok East", "Narok North", "Narok South", "Narok West"],
  "Kajiado": ["Kajiado Central", "Kajiado East", "Kajiado North", "Kajiado South", "Kajiado West"],
  "Kericho": ["Ainamoi", "Belgut", "Bureti", "Kipkelion East", "Kipkelion West", "Sigowet/Soin"],
  "Bomet": ["Bomet Central", "Bomet East", "Chepalungu", "Konoin", "Sotik"],
  "Kakamega": ["Butere", "Ikolomani", "Khwisero", "Likuyani", "Lugari", "Lurambi", "Malava", "Matungu", "Mumias East", "Mumias West", "Navakholo", "Shinyalu"],
  "Vihiga": ["Emuhaya", "Hamisi", "Luanda", "Sabatia", "Vihiga"],
  "Bungoma": ["Bumula", "Kabuchai", "Kanduyi", "Kimilili", "Mt. Elgon", "Sirisia", "Tongaren", "Webuye East", "Webuye West"],
  "Busia": ["Budalangi", "Butula", "Funyula", "Matayos", "Nambale", "Teso North", "Teso South"],
  "Siaya": ["Alego Usonga", "Bondo", "Gem", "Rarieda", "Ugenya", "Ugunja"],
  "Kisumu": ["Kisumu Central", "Kisumu East", "Kisumu West", "Muhoroni", "Nyakach", "Nyando", "Seme"],
  "Homa Bay": ["Homa Bay Town", "Kabondo Kasipul", "Karachuonyo", "Kasipul", "Mbita", "Ndhiwa", "Rangwe", "Suba"],
  "Migori": ["Awendo", "Kuria East", "Kuria West", "Nyatike", "Rongo", "Suna East", "Suna West", "Uriri"],
  "Kisii": ["Bobasi", "Bomachoge Borabu", "Bomachoge Chache", "Bonchari", "Kitutu Chache North", "Kitutu Chache South", "Nyaribari Chache", "Nyaribari Masaba", "South Mugirango"],
  "Nyamira": ["Borabu", "Kitutu Masaba", "North Mugirango", "West Mugirango"],
  "Nairobi": ["Dagoretti North", "Dagoretti South", "Embakasi Central", "Embakasi East", "Embakasi North", "Embakasi South", "Embakasi West", "Kamukunji", "Kasarani", "Kibra", "Lang'ata", "Makadara", "Mathare", "Roysambu", "Ruaraka", "Starehe", "Westlands"]
};
const COUNTY_NAMES = Object.keys(KENYA_COUNTIES).sort();
const bool = (v) => v ? "Yes" : "No";
const dash = (v) => v === null || v === void 0 || v === "" ? "â€”" : String(v);
const money = (v) => v ? `KSh ${Number(v).toLocaleString()}` : "â€”";
function generateBursaryPdf(d) {
  const doc = new jspdf_node_minExports.jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 14;
  let y = 14;
  doc.setFillColor(20, 83, 45);
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
    "STUDENTS LIVING WITH DISABILITY ARE ENCOURAGED TO APPLY."
  ];
  for (const line of instr) {
    doc.text(line, M, y);
    y += 4;
  }
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
    ["Received Bursary in Last 6 Months?", d.received_bursary_before ? `Yes â€” ${d.previous_bursary_source || "source unspecified"} (${money(d.previous_bursary_amount)})` : "No"]
  ]);
  y += rowHeight(14);
  if (d.father_alive) {
    y += 2;
    sectionTitle(doc, "B1: FATHER'S DETAILS", y);
    y += 5;
    kvRows(doc, y, [
      ["Father's Name", dash(d.father_name)],
      ["Phone", dash(d.father_phone)],
      ["Occupation", dash(d.father_occupation)],
      ["National ID", dash(d.father_national_id)]
    ]);
    y += rowHeight(4);
  }
  if (d.mother_alive) {
    y += 2;
    sectionTitle(doc, "B2: MOTHER'S DETAILS", y);
    y += 5;
    kvRows(doc, y, [
      ["Mother's Name", dash(d.mother_name)],
      ["Phone", dash(d.mother_phone)],
      ["Occupation", dash(d.mother_occupation)],
      ["National ID", dash(d.mother_national_id)]
    ]);
    y += rowHeight(4);
  }
  y += 2;
  sectionTitle(doc, "C: SCHOOL'S DETAILS", y);
  y += 5;
  kvRows(doc, y, [
    ["School Name", dash(d.school_name)],
    ["Category", dash(d.school_category)],
    ["County", dash(d.school_county)],
    ["Sub-County", dash(d.school_sub_county)],
    ["Year of Admission", dash(d.year_of_admission)],
    ["School Bank Account", dash(d.school_bank_account)]
  ]);
  y += rowHeight(6);
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
    ["Parent's Monthly Budget", money(d.monthly_budget)]
  ]);
  y += rowHeight(10);
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
    M,
    y
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
    M,
    y
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
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Moha Education Kitty â€¢ Generated ${(/* @__PURE__ */ new Date()).toLocaleString()} â€¢ Ref ${d.reference}`,
    W / 2,
    290,
    { align: "center" }
  );
  doc.save(`Moha-Bursary-${d.reference}.pdf`);
}
function sectionTitle(doc, label, y) {
  doc.setFillColor(212, 175, 55);
  doc.rect(14, y - 4, 182, 6, "F");
  doc.setTextColor(20, 30, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(label, 16, y);
  doc.setTextColor(0, 0, 0);
}
function kvRows(doc, startY, rows) {
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
function rowHeight(itemCount) {
  return Math.ceil(itemCount / 2) * 7;
}
function signLine(doc, y, label, value, xStart = 14) {
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
function checkbox(doc, x, y, label) {
  doc.setDrawColor(0, 0, 0);
  doc.rect(x, y, 4, 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(label, x + 5, y + 3.2);
}
function generateConfirmationLetter(rows, opts) {
  const doc = new jspdf_node_minExports.jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210;
  const M = 18;
  const contentW = W - 2 * M;
  const term = opts.termLabel || `${(/* @__PURE__ */ new Date()).getFullYear()} T2`;
  const officerName = opts.officerName || "Benard Omondi";
  const officerPhone = opts.officerPhone || "0725104771";
  const total = rows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
  let y = 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 83, 45);
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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  const dateText = `Date: ${opts.dateLabel || ""}`;
  doc.text(dateText, W - M, y, { align: "right" });
  if (!opts.dateLabel) {
    doc.getTextWidth("Date: ");
    doc.setLineWidth(0.3);
    doc.line(W - M - 45, y + 0.8, W - M, y + 0.8);
  }
  y += 12;
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
  const colNo = { x: M, w: 12 };
  const colName = { x: M + 12, w: 80 };
  const colAdm = { x: M + 92, w: 45 };
  const colAmt = { x: M + 137, w: contentW - 137 };
  const headerH = 8;
  const rowH = 7.6;
  const tableRows = Math.max(rows.length, 15);
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
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  if (y > 255) {
    doc.addPage();
    y = 20;
  }
  doc.text(
    "We are requested to distribute the funds accordingly. For any discrepancies or confirmation of the",
    M,
    y,
    { maxWidth: contentW }
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
function generateBroadsheetPdf(rows, title = "Approved Bursary Awards â€” Broadsheet") {
  const doc = new jspdf_node_minExports.jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const W = 297;
  const M = 10;
  const PAGE_H = 210;
  const FOOTER_H = 12;
  const USABLE_H = PAGE_H - FOOTER_H;
  const generated = (/* @__PURE__ */ new Date()).toLocaleString("en-KE");
  const sorted = [...rows].sort((a, b) => {
    const ca = (a.school_county || "UNSPECIFIED COUNTY").toUpperCase();
    const cb = (b.school_county || "UNSPECIFIED COUNTY").toUpperCase();
    if (ca !== cb) return ca.localeCompare(cb);
    const sa = a.school_name.toUpperCase().trim();
    const sb = b.school_name.toUpperCase().trim();
    if (sa !== sb) return sa.localeCompare(sb);
    return a.student_name.localeCompare(b.student_name);
  });
  const byCounty = /* @__PURE__ */ new Map();
  for (const r of sorted) {
    const countyKey = (r.school_county || "UNSPECIFIED COUNTY").trim().toUpperCase();
    const schoolKey = r.school_name.toUpperCase().trim();
    if (!byCounty.has(countyKey)) byCounty.set(countyKey, /* @__PURE__ */ new Map());
    const schoolMap = byCounty.get(countyKey);
    if (!schoolMap.has(schoolKey)) schoolMap.set(schoolKey, []);
    schoolMap.get(schoolKey).push(r);
  }
  const totalSchools = [...byCounty.values()].reduce((s, m) => s + m.size, 0);
  let page = 1;
  let y = 0;
  const addPageHeader = () => {
    doc.setFillColor(20, 83, 45);
    doc.rect(0, 0, W, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("MOHA EDUCATION KITTY â€” CONSTITUENCY BURSARY AWARD BROADSHEET", M, 8);
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
      `Moha Education Kitty â€¢ Kiamaiko-Mathare â€¢ ${title} â€¢ Confidential`,
      W / 2,
      PAGE_H - 4,
      { align: "center" }
    );
    doc.setTextColor(0, 0, 0);
  };
  const newPage = () => {
    addPageFooter();
    doc.addPage();
    page++;
    addPageHeader();
  };
  const checkY = (needed) => {
    if (y + needed > USABLE_H) newPage();
  };
  const cols = {
    no: { x: M, w: 9 },
    ref: { x: M + 9, w: 22 },
    name: { x: M + 31, w: 50 },
    grade: { x: M + 81, w: 22 },
    gender: { x: M + 103, w: 16 },
    guardian: { x: M + 119, w: 45 },
    phone: { x: M + 164, w: 30 },
    ward: { x: M + 194, w: 30 },
    amount: { x: M + 224, w: 28 },
    bank: { x: M + 252, w: 35 }
  };
  const ROW_H = 7;
  const HEAD_H = 8;
  const drawTableHeader = () => {
    doc.setFillColor(212, 175, 55);
    doc.rect(M, y, W - 2 * M, HEAD_H, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(20, 30, 20);
    const headers = [
      ["#", "no"],
      ["REF", "ref"],
      ["STUDENT NAME", "name"],
      ["GRADE", "grade"],
      ["GENDER", "gender"],
      ["GUARDIAN / PARENT", "guardian"],
      ["PHONE", "phone"],
      ["WARD", "ward"],
      ["AMOUNT (KSh)", "amount"],
      ["SCHOOL BANK A/C", "bank"]
    ];
    for (const [label, col] of headers) {
      doc.text(label, cols[col].x + 1.5, y + 5.5);
    }
    doc.setTextColor(0, 0, 0);
    y += HEAD_H;
  };
  const drawRow = (r, serial2, shade) => {
    if (shade) {
      doc.setFillColor(245, 245, 245);
      doc.rect(M, y, W - 2 * M, ROW_H, "F");
    }
    doc.setDrawColor(210, 210, 210);
    doc.rect(M, y, W - 2 * M, ROW_H);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const cell = (text, col) => {
      const t = doc.splitTextToSize(text || "â€”", cols[col].w - 2);
      doc.text(String(t[0] ?? "â€”"), cols[col].x + 1.5, y + 4.5);
    };
    cell(String(serial2), "no");
    cell(r.reference, "ref");
    doc.setFont("helvetica", "bold");
    cell(r.student_name, "name");
    doc.setFont("helvetica", "normal");
    cell(r.current_grade, "grade");
    cell(r.gender || "â€”", "gender");
    cell(r.guardian_name, "guardian");
    cell(r.guardian_phone, "phone");
    cell(r.ward || "â€”", "ward");
    cell(r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "â€”", "amount");
    cell(r.school_bank_account || "â€”", "bank");
    y += ROW_H;
  };
  const drawSchoolSubtotal = (schoolRows, schoolKey) => {
    const total = schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
    doc.setFillColor(235, 245, 235);
    doc.rect(M, y, W - 2 * M, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 83, 45);
    doc.text(`Sub-total: ${schoolKey} â€” ${schoolRows.length} student(s)`, M + 2, y + 5);
    doc.text(`KSh ${total.toLocaleString()}`, cols.amount.x + 1.5, y + 5);
    doc.setTextColor(0, 0, 0);
    y += 8;
  };
  const drawCountySubtotal = (countyKey, countyStudents, countyTotal) => {
    checkY(9);
    doc.setFillColor(200, 230, 210);
    doc.rect(M, y, W - 2 * M, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(20, 83, 45);
    doc.text(`${countyKey} COUNTY TOTAL â€” ${countyStudents} student(s)`, M + 3, y + 6);
    doc.text(`KSh ${countyTotal.toLocaleString()}`, cols.amount.x + 1.5, y + 6);
    doc.setTextColor(0, 0, 0);
    y += 10;
  };
  addPageHeader();
  const grandTotal = rows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
  doc.setFillColor(240, 247, 240);
  doc.rect(M, y, W - 2 * M, 11, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 83, 45);
  doc.text(
    `Total Approved: ${rows.length} students  |  Counties: ${byCounty.size}  |  Schools: ${totalSchools}  |  Grand Total: KSh ${grandTotal.toLocaleString()}`,
    W / 2,
    y + 7.5,
    { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
  y += 14;
  let serial = 1;
  for (const [countyKey, schoolMap] of byCounty) {
    const countyAllRows = [...schoolMap.values()].flat();
    const countyStudentCount = countyAllRows.length;
    const countyTotal = countyAllRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
    checkY(HEAD_H + ROW_H * 2 + 20);
    doc.setFillColor(10, 50, 25);
    doc.rect(M, y, W - 2 * M, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 215, 0);
    doc.text(`COUNTY: ${countyKey}`, M + 3, y + 7);
    doc.setFontSize(8);
    doc.text(
      `${countyStudentCount} student(s)  |  ${schoolMap.size} school(s)  |  KSh ${countyTotal.toLocaleString()}`,
      W - M - 3,
      y + 7,
      { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    y += 12;
    for (const [schoolKey, schoolRows] of schoolMap) {
      checkY(HEAD_H + ROW_H * 2 + 10);
      doc.setFillColor(20, 83, 45);
      doc.rect(M, y, W - 2 * M, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      const category = schoolRows[0].school_category ? ` (${schoolRows[0].school_category})` : "";
      doc.text(`  ${schoolKey}${category}`, M + 2, y + 5.5);
      doc.text(`${schoolRows.length} student(s)`, W - M - 2, y + 5.5, { align: "right" });
      doc.setTextColor(0, 0, 0);
      y += 10;
      drawTableHeader();
      for (let i = 0; i < schoolRows.length; i++) {
        checkY(ROW_H + 1);
        drawRow(schoolRows[i], serial++, i % 2 === 1);
      }
      checkY(10);
      drawSchoolSubtotal(schoolRows, schoolKey);
      y += 3;
    }
    drawCountySubtotal(countyKey, countyStudentCount, countyTotal);
    y += 5;
  }
  checkY(18);
  doc.setFillColor(20, 83, 45);
  doc.rect(M, y, W - 2 * M, 12, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `GRAND TOTAL â€” ${rows.length} Students across ${totalSchools} School(s) in ${byCounty.size} County/Counties â€” KSh ${grandTotal.toLocaleString()}`,
    W / 2,
    y + 8,
    { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
  y += 16;
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
    ["Approved by (Coordinator)", ""]
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
export {
  COUNTY_NAMES as C,
  KENYA_COUNTIES as K,
  generateBroadsheetPdf as a,
  generateConfirmationLetter as b,
  generateBursaryPdf as g
};
