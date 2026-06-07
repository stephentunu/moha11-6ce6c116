import { useState, useMemo, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, Download, User, School, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

const StudentSchema = z.object({
  studentName: z.string().trim().min(2, "Student name is required").max(120),
  registrationNumber: z.string().trim().max(40).optional(),
  dob: z.string().optional(),
  currentGrade: z.string().trim().min(1, "Grade / class is required").max(40),
  gender: z.string().optional(),
});

const SchoolSchema = z.object({
  schoolName: z.string().trim().min(2, "School name is required").max(160),
  schoolCategory: z.string().min(1, "School category is required"),
  schoolCounty: z.string().min(1, "School county is required"),
  schoolSubCounty: z.string().min(1, "School sub-county is required"),
  yearOfAdmission: z.string().trim().max(10).optional(),
});

const GuardianSchema = z.object({
  guardianName: z.string().trim().min(2, "Guardian name is required").max(120),
  guardianPhone: z.string().trim().min(7, "Guardian phone is required").max(20),
  parentNationalId: z.string().trim().max(20).optional(),
  amountRequested: z.coerce.number().min(0).max(2_000_000).optional(),
});

type Form = {
  // Student
  studentName: string;
  registrationNumber: string;
  dob: string;
  currentGrade: string;
  gender: string;
  fatherAlive: boolean;
  motherAlive: boolean;
  studentDisability: boolean;
  studentDisabilityDetail: string;
  // Father (when alive)
  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;
  fatherNationalId: string;
  // Mother (when alive)
  motherName: string;
  motherPhone: string;
  motherOccupation: string;
  motherNationalId: string;
  // School
  schoolName: string;
  schoolCategory: string;
  schoolCounty: string;
  schoolSubCounty: string;
  yearOfAdmission: string;
  studentOutstanding: string;
  schoolBankAccount: string;
  // Parent
  guardianName: string;
  guardianPhone: string;
  parentNationalId: string;
  parentOccupation: string;
  parentResidenceSubCounty: string;
  ward: string;
  pollingStation: string;
  parentDisability: boolean;
  parentDisabilityDetail: string;
  siblingsInSchool: string;
  totalFeePayable: string;
  feeArrears: string;
  monthlyBudget: string;
  estimatedFeeBalances: string;
  amountRequested: string;
  receivedBursaryBefore: boolean;
  previousBursarySource: string;
  previousBursaryAmount: string;
  reason: string;
};

const EMPTY: Form = {
  studentName: "", registrationNumber: "", dob: "", currentGrade: "", gender: "",
  fatherAlive: true, motherAlive: true, studentDisability: false, studentDisabilityDetail: "",
  fatherName: "", fatherPhone: "", fatherOccupation: "", fatherNationalId: "",
  motherName: "", motherPhone: "", motherOccupation: "", motherNationalId: "",
  schoolName: "", schoolCategory: "", schoolCounty: "", schoolSubCounty: "",
  yearOfAdmission: "", studentOutstanding: "", schoolBankAccount: "",
  guardianName: "", guardianPhone: "", parentNationalId: "", parentOccupation: "",
  parentResidenceSubCounty: "", ward: "", pollingStation: "", parentDisability: false,
  parentDisabilityDetail: "", siblingsInSchool: "",
  totalFeePayable: "", feeArrears: "", monthlyBudget: "",
  estimatedFeeBalances: "",
  amountRequested: "",
  receivedBursaryBefore: false, previousBursarySource: "", previousBursaryAmount: "",
  reason: "",
};

const GRADES = [
  "Grade 10", "Form 3", "Form 4", "TVET / College", "University",
];
const SCHOOL_CATEGORIES = [
  { v: "C1", l: "C1 — National" },
  { v: "C2", l: "C2 — Extra-County" },
  { v: "C3", l: "C3 — County" },
  { v: "C4", l: "C4 — Sub-County / Day" },
];

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
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) toast.error(e.issues[0]?.message ?? "Please complete required fields");
      return false;
    }
  };

  const reset = () => { setForm(EMPTY); setStep(1); setResult(null); };

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        student_name: form.studentName,
        registration_number: form.registrationNumber || null,
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
        parent_national_id: form.parentNationalId || null,
        parent_occupation: form.parentOccupation || null,
        parent_residence_sub_county: form.parentResidenceSubCounty || null,
        ward: form.ward || null,
        polling_station: form.pollingStation || null,
        parent_disability: form.parentDisability,
        parent_disability_detail: form.parentDisabilityDetail || null,
        siblings_in_school: form.siblingsInSchool ? Number(form.siblingsInSchool) : 0,
        estimated_fee_balances: form.estimatedFeeBalances ? Number(form.estimatedFeeBalances) : 0,
        amount_requested: form.amountRequested ? Number(form.amountRequested) : 0,
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
      registration_number: form.registrationNumber,
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
      parent_national_id: form.parentNationalId,
      parent_occupation: form.parentOccupation,
      parent_residence_sub_county: form.parentResidenceSubCounty,
      ward: form.ward,
      polling_station: form.pollingStation,
      parent_disability: form.parentDisability,
      parent_disability_detail: form.parentDisabilityDetail,
      siblings_in_school: form.siblingsInSchool ? Number(form.siblingsInSchool) : 0,
      estimated_fee_balances: form.estimatedFeeBalances ? Number(form.estimatedFeeBalances) : 0,
      amount_requested: form.amountRequested ? Number(form.amountRequested) : 0,
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
            Ward Bursary Application Form — Term 2 (2026/2027). Complete the three sections and download
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

            {step === 1 && (
              <div className="space-y-4">
                <SectionLabel icon={User}>Student's Details</SectionLabel>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Student name *">
                    <Input value={form.studentName} onChange={(e) => set("studentName", e.target.value)} />
                  </Field>
                  <Field label="Registration / Admission no.">
                    <Input value={form.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} />
                  </Field>
                  <Field label="Date of birth">
                    <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
                  </Field>
                  <Field label="Grade / Class *">
                    <Select value={form.currentGrade} onValueChange={(v) => set("currentGrade", v)}>
                      <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Parents — alive / deceased
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <CheckboxRow label="Father alive" checked={form.fatherAlive} onChange={(v) => set("fatherAlive", v)} />
                    <CheckboxRow label="Mother alive" checked={form.motherAlive} onChange={(v) => set("motherAlive", v)} />
                  </div>
                </div>

                {form.fatherAlive && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Father's details
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Father's name">
                        <Input value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
                      </Field>
                      <Field label="Father's phone">
                        <Input value={form.fatherPhone} onChange={(e) => set("fatherPhone", e.target.value)} placeholder="07XX XXX XXX" />
                      </Field>
                      <Field label="Father's occupation">
                        <Input value={form.fatherOccupation} onChange={(e) => set("fatherOccupation", e.target.value)} />
                      </Field>
                      <Field label="Father's national ID">
                        <Input value={form.fatherNationalId} onChange={(e) => set("fatherNationalId", e.target.value)} />
                      </Field>
                    </div>
                  </div>
                )}

                {form.motherAlive && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Mother's details
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Mother's name">
                        <Input value={form.motherName} onChange={(e) => set("motherName", e.target.value)} />
                      </Field>
                      <Field label="Mother's phone">
                        <Input value={form.motherPhone} onChange={(e) => set("motherPhone", e.target.value)} placeholder="07XX XXX XXX" />
                      </Field>
                      <Field label="Mother's occupation">
                        <Input value={form.motherOccupation} onChange={(e) => set("motherOccupation", e.target.value)} />
                      </Field>
                      <Field label="Mother's national ID">
                        <Input value={form.motherNationalId} onChange={(e) => set("motherNationalId", e.target.value)} />
                      </Field>
                    </div>
                  </div>
                )}


                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <CheckboxRow
                    label="Student lives with a disability"
                    checked={form.studentDisability}
                    onChange={(v) => set("studentDisability", v)}
                  />
                  {form.studentDisability && (
                    <Field label="Please specify (NCPWD card / nature of disability)">
                      <Input
                        value={form.studentDisabilityDetail}
                        onChange={(e) => set("studentDisabilityDetail", e.target.value)}
                      />
                    </Field>
                  )}
                </div>
              </div>
            )}

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
                    <Input
                      value={form.yearOfAdmission}
                      onChange={(e) => set("yearOfAdmission", e.target.value)}
                      placeholder="e.g. 2024"
                    />
                  </Field>
                  <Field label="School bank account">
                    <Input
                      value={form.schoolBankAccount}
                      onChange={(e) => set("schoolBankAccount", e.target.value)}
                      placeholder="Bank · Branch · A/C No."
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Outstanding of the student (achievements, performance, conduct)">
                      <Textarea
                        rows={3}
                        value={form.studentOutstanding}
                        onChange={(e) => set("studentOutstanding", e.target.value)}
                        maxLength={500}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <SectionLabel icon={Users}>Parent / Guardian's Details</SectionLabel>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Parent / Guardian name *">
                    <Input value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
                  </Field>
                  <Field label="Phone contact *">
                    <Input value={form.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} placeholder="07XX XXX XXX" />
                  </Field>
                  <Field label="National ID">
                    <Input value={form.parentNationalId} onChange={(e) => set("parentNationalId", e.target.value)} />
                  </Field>
                  <Field label="Occupation">
                    <Input value={form.parentOccupation} onChange={(e) => set("parentOccupation", e.target.value)} />
                  </Field>
                  <Field label="Residential sub-county">
                    <Input
                      value={form.parentResidenceSubCounty}
                      onChange={(e) => set("parentResidenceSubCounty", e.target.value)}
                    />
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
                  <Field label="Children in High School / University">
                    <Input
                      type="number" min="0"
                      value={form.siblingsInSchool}
                      onChange={(e) => set("siblingsInSchool", e.target.value)}
                    />
                  </Field>
                  <Field label="Estimated total fee balances (all children, KSh)">
                    <Input
                      type="number" min="0"
                      value={form.estimatedFeeBalances}
                      onChange={(e) => set("estimatedFeeBalances", e.target.value)}
                    />
                  </Field>
                  <Field label="Amount applying for (KSh)">
                    <Input
                      type="number" min="0"
                      value={form.amountRequested}
                      onChange={(e) => set("amountRequested", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <CheckboxRow
                    label="Parent / Guardian lives with a disability"
                    checked={form.parentDisability}
                    onChange={(v) => set("parentDisability", v)}
                  />
                  {form.parentDisability && (
                    <Field label="Please specify">
                      <Input
                        value={form.parentDisabilityDetail}
                        onChange={(e) => set("parentDisabilityDetail", e.target.value)}
                      />
                    </Field>
                  )}
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

            {step === 4 && (
              <div className="space-y-3 text-sm">
                <h4 className="font-display font-bold text-base">Review your application</h4>
                <Row label="Student" value={`${form.studentName} · ${form.currentGrade}`} />
                <Row label="Reg. No." value={form.registrationNumber} />
                <Row label="School" value={`${form.schoolName} (${form.schoolCategory || "—"})`} />
                <Row label="School location" value={`${form.schoolCounty || "—"} / ${form.schoolSubCounty || "—"}`} />
                <Row label="Guardian" value={`${form.guardianName} · ${form.guardianPhone}`} />
                <Row label="Parent ID" value={form.parentNationalId} />
                <Row label="Ward / Polling" value={`${form.ward || "—"} · ${form.pollingStation || "—"}`} />
                <Row label="Children in school" value={form.siblingsInSchool || "0"} />
                <Row
                  label="Fee balances"
                  value={form.estimatedFeeBalances ? `KSh ${Number(form.estimatedFeeBalances).toLocaleString()}` : "—"}
                />
                <Row
                  label="Amount requested"
                  value={form.amountRequested ? `KSh ${Number(form.amountRequested).toLocaleString()}` : "—"}
                />
                {form.reason && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Reason</p>
                    <p className="text-foreground whitespace-pre-line">{form.reason}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  After submission you'll be able to download a pre-filled PDF form to sign and submit
                  alongside your supporting documents.
                </p>
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
                <Button variant="hero" onClick={submit} disabled={submitting}>
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
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground text-right">{value || "—"}</span>
    </div>
  );
}
