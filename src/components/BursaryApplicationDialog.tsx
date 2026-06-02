import { useState, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { MATHARE_WARDS } from "@/lib/admin-store";

const StudentSchema = z.object({
  studentName: z.string().trim().min(2, "Student name is required").max(120),
  dob: z.string().optional(),
  gender: z.string().optional(),
  idOrBirthCertNumber: z.string().trim().max(40).optional(),
  phone: z.string().trim().max(20).optional(),
});

const SchoolSchema = z.object({
  schoolName: z.string().trim().min(2, "School name is required").max(160),
  currentGrade: z.string().trim().min(1, "Current grade is required").max(40),
  kcseYear: z.string().trim().max(10).optional(),
});

const GuardianSchema = z.object({
  guardianName: z.string().trim().min(2, "Guardian name is required").max(120),
  guardianPhone: z.string().trim().min(7, "Guardian phone is required").max(20),
  ward: z.string().optional(),
  residenceEstate: z.string().trim().max(120).optional(),
  householdIncomeBand: z.string().optional(),
  siblingsInSchool: z.coerce.number().min(0).max(20).optional(),
  amountRequested: z.coerce.number().min(0).max(2_000_000).optional(),
  reason: z.string().trim().max(1000).optional(),
});

type Form = {
  studentName: string;
  dob: string;
  gender: string;
  idOrBirthCertNumber: string;
  phone: string;
  schoolName: string;
  currentGrade: string;
  kcseYear: string;
  guardianName: string;
  guardianPhone: string;
  ward: string;
  residenceEstate: string;
  householdIncomeBand: string;
  siblingsInSchool: string;
  amountRequested: string;
  reason: string;
};

const EMPTY: Form = {
  studentName: "", dob: "", gender: "", idOrBirthCertNumber: "", phone: "",
  schoolName: "", currentGrade: "", kcseYear: "",
  guardianName: "", guardianPhone: "", ward: "", residenceEstate: "",
  householdIncomeBand: "", siblingsInSchool: "", amountRequested: "", reason: "",
};

const GRADES = [
  "PP1", "PP2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
  "TVET / College", "University",
];
const INCOME_BANDS = [
  "Below KSh 5,000", "KSh 5,000 – 15,000", "KSh 15,000 – 30,000",
  "KSh 30,000 – 50,000", "Above KSh 50,000",
];

export function BursaryApplicationDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep = (): boolean => {
    try {
      if (step === 1) StudentSchema.parse(form);
      else if (step === 2) SchoolSchema.parse(form);
      else if (step === 3) GuardianSchema.parse(form);
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.issues[0]?.message ?? "Please complete the required fields");
      }
      return false;
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setStep(1);
    setReference(null);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("bursary_applications" as never)
        .insert({
          student_name: form.studentName,
          dob: form.dob || null,
          gender: form.gender || null,
          id_or_birth_cert_number: form.idOrBirthCertNumber || null,
          phone: form.phone || null,
          school_name: form.schoolName,
          current_grade: form.currentGrade,
          kcse_year: form.kcseYear || null,
          guardian_name: form.guardianName,
          guardian_phone: form.guardianPhone,
          ward: form.ward || null,
          residence_estate: form.residenceEstate || null,
          household_income_band: form.householdIncomeBand || null,
          siblings_in_school: form.siblingsInSchool ? Number(form.siblingsInSchool) : 0,
          amount_requested: form.amountRequested ? Number(form.amountRequested) : 0,
          reason: form.reason || null,
        } as never)
        .select("reference")
        .single();
      if (error) throw error;
      const ref = (data as unknown as { reference: string }).reference;
      setReference(ref);
      toast.success(`Application submitted — Ref ${ref}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <GraduationCap className="h-6 w-6 text-gold" />
            Bursary Application
          </DialogTitle>
          <DialogDescription>
            High School Bursaries & Scholarships — for needy Mathare students.
          </DialogDescription>
        </DialogHeader>

        {reference ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gold/15 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-gold" />
            </div>
            <h3 className="text-xl font-display font-bold">Application received</h3>
            <p className="text-sm text-muted-foreground">
              Save this reference — you may be contacted by SMS for feedback.
            </p>
            <p className="text-2xl font-bold tracking-wider text-primary">{reference}</p>
            <Button onClick={() => setOpen(false)} variant="hero">Done</Button>
          </div>
        ) : (
          <>
            <Stepper step={step} />

            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Student name *" required>
                  <Input value={form.studentName} onChange={(e) => set("studentName", e.target.value)} />
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
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="ID / Birth cert. number">
                  <Input value={form.idOrBirthCertNumber} onChange={(e) => set("idOrBirthCertNumber", e.target.value)} />
                </Field>
                <Field label="Student phone (if any)">
                  <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="07XX XXX XXX" />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="School name *" required>
                  <Input value={form.schoolName} onChange={(e) => set("schoolName", e.target.value)} />
                </Field>
                <Field label="Current grade *" required>
                  <Select value={form.currentGrade} onValueChange={(v) => set("currentGrade", v)}>
                    <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>
                      {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="KCSE year (if applicable)">
                  <Input value={form.kcseYear} onChange={(e) => set("kcseYear", e.target.value)} placeholder="e.g. 2025" />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Guardian name *" required>
                  <Input value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
                </Field>
                <Field label="Guardian phone *" required>
                  <Input value={form.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} placeholder="07XX XXX XXX" />
                </Field>
                <Field label="Ward">
                  <Select value={form.ward} onValueChange={(v) => set("ward", v)}>
                    <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                    <SelectContent>
                      {MATHARE_WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Residence / Estate">
                  <Input value={form.residenceEstate} onChange={(e) => set("residenceEstate", e.target.value)} />
                </Field>
                <Field label="Household monthly income">
                  <Select value={form.householdIncomeBand} onValueChange={(v) => set("householdIncomeBand", v)}>
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {INCOME_BANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Siblings in school">
                  <Input type="number" min="0" value={form.siblingsInSchool} onChange={(e) => set("siblingsInSchool", e.target.value)} />
                </Field>
                <Field label="Amount requested (KSh)">
                  <Input type="number" min="0" value={form.amountRequested} onChange={(e) => set("amountRequested", e.target.value)} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Reason / story">
                    <Textarea value={form.reason} onChange={(e) => set("reason", e.target.value)} rows={4} maxLength={1000} placeholder="Tell us briefly why you need support…" />
                  </Field>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 text-sm">
                <h4 className="font-display font-bold text-base">Review your application</h4>
                <Row label="Student" value={form.studentName} />
                <Row label="School" value={`${form.schoolName} · ${form.currentGrade}`} />
                <Row label="Guardian" value={`${form.guardianName} · ${form.guardianPhone}`} />
                <Row label="Ward" value={form.ward || "—"} />
                <Row label="Estate" value={form.residenceEstate || "—"} />
                <Row label="Income band" value={form.householdIncomeBand || "—"} />
                <Row label="Siblings in school" value={form.siblingsInSchool || "0"} />
                <Row label="Amount requested" value={form.amountRequested ? `KSh ${Number(form.amountRequested).toLocaleString()}` : "—"} />
                {form.reason && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Reason</p>
                    <p className="text-foreground whitespace-pre-line">{form.reason}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 4 ? (
                <Button
                  variant="hero"
                  onClick={() => { if (validateStep()) setStep((s) => s + 1); }}
                >
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

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}{required ? "" : null}</Label>
      {children}
    </div>
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
