import { useState, useMemo, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, Download, User, School, Users, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { MATHARE_WARDS } from "@/lib/admin-store";
import { KENYA_COUNTIES, COUNTY_NAMES } from "@/lib/kenya-counties";
import { generateBursaryPdf } from "@/lib/bursary-pdf";

// ─── Schemas ────────────────────────────────────────────────────────────────

const StudentSchema = z.object({
  studentName: z.string().trim().min(2, "Student name is required").max(120),
  admissionNumber: z.string().trim().max(40).optional(),
  dob: z.string().optional(),
  currentGrade: z.string().trim().min(1, "Grade / class is required").max(40),
  gender: z.string().optional(),
  birthCertNumber: z.string().trim().max(40).optional(),
  studentOutstanding: z.string().trim().max(500).optional(),
  studentAnnualFee: z.string().optional(),
  amountRequested: z.string().optional(),
  receivedBursaryBefore: z.boolean().optional(),
  previousBursaryAmount: z.string().optional(),
  previousBursarySource: z.string().max(200).optional(),
});

const SchoolSchema = z.object({
  schoolName: z.string().trim().min(2, "School name is required").max(160),
  schoolCategory: z.string().min(1, "School category is required"),
  schoolCounty: z.string().min(1, "School county is required"),
  schoolSubCounty: z.string().min(1, "School sub-county is required"),
});

const GuardianSchema = z.object({
  guardianName: z.string().trim().min(2, "Guardian / contact name is required").max(120),
  guardianPhone: z.string().trim().min(7, "Phone contact is required").max(20),
});

const ConsentSchema = z.object({
  dataConsent: z.literal(true, { errorMap: () => ({ message: "You must agree to the data policy before submitting" }) }),
});

// ─── Types ───────────────────────────────────────────────────────────────────

type Form = {
  // Student
  studentName: string;
  admissionNumber: string;
  dob: string;
  currentGrade: string;
  gender: string;
  studentDisability: boolean;
  studentDisabilityDetail: string;
  birthCertNumber: string;
  studentOutstanding: string;
  studentAnnualFee: string;
  amountRequested: string;
  receivedBursaryBefore: boolean | null; // null = not answered yet
  previousBursarySource: string;
  previousBursaryAmount: string;
  // School
  schoolName: string;
  schoolCategory: string;
  schoolCounty: string;
  schoolSubCounty: string;
  yearOfAdmission: string;
  schoolBankAccount: string;
  // Parents alive flags
  fatherAlive: boolean;
  motherAlive: boolean;
  // Father
  fatherName: string;
  fatherPhone: string;
  fatherNationalId: string;
  fatherOccupation: string;
  fatherDisability: boolean;
  fatherDisabilityDetail: string;
  // Mother
  motherName: string;
  motherPhone: string;
  motherNationalId: string;
  motherOccupation: string;
  motherDisability: boolean;
  motherDisabilityDetail: string;
  // Guardian (always shown)
  guardianName: string;
  guardianPhone: string;
  guardianNationalId: string;
  guardianOccupation: string;
  guardianDisability: boolean;
  guardianDisabilityDetail: string;
  // Household
  parentResidenceSubCounty: string;
  ward: string;
  pollingStation: string;
  siblingsInSchool: string;
  totalFeePayable: string;
  monthlyBudget: string;
  reason: string;
  // Consent
  dataConsent: boolean;
};

const EMPTY: Form = {
  studentName: "", admissionNumber: "", dob: "", currentGrade: "", gender: "",
  studentDisability: false, studentDisabilityDetail: "",
  birthCertNumber: "", studentOutstanding: "", studentAnnualFee: "", amountRequested: "",
  receivedBursaryBefore: null, previousBursarySource: "", previousBursaryAmount: "",
  schoolName: "", schoolCategory: "", schoolCounty: "", schoolSubCounty: "",
  yearOfAdmission: "", schoolBankAccount: "",
  fatherAlive: true, motherAlive: true,
  fatherName: "", fatherPhone: "", fatherNationalId: "", fatherOccupation: "",
  fatherDisability: false, fatherDisabilityDetail: "",
  motherName: "", motherPhone: "", motherNationalId: "", motherOccupation: "",
  motherDisability: false, motherDisabilityDetail: "",
  guardianName: "", guardianPhone: "", guardianNationalId: "", guardianOccupation: "",
  guardianDisability: false, guardianDisabilityDetail: "",
  parentResidenceSubCounty: "", ward: "", pollingStation: "",
  siblingsInSchool: "", totalFeePayable: "", monthlyBudget: "", reason: "",
  dataConsent: false,
};

const GRADES = [
  "Grade 10", "Form 2", "Form 3", "Form 4",
  "TVET / College", "University / Degree",
];

const SCHOOL_CATEGORIES = [
  { v: "C1", l: "C1 — National" },
  { v: "C2", l: "C2 — Extra-County" },
  { v: "C3", l: "C3 — County" },
  { v: "C4", l: "C4 — Sub-County / Day" },
  { v: "Private", l: "Private" },
  { v: "TVET", l: "TVET / Vocational" },
  { v: "University", l: "University" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function BursaryApplicationDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string } | null>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const schoolSubCounties = useMemo(
    () => (form.schoolCounty ? KENYA_COUNTIES[form.schoolCounty] ?? [] : []),
    [form.schoolCounty],
  );

  const validateStep = (): boolean => {
    try {
      if (step === 1) StudentSchema.parse(form);
      else if (step === 2) SchoolSchema.parse(form);
      else if (step === 3) GuardianSchema.parse(form);
      else if (step === 4) {
        if (!form.dataConsent) {
          toast.error("You must agree to the data policy before submitting");
          return false;
        }
      }
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) toast.error(e.issues[0]?.message ?? "Please complete required fields");
      return false;
    }
  };

  const reset = () => { setForm(EMPTY); setStep(1); setResult(null); };

  const submit = async () => {
    if (!form.dataConsent) {
      toast.error("You must agree to the data policy before submitting");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        student_name: form.studentName,
        registration_number: form.admissionNumber || null,
        dob: form.dob || null,
        current_grade: form.currentGrade,
        gender: form.gender || null,
        father_alive: form.fatherAlive,
        mother_alive: form.motherAlive,
        father_name: form.fatherAlive ? (form.fatherName || null) : null,
        father_phone: form.fatherAlive ? (form.fatherPhone || null) : null,
        father_occupation: form.fatherAlive ? (form.fatherOccupation || null) : null,
        father_national_id: form.fatherAlive ? (form.fatherNationalId || null) : null,
        mother_name: form.motherAlive ? (form.motherName || null) : null,
        mother_phone: form.motherAlive ? (form.motherPhone || null) : null,
        mother_occupation: form.motherAlive ? (form.motherOccupation || null) : null,
        mother_national_id: form.motherAlive ? (form.motherNationalId || null) : null,
        student_disability: form.studentDisability,
        student_disability_detail: form.studentDisabilityDetail || null,
        school_name: form.schoolName,
        school_category: form.schoolCategory,
        school_county: form.schoolCounty,
        school_sub_county: form.schoolSubCounty,
        year_of_admission: form.yearOfAdmission || null,
        student_outstanding: form.studentOutstanding || null,
        school_bank_account: form.schoolBankAccount || null,
        guardian_name: form.guardianName,
        guardian_phone: form.guardianPhone,
        parent_national_id: form.guardianNationalId || null,
        parent_occupation: form.guardianOccupation || null,
        parent_residence_sub_county: form.parentResidenceSubCounty || null,
        ward: form.ward || null,
        polling_station: form.pollingStation || null,
        parent_disability: form.guardianDisability,
        parent_disability_detail: form.guardianDisabilityDetail || null,
        siblings_in_school: form.siblingsInSchool ? Number(form.siblingsInSchool) : 0,
        total_fee_payable: form.totalFeePayable ? Number(form.totalFeePayable) : null,
        monthly_budget: form.monthlyBudget ? Number(form.monthlyBudget) : null,
        amount_requested: form.amountRequested ? Number(form.amountRequested) : 0,
        received_bursary_before: form.receivedBursaryBefore ?? false,
        previous_bursary_source: form.receivedBursaryBefore ? (form.previousBursarySource || null) : null,
        previous_bursary_amount: form.receivedBursaryBefore && form.previousBursaryAmount ? Number(form.previousBursaryAmount) : null,
        reason: form.reason || null,
      };
      const { data, error } = await supabase
        .from("bursary_applications" as never)
        .insert(payload as never)
        .select("reference")
        .single();
      if (error) throw error;
      const ref = (data as unknown as { reference: string }).reference;
      setResult({ reference: ref });
      toast.success(`Application submitted — Ref ${ref}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadPdf = () => {
    if (!result) return;
    generateBursaryPdf({
      reference: result.reference,
      student_name: form.studentName,
      registration_number: form.admissionNumber,
      dob: form.dob,
      gender: form.gender,
      current_grade: form.currentGrade,
      father_alive: form.fatherAlive,
      mother_alive: form.motherAlive,
      father_name: form.fatherAlive ? form.fatherName : "",
      father_phone: form.fatherAlive ? form.fatherPhone : "",
      father_occupation: form.fatherAlive ? form.fatherOccupation : "",
      father_national_id: form.fatherAlive ? form.fatherNationalId : "",
      mother_name: form.motherAlive ? form.motherName : "",
      mother_phone: form.motherAlive ? form.motherPhone : "",
      mother_occupation: form.motherAlive ? form.motherOccupation : "",
      mother_national_id: form.motherAlive ? form.motherNationalId : "",
      student_disability: form.studentDisability,
      student_disability_detail: form.studentDisabilityDetail,
      school_name: form.schoolName,
      school_category: form.schoolCategory,
      school_county: form.schoolCounty,
      school_sub_county: form.schoolSubCounty,
      year_of_admission: form.yearOfAdmission,
      student_outstanding: form.studentOutstanding,
      school_bank_account: form.schoolBankAccount,
      guardian_name: form.guardianName,
      guardian_phone: form.guardianPhone,
      parent_national_id: form.guardianNationalId,
      parent_occupation: form.guardianOccupation,
      parent_residence_sub_county: form.parentResidenceSubCounty,
      ward: form.ward,
      polling_station: form.pollingStation,
      parent_disability: form.guardianDisability,
      parent_disability_detail: form.guardianDisabilityDetail,
      siblings_in_school: form.siblingsInSchool ? Number(form.siblingsInSchool) : 0,
      total_fee_payable: form.totalFeePayable ? Number(form.totalFeePayable) : 0,
      fee_arrears: 0,
      monthly_budget: form.monthlyBudget ? Number(form.monthlyBudget) : 0,
      estimated_fee_balances: 0,
      amount_requested: form.amountRequested ? Number(form.amountRequested) : 0,
      received_bursary_before: form.receivedBursaryBefore ?? false,
      previous_bursary_source: form.receivedBursaryBefore ? form.previousBursarySource : "",
      previous_bursary_amount: form.receivedBursaryBefore && form.previousBursaryAmount ? Number(form.previousBursaryAmount) : 0,
      reason: form.reason,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <GraduationCap className="h-6 w-6 text-gold" />
            Moha Education Kitty — Bursary Application
          </DialogTitle>
          <DialogDescription>
            Ward Bursary Application Form — Term 2 (2026/2027). Complete all four sections and download
            your application form to sign and submit at the Moha Coordination Office, Kiamako-Mathare.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="py-8 text-center space-y-5">
            <div className="mx-auto h-16 w-16 rounded-full bg-gold/15 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-gold" />
            </div>
            <h3 className="text-xl font-display font-bold">Application received</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Download the pre-filled form, attach the required documents (National ID, birth certificate, fee structure,
              report form, NCPWD card, etc.), sign, and drop it at the Moha Coordination Office, Kiamako-Mathare.
            </p>
            <p className="text-2xl font-bold tracking-wider text-primary">{result.reference}</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={downloadPdf} variant="hero" className="gap-2">
                <Download className="h-4 w-4" /> Download Application Form (PDF)
              </Button>
              <Button onClick={() => setOpen(false)} variant="outline">Close</Button>
            </div>
          </div>
        ) : (
          <>
            <Stepper step={step} />

            {/* ── STEP 1: STUDENT ─────────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <SectionLabel icon={User}>Student's Details</SectionLabel>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Student name *">
                    <Input value={form.studentName} onChange={(e) => set("studentName", e.target.value)} placeholder="Full legal name" />
                  </Field>
                  <Field label="Admission / Registration number">
                    <Input value={form.admissionNumber} onChange={(e) => set("admissionNumber", e.target.value)} placeholder="e.g. ADM/2024/001" />
                  </Field>
                  <Field label="Date of birth">
                    <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
                  </Field>
                  <Field label="Gender">
                    <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Grade / Class *">
                    <Select value={form.currentGrade} onValueChange={(v) => set("currentGrade", v)}>
                      <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Birth certificate number">
                    <Input value={form.birthCertNumber} onChange={(e) => set("birthCertNumber", e.target.value)} placeholder="As on birth certificate" />
                  </Field>
                </div>

                {/* Disability toggle */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="studentDisabilityToggle" className="text-sm font-semibold cursor-pointer">
                      Student lives with a disability
                    </Label>
                    <Switch
                      id="studentDisabilityToggle"
                      checked={form.studentDisability}
                      onCheckedChange={(v) => set("studentDisability", v)}
                    />
                  </div>
                  {form.studentDisability && (
                    <Field label="Please specify (NCPWD card / nature of disability)">
                      <Input value={form.studentDisabilityDetail} onChange={(e) => set("studentDisabilityDetail", e.target.value)} />
                    </Field>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Student's outstanding ability / achievement">
                    <Textarea
                      rows={3}
                      value={form.studentOutstanding}
                      onChange={(e) => set("studentOutstanding", e.target.value)}
                      placeholder="Academic performance, talent, conduct…"
                      maxLength={500}
                    />
                  </Field>
                  <div className="space-y-4">
                    <Field label="Student annual fee payable (KSh)">
                      <Input type="number" min="0" value={form.studentAnnualFee} onChange={(e) => set("studentAnnualFee", e.target.value)} placeholder="0" />
                    </Field>
                    <Field label="Amount applying for (KSh)">
                      <Input type="number" min="0" value={form.amountRequested} onChange={(e) => set("amountRequested", e.target.value)} placeholder="0" />
                    </Field>
                  </div>
                </div>

                {/* Bursary history — Yes/No checkboxes */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    Have you ever received a Bursary or support from Moha Foundation or any other public source in the last 6 months?
                  </p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <Checkbox
                        checked={form.receivedBursaryBefore === true}
                        onCheckedChange={() => set("receivedBursaryBefore", true)}
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <Checkbox
                        checked={form.receivedBursaryBefore === false}
                        onCheckedChange={() => set("receivedBursaryBefore", false)}
                      />
                      No
                    </label>
                  </div>
                  {form.receivedBursaryBefore === true && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                      <Field label="If yes, state the source (e.g. Moha Foundation, NG-CDF, Equity Wings)">
                        <Input value={form.previousBursarySource} onChange={(e) => set("previousBursarySource", e.target.value)} />
                      </Field>
                      <Field label="Amount received (KSh)">
                        <Input type="number" min="0" value={form.previousBursaryAmount} onChange={(e) => set("previousBursaryAmount", e.target.value)} placeholder="0" />
                      </Field>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 2: SCHOOL ──────────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-4">
                <SectionLabel icon={School}>School's Details</SectionLabel>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="School name *">
                    <Input value={form.schoolName} onChange={(e) => set("schoolName", e.target.value)} />
                  </Field>
                  <Field label="School category *">
                    <Select value={form.schoolCategory} onValueChange={(v) => set("schoolCategory", v)}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {SCHOOL_CATEGORIES.map((c) => (
                          <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="County *">
                    <Select
                      value={form.schoolCounty}
                      onValueChange={(v) => { set("schoolCounty", v); set("schoolSubCounty", ""); }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {COUNTY_NAMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Sub-county *">
                    <Select
                      value={form.schoolSubCounty}
                      onValueChange={(v) => set("schoolSubCounty", v)}
                      disabled={!form.schoolCounty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={form.schoolCounty ? "Select sub-county" : "Pick county first"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {schoolSubCounties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Year of admission">
                    <Input value={form.yearOfAdmission} onChange={(e) => set("yearOfAdmission", e.target.value)} placeholder="e.g. 2024" />
                  </Field>
                  <Field label="School bank account">
                    <Input value={form.schoolBankAccount} onChange={(e) => set("schoolBankAccount", e.target.value)} placeholder="Bank · Branch · A/C No." />
                  </Field>
                </div>
              </div>
            )}

            {/* ── STEP 3: PARENT / GUARDIAN ───────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <SectionLabel icon={Users}>Parent / Guardian's Details</SectionLabel>

                {/* Parent alive flags */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Parents — alive / deceased
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <CheckboxRow label="Father alive" checked={form.fatherAlive} onChange={(v) => set("fatherAlive", v)} />
                    <CheckboxRow label="Mother alive" checked={form.motherAlive} onChange={(v) => set("motherAlive", v)} />
                  </div>
                </div>

                {/* Father */}
                {form.fatherAlive && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Father's Details</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Name"><Input value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} /></Field>
                      <Field label="Phone contact"><Input value={form.fatherPhone} onChange={(e) => set("fatherPhone", e.target.value)} placeholder="07XX XXX XXX" /></Field>
                      <Field label="National ID"><Input value={form.fatherNationalId} onChange={(e) => set("fatherNationalId", e.target.value)} /></Field>
                      <Field label="Occupation"><Input value={form.fatherOccupation} onChange={(e) => set("fatherOccupation", e.target.value)} /></Field>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Label className="text-sm font-semibold cursor-pointer">Father lives with a disability</Label>
                      <Switch checked={form.fatherDisability} onCheckedChange={(v) => set("fatherDisability", v)} />
                    </div>
                    {form.fatherDisability && (
                      <Field label="Please specify"><Input value={form.fatherDisabilityDetail} onChange={(e) => set("fatherDisabilityDetail", e.target.value)} /></Field>
                    )}
                  </div>
                )}

                {/* Mother */}
                {form.motherAlive && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mother's Details</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Name"><Input value={form.motherName} onChange={(e) => set("motherName", e.target.value)} /></Field>
                      <Field label="Phone contact"><Input value={form.motherPhone} onChange={(e) => set("motherPhone", e.target.value)} placeholder="07XX XXX XXX" /></Field>
                      <Field label="National ID"><Input value={form.motherNationalId} onChange={(e) => set("motherNationalId", e.target.value)} /></Field>
                      <Field label="Occupation"><Input value={form.motherOccupation} onChange={(e) => set("motherOccupation", e.target.value)} /></Field>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Label className="text-sm font-semibold cursor-pointer">Mother lives with a disability</Label>
                      <Switch checked={form.motherDisability} onCheckedChange={(v) => set("motherDisability", v)} />
                    </div>
                    {form.motherDisability && (
                      <Field label="Please specify"><Input value={form.motherDisabilityDetail} onChange={(e) => set("motherDisabilityDetail", e.target.value)} /></Field>
                    )}
                  </div>
                )}

                {/* Guardian */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Guardian's Details <span className="text-[10px] normal-case text-muted-foreground">(Primary contact person if different from above)</span>
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Name *"><Input value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} placeholder="Full name" /></Field>
                    <Field label="Phone contact *"><Input value={form.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} placeholder="07XX XXX XXX" /></Field>
                    <Field label="National ID"><Input value={form.guardianNationalId} onChange={(e) => set("guardianNationalId", e.target.value)} /></Field>
                    <Field label="Occupation"><Input value={form.guardianOccupation} onChange={(e) => set("guardianOccupation", e.target.value)} /></Field>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Label className="text-sm font-semibold cursor-pointer">Guardian lives with a disability</Label>
                    <Switch checked={form.guardianDisability} onCheckedChange={(v) => set("guardianDisability", v)} />
                  </div>
                  {form.guardianDisability && (
                    <Field label="Please specify"><Input value={form.guardianDisabilityDetail} onChange={(e) => set("guardianDisabilityDetail", e.target.value)} /></Field>
                  )}
                </div>

                {/* Household & Residence */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Residential sub-county">
                    <Input value={form.parentResidenceSubCounty} onChange={(e) => set("parentResidenceSubCounty", e.target.value)} />
                  </Field>
                  <Field label="Ward">
                    <Select value={form.ward} onValueChange={(v) => set("ward", v)}>
                      <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                      <SelectContent>
                        {MATHARE_WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Polling station">
                    <Input value={form.pollingStation} onChange={(e) => set("pollingStation", e.target.value)} />
                  </Field>
                  <Field label="Number of children in school / University">
                    <Input type="number" min="0" value={form.siblingsInSchool} onChange={(e) => set("siblingsInSchool", e.target.value)} placeholder="0" />
                  </Field>
                  <Field label="Total fee payable per annum — all children (KSh)">
                    <Input type="number" min="0" value={form.totalFeePayable} onChange={(e) => set("totalFeePayable", e.target.value)} placeholder="0" />
                  </Field>
                  <Field label="Monthly budget (KSh)">
                    <Input type="number" min="0" value={form.monthlyBudget} onChange={(e) => set("monthlyBudget", e.target.value)} placeholder="0" />
                  </Field>
                </div>

                <Field label="Brief description of reason for application">
                  <Textarea
                    rows={4}
                    maxLength={1000}
                    value={form.reason}
                    onChange={(e) => set("reason", e.target.value)}
                    placeholder="Tell us briefly why you need support…"
                  />
                </Field>
              </div>
            )}

            {/* ── STEP 4: REVIEW & CONSENT ─────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-4">
                <SectionLabel icon={ShieldCheck}>Review & Data Consent</SectionLabel>

                <div className="space-y-1.5 text-sm">
                  <Row label="Student" value={`${form.studentName} · ${form.currentGrade}`} />
                  <Row label="Admission No." value={form.admissionNumber} />
                  <Row label="Birth Cert No." value={form.birthCertNumber} />
                  <Row label="School" value={`${form.schoolName} (${form.schoolCategory || "—"})`} />
                  <Row label="School location" value={`${form.schoolCounty || "—"} / ${form.schoolSubCounty || "—"}`} />
                  <Row label="Annual fee" value={form.studentAnnualFee ? `KSh ${Number(form.studentAnnualFee).toLocaleString()}` : "—"} />
                  <Row label="Amount requested" value={form.amountRequested ? `KSh ${Number(form.amountRequested).toLocaleString()}` : "—"} />
                  <Row label="Guardian" value={`${form.guardianName} · ${form.guardianPhone}`} />
                  <Row label="Ward / Polling" value={`${form.ward || "—"} · ${form.pollingStation || "—"}`} />
                  <Row label="Children in school" value={form.siblingsInSchool || "0"} />
                  <Row label="Total annual fee (all)" value={form.totalFeePayable ? `KSh ${Number(form.totalFeePayable).toLocaleString()}` : "—"} />
                  <Row label="Monthly budget" value={form.monthlyBudget ? `KSh ${Number(form.monthlyBudget).toLocaleString()}` : "—"} />
                  <Row label="Previous bursary" value={form.receivedBursaryBefore === null ? "Not answered" : form.receivedBursaryBefore ? `Yes — ${form.previousBursarySource || "—"} (KSh ${Number(form.previousBursaryAmount || 0).toLocaleString()})` : "No"} />
                </div>

                {/* Data Policy / Consent */}
                <div className="rounded-xl border-2 border-gold/40 bg-gold/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="h-5 w-5 text-gold shrink-0" />
                    <h4 className="font-display font-bold text-base text-foreground">Data Policy & Consent</h4>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                    <p>
                      The personal information collected in this form (including names, identification numbers,
                      contact details, and household information) will be used exclusively for the purpose of
                      evaluating and processing your bursary application with the <strong className="text-foreground">Moha Education Kitty / Moha Foundation</strong>.
                    </p>
                    <p>
                      Your data will be stored securely and will <strong className="text-foreground">not</strong> be shared
                      with third parties without your consent, except where required by law. You have the right
                      to request access to or deletion of your data at any time by contacting us at
                      the Moha Coordination Office, Kiamako-Mathare or via <em>hello@mohadelivers.com</em>.
                    </p>
                    <p>
                      By submitting this application, you confirm that the information provided is true and accurate
                      to the best of your knowledge.
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group mt-2">
                    <Checkbox
                      checked={form.dataConsent}
                      onCheckedChange={(v) => set("dataConsent", Boolean(v))}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      I have read and understood the data policy above. I consent to the collection and use of my
                      personal information for bursary application processing purposes. *
                    </span>
                  </label>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 4 ? (
                <Button variant="hero" onClick={() => { if (validateStep()) setStep((s) => s + 1); }}>
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="hero" onClick={submit} disabled={submitting || !form.dataConsent}>
                  {submitting ? "Submitting…" : "Submit Application"}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  const labels = ["Student", "School", "Guardian", "Review"];
  return (
    <div className="flex items-center gap-2 py-2">
      {labels.map((l, i) => {
        const idx = i + 1;
        const active = idx === step;
        const done = idx < step;
        return (
          <div key={l} className="flex-1 flex items-center gap-2">
            <div
              className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                done ? "bg-gold text-gold-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? "✓" : idx}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>{l}</span>
            {idx < labels.length && <div className="flex-1 h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-border">
      <Icon className="h-4 w-4 text-gold" />
      <h3 className="font-display font-bold text-base">{children}</h3>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      {label}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border py-1.5">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-semibold text-foreground text-right">{value || "—"}</span>
    </div>
  );
}