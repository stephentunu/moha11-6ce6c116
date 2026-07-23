import { useState, useMemo, useEffect, useRef, type ReactNode } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, Download, User, School, Users, ShieldCheck, Share2,
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
import { MATHARE_WARDS, syncGuardianAsSupporter, fetchBursaryTerm } from "@/lib/admin-store";
import { KENYA_COUNTIES, COUNTY_NAMES } from "@/lib/kenya-counties";
import { generateBursaryPdf } from "@/lib/bursary-pdf";

// ─── Schemas ────────────────────────────────────────────────────────────────

const StudentSchema = z.object({
  studentName: z.string().trim().min(2, "Student name is required").max(120)
    .regex(/^[^\d]*$/, "Student name must not contain numbers"),
  admissionNumber: z.string().trim().max(40).optional(),
  dob: z.string().optional(),
  currentGrade: z.string().trim().min(1, "Grade / class is required").max(40),
  gender: z.string().optional(),
  birthCertNumber: z.string().trim()
    .min(1, "Birth certificate number is required")
    .regex(/^\d{5,12}$/, "Birth certificate number must be 5–12 digits, numbers only"),
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

// Standard maximum length for a phone number field (e.g. "+254712345678"
// is 13 characters). Applies to father/mother/guardian phone contacts.
const PHONE_MAX_LEN = 13;

const digitsField = (label: string, required: boolean) => {
  const base = z.string().trim();
  const checked = required
    ? base.min(7, `${label} is required`).regex(new RegExp(`^\\d{7,${PHONE_MAX_LEN}}$`), `${label} must contain numbers only, up to ${PHONE_MAX_LEN} digits`)
    : base.regex(new RegExp(`^\\d{7,${PHONE_MAX_LEN}}$`), `${label} must contain numbers only, up to ${PHONE_MAX_LEN} digits`).optional().or(z.literal(""));
  return checked;
};

const GuardianSchema = z.object({
  guardianName: z.string().trim().min(2, "Guardian / contact name is required").max(120)
    .regex(/^[^\d]*$/, "Guardian name must not contain numbers"),
  guardianPhone: digitsField("Phone contact", true),
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
  outstandingBalance: string;
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
  monthlyBudget: string;
  reason: string;
  // Consent
  dataConsent: boolean;
};

const EMPTY: Form = {
  studentName: "", admissionNumber: "", dob: "", currentGrade: "", gender: "",
  studentDisability: false, studentDisabilityDetail: "",
  birthCertNumber: "", studentOutstanding: "", studentAnnualFee: "", outstandingBalance: "", amountRequested: "",
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
  siblingsInSchool: "", monthlyBudget: "", reason: "",
  dataConsent: false,
};

const GRADES = [
  "Grade 10", "Form 3", "Form 4",
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

// Strips everything except digits as the user types, so fields that expect a
// number (birth certificate, phone, national ID) can never end up holding
// letters — enforced at the keystroke, not just on submit.
function digitsOnly(value: string, maxLen = 15): string {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

// Strips digits as the user types, for fields that hold a person's name
// (student, father, mother, guardian) — names must never contain numbers.
// Letters, spaces, and standard name punctuation (hyphens, apostrophes,
// periods for initials) are preserved.
function lettersOnly(value: string, maxLen = 120): string {
  return value.replace(/[0-9]/g, "").slice(0, maxLen);
}

// Uppercases every "free text" field on the form. Applicants sometimes type
// in lower case or mixed case; official bursary records must be in capital
// letters, so this is applied automatically at submission time rather than
// relying on the applicant to remember to use caps lock.
const UPPERCASE_FIELDS: (keyof Form)[] = [
  "studentName", "admissionNumber", "studentOutstanding",
  "schoolName", "schoolBankAccount",
  "fatherName", "fatherOccupation", "fatherDisabilityDetail",
  "motherName", "motherOccupation", "motherDisabilityDetail",
  "guardianName", "guardianOccupation", "guardianDisabilityDetail",
  "studentDisabilityDetail",
  "parentResidenceSubCounty", "pollingStation",
  "previousBursarySource", "reason",
];

function toUppercaseForm(f: Form): Form {
  const upper = { ...f };
  for (const key of UPPERCASE_FIELDS) {
    const value = upper[key];
    if (typeof value === "string") {
      (upper[key] as string) = value.toUpperCase();
    }
  }
  return upper;
}

// ─── Draft persistence (resume an interrupted application) ────────────────
// If an applicant's device loses power, connectivity, or they simply need
// to step away, their in-progress answers are saved to this device's local
// storage and automatically restored the next time they open the form —
// no account or login required. The draft is cleared once the application
// is successfully submitted.
const DRAFT_STORAGE_KEY = "moha_bursary_application_draft_v1";
const DRAFT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

type Draft = { form: Form; step: number; savedAt: number };

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (!parsed || typeof parsed !== "object" || !parsed.form) return null;
    if (typeof parsed.savedAt === "number" && Date.now() - parsed.savedAt > DRAFT_MAX_AGE_MS) {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }
    return {
      form: { ...EMPTY, ...parsed.form },
      step: typeof parsed.step === "number" && parsed.step >= 1 && parsed.step <= 4 ? parsed.step : 1,
      savedAt: parsed.savedAt ?? Date.now(),
    };
  } catch {
    return null;
  }
}

function saveDraft(form: Form, step: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ form, step, savedAt: Date.now() }));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — non-critical,
    // the applicant can still complete the form in this session.
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// True if the form holds any applicant-entered content worth resuming
// (as opposed to a fresh, untouched form with just the default flags set).
function hasDraftProgress(form: Form): boolean {
  return (Object.keys(form) as (keyof Form)[]).some((key) => {
    if (key === "dataConsent" || key === "fatherAlive" || key === "motherAlive") return false;
    const value = form[key];
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "boolean") return value === true;
    return value !== null && value !== undefined;
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BursaryApplicationDialog({ trigger }: { trigger: ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string } | null>(null);

  // Whether a saved draft with real progress was restored on load, so the
  // UI can let the applicant know their earlier answers are still here.
  const [resumedDraft, setResumedDraft] = useState(false);
  const resumeAnnouncedRef = useRef(false);
  // Guards against the autosave effect firing on its very first pass (before
  // the restore effect's setForm/setStep have actually landed), which would
  // otherwise immediately overwrite a just-restored draft with stale data.
  const skipFirstSaveRef = useRef(true);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  // Same as `set`, but strips any non-digit characters first — use for every
  // field that must hold a number (birth cert, phone, national ID).
  const setDigits = <K extends keyof Form>(k: K, raw: string, maxLen = 15) =>
    setForm((f) => ({ ...f, [k]: digitsOnly(raw, maxLen) as Form[K] }));

  // Same as `set`, but strips any digit characters first — use for every
  // field that must hold a person's name (student, father, mother, guardian).
  const setLetters = <K extends keyof Form>(k: K, raw: string, maxLen = 120) =>
    setForm((f) => ({ ...f, [k]: lettersOnly(raw, maxLen) as Form[K] }));

  // ── Resume-in-progress draft ──────────────────────────────────────────────
  // On first mount, restore any saved draft from this device so an applicant
  // who was interrupted (device died, connectivity dropped, they had to step
  // away) picks up exactly where they left off, rather than starting over.
  useEffect(() => {
    const draft = loadDraft();
    if (draft && hasDraftProgress(draft.form)) {
      setForm(draft.form);
      setStep(draft.step);
      setResumedDraft(true);
    }
  }, []);

  // Autosave the draft as the applicant progresses. The first pass is
  // skipped (see skipFirstSaveRef above); once the application has been
  // successfully submitted the draft is no longer needed either.
  useEffect(() => {
    if (skipFirstSaveRef.current) {
      skipFirstSaveRef.current = false;
      return;
    }
    if (result) return;
    saveDraft(form, step);
  }, [form, step, result]);

  // Let the applicant know their previous answers were restored, the first
  // time they actually open the dialog with a resumed draft in it.
  useEffect(() => {
    if (open && resumedDraft && !resumeAnnouncedRef.current) {
      toast.info(t("Welcome back — we've restored your saved application so you can continue where you left off."));
      resumeAnnouncedRef.current = true;
    }
  }, [open, resumedDraft, t]);

  // Discards the saved draft and starts a completely blank application —
  // offered to applicants who resumed a draft but would rather start over.
  const startOver = () => {
    clearDraft();
    setForm(EMPTY);
    setStep(1);
    setResumedDraft(false);
    toast.success(t("Started a new application."));
  };

  // ── School name autocomplete ──────────────────────────────────────────────
  // Suggests schools already on record, filtered to whatever the applicant
  // has typed so far (matching on the start of the name, per school).
  const [knownSchools, setKnownSchools] = useState<string[]>([]);
  const [schoolSuggestOpen, setSchoolSuggestOpen] = useState(false);
  const schoolFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("bursary_applications" as never)
        .select("school_name");
      if (cancelled || error || !data) return;
      const names = new Set<string>();
      for (const row of data as unknown as { school_name: string | null }[]) {
        if (row.school_name && row.school_name.trim()) names.add(row.school_name.trim());
      }
      setKnownSchools(Array.from(names).sort((a, b) => a.localeCompare(b)));
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (schoolFieldRef.current && !schoolFieldRef.current.contains(e.target as Node)) {
        setSchoolSuggestOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const schoolSuggestions = useMemo(() => {
    const q = form.schoolName.trim().toLowerCase();
    if (!q) return [];
    return knownSchools.filter((s) => s.toLowerCase().startsWith(q)).slice(0, 8);
  }, [form.schoolName, knownSchools]);

  const schoolSubCounties = useMemo(
    () => (form.schoolCounty ? KENYA_COUNTIES[form.schoolCounty] ?? [] : []),
    [form.schoolCounty],
  );

  const validateStep = async (): Promise<boolean> => {
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

  const reset = () => { setForm(EMPTY); setStep(1); setResult(null); setResumedDraft(false); clearDraft(); };

  const submit = async () => {
    if (!form.dataConsent) {
      toast.error("You must agree to the data policy before submitting");
      return;
    }
    setSubmitting(true);
    try {
      // Applicants sometimes type in lower case or mixed case — normalize
      // all free-text fields to capital letters before anything is saved,
      // so official records are always consistent regardless of how the
      // applicant typed them in.
      const upperForm = toUppercaseForm(form);
      const payload = {
        student_name: upperForm.studentName,
        registration_number: upperForm.admissionNumber || null,
        id_or_birth_cert_number: upperForm.birthCertNumber || null,
        dob: upperForm.dob || null,
        current_grade: upperForm.currentGrade,
        gender: upperForm.gender || null,
        father_alive: upperForm.fatherAlive,
        mother_alive: upperForm.motherAlive,
        father_name: upperForm.fatherAlive ? (upperForm.fatherName || null) : null,
        father_phone: upperForm.fatherAlive ? (upperForm.fatherPhone || null) : null,
        father_occupation: upperForm.fatherAlive ? (upperForm.fatherOccupation || null) : null,
        father_national_id: upperForm.fatherAlive ? (upperForm.fatherNationalId || null) : null,
        mother_name: upperForm.motherAlive ? (upperForm.motherName || null) : null,
        mother_phone: upperForm.motherAlive ? (upperForm.motherPhone || null) : null,
        mother_occupation: upperForm.motherAlive ? (upperForm.motherOccupation || null) : null,
        mother_national_id: upperForm.motherAlive ? (upperForm.motherNationalId || null) : null,
        student_disability: upperForm.studentDisability,
        student_disability_detail: upperForm.studentDisabilityDetail || null,
        school_name: upperForm.schoolName,
        school_category: upperForm.schoolCategory,
        school_county: upperForm.schoolCounty,
        school_sub_county: upperForm.schoolSubCounty,
        year_of_admission: upperForm.yearOfAdmission || null,
        student_outstanding: upperForm.studentOutstanding || null,
        school_bank_account: upperForm.schoolBankAccount || null,
        guardian_name: upperForm.guardianName,
        guardian_phone: upperForm.guardianPhone,
        parent_national_id: upperForm.guardianNationalId || null,
        parent_occupation: upperForm.guardianOccupation || null,
        parent_residence_sub_county: upperForm.parentResidenceSubCounty || null,
        ward: upperForm.ward || null,
        polling_station: upperForm.pollingStation || null,
        parent_disability: upperForm.guardianDisability,
        parent_disability_detail: upperForm.guardianDisabilityDetail || null,
        siblings_in_school: upperForm.siblingsInSchool ? Number(upperForm.siblingsInSchool) : 0,
        student_annual_fee: upperForm.studentAnnualFee ? Number(upperForm.studentAnnualFee) : null,
        outstanding_balance: upperForm.outstandingBalance ? Number(upperForm.outstandingBalance) : null,
        monthly_budget: upperForm.monthlyBudget ? Number(upperForm.monthlyBudget) : null,
        amount_requested: upperForm.amountRequested ? Number(upperForm.amountRequested) : 0,
        received_bursary_before: upperForm.receivedBursaryBefore ?? false,
        previous_bursary_source: upperForm.receivedBursaryBefore ? (upperForm.previousBursarySource || null) : null,
        previous_bursary_amount: upperForm.receivedBursaryBefore && upperForm.previousBursaryAmount ? Number(upperForm.previousBursaryAmount) : null,
        reason: upperForm.reason || null,
      };

      // Attach the currently-open term (e.g. "Term 1 - 2026") so this
      // application is grouped with the rest of this term's applications in
      // the admin dashboard. Falls back to the column's DB default if no
      // window/term has been configured yet.
      const currentTerm = await fetchBursaryTerm();
      const payloadWithTerm = currentTerm ? { ...payload, term: currentTerm } : payload;

      // Birth certificate numbers must be unique per student within a term —
      // check up front so the applicant gets a clear message instead of a
      // raw database error, before we even attempt the insert.
      if (currentTerm) {
        const { data: dupe } = await supabase
          .from("bursary_applications" as never)
          .select("student_name")
          .eq("id_or_birth_cert_number", upperForm.birthCertNumber)
          .eq("term", currentTerm)
          .limit(1)
          .maybeSingle();
        if (dupe) {
          const existingName = (dupe as unknown as { student_name: string }).student_name;
          toast.error(
            `This birth certificate number is already registered this term (to ${existingName}). Each student needs their own unique number — please check and try again.`,
          );
          setSubmitting(false);
          return;
        }
      }

      let { data, error } = await supabase
        .from("bursary_applications" as never)
        .insert(payloadWithTerm as never)
        .select("reference")
        .single();

      // Resilience: if Supabase rejects the insert because a column doesn't
      // exist yet (e.g. a field was added to the form before the database
      // migration was run), retry once without the newer optional fields
      // rather than losing the whole application.
      if (error && /column .* does not exist/i.test(error.message)) {
        const { student_annual_fee, outstanding_balance, ...fallbackPayload } = payloadWithTerm as typeof payload & { term?: string };
        const retry = await supabase
          .from("bursary_applications" as never)
          .insert(fallbackPayload as never)
          .select("reference")
          .single();
        data = retry.data;
        error = retry.error;
        if (!error) {
          toast.info("Application saved. Some new fields will sync once the database is updated.");
        }
      }

      if (error) throw error;
      const ref = (data as unknown as { reference: string }).reference;
      setResult({ reference: ref });
      // Keep the (now-uppercased) values in the form so the downloadable PDF
      // below matches exactly what was saved, and drop the saved draft since
      // the application has been successfully submitted.
      setForm(upperForm);
      clearDraft();
      toast.success(`Application submitted — Ref ${ref}`);

      // Add the guardian to the Supporters list — best-effort, never blocks
      // or fails the application submission itself.
      syncGuardianAsSupporter({
        name: upperForm.guardianName,
        phone: upperForm.guardianPhone,
        idNumber: upperForm.guardianNationalId,
        ward: upperForm.ward || null,
      });
    } catch (e) {
      const raw = e instanceof Error ? e.message : "";
      if (/duplicate key|unique constraint|uniq_birth_cert/i.test(raw)) {
        toast.error(
          "This birth certificate number is already registered for another applicant this term. Each student needs their own unique number.",
        );
      } else {
        toast.error(raw || "Failed to submit application");
      }
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
      birth_cert_number: form.birthCertNumber,
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
      student_outstanding_ability: form.studentOutstanding,
      student_annual_fee: form.studentAnnualFee ? Number(form.studentAnnualFee) : 0,
      outstanding_balance: form.outstandingBalance ? Number(form.outstandingBalance) : 0,
      school_name: form.schoolName,
      school_category: form.schoolCategory,
      school_county: form.schoolCounty,
      school_sub_county: form.schoolSubCounty,
      year_of_admission: form.yearOfAdmission,
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
      monthly_budget: form.monthlyBudget ? Number(form.monthlyBudget) : 0,
      amount_requested: form.amountRequested ? Number(form.amountRequested) : 0,
      received_bursary_before: form.receivedBursaryBefore ?? false,
      previous_bursary_source: form.receivedBursaryBefore ? form.previousBursarySource : "",
      previous_bursary_amount: form.receivedBursaryBefore && form.previousBursaryAmount ? Number(form.previousBursaryAmount) : 0,
      reason: form.reason,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        // If the applicant closes the dialog mid-application (without having
        // submitted), keep their answers — both in state and in the saved
        // draft — so reopening the form resumes exactly where they left off.
        // Only reset once an application has actually been submitted.
        if (!o && result) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <GraduationCap className="h-6 w-6 text-gold" />
            {t("Constituency Bursary Application Form")}
          </DialogTitle>
          <DialogDescription>
            {t("Ward Bursary Application Form — Term 2 (2026/2027). Complete all four sections and download your application form to sign and submit at the Moha Coordination Office, Kiamaiko-Mathare.")}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-gold/15 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-gold" />
            </div>
            <h3 className="text-xl font-display font-bold">{t("Application received!")}</h3>
            <p className="text-2xl font-bold tracking-wider text-primary">{result.reference}</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t("Download the pre-filled form, attach the required documents (National ID, birth certificate, fee structure, report form, NCPWD card, etc.), sign, and drop it at the Moha Coordination Office, Kiamaiko-Mathare.")}
            </p>

            {/* Share link */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-left space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5" /> {t("Know someone who needs to apply? Share this link")}
              </p>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={typeof window !== "undefined" ? `${window.location.origin}/foundations` : ""}
                  className="text-xs font-mono bg-background"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    const url = typeof window !== "undefined" ? `${window.location.origin}/foundations` : "";
                    navigator.clipboard.writeText(url).then(() => toast.success("Application link copied!"));
                  }}
                >
                  {t("Copy")}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("Share with friends or family in Mathare who also need bursary support.")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={downloadPdf} variant="hero" className="gap-2">
                <Download className="h-4 w-4" /> {t("Download Application Form (PDF)")}
              </Button>
              <Button onClick={() => setOpen(false)} variant="outline">{t("Close")}</Button>
            </div>
          </div>
        ) : (
          <>
            <Stepper step={step} t={t} />

            {resumedDraft && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
                <span>{t("Continuing your saved application draft.")}</span>
                <button
                  type="button"
                  onClick={startOver}
                  className="shrink-0 font-semibold text-primary hover:underline"
                >
                  {t("Start over")}
                </button>
              </div>
            )}


            {/* ── STEP 1: STUDENT ─────────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <SectionLabel icon={User}>{t("Student's Details")}</SectionLabel>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("Student name *")}>
                    <Input
                      value={form.studentName}
                      onChange={(e) => setLetters("studentName", e.target.value, 120)}
                      placeholder={t("Full legal name")}
                    />
                  </Field>
                  <Field label={t("Admission / Registration number")}>
                    <Input value={form.admissionNumber} onChange={(e) => set("admissionNumber", e.target.value)} placeholder="e.g. ADM/2024/001" />
                  </Field>
                  <Field label={t("Date of birth")}>
                    <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
                  </Field>
                  <Field label={t("Gender")}>
                    <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                      <SelectTrigger><SelectValue placeholder={t("Select")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">{t("Female")}</SelectItem>
                        <SelectItem value="male">{t("Male")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("Grade / Class *")}>
                    <Select value={form.currentGrade} onValueChange={(v) => set("currentGrade", v)}>
                      <SelectTrigger><SelectValue placeholder={t("Select grade")} /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("Birth certificate number *")}>
                    <Input
                      value={form.birthCertNumber}
                      onChange={(e) => setDigits("birthCertNumber", e.target.value, 12)}
                      placeholder={t("As on birth certificate")}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={12}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {t("Numbers only. Must be unique to this student — it cannot already be in use by another applicant this term.")}
                    </p>
                  </Field>
                </div>

                {/* Disability toggle */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="studentDisabilityToggle" className="text-sm font-semibold cursor-pointer">
                      {t("Student lives with a disability")}
                    </Label>
                    <Switch
                      id="studentDisabilityToggle"
                      checked={form.studentDisability}
                      onCheckedChange={(v) => set("studentDisability", v)}
                    />
                  </div>
                  {form.studentDisability && (
                    <Field label={t("Please specify (NCPWD card / nature of disability)")}>
                      <Input value={form.studentDisabilityDetail} onChange={(e) => set("studentDisabilityDetail", e.target.value)} />
                    </Field>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("Student's outstanding ability / achievement")}>
                    <Textarea
                      rows={3}
                      value={form.studentOutstanding}
                      onChange={(e) => set("studentOutstanding", e.target.value)}
                      placeholder={t("Academic performance, talent, conduct…")}
                      maxLength={500}
                    />
                  </Field>
                  <div className="space-y-4">
                    <Field label={t("Student annual fee payable (KSh)")}>
                      <Input type="number" min="0" value={form.studentAnnualFee} onChange={(e) => set("studentAnnualFee", e.target.value)} placeholder="0" />
                    </Field>
                    <Field label={t("Student's outstanding fee balance (KSh)")}>
                      <Input type="number" min="0" value={form.outstandingBalance} onChange={(e) => set("outstandingBalance", e.target.value)} placeholder="0" />
                    </Field>
                    <Field label={t("Amount applying for (KSh)")}>
                      <Input type="number" min="0" value={form.amountRequested} onChange={(e) => set("amountRequested", e.target.value)} placeholder="0" />
                    </Field>
                  </div>
                </div>

                {/* Bursary history — Yes/No checkboxes */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    {t("Have you ever received a Bursary or support from Moha Foundation or any other public source in the last 6 months?")}
                  </p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <Checkbox
                        checked={form.receivedBursaryBefore === true}
                        onCheckedChange={() => set("receivedBursaryBefore", true)}
                      />
                      {t("Yes")}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <Checkbox
                        checked={form.receivedBursaryBefore === false}
                        onCheckedChange={() => set("receivedBursaryBefore", false)}
                      />
                      {t("No")}
                    </label>
                  </div>
                  {form.receivedBursaryBefore === true && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                      <Field label={t("If yes, state the source (e.g. Moha Foundation, NG-CDF, Equity Wings)")}>
                        <Input value={form.previousBursarySource} onChange={(e) => set("previousBursarySource", e.target.value)} />
                      </Field>
                      <Field label={t("Amount received (KSh)")}>
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
                <SectionLabel icon={School}>{t("School's Details")}</SectionLabel>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("School name *")}>
                    <div ref={schoolFieldRef} className="relative">
                      <Input
                        value={form.schoolName}
                        onChange={(e) => { set("schoolName", e.target.value); setSchoolSuggestOpen(true); }}
                        onFocus={() => setSchoolSuggestOpen(true)}
                        placeholder={t("Start typing to search existing schools…")}
                        autoComplete="off"
                      />
                      {schoolSuggestOpen && schoolSuggestions.length > 0 && (
                        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg">
                          {schoolSuggestions.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => { set("schoolName", s); setSchoolSuggestOpen(false); }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted/60 truncate"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                  <Field label={t("School category *")}>
                    <Select value={form.schoolCategory} onValueChange={(v) => set("schoolCategory", v)}>
                      <SelectTrigger><SelectValue placeholder={t("Select category")} /></SelectTrigger>
                      <SelectContent>
                        {SCHOOL_CATEGORIES.map((c) => (
                          <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("County *")}>
                    <Select
                      value={form.schoolCounty}
                      onValueChange={(v) => { set("schoolCounty", v); set("schoolSubCounty", ""); }}
                    >
                      <SelectTrigger><SelectValue placeholder={t("Select county")} /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {COUNTY_NAMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("Sub-county *")}>
                    <Select
                      value={form.schoolSubCounty}
                      onValueChange={(v) => set("schoolSubCounty", v)}
                      disabled={!form.schoolCounty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={form.schoolCounty ? t("Select sub-county") : t("Pick county first")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {schoolSubCounties.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("Year of admission")}>
                    <Input value={form.yearOfAdmission} onChange={(e) => set("yearOfAdmission", e.target.value)} placeholder="e.g. 2024" />
                  </Field>
                  <Field label={t("School bank account")}>
                    <Input value={form.schoolBankAccount} onChange={(e) => set("schoolBankAccount", e.target.value)} placeholder="Bank · Branch · A/C No." />
                  </Field>
                </div>
              </div>
            )}

            {/* ── STEP 3: PARENT / GUARDIAN ───────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <SectionLabel icon={Users}>{t("Parent / Guardian's Details")}</SectionLabel>

                {/* Parent alive flags */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("Parents — alive / deceased")}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <CheckboxRow label={t("Father alive")} checked={form.fatherAlive} onChange={(v) => set("fatherAlive", v)} />
                    <CheckboxRow label={t("Mother alive")} checked={form.motherAlive} onChange={(v) => set("motherAlive", v)} />
                  </div>
                </div>

                {/* Father */}
                {form.fatherAlive && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Father's Details")}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label={t("Name")}><Input value={form.fatherName} onChange={(e) => setLetters("fatherName", e.target.value, 120)} /></Field>
                      <Field label={t("Phone contact")}>
                        <Input
                          value={form.fatherPhone}
                          onChange={(e) => setDigits("fatherPhone", e.target.value, PHONE_MAX_LEN)}
                          placeholder="07XX XXX XXX"
                          inputMode="tel"
                          maxLength={PHONE_MAX_LEN}
                        />
                      </Field>
                      <Field label={t("National ID")}>
                        <Input
                          value={form.fatherNationalId}
                          onChange={(e) => setDigits("fatherNationalId", e.target.value, 10)}
                          inputMode="numeric"
                        />
                      </Field>
                      <Field label={t("Occupation")}><Input value={form.fatherOccupation} onChange={(e) => set("fatherOccupation", e.target.value)} /></Field>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Label className="text-sm font-semibold cursor-pointer">{t("Father lives with a disability")}</Label>
                      <Switch checked={form.fatherDisability} onCheckedChange={(v) => set("fatherDisability", v)} />
                    </div>
                    {form.fatherDisability && (
                      <Field label={t("Please specify")}><Input value={form.fatherDisabilityDetail} onChange={(e) => set("fatherDisabilityDetail", e.target.value)} /></Field>
                    )}
                  </div>
                )}

                {/* Mother */}
                {form.motherAlive && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Mother's Details")}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label={t("Name")}><Input value={form.motherName} onChange={(e) => setLetters("motherName", e.target.value, 120)} /></Field>
                      <Field label={t("Phone contact")}>
                        <Input
                          value={form.motherPhone}
                          onChange={(e) => setDigits("motherPhone", e.target.value, PHONE_MAX_LEN)}
                          placeholder="07XX XXX XXX"
                          inputMode="tel"
                          maxLength={PHONE_MAX_LEN}
                        />
                      </Field>
                      <Field label={t("National ID")}>
                        <Input
                          value={form.motherNationalId}
                          onChange={(e) => setDigits("motherNationalId", e.target.value, 10)}
                          inputMode="numeric"
                        />
                      </Field>
                      <Field label={t("Occupation")}><Input value={form.motherOccupation} onChange={(e) => set("motherOccupation", e.target.value)} /></Field>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Label className="text-sm font-semibold cursor-pointer">{t("Mother lives with a disability")}</Label>
                      <Switch checked={form.motherDisability} onCheckedChange={(v) => set("motherDisability", v)} />
                    </div>
                    {form.motherDisability && (
                      <Field label={t("Please specify")}><Input value={form.motherDisabilityDetail} onChange={(e) => set("motherDisabilityDetail", e.target.value)} /></Field>
                    )}
                  </div>
                )}

                {/* Guardian */}
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("Primary Contactable Parent / Guardian")} <span className="text-[10px] normal-case text-muted-foreground">(The parent or guardian who can be reached for communication)</span>
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t("Name *")}><Input value={form.guardianName} onChange={(e) => setLetters("guardianName", e.target.value, 120)} placeholder="Full name" /></Field>
                    <Field label={t("Phone contact *")}>
                      <Input
                        value={form.guardianPhone}
                        onChange={(e) => setDigits("guardianPhone", e.target.value, PHONE_MAX_LEN)}
                        placeholder="07XX XXX XXX"
                        inputMode="tel"
                        maxLength={PHONE_MAX_LEN}
                      />
                    </Field>
                    <Field label={t("National ID")}>
                      <Input
                        value={form.guardianNationalId}
                        onChange={(e) => setDigits("guardianNationalId", e.target.value, 10)}
                        inputMode="numeric"
                      />
                    </Field>
                    <Field label={t("Occupation")}><Input value={form.guardianOccupation} onChange={(e) => set("guardianOccupation", e.target.value)} /></Field>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Label className="text-sm font-semibold cursor-pointer">{t("Guardian lives with a disability")}</Label>
                    <Switch checked={form.guardianDisability} onCheckedChange={(v) => set("guardianDisability", v)} />
                  </div>
                  {form.guardianDisability && (
                    <Field label={t("Please specify")}><Input value={form.guardianDisabilityDetail} onChange={(e) => set("guardianDisabilityDetail", e.target.value)} /></Field>
                  )}
                </div>

                {/* Household & Residence */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("Residential sub-county")}>
                    <Input value={form.parentResidenceSubCounty} onChange={(e) => set("parentResidenceSubCounty", e.target.value)} />
                  </Field>
                  <Field label={t("Ward")}>
                    <Select value={form.ward} onValueChange={(v) => set("ward", v)}>
                      <SelectTrigger><SelectValue placeholder={t("Select your Ward")} /></SelectTrigger>
                      <SelectContent>
                        {MATHARE_WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t("Polling station")}>
                    <Input value={form.pollingStation} onChange={(e) => set("pollingStation", e.target.value)} />
                  </Field>
                  <Field label={t("Number of children in school / University")}>
                    <Input type="number" min="0" value={form.siblingsInSchool} onChange={(e) => set("siblingsInSchool", e.target.value)} placeholder="0" />
                  </Field>
                  <Field label={t("Monthly budget (KSh)")}>
                    <Input type="number" min="0" value={form.monthlyBudget} onChange={(e) => set("monthlyBudget", e.target.value)} placeholder="0" />
                  </Field>
                </div>

                <Field label={t("Brief description of reason for application")}>
                  <Textarea
                    rows={4}
                    maxLength={1000}
                    value={form.reason}
                    onChange={(e) => set("reason", e.target.value)}
                    placeholder={t("Tell us briefly why you need support…")}
                  />
                </Field>
              </div>
            )}

            {/* ── STEP 4: REVIEW & CONSENT ─────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-4">
                <SectionLabel icon={ShieldCheck}>{t("Review & Data Consent")}</SectionLabel>

                <div className="space-y-1.5 text-sm">
                  <Row label={t("Student")} value={`${form.studentName} · ${form.currentGrade}`} />
                  <Row label={t("Admission No.")} value={form.admissionNumber} />
                  <Row label={t("Birth Cert No.")} value={form.birthCertNumber} />
                  <Row label={t("School")} value={`${form.schoolName} (${form.schoolCategory || "—"})`} />
                  <Row label={t("School location")} value={`${form.schoolCounty || "—"} / ${form.schoolSubCounty || "—"}`} />
                  <Row label={t("Annual fee")} value={form.studentAnnualFee ? `KSh ${Number(form.studentAnnualFee).toLocaleString()}` : "—"} />
                  <Row label={t("Outstanding balance")} value={form.outstandingBalance ? `KSh ${Number(form.outstandingBalance).toLocaleString()}` : "—"} />
                  <Row label={t("Amount requested")} value={form.amountRequested ? `KSh ${Number(form.amountRequested).toLocaleString()}` : "—"} />
                  <Row label={t("Guardian")} value={`${form.guardianName} · ${form.guardianPhone}`} />
                  <Row label={t("Ward / Polling")} value={`${form.ward || "—"} · ${form.pollingStation || "—"}`} />
                  <Row label={t("Children in school")} value={form.siblingsInSchool || "0"} />
                  <Row label={t("Monthly budget")} value={form.monthlyBudget ? `KSh ${Number(form.monthlyBudget).toLocaleString()}` : "—"} />
                  <Row label={t("Previous bursary")} value={form.receivedBursaryBefore === null ? t("Not answered") : form.receivedBursaryBefore ? `${t("Yes")} — ${form.previousBursarySource || "—"} (KSh ${Number(form.previousBursaryAmount || 0).toLocaleString()})` : t("No")} />
                </div>

                {/* Data Policy / Consent */}
                <div className="rounded-xl border-2 border-gold/40 bg-gold/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="h-5 w-5 text-gold shrink-0" />
                    <h4 className="font-display font-bold text-base text-foreground">{t("Data Policy & Consent")}</h4>
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
                      the Moha Coordination Office, Kiamaiko-Mathare or via <em>hello@mohadelivers.com</em>.
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
                      {t("I have read and understood the data policy above. I consent to the collection and use of my personal information for bursary application processing purposes. *")}
                    </span>
                  </label>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
                  <ArrowLeft className="h-4 w-4" /> {t("Back")}
                </Button>
              )}
              {step < 4 ? (
                <Button variant="hero" onClick={async () => { if (await validateStep()) setStep((s) => s + 1); }}>
                  {t("Next")} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="hero" onClick={submit} disabled={submitting || !form.dataConsent}>
                  {submitting ? t("Submitting…") : t("Submit Application")}
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

function Stepper({ step, t }: { step: number; t: (s: string) => string }) {
  const labels = [t("Student"), t("School"), t("Guardian"), t("Review")];
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