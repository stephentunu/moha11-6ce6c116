import { useState, type ReactNode } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { TERM_NAMES, buildTermLabel } from "@/lib/admin-store";
import { generateBursaryPdf } from "@/lib/bursary-pdf";

// Minimal shape of what we read back from Supabase — just what's needed to
// regenerate the same downloadable PDF the applicant already filled in.
type PreviousApplicationRow = {
  reference: string;
  term: string;
  student_name: string;
  registration_number: string | null;
  id_or_birth_cert_number: string | null;
  dob: string | null;
  gender: string | null;
  current_grade: string;
  father_alive: boolean | null;
  mother_alive: boolean | null;
  father_name: string | null;
  father_phone: string | null;
  father_occupation: string | null;
  father_national_id: string | null;
  mother_name: string | null;
  mother_phone: string | null;
  mother_occupation: string | null;
  mother_national_id: string | null;
  student_disability: boolean | null;
  student_disability_detail: string | null;
  student_outstanding: string | null;
  student_annual_fee: number | null;
  outstanding_balance: number | null;
  school_name: string;
  school_category: string | null;
  school_county: string | null;
  school_sub_county: string | null;
  year_of_admission: string | null;
  school_bank_account: string | null;
  guardian_name: string;
  guardian_phone: string;
  parent_national_id: string | null;
  parent_occupation: string | null;
  parent_residence_sub_county: string | null;
  ward: string | null;
  polling_station: string | null;
  parent_disability: boolean | null;
  parent_disability_detail: string | null;
  siblings_in_school: number | null;
  monthly_budget: number | null;
  amount_requested: number | null;
  received_bursary_before: boolean | null;
  previous_bursary_source: string | null;
  previous_bursary_amount: number | null;
  reason: string | null;
};

// A handful of recent years is plenty — this is just for redownloading a
// form that was already submitted, not for picking a future term.
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2];

export function PreviousApplicationDialog({ trigger }: { trigger: ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [birthCert, setBirthCert] = useState("");
  const [termName, setTermName] = useState<string>(TERM_NAMES[1]);
  const [year, setYear] = useState<string>(String(currentYear));
  const [searching, setSearching] = useState(false);

  const reset = () => {
    setBirthCert("");
    setTermName(TERM_NAMES[1]);
    setYear(String(currentYear));
  };

  const findAndDownload = async () => {
    const cert = birthCert.trim();
    if (!cert) {
      toast.error(t("Please enter the student's birth certificate number."));
      return;
    }
    const term = buildTermLabel(termName, year);

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("bursary_applications" as never)
        .select("*")
        .eq("id_or_birth_cert_number", cert)
        .eq("term", term)
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error(t("Application not available"), {
          description: t(`No application was found for that birth certificate number in ${term}. Please double-check the number and term, or contact the Moha Coordination Office if you believe this is a mistake.`),
          duration: 15_000,
        });
        return;
      }

      const r = data as unknown as PreviousApplicationRow;
      generateBursaryPdf({
        reference: r.reference,
        term: r.term,
        student_name: r.student_name,
        registration_number: r.registration_number,
        dob: r.dob,
        gender: r.gender,
        current_grade: r.current_grade,
        birth_cert_number: r.id_or_birth_cert_number,
        father_alive: r.father_alive,
        mother_alive: r.mother_alive,
        father_name: r.father_name,
        father_phone: r.father_phone,
        father_occupation: r.father_occupation,
        father_national_id: r.father_national_id,
        mother_name: r.mother_name,
        mother_phone: r.mother_phone,
        mother_occupation: r.mother_occupation,
        mother_national_id: r.mother_national_id,
        student_disability: r.student_disability,
        student_disability_detail: r.student_disability_detail,
        student_outstanding_ability: r.student_outstanding,
        student_annual_fee: r.student_annual_fee,
        outstanding_balance: r.outstanding_balance,
        school_name: r.school_name,
        school_category: r.school_category,
        school_county: r.school_county,
        school_sub_county: r.school_sub_county,
        year_of_admission: r.year_of_admission,
        school_bank_account: r.school_bank_account,
        guardian_name: r.guardian_name,
        guardian_phone: r.guardian_phone,
        parent_national_id: r.parent_national_id,
        parent_occupation: r.parent_occupation,
        parent_residence_sub_county: r.parent_residence_sub_county,
        ward: r.ward,
        polling_station: r.polling_station,
        parent_disability: r.parent_disability,
        parent_disability_detail: r.parent_disability_detail,
        siblings_in_school: r.siblings_in_school,
        monthly_budget: r.monthly_budget,
        amount_requested: r.amount_requested,
        received_bursary_before: r.received_bursary_before,
        previous_bursary_source: r.previous_bursary_source,
        previous_bursary_amount: r.previous_bursary_amount,
        reason: r.reason,
      });
      toast.success(t("Your application form has been downloaded."));
      setOpen(false);
      reset();
    } catch {
      toast.error(t("Something went wrong while looking up your application. Please try again."));
    } finally {
      setSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gold" />
            {t("Redownload a Previous Application")}
          </DialogTitle>
          <DialogDescription>
            {t("Already applied but lost your downloaded form? Enter the student's birth certificate number and the term you applied for, and we'll regenerate it for you.")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="prev-app-birth-cert">{t("Student's Birth Certificate Number")}</Label>
            <Input
              id="prev-app-birth-cert"
              value={birthCert}
              onChange={(e) => setBirthCert(e.target.value.replace(/\D/g, "").slice(0, 20))}
              placeholder={t("Enter birth certificate number")}
              inputMode="numeric"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prev-app-term">{t("Term")}</Label>
              <Select value={termName} onValueChange={setTermName}>
                <SelectTrigger id="prev-app-term" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TERM_NAMES.map((tn) => (
                    <SelectItem key={tn} value={tn}>{t(tn)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prev-app-year">{t("Year")}</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="prev-app-year" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{t("Cancel")}</Button>
          <Button variant="hero" onClick={findAndDownload} disabled={searching} className="gap-2">
            <Download className="h-4 w-4" />
            {searching ? t("Searching…") : t("Find & Download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}