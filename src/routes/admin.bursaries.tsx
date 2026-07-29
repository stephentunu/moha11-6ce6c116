import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  GraduationCap, Send, Eye, Trash2, Download, Search,
  FileSpreadsheet, CheckCircle2, School, ArrowUpDown,
  ChevronDown, ChevronRight, Users, Banknote,
  CheckSquare, X, Mail, FileText, Calendar,
  MapPin, Pencil, ArrowLeft, XCircle, Clock3, UserPlus,
  Archive, ArchiveRestore, History, CalendarClock,
} from "lucide-react";
import { generateBursaryPdf, generateBroadsheetPdf, generateBroadsheetExcel, generateWardListExcel, generateConfirmationLetter, type BroadsheetRow, type BursaryPdfData, type ConfirmationLetterRow } from "@/lib/bursary-pdf";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { sendBursarySms } from "@/lib/bursary.functions";
import { cn } from "@/lib/utils";
import { MATHARE_WARDS, useBursaryTerm, fetchArchivedSchools, archiveSchools, unarchiveSchools, fetchGeneratedLetterSchools, markLetterGenerated, unmarkLetterGenerated, parseTermLabel } from "@/lib/admin-store";
import { COUNTY_NAMES, KENYA_COUNTIES } from "@/lib/kenya-counties";
import { BursaryApplicationDialog } from "@/components/BursaryApplicationDialog";

export const Route = createFileRoute("/admin/bursaries")({
  head: () => ({
    meta: [
      { title: "Bursary Applications — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminBursariesPage,
});

type Row = {
  id: string;
  reference: string;
  term: string;
  student_name: string;
  registration_number: string | null;
  id_or_birth_cert_number: string | null;
  dob: string | null;
  gender: string | null;
  phone: string | null;
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
  school_name: string;
  canonical_school_name: string | null;
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
  student_annual_fee: number | null;
  outstanding_balance: number | null;
  monthly_budget: number | null;
  amount_requested: number | null;
  received_bursary_before: boolean | null;
  previous_bursary_source: string | null;
  previous_bursary_amount: number | null;
  reason: string | null;
  status: string;
  admin_notes: string | null;
  sms_last_sent_at: string | null;
  sms_last_message: string | null;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  reviewing: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  approved:  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  rejected:  "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

/**
 * The school name actually used everywhere in the UI, broadsheet, and
 * letters. Applicants type their school freely on the form, which means the
 * same real school can show up under several spellings — e.g. "Kanga
 * School", "Kanga High School", "Kanga Boys". An admin can set a single
 * `canonical_school_name` on any one application from that school to fix
 * this; once set, it takes priority over the raw applicant-entered name.
 */
function effectiveSchoolName(r: Row): string {
  return (r.canonical_school_name?.trim() || r.school_name || "").trim().toUpperCase();
}

// Strips everything but digits — used for amount fields so entries are
// always whole numbers (no decimals) and, since the input stays a plain
// text field rather than type="number", there are no up/down spinner
// arrows to accidentally bump the value by ±1/±500.
function digitsOnly(value: string, maxLen = 9): string {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

type Tab = "applications" | "review" | "broadsheet" | "letters" | "schools";
type SortField = "student_name" | "school_name" | "ward" | "amount_requested" | "current_grade";

function AdminBursariesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<Tab>("applications");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  // Row whose "Application History" dialog is open, launched directly from
  // the applications list (separate from the full detail/edit dialog above).
  const [historyRow, setHistoryRow] = useState<Row | null>(null);
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsTarget, setSmsTarget] = useState<Row | null>(null);
  const [smsText, setSmsText] = useState("");
  const [smsBusy, setSmsBusy] = useState(false);
  // Broadsheet controls
  const [bsSort, setBsSort] = useState<SortField>("school_name");
  const [bsOrder, setBsOrder] = useState<"asc" | "desc">("asc");
  const [bsExpanded, setBsExpanded] = useState<Set<string>>(new Set());
  // Bulk selection
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  // Applications tab — Ward / School quick filters, picked from a dropdown
  // opened by clicking the "Ward" / "School / Grade" column headers. Selecting
  // a ward or school narrows the table straight down to its students (no
  // intermediate browsing step); both filters can be combined, and each
  // clears independently.
  const [appsWard, setAppsWard] = useState<string | null>(null);
  const [appsSchool, setAppsSchool] = useState<string | null>(null);

  // Term window — which term's applications are currently being viewed.
  // "current" tracks whatever term is open right now (per site_settings);
  // any other value pins the view to that specific past term.
  const { term: currentTerm } = useBursaryTerm();
  const [termView, setTermView] = useState<string>("current");
  const effectiveTerm = termView === "current" ? currentTerm : termView;

  // Archived schools — hidden from the active school pickers (Review by
  // Location, Confirmation Letters) until unarchived. Loaded once and kept
  // in sync locally when the admin archives/unarchives from the Schools tab.
  const [archivedSchools, setArchivedSchools] = useState<Set<string>>(new Set());
  const [showArchivedInPickers, setShowArchivedInPickers] = useState(false);

  // Schools that already had their confirmation letter downloaded for a given
  // term — keyed as "school||term". Drops them off the active Confirmation
  // Letters picker for that term until restored (see Schools tab).
  const [letterGeneratedSet, setLetterGeneratedSet] = useState<Set<string>>(new Set());
  const [showSentInLetters, setShowSentInLetters] = useState(false);

  // Students hidden (excluded) from the confirmation letter currently being
  // prepared — cleared whenever a different school is selected. Lets an
  // admin uncheck a student before downloading, then re-check (unhide) them
  // again before the letter actually goes out.
  const [letterHiddenIds, setLetterHiddenIds] = useState<Set<string>>(new Set());

  // Schools tab — manage the school directory: archive/unarchive a single
  // school or all schools at once.
  const [schoolsSearch, setSchoolsSearch] = useState("");
  const [checkedSchools, setCheckedSchools] = useState<Set<string>>(new Set());
  const [schoolsShowArchivedOnly, setSchoolsShowArchivedOnly] = useState<"active" | "archived" | "all">("active");
  const [schoolsBusy, setSchoolsBusy] = useState(false);

  // School Confirmation Letter tab
  const [letterSchoolSearch, setLetterSchoolSearch] = useState("");
  const [letterSelectedSchool, setLetterSelectedSchool] = useState<string | null>(null);
  const [letterChequeNumber, setLetterChequeNumber] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [letterOfficerName, setLetterOfficerName] = useState("Nancy Otieno");
  const [letterOfficerPhone, setLetterOfficerPhone] = useState("0728827978");
  const [letterTerm, setLetterTerm] = useState(`${new Date().getFullYear()} T2`);
  const [letterTermTouched, setLetterTermTouched] = useState(false);

  // Review by Location tab — County → Sub-county → School → Students drill-down
  const [reviewCounty, setReviewCounty] = useState<string | null>(null);
  const [reviewSubCounty, setReviewSubCounty] = useState<string | null>(null);
  const [reviewSchool, setReviewSchool] = useState<string | null>(null);
  const [renameSchoolOpen, setRenameSchoolOpen] = useState(false);
  const [renameSchoolDraft, setRenameSchoolDraft] = useState("");
  const [renameSubCountyDraft, setRenameSubCountyDraft] = useState("");
  const [renameCountyDraft, setRenameCountyDraft] = useState("");
  const [renameSchoolBusy, setRenameSchoolBusy] = useState(false);

  // Inline amount editing in Review by Location
  const [editAmountId, setEditAmountId] = useState<string | null>(null);
  const [editAmountValue, setEditAmountValue] = useState("");
  const [editAmountBusy, setEditAmountBusy] = useState(false);

  // Application Details Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    student_name: "",
    registration_number: "",
    school_name: "",
    canonical_school_name: "",
    school_category: "",
    school_county: "",
    school_sub_county: "",
    ward: "",
    amount_requested: "",
    status: "",
  });
  const [editBusy, setEditBusy] = useState(false);

  useEffect(() => {
    if (currentTerm && !letterTermTouched) setLetterTerm(currentTerm);
  }, [currentTerm, letterTermTouched]);

  const load = async () => {
    const { data, error } = await supabase
      .from("bursary_applications" as never)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data as unknown as Row[]) || []);
  };

  const loadArchivedSchools = async () => {
    setArchivedSchools(await fetchArchivedSchools());
  };

  const loadGeneratedLetters = async () => {
    setLetterGeneratedSet(await fetchGeneratedLetterSchools());
  };

  useEffect(() => {
    load();
    loadArchivedSchools();
    loadGeneratedLetters();
    const ch = supabase
      .channel("bursary-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bursary_applications" }, () => load())
      .subscribe();
    const archCh = supabase
      .channel("archived-schools-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "archived_schools" }, () => loadArchivedSchools())
      .subscribe();
    const letterCh = supabase
      .channel("school-letters-generated-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "school_letters_generated" }, () => loadGeneratedLetters())
      .subscribe();
    return () => { supabase.removeChannel(ch); supabase.removeChannel(archCh); supabase.removeChannel(letterCh); };
  }, []);


  // ── Term-scoped rows — everything below (except Application History, which
  // intentionally looks across ALL terms) is derived from this instead of
  // the raw `rows`, so switching the Term filter re-scopes the whole page. ──
  const activeRows = useMemo(() => {
    if (!effectiveTerm) return rows; // no term configured yet — show everything
    return rows.filter((r) => (r.term || "") === effectiveTerm);
  }, [rows, effectiveTerm]);

  const distinctTerms = useMemo(() => {
    const terms = new Set<string>();
    for (const r of rows) if (r.term) terms.add(r.term);
    if (currentTerm) terms.add(currentTerm);
    return Array.from(terms).sort().reverse();
  }, [rows, currentTerm]);

  // ── Filtered list (Applications tab) ────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeRows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.student_name.toLowerCase().includes(q) ||
        (r.school_name || "").toLowerCase().includes(q) ||
        (r.canonical_school_name || "").toLowerCase().includes(q) ||
        (r.ward || "").toLowerCase().includes(q) ||
        (r.reference || "").toLowerCase().includes(q) ||
        (r.guardian_name || "").toLowerCase().includes(q) ||
        (r.school_county || "").toLowerCase().includes(q) ||
        (r.school_sub_county || "").toLowerCase().includes(q)
      );
    });
  }, [activeRows, filter, search]);
  const approvedRows = useMemo(() => {
    const approved = activeRows.filter((r) => r.status === "approved");
    return [...approved].sort((a, b) => {
      let va: string | number = a[bsSort] ?? "";
      let vb: string | number = b[bsSort] ?? "";
      if (bsSort === "amount_requested") {
        va = Number(va); vb = Number(vb);
        return bsOrder === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
      }
      va = String(va).toLowerCase(); vb = String(vb).toLowerCase();
      const cmp = (va as string).localeCompare(vb as string);
      return bsOrder === "asc" ? cmp : -cmp;
    });
  }, [activeRows, bsSort, bsOrder]);

  // Group approved by school (already sorted by school then name within each group)
  const bySchool = useMemo(() => {
    const base = [...approvedRows].sort(
      (a, b) => effectiveSchoolName(a).localeCompare(effectiveSchoolName(b)) || a.student_name.localeCompare(b.student_name)
    );
    const map = new Map<string, Row[]>();
    for (const r of base) {
      const key = effectiveSchoolName(r);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return map;
  }, [approvedRows]);

  const grandTotal = useMemo(
    () => approvedRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0),
    [approvedRows]
  );

  // Schools available for confirmation letters (only schools with at least
  // one APPROVED applicant — this is what gets confirmed and sent for cheque
  // distribution).
  const letterSchoolList = useMemo(() => {
    const q = letterSchoolSearch.trim().toLowerCase();
    return Array.from(bySchool.entries())
      .map(([school, schoolRows]) => ({
        school,
        count: schoolRows.length,
        total: schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0),
        category: schoolRows[0]?.school_category ?? null,
        archived: archivedSchools.has(school),
        letterSent: effectiveTerm ? letterGeneratedSet.has(`${school}||${effectiveTerm}`) : false,
      }))
      .filter((s) => showArchivedInPickers || !s.archived)
      .filter((s) => showSentInLetters || !s.letterSent)
      .filter((s) => !q || s.school.toLowerCase().includes(q))
      .sort((a, b) => a.school.localeCompare(b.school));
  }, [bySchool, letterSchoolSearch, archivedSchools, showArchivedInPickers, letterGeneratedSet, effectiveTerm, showSentInLetters]);

  const letterSelectedRows = useMemo(
    () => (letterSelectedSchool ? bySchool.get(letterSelectedSchool) ?? [] : []),
    [bySchool, letterSelectedSchool]
  );

  // The subset of letterSelectedRows actually going into the letter — a
  // student can be unchecked (hidden) from here before download, and
  // re-checked (unhidden) again right up until the letter is generated.
  const letterVisibleRows = useMemo(
    () => letterSelectedRows.filter((r) => !letterHiddenIds.has(r.id)),
    [letterSelectedRows, letterHiddenIds]
  );

  const letterSelectedTotal = useMemo(
    () => letterVisibleRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0),
    [letterVisibleRows]
  );

  const toggleLetterStudentHidden = (id: string) =>
    setLetterHiddenIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  // ── Review by Location: County → Sub-county → School → Students ────────────
  // Built from ALL applications (not just approved) since this is the
  // primary place admins triage pending/reviewing applications. Counties and
  // sub-counties come from the application form's standardized dropdown, so
  // they're already consistent. School names go through effectiveSchoolName()
  // so a canonical rename merges variant spellings immediately.

  const reviewCounties = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of activeRows) {
      const key = (r.school_county || "Unspecified").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries())
      .map(([county, countyRows]) => ({
        county,
        count: countyRows.length,
        pending: countyRows.filter((r) => r.status === "pending").length,
      }))
      .sort((a, b) => a.county.localeCompare(b.county));
  }, [activeRows]);

  const reviewSubCounties = useMemo(() => {
    if (!reviewCounty) return [];
    const inCounty = activeRows.filter((r) => (r.school_county || "Unspecified").trim() === reviewCounty);
    const map = new Map<string, Row[]>();
    for (const r of inCounty) {
      const key = (r.school_sub_county || "Unspecified").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries())
      .map(([subCounty, subRows]) => ({
        subCounty,
        count: subRows.length,
        pending: subRows.filter((r) => r.status === "pending").length,
      }))
      .sort((a, b) => a.subCounty.localeCompare(b.subCounty));
  }, [activeRows, reviewCounty]);

  const reviewSchools = useMemo(() => {
    if (!reviewCounty || !reviewSubCounty) return [];
    const inLocation = activeRows.filter(
      (r) =>
        (r.school_county || "Unspecified").trim() === reviewCounty &&
        (r.school_sub_county || "Unspecified").trim() === reviewSubCounty,
    );
    const map = new Map<string, Row[]>();
    for (const r of inLocation) {
      const key = effectiveSchoolName(r) || "Unspecified School";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries())
      .map(([school, schoolRows]) => ({
        school,
        count: schoolRows.length,
        pending: schoolRows.filter((r) => r.status === "pending").length,
        category: schoolRows[0]?.school_category ?? null,
        archived: archivedSchools.has(school),
      }))
      .filter((s) => showArchivedInPickers || !s.archived)
      .sort((a, b) => a.school.localeCompare(b.school));
  }, [activeRows, reviewCounty, reviewSubCounty, archivedSchools, showArchivedInPickers]);

  const reviewStudents = useMemo(() => {
    if (!reviewCounty || !reviewSubCounty || !reviewSchool) return [];
    return activeRows
      .filter(
        (r) =>
          (r.school_county || "Unspecified").trim() === reviewCounty &&
          (r.school_sub_county || "Unspecified").trim() === reviewSubCounty &&
          (effectiveSchoolName(r) || "Unspecified School") === reviewSchool,
      )
      .sort((a, b) => a.student_name.localeCompare(b.student_name));
  }, [activeRows, reviewCounty, reviewSubCounty, reviewSchool]);

  // Variant raw spellings feeding into the currently-selected canonical school
  // name — shown to the admin so they can see exactly what they're merging.
  const reviewSchoolVariants = useMemo(() => {
    const variants = new Set(reviewStudents.map((r) => r.school_name.trim()).filter(Boolean));
    return Array.from(variants);
  }, [reviewStudents]);

  const counts = useMemo(() => {
    const c = { all: activeRows.length, pending: 0, reviewing: 0, approved: 0, rejected: 0 };
    for (const r of activeRows) (c as Record<string, number>)[r.status] = ((c as Record<string, number>)[r.status] ?? 0) + 1;
    return c;
  }, [activeRows]);

  const allSchoolNames = useMemo(() => {
    const names = new Set<string>();
    for (const r of activeRows) {
      const name = effectiveSchoolName(r);
      if (name) names.add(name);
    }
    return Array.from(names).sort();
  }, [activeRows]);

  const allSubCounties = useMemo(() => {
    const names = new Set<string>();
    for (const r of activeRows) {
      if (r.school_sub_county) names.add(r.school_sub_county.trim().toUpperCase());
    }
    return Array.from(names).sort();
  }, [activeRows]);

  const allCounties = useMemo(() => {
    const names = new Set<string>();
    for (const r of activeRows) {
      if (r.school_county) names.add(r.school_county.trim().toUpperCase());
    }
    return Array.from(names).sort();
  }, [activeRows]);

  // ── Schools directory (Schools tab) — built from ALL terms, not just the
  // currently-viewed term, so an admin can archive/unarchive a school
  // regardless of which term is currently selected. ──────────────────────────
  const schoolsDirectory = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of rows) {
      const key = effectiveSchoolName(r);
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    const q = schoolsSearch.trim().toLowerCase();
    return Array.from(map.entries())
      .map(([school, schoolRows]) => ({
        school,
        count: schoolRows.length,
        pending: schoolRows.filter((r) => r.status === "pending").length,
        county: schoolRows[0]?.school_county ?? null,
        subCounty: schoolRows[0]?.school_sub_county ?? null,
        category: schoolRows[0]?.school_category ?? null,
        archived: archivedSchools.has(school),
        letterSent: effectiveTerm ? letterGeneratedSet.has(`${school}||${effectiveTerm}`) : false,
      }))
      .filter((s) => !q || s.school.toLowerCase().includes(q))
      .filter((s) => {
        if (schoolsShowArchivedOnly === "active") return !s.archived;
        if (schoolsShowArchivedOnly === "archived") return s.archived;
        return true;
      })
      .sort((a, b) => a.school.localeCompare(b.school));
  }, [rows, schoolsSearch, archivedSchools, schoolsShowArchivedOnly, letterGeneratedSet, effectiveTerm]);

  const schoolsFilteredNames = schoolsDirectory.map((s) => s.school);
  const allSchoolsChecked = schoolsFilteredNames.length > 0 && schoolsFilteredNames.every((n) => checkedSchools.has(n));

  const toggleOneSchool = (name: string) =>
    setCheckedSchools((prev) => { const next = new Set(prev); next.has(name) ? next.delete(name) : next.add(name); return next; });

  const toggleAllSchools = () => {
    if (allSchoolsChecked) {
      setCheckedSchools((prev) => { const next = new Set(prev); schoolsFilteredNames.forEach((n) => next.delete(n)); return next; });
    } else {
      setCheckedSchools((prev) => { const next = new Set(prev); schoolsFilteredNames.forEach((n) => next.add(n)); return next; });
    }
  };

  const clearCheckedSchools = () => setCheckedSchools(new Set());

  /**
   * Archive or unarchive either a single school (pass just its name) or the
   * whole current selection at once — this is the "select a single school or
   * all schools at once" bulk archive/unarchive action.
   */
  const runSchoolArchiveAction = async (names: string[], action: "archive" | "unarchive") => {
    if (names.length === 0) return;
    setSchoolsBusy(true);
    try {
      if (action === "archive") {
        await archiveSchools(names);
        toast.success(`${names.length} school${names.length !== 1 ? "s" : ""} archived`);
      } else {
        await unarchiveSchools(names);
        toast.success(`${names.length} school${names.length !== 1 ? "s" : ""} unarchived`);
      }
      await loadArchivedSchools();
      clearCheckedSchools();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setSchoolsBusy(false);
    }
  };

  /** Put a school back onto the active Confirmation Letters list for the term currently being viewed. */
  const restoreLetterSchool = async (school: string) => {
    const term = effectiveTerm || currentTerm;
    if (!term) return;
    setSchoolsBusy(true);
    try {
      await unmarkLetterGenerated(school, term);
      await loadGeneratedLetters();
      toast.success(`${school} is back on the active Confirmation Letters list for ${term}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setSchoolsBusy(false);
    }
  };

  // ── Application History — cross-term lookup for a given student, so
  // admins reviewing an application can immediately see whether this
  // student has applied before and what happened (approved/pending/
  // rejected), regardless of which term that earlier application was in.
  // Matches on ID/birth-cert number or registration/admission number first
  // (most reliable), falling back to student name + guardian phone. ─────────
  const computeApplicationHistory = (row: Row | null, allRows: Row[]): Row[] => {
    if (!row) return [];
    const idKey = (row.id_or_birth_cert_number || "").trim().toLowerCase();
    const regKey = (row.registration_number || "").trim().toLowerCase();
    const schoolKey = effectiveSchoolName(row).trim().toLowerCase();
    const nameKey = row.student_name.trim().toLowerCase();
    const phoneKey = (row.guardian_phone || "").trim();
    return allRows
      .filter((r) => r.id !== row.id)
      .filter((r) => {
        if (idKey && (r.id_or_birth_cert_number || "").trim().toLowerCase() === idKey) return true;
        // Admission numbers are only unique within a school — many schools
        // independently assign "1", "2", "3"... — so this must match school
        // name too, or two entirely different students at different
        // schools who happen to share an admission number would be wrongly
        // treated as the same applicant.
        if (regKey && schoolKey && (r.registration_number || "").trim().toLowerCase() === regKey && effectiveSchoolName(r).trim().toLowerCase() === schoolKey) return true;
        if (nameKey && phoneKey && r.student_name.trim().toLowerCase() === nameKey && (r.guardian_phone || "").trim() === phoneKey) return true;
        return false;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const applicationHistory = useMemo(() => computeApplicationHistory(selected, rows), [selected, rows]);

  // History for whichever row the admin clicked the History icon on, in the
  // main applications list — shown in its own focused dialog.
  const historyRowHistory = useMemo(() => computeApplicationHistory(historyRow, rows), [historyRow, rows]);

  // Orders term labels like "Term 1 - 2026" chronologically (year, then
  // Term 1/2/3 within that year) so the comparison table below reads top
  // to bottom the same way an admin would flip through a physical register.
  const TERM_ORDER: Record<string, number> = { "Term 1": 1, "Term 2": 2, "Term 3": 3 };
  const termSortKey = (termLabel: string | null | undefined): number => {
    if (!termLabel) return 0;
    const { termName, year } = parseTermLabel(termLabel);
    const y = parseInt(year, 10) || 0;
    const t = TERM_ORDER[termName.trim()] || 0;
    return y * 10 + t;
  };

  // All applications for the student behind the History dialog — the one
  // being reviewed plus every prior term — ordered chronologically (Term 1,
  // 2, 3…) so admins can read straight down the list and compare, exactly
  // like flipping through a paper register.
  const historyComparisonRows = useMemo(() => {
    if (!historyRow) return [];
    return [...historyRowHistory, historyRow].sort(
      (a, b) => termSortKey(a.term) - termSortKey(b.term) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, [historyRow, historyRowHistory]);

  // Flags whether a past term's core identity details (name/school/ward)
  // differ from the application currently under review — the details most
  // likely to reveal a duplicate or inconsistent applicant, so admins can
  // spot it at a glance rather than re-reading every field by hand.
  const historyMismatch = (row: Row) => {
    if (!historyRow || row.id === historyRow.id) {
      return { student: false, school: false, ward: false, any: false };
    }
    const student = row.student_name.trim().toLowerCase() !== historyRow.student_name.trim().toLowerCase();
    const school = effectiveSchoolName(row).trim().toLowerCase() !== effectiveSchoolName(historyRow).trim().toLowerCase();
    const ward = (row.ward || "").trim().toLowerCase() !== (historyRow.ward || "").trim().toLowerCase();
    return { student, school, ward, any: student || school || ward };
  };

  const historyMismatchCount = useMemo(
    () => historyComparisonRows.filter((r) => historyMismatch(r).any).length,
    [historyComparisonRows, historyRow],
  );

  // ── Draggable History dialog ────────────────────────────────────────────
  // Lets an admin drag the History comparison window aside by its header, so
  // it can sit next to the applications table instead of covering it — handy
  // when cross-checking a flagged row against the list behind it. Position
  // is relative to the dialog's normal centered spot and resets every time a
  // different student's history is opened.
  const [historyDragOffset, setHistoryDragOffset] = useState({ x: 0, y: 0 });
  const historyDragState = useRef({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  useEffect(() => {
    setHistoryDragOffset({ x: 0, y: 0 });
  }, [historyRow?.id]);

  const handleHistoryDragMove = (e: PointerEvent) => {
    if (!historyDragState.current.dragging) return;
    setHistoryDragOffset({
      x: historyDragState.current.originX + (e.clientX - historyDragState.current.startX),
      y: historyDragState.current.originY + (e.clientY - historyDragState.current.startY),
    });
  };

  const handleHistoryDragEnd = () => {
    historyDragState.current.dragging = false;
    window.removeEventListener("pointermove", handleHistoryDragMove);
    window.removeEventListener("pointerup", handleHistoryDragEnd);
  };

  const handleHistoryDragStart = (e: React.PointerEvent) => {
    // Ignore drags started from the close button or other interactive
    // controls inside the header — only the bare header area should drag.
    if ((e.target as HTMLElement).closest("button, a")) return;
    historyDragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: historyDragOffset.x,
      originY: historyDragOffset.y,
    };
    window.addEventListener("pointermove", handleHistoryDragMove);
    window.addEventListener("pointerup", handleHistoryDragEnd);
  };

  // ── Applications tab drill-down data (built from `filtered`, so the search
  // box and status filter chips stay in effect for the dropdown options too) ─
  const appsWardOptions = useMemo(() => {
    const map = new Map<string, number>();
    MATHARE_WARDS.forEach((w) => map.set(w, 0));
    for (const r of filtered) {
      const w = (r.ward || "").trim() || "Unspecified";
      map.set(w, (map.get(w) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const appsSchoolOptions = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      const s = effectiveSchoolName(r) || "Unspecified School";
      map.set(s, (map.get(s) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  // The rows actually rendered in the table/cards below — the flat `filtered`
  // list, narrowed by whichever of the Ward / School dropdown filters are
  // currently set (both can be active together).
  const displayRows = useMemo(() => {
    return filtered.filter((r) => {
      if (appsWard && ((r.ward || "").trim() || "Unspecified") !== appsWard) return false;
      if (appsSchool && (effectiveSchoolName(r) || "Unspecified School") !== appsSchool) return false;
      return true;
    });
  }, [filtered, appsWard, appsSchool]);

  // ── Bulk selection helpers ───────────────────────────────────────────────
  const filteredIds = displayRows.map((r) => r.id);
  const allChecked = filteredIds.length > 0 && filteredIds.every((id) => checkedIds.has(id));
  const someChecked = filteredIds.some((id) => checkedIds.has(id));

  const toggleOne = (id: string) =>
    setCheckedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  const toggleAll = () => {
    if (allChecked) {
      setCheckedIds((prev) => { const next = new Set(prev); filteredIds.forEach((id) => next.delete(id)); return next; });
    } else {
      setCheckedIds((prev) => { const next = new Set(prev); filteredIds.forEach((id) => next.add(id)); return next; });
    }
  };

  const clearChecked = () => setCheckedIds(new Set());

  // ── Bulk actions ─────────────────────────────────────────────────────────
  const bulkUpdateStatus = async (status: string) => {
    const ids = [...checkedIds];
    setBulkBusy(true);
    const { error } = await supabase
      .from("bursary_applications" as never)
      .update({ status } as never)
      .in("id", ids);
    setBulkBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${ids.length} application${ids.length !== 1 ? "s" : ""} marked as ${status}`);
    clearChecked();
    load();
  };

  const bulkDelete = async () => {
    const ids = [...checkedIds];
    const names = rows.filter((r) => ids.includes(r.id)).map((r) => r.student_name);
    if (!window.confirm(
      `Delete ${ids.length} application${ids.length !== 1 ? "s" : ""}?\n\n${names.slice(0, 5).join(", ")}${names.length > 5 ? ` and ${names.length - 5} more` : ""}\n\nThis cannot be undone.`
    )) return;
    setBulkBusy(true);
    const { error } = await supabase
      .from("bursary_applications" as never)
      .delete()
      .in("id", ids);
    setBulkBusy(false);
    if (error) { toast.error(error.message); return; }
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
    clearChecked();
    toast.success(`${ids.length} application${ids.length !== 1 ? "s" : ""} deleted`);
    load();
  };

  // ── Actions ──────────────────────────────────────────────────────────────────
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("bursary_applications" as never)
      .update({ status } as never)
      .eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Marked ${status}`); load(); }
  };

  /**
   * Apply a single canonical school name to every application currently
   * showing under the selected (raw or already-canonical) school name. This
   * is how an admin merges "Kanga School" / "Kanga High School" / "Kanga
   * Boys" into one consistent entry that flows through to the broadsheet and
   * confirmation letters.
   */
  const renameSchool = async () => {
    const newName = renameSchoolDraft.trim();
    const newSubCounty = renameSubCountyDraft.trim();
    const newCounty = renameCountyDraft.trim();
    if (!newName || !reviewSchool) {
      toast.error("Enter a school name");
      return;
    }
    setRenameSchoolBusy(true);
    const ids = reviewStudents.map((r) => r.id);
    const { error } = await supabase
      .from("bursary_applications" as never)
      .update({
        canonical_school_name: newName,
        school_sub_county: newSubCounty || null,
        school_county: newCounty || null,
      } as never)
      .in("id", ids);
    setRenameSchoolBusy(false);

    if (error) { toast.error(error.message); return; }

    toast.success(`${ids.length} application${ids.length !== 1 ? "s" : ""} updated`);
    setRenameSchoolOpen(false);

    // If location changed, clear the selected county/subcounty/school so the UI resets cleanly
    if (newCounty !== reviewCounty || newSubCounty !== reviewSubCounty || newName !== reviewSchool) {
      setReviewSchool(null);
      if (newSubCounty !== reviewSubCounty) setReviewSubCounty(null);
      if (newCounty !== reviewCounty) setReviewCounty(null);
    } else {
      setReviewSchool(newName);
    }
    load();
  };

  /**
   * Persist a manually-entered awarded amount for a single application.
   * Called from the inline editor in the Review by Location student table.
   */
  const saveAmount = async (id: string) => {
    const parsed = parseFloat(editAmountValue.replace(/,/g, ""));
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Enter a valid amount (numbers only)");
      return;
    }
    setEditAmountBusy(true);
    const { error } = await supabase
      .from("bursary_applications" as never)
      .update({ amount_requested: parsed } as never)
      .eq("id", id);
    setEditAmountBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Amount updated");
    setEditAmountId(null);
    setEditAmountValue("");
    load();
  };

  const cancelEditAmount = () => {
    setEditAmountId(null);
    setEditAmountValue("");
  };

  const startEditing = (r: Row) => {
    setEditFields({
      student_name: r.student_name || "",
      registration_number: r.registration_number || "",
      school_name: r.school_name || "",
      canonical_school_name: r.canonical_school_name || "",
      school_category: r.school_category || "",
      school_county: r.school_county || "",
      school_sub_county: r.school_sub_county || "",
      ward: r.ward || "",
      amount_requested: r.amount_requested !== null && r.amount_requested !== undefined ? String(r.amount_requested) : "",
      status: r.status || "pending",
    });
    setIsEditing(true);
  };

  const saveEditApplication = async () => {
    if (!selected) return;
    const studentName = editFields.student_name.trim();
    if (!studentName) {
      toast.error("Student name is required");
      return;
    }
    const schoolName = editFields.school_name.trim();
    if (!schoolName) {
      toast.error("School name is required");
      return;
    }

    setEditBusy(true);
    const parsedAmount = editFields.amount_requested ? parseFloat(editFields.amount_requested) : null;
    const admissionNumber = editFields.registration_number.trim().toUpperCase() || null;
    const { error } = await supabase
      .from("bursary_applications" as never)
      .update({
        student_name: studentName,
        registration_number: admissionNumber,
        school_name: schoolName,
        canonical_school_name: editFields.canonical_school_name.trim() || null,
        school_category: editFields.school_category || null,
        school_county: editFields.school_county || null,
        school_sub_county: editFields.school_sub_county || null,
        ward: editFields.ward || null,
        amount_requested: parsedAmount,
        status: editFields.status,
      } as never)
      .eq("id", selected.id);

    setEditBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Application updated successfully");
    setIsEditing(false);

    // Update the selected state so the detail dialog gets updated values
    setSelected((prev) =>
      prev
        ? {
            ...prev,
            student_name: studentName,
            registration_number: admissionNumber,
            school_name: schoolName,
            canonical_school_name: editFields.canonical_school_name.trim() || null,
            school_category: editFields.school_category || null,
            school_county: editFields.school_county || null,
            school_sub_county: editFields.school_sub_county || null,
            ward: editFields.ward || null,
            amount_requested: parsedAmount,
            status: editFields.status,
          }
        : null
    );

    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this application permanently?")) return;
    const { error } = await supabase
      .from("bursary_applications" as never)
      .delete()
      .eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); load(); }
  };

  const openSms = (r: Row) => {
    setSmsTarget(r);
    setSmsText(`Hello ${r.guardian_name.split(" ")[0]}, regarding ${r.student_name}'s bursary application (Ref ${r.reference}): `);
    setSmsOpen(true);
  };

  const sendSms = async () => {
    if (!smsTarget) return;
    setSmsBusy(true);
    try {
      const res = await sendBursarySms({ data: { applicationId: smsTarget.id, message: smsText } });
      if (res.simulated) toast.success(`SMS simulated to ${res.phone}`);
      else toast.success(`SMS sent to ${res.phone}`);
      setSmsOpen(false); setSmsText(""); setSmsTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send SMS");
    } finally { setSmsBusy(false); }
  };

  const downloadBroadsheet = () => {
    if (approvedRows.length === 0) {
      toast.error("No approved applications to include in the broadsheet.");
      return;
    }
    const bsRows: BroadsheetRow[] = approvedRows.map((r) => ({
      reference: r.reference,
      student_name: r.student_name,
      registration_number: r.registration_number,
      current_grade: r.current_grade,
      gender: r.gender,
      guardian_name: r.guardian_name,
      guardian_phone: r.guardian_phone,
      ward: r.ward,
      amount_requested: r.amount_requested,
      school_name: effectiveSchoolName(r),   // use canonical name if set
      school_category: r.school_category,
      school_bank_account: r.school_bank_account,
      school_county: r.school_county,         // needed for County → School grouping
    }));
    generateBroadsheetPdf(bsRows, `Moha Bursary Broadsheet — ${new Date().toLocaleDateString("en-KE")}`);
    toast.success("Broadsheet PDF generated!");
  };

  const downloadBroadsheetExcel = () => {
    if (approvedRows.length === 0) {
      toast.error("No approved applications to include in the broadsheet.");
      return;
    }
    const bsRows: BroadsheetRow[] = approvedRows.map((r) => ({
      reference: r.reference,
      student_name: r.student_name,
      registration_number: r.registration_number,
      current_grade: r.current_grade,
      gender: r.gender,
      guardian_name: r.guardian_name,
      guardian_phone: r.guardian_phone,
      ward: r.ward,
      amount_requested: r.amount_requested,
      school_name: effectiveSchoolName(r),   // use canonical name if set
      school_category: r.school_category,
      school_bank_account: r.school_bank_account,
      school_county: r.school_county,
    }));
    generateBroadsheetExcel(bsRows, new Date());
    toast.success("Broadsheet Excel file generated!");
  };

  const downloadWardListExcel = () => {
    if (approvedRows.length === 0) {
      toast.error("No approved applications to include in the broadsheet.");
      return;
    }
    const bsRows: BroadsheetRow[] = approvedRows.map((r) => ({
      reference: r.reference,
      student_name: r.student_name,
      registration_number: r.registration_number,
      current_grade: r.current_grade,
      gender: r.gender,
      guardian_name: r.guardian_name,
      guardian_phone: r.guardian_phone,
      ward: r.ward,
      amount_requested: r.amount_requested,
      school_name: effectiveSchoolName(r),   // use canonical name if set
      school_category: r.school_category,
      school_bank_account: r.school_bank_account,
      school_county: r.school_county,
    }));
    generateWardListExcel(bsRows, new Date());
    toast.success("Ward List Details Excel file generated!");
  };

  const downloadConfirmationLetter = async () => {
    if (!letterSelectedSchool || letterVisibleRows.length === 0) {
      toast.error("Select a school with at least one visible approved applicant first.");
      return;
    }
    const rows: ConfirmationLetterRow[] = letterVisibleRows.map((r) => ({
      student_name: r.student_name,
      registration_number: r.registration_number,
      current_grade: r.current_grade,
      amount_requested: r.amount_requested,
    }));
    generateConfirmationLetter(rows, {
      schoolName: letterSelectedSchool,
      termLabel: letterTerm,
      chequeNumber: letterChequeNumber.trim() || undefined,
      dateLabel: letterDate.trim() || undefined,
      officerName: letterOfficerName.trim() || undefined,
      officerPhone: letterOfficerPhone.trim() || undefined,
      schoolCounty: letterVisibleRows[0]?.school_county ?? null,
      schoolSubCounty: letterVisibleRows[0]?.school_sub_county ?? null,
    });
    toast.success(`Confirmation letter generated for ${letterSelectedSchool}`);

    // Move this school off the active Confirmation Letters list for the
    // term currently being viewed, and into the Schools tab, where it can
    // be archived or restored back onto the active list.
    const termForRecord = effectiveTerm || currentTerm;
    if (termForRecord) {
      try {
        await markLetterGenerated(letterSelectedSchool, termForRecord);
        await loadGeneratedLetters();
        toast.info(`${letterSelectedSchool} moved to the Schools tab — you can archive it there, or restore it back to this list.`);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Letter downloaded, but couldn't update the schools list.");
      }
    }
    setLetterSelectedSchool(null);
    setLetterHiddenIds(new Set());
  };

  // Downloads a blank confirmation letter — identical layout and letterhead
  // to a real one, but with the school name, term, and beneficiary table
  // left blank (dotted lines / empty rows) for filling in by hand. Useful
  // when a letter needs to be prepared for a school that isn't in the
  // system yet, or filled out manually for any other reason.
  const downloadBlankConfirmationLetter = () => {
    generateConfirmationLetter([], {
      schoolName: "",
      termLabel: "",
      emptyTemplateRowCount: 25,
    });
    toast.success("Blank confirmation letter template downloaded.");
  };

  const toggleSchool = (school: string) => {
    setBsExpanded((prev) => {
      const next = new Set(prev);
      next.has(school) ? next.delete(school) : next.add(school);
      return next;
    });
  };

  const expandAll = () => setBsExpanded(new Set(bySchool.keys()));
  const collapseAll = () => setBsExpanded(new Set());

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Bursary Applications">
      <Toaster />
      <datalist id="school-suggestions">
        {allSchoolNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <datalist id="subcounty-suggestions">
        {allSubCounties.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <datalist id="county-suggestions">
        {allCounties.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <div className="space-y-3">

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1 bg-muted/50 border border-border rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab("applications")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "applications"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> All Applications
            </span>
          </button>
          <button
            onClick={() => setTab("review")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "review"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Review by Location
              {counts.pending > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {counts.pending}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setTab("broadsheet")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "broadsheet"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Approved Broadsheet
              {counts.approved > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {counts.approved}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setTab("letters")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "letters"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Confirmation Letter
            </span>
          </button>
          <button
            onClick={() => setTab("schools")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "schools"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Archive className="h-4 w-4" /> Schools
            </span>
          </button>
        </div>

          {/* Late application button — always available regardless of window status */}
          <BursaryApplicationDialog
            trigger={
              <Button variant="outline" className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 shrink-0">
                <UserPlus className="h-4 w-4" />
                Add Late Application
              </Button>
            }
          />
        </div>

        {/* Term filter — applies to Applications, Review, Broadsheet & Letters tabs */}
        {tab !== "schools" && (
          <div className="flex flex-wrap items-center gap-2 -mt-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Term:</span>
            <Select value={termView} onValueChange={setTermView}>
              <SelectTrigger className="h-8 w-56 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  Current{currentTerm ? ` — ${currentTerm}` : ""}
                </SelectItem>
                {distinctTerms.filter((t) => t !== currentTerm).map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {termView !== "current" && (
              <Badge className="bg-amber-500/15 text-amber-700">Viewing a past term's applications</Badge>
            )}
          </div>
        )}

        {/* ── APPLICATIONS TAB ──────────────────────────────────────────────── */}
        {tab === "applications" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                list="school-suggestions"
                placeholder="Search by student name, school, ward (e.g. Kiamaiko), guardian or reference…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="grid grid-cols-5 gap-1">
              {(["all", "pending", "reviewing", "approved", "rejected"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`bg-card border-2 rounded-lg px-1.5 py-1 text-left transition-all ${
                    filter === k ? "border-primary shadow-elegant" : "border-border hover:border-primary/40"
                  }`}
                >
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground leading-tight truncate">{k}</p>
                  <p className="text-sm font-display font-bold leading-tight">
                    {(counts as Record<string, number>)[k] ?? 0}
                  </p>
                </button>
              ))}
            </div>

            {/* Ward / School quick filters — pick from the dropdowns on the
                "Ward" and "School / Grade" column headers below; the chips
                here show what's active and let you clear each one. */}
            {(appsWard || appsSchool) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filtered by:</span>
                {appsWard && (
                  <button
                    onClick={() => setAppsWard(null)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20"
                  >
                    <MapPin className="h-3 w-3" /> Ward: {appsWard} <X className="h-3 w-3" />
                  </button>
                )}
                {appsSchool && (
                  <button
                    onClick={() => setAppsSchool(null)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20"
                  >
                    <School className="h-3 w-3" /> School: {appsSchool} <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Bulk action bar */}
            {checkedIds.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 px-2 py-1 bg-primary/5 border border-primary/20 rounded-xl mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-primary">
                    {checkedIds.size} application{checkedIds.size !== 1 ? "s" : ""} selected
                  </span>
                  <button onClick={clearChecked} className="ml-1 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" disabled={bulkBusy} onClick={() => bulkUpdateStatus("approved")}
                    className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve all
                  </Button>
                  <Button size="sm" variant="outline" disabled={bulkBusy} onClick={() => bulkUpdateStatus("reviewing")}
                    className="gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50">
                    Reviewing
                  </Button>
                  <Button size="sm" variant="outline" disabled={bulkBusy} onClick={() => bulkUpdateStatus("pending")}
                    className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50">
                    Pending
                  </Button>
                  <Button size="sm" variant="outline" disabled={bulkBusy} onClick={() => bulkUpdateStatus("rejected")}
                    className="gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50">
                    Reject all
                  </Button>
                  <Button size="sm" variant="destructive" disabled={bulkBusy} onClick={bulkDelete} className="gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" /> Delete {checkedIds.size}
                  </Button>
                </div>
              </div>
            )}

            {/* Desktop table */}
            <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="w-10 px-2 py-0.5">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={toggleAll}
                          aria-label="Select all"
                        />
                      </th>
                      <th className="text-left px-2 py-0.5">Ref</th>
                      <th className="text-left px-2 py-0.5">Student</th>
                      <th className="text-left px-2 py-0.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger className={`flex items-center gap-1 hover:text-foreground outline-none ${appsSchool ? "text-primary" : ""}`}>
                            School / Grade <ChevronDown className="h-3 w-3" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto w-64">
                            <DropdownMenuItem onClick={() => setAppsSchool(null)} className={!appsSchool ? "font-semibold text-primary" : ""}>
                              All Schools
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {appsSchoolOptions.map(([school, count]) => (
                              <DropdownMenuItem
                                key={school}
                                onClick={() => setAppsSchool(school)}
                                className={`flex items-center justify-between gap-2 ${appsSchool === school ? "font-semibold text-primary" : ""}`}
                              >
                                <span className="truncate">{school}</span>
                                <span className="text-xs text-muted-foreground shrink-0">{count}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </th>
                      <th className="text-left px-2 py-0.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger className={`flex items-center gap-1 hover:text-foreground outline-none ${appsWard ? "text-primary" : ""}`}>
                            Ward <ChevronDown className="h-3 w-3" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto w-56">
                            <DropdownMenuItem onClick={() => setAppsWard(null)} className={!appsWard ? "font-semibold text-primary" : ""}>
                              All Wards
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {appsWardOptions.map(([ward, count]) => (
                              <DropdownMenuItem
                                key={ward}
                                onClick={() => setAppsWard(ward)}
                                className={`flex items-center justify-between gap-2 ${appsWard === ward ? "font-semibold text-primary" : ""}`}
                              >
                                <span className="truncate">{ward}</span>
                                <span className="text-xs text-muted-foreground shrink-0">{count}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </th>
                      <th className="text-right px-2 py-0.5">Amount</th>
                      <th className="text-left px-2 py-0.5">Status</th>
                      <th className="text-right px-2 py-0.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {displayRows.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">
                        <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        No applications match your filters.
                      </td></tr>
                    ) : (
                      displayRows.map((r) => {
                        const isChecked = checkedIds.has(r.id);
                        return (
                        <tr key={r.id} className={isChecked ? "bg-primary/5" : "hover:bg-muted/30"}>
                          <td className="px-2 py-0.5">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleOne(r.id)}
                              aria-label={`Select ${r.student_name}`}
                            />
                          </td>
                          <td className="px-2 py-0.5 font-mono text-xs font-bold text-primary">{r.reference}</td>
                          <td className="px-2 py-0.5 leading-tight">
                            <p className="font-semibold">{r.student_name}</p>
                            <p className="text-xs text-muted-foreground">{r.guardian_name} · {r.guardian_phone}</p>
                          </td>
                          <td className="px-2 py-0.5 leading-tight">
                            <p>{effectiveSchoolName(r) || "—"}</p>
                            <p className="text-xs text-muted-foreground">{r.current_grade}</p>
                          </td>
                          <td className="px-2 py-0.5 text-muted-foreground">{r.ward || "—"}</td>
                          <td className="px-2 py-0.5 text-right font-semibold">
                            {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                          </td>
                          <td className="px-2 py-0.5">
                            <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                              <SelectTrigger className={`h-6 w-24 text-xs font-bold uppercase ${STATUS_COLORS[r.status] ?? ""}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewing">Reviewing</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-2 py-0.5">
                            <div className="flex items-center justify-end gap-0.5">
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setSelected(r)} title="View">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setHistoryRow(r)} title="Application History">
                                <History className="h-3 w-3 text-gold" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setSelected(r); startEditing(r); }} title="Edit">
                                <Pencil className="h-3 w-3 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => openSms(r)} title="Send SMS">
                                <Send className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => remove(r.id)} title="Delete">
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-1.5">
              {displayRows.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-4 text-center text-muted-foreground">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No applications match your filters.
                </div>
              ) : (
                displayRows.map((r) => {
                  const isChecked = checkedIds.has(r.id);
                  return (
                  <div key={r.id} className={`bg-card border rounded-xl px-2.5 py-2 ${isChecked ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleOne(r.id)}
                        className="shrink-0"
                        aria-label={`Select ${r.student_name}`}
                      />
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className="font-semibold text-xs truncate">{r.student_name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {effectiveSchoolName(r) || "—"} · {r.ward || "—"} · KSh {r.amount_requested ? Number(r.amount_requested).toLocaleString() : "—"}
                        </p>
                      </div>
                      <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                        <SelectTrigger className={`h-6 w-20 shrink-0 text-[9px] font-bold uppercase px-1.5 ${STATUS_COLORS[r.status] ?? ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setSelected(r)} title="View">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setHistoryRow(r)} title="Application History">
                          <History className="h-3 w-3 text-gold" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setSelected(r); startEditing(r); }} title="Edit">
                          <Pencil className="h-3 w-3 text-primary" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => openSms(r)} title="Send SMS">
                          <Send className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => remove(r.id)} title="Delete">
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ── REVIEW BY LOCATION TAB ───────────────────────────────────────────── */}
        {tab === "review" && (
          <div className="space-y-2">
            <div className="bg-card border border-border rounded-2xl p-3">
              <h2 className="font-display font-bold text-sm flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold" />
                Review by Location
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Drill down from County → Sub-county → School to review every applicant from that school together,
                and merge duplicate school name spellings into one consistent entry.
              </p>

              {/* Breadcrumb */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
                <button
                  onClick={() => { setReviewCounty(null); setReviewSubCounty(null); setReviewSchool(null); }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${!reviewCounty ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  All Counties
                </button>
                {reviewCounty && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <button
                      onClick={() => { setReviewSubCounty(null); setReviewSchool(null); }}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${!reviewSubCounty ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {reviewCounty}
                    </button>
                  </>
                )}
                {reviewSubCounty && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <button
                      onClick={() => setReviewSchool(null)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${!reviewSchool ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {reviewSubCounty}
                    </button>
                  </>
                )}
                {reviewSchool && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="px-2.5 py-1 rounded-lg font-semibold bg-primary/10 text-primary">{reviewSchool}</span>
                  </>
                )}
              </div>
            </div>

            {/* Level 1: Counties */}
            {!reviewCounty && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {reviewCounties.map(({ county, count, pending }) => (
                  <button
                    key={county}
                    onClick={() => setReviewCounty(county)}
                    className="bg-card border border-border rounded-xl p-3 text-left hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-foreground">{county}</p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">{count} application{count !== 1 ? "s" : ""}</span>
                      {pending > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                          <Clock3 className="h-3 w-3" /> {pending} pending
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Level 2: Sub-counties */}
            {reviewCounty && !reviewSubCounty && (
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => setReviewCounty(null)} className="gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Counties
                </Button>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {reviewSubCounties.map(({ subCounty, count, pending }) => (
                    <button
                      key={subCounty}
                      onClick={() => setReviewSubCounty(subCounty)}
                      className="bg-card border border-border rounded-xl p-3 text-left hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-display font-bold text-foreground">{subCounty}</p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">{count} application{count !== 1 ? "s" : ""}</span>
                        {pending > 0 && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                            <Clock3 className="h-3 w-3" /> {pending} pending
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level 3: Schools */}
            {reviewCounty && reviewSubCounty && !reviewSchool && (
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => setReviewSubCounty(null)} className="gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to {reviewCounty}
                </Button>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {reviewSchools.map(({ school, count, pending, category }) => (
                    <button
                      key={school}
                      onClick={() => setReviewSchool(school)}
                      className="bg-card border border-border rounded-xl p-3 text-left hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <School className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="font-display font-bold text-foreground leading-snug">{school}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 mt-2 ml-3">
                        <span className="text-xs text-muted-foreground">
                          {category && `${category} · `}{count} student{count !== 1 ? "s" : ""}
                        </span>
                        {pending > 0 && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                            <Clock3 className="h-3 w-3" /> {pending} pending
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level 4: Students at this school */}
            {reviewCounty && reviewSubCounty && reviewSchool && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button variant="outline" size="sm" onClick={() => setReviewSchool(null)} className="gap-1.5">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Schools
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRenameSchoolDraft(reviewSchool || "");
                      setRenameSubCountyDraft(reviewSubCounty || "");
                      setRenameCountyDraft(reviewCounty || "");
                      setRenameSchoolOpen(true);
                    }}
                    className="gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Fix / Standardize School Details
                  </Button>
                </div>

                {reviewSchoolVariants.length > 1 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                    <p className="font-semibold mb-1">⚠ Multiple spellings found for this school</p>
                    <p className="text-xs">
                      Applicants entered: {reviewSchoolVariants.map((v) => `"${v}"`).join(", ")}.
                      Use "Fix / Standardize School Details" above to merge them and ensure they have consistent county and sub-county values.
                    </p>
                  </div>
                )}

                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-display font-bold text-sm text-foreground">{reviewSchool}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {reviewStudents.length} application{reviewStudents.length !== 1 ? "s" : ""} from this school
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="text-left px-3 py-1.5">Student</th>
                          <th className="text-left px-3 py-1.5">Grade</th>
                          <th className="text-left px-3 py-1.5">Guardian</th>
                          <th className="text-right px-3 py-1.5">
                            <span className="flex items-center justify-end gap-1" title="Click row amount to edit">
                              Amount Awarded
                              <Pencil className="h-2.5 w-2.5 opacity-50" />
                            </span>
                          </th>
                          <th className="text-left px-3 py-1.5">Status</th>
                          <th className="text-right px-3 py-1.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {reviewStudents.map((r) => (
                          <tr key={r.id} className="hover:bg-muted/20">
                            <td className="px-2 py-1">
                              <p className="font-semibold text-foreground">{r.student_name}</p>
                              <p className="font-mono text-[11px] text-primary">{r.reference}</p>
                            </td>
                            <td className="px-2 py-1 text-muted-foreground">{r.current_grade}</td>
                            <td className="px-2 py-1">
                              <p>{r.guardian_name}</p>
                              <p className="text-xs text-muted-foreground">{r.guardian_phone}</p>
                            </td>
                            <td className="px-2 py-1 text-right">
                              {editAmountId === r.id ? (
                                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <Input
                                    value={editAmountValue}
                                    onChange={(e) => setEditAmountValue(digitsOnly(e.target.value))}
                                    className="h-8 w-28 text-right text-xs border-primary/50 focus-visible:ring-primary"
                                    inputMode="numeric"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveAmount(r.id);
                                      if (e.key === "Escape") cancelEditAmount();
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-2 shrink-0"
                                    onClick={() => saveAmount(r.id)}
                                    disabled={editAmountBusy}
                                  >
                                    {editAmountBusy ? "…" : <CheckCircle2 className="h-3.5 w-3.5" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-2 text-muted-foreground shrink-0"
                                    onClick={cancelEditAmount}
                                    disabled={editAmountBusy}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  className="inline-flex items-center justify-end gap-1.5 cursor-pointer group hover:text-primary transition-colors py-1 pl-3 pr-1 rounded-md hover:bg-muted/40"
                                  onClick={() => {
                                    setEditAmountId(r.id);
                                    setEditAmountValue(String(r.amount_requested ?? ""));
                                  }}
                                  title="Click to edit awarded amount"
                                >
                                  <span className="font-semibold border-b border-dashed border-muted-foreground/35 group-hover:border-primary/50">
                                    {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                                  </span>
                                  <Pencil className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0" />
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-1">
                              <Badge className={STATUS_COLORS[r.status] ?? ""}>{r.status}</Badge>
                            </td>
                            <td className="px-2 py-1">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="ghost" onClick={() => setSelected(r)} title="View full application">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                  onClick={() => updateStatus(r.id, "approved")}
                                  disabled={r.status === "approved"}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                                  onClick={() => updateStatus(r.id, "reviewing")}
                                  disabled={r.status === "reviewing"}
                                >
                                  Reviewing
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 border-rose-300 text-rose-700 hover:bg-rose-50"
                                  onClick={() => updateStatus(r.id, "rejected")}
                                  disabled={r.status === "rejected"}
                                >
                                  <XCircle className="h-3.5 w-3.5" /> Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Approved applications appear automatically in the <strong>Approved Broadsheet</strong> and{" "}
                  <strong>Confirmation Letter</strong> tabs under this same school name.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── BROADSHEET TAB ────────────────────────────────────────────────── */}
        {tab === "broadsheet" && (
          <div className="space-y-2">

            {/* Header controls */}
            <div className="bg-card border border-border rounded-2xl p-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display font-bold text-sm flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-gold" />
                    Approved Bursary Broadsheet
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    All approved applications sorted and grouped by school. School List Details is a PDF to send to schools. County List Details and Ward List Details are Excel files for the finance team.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    variant="outline"
                    onClick={downloadBroadsheetExcel}
                    disabled={approvedRows.length === 0}
                    className="gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    County List Details (Excel)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadWardListExcel}
                    disabled={approvedRows.length === 0}
                    className="gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Ward List Details (Excel)
                  </Button>
                  <Button
                    variant="hero"
                    onClick={downloadBroadsheet}
                    disabled={approvedRows.length === 0}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    School List Details (PDF)
                  </Button>
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <StatCard icon={CheckCircle2} label="Approved" value={String(approvedRows.length)} color="text-emerald-600" />
                <StatCard icon={School} label="Schools" value={String(bySchool.size)} color="text-blue-600" />
                <StatCard icon={Users} label="Total Students" value={String(approvedRows.length)} color="text-primary" />
                <StatCard icon={Banknote} label="Grand Total" value={`KSh ${grandTotal.toLocaleString()}`} color="text-gold" />
              </div>

              {/* Sort controls */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort by:</span>
                {(
                  [
                    ["student_name", "Student Name"],
                    ["school_name", "School"],
                    ["ward", "Ward"],
                    ["current_grade", "Grade"],
                    ["amount_requested", "Amount"],
                  ] as [SortField, string][]
                ).map(([field, label]) => (
                  <button
                    key={field}
                    onClick={() => {
                      if (bsSort === field) setBsOrder((o) => (o === "asc" ? "desc" : "asc"));
                      else { setBsSort(field); setBsOrder("asc"); }
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      bsSort === field
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {label}
                    {bsSort === field && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </button>
                ))}
                <div className="ml-auto flex gap-2">
                  <button onClick={expandAll} className="text-xs text-primary hover:underline">Expand all</button>
                  <span className="text-muted-foreground">·</span>
                  <button onClick={collapseAll} className="text-xs text-primary hover:underline">Collapse all</button>
                </div>
              </div>
            </div>

            {approvedRows.length === 0 ? (
              <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold">No approved applications yet.</p>
                <p className="text-xs mt-1">Go to the Applications tab and mark applications as <strong>Approved</strong> to populate the broadsheet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Per-school accordion */}
                {Array.from(bySchool.entries()).map(([school, schoolRows], schoolIdx) => {
                  const schoolTotal = schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
                  const isOpen = bsExpanded.has(school);
                  return (
                    <div key={school} className="bg-card border border-border rounded-2xl overflow-hidden">
                      {/* School header */}
                      <button
                        onClick={() => toggleSchool(school)}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <School className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-sm text-foreground truncate">{school}</p>
                            <p className="text-xs text-muted-foreground">
                              {schoolRows[0].school_category && `${schoolRows[0].school_category} · `}
                              {schoolRows.length} student{schoolRows.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Sub-total</p>
                            <p className="font-bold text-emerald-600">KSh {schoolTotal.toLocaleString()}</p>
                          </div>
                          {isOpen
                            ? <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            : <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          }
                        </div>
                      </button>

                      {/* Students table inside accordion */}
                      {isOpen && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-muted/20 text-[11px] uppercase tracking-wider text-muted-foreground">
                              <tr>
                                <th className="text-left px-3 py-1.5 w-8">#</th>
                                <th className="text-left px-3 py-1.5">Student Name</th>
                                <th className="text-left px-3 py-1.5">Ref</th>
                                <th className="text-left px-3 py-1.5">Grade</th>
                                <th className="text-left px-3 py-1.5">Gender</th>
                                <th className="text-left px-3 py-1.5">Guardian</th>
                                <th className="text-left px-3 py-1.5">Phone</th>
                                <th className="text-left px-3 py-1.5">Ward</th>
                                <th className="text-right px-3 py-1.5">Amount</th>
                                <th className="text-right px-3 py-1.5">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {schoolRows.map((r, idx) => (
                                <tr key={r.id} className={`hover:bg-muted/20 ${idx % 2 === 1 ? "bg-muted/10" : ""}`}>
                                  <td className="px-2 py-1 text-muted-foreground text-xs">
                                    {/* Global serial across all schools */}
                                    {(Array.from(bySchool.values()).slice(0, schoolIdx).reduce((s, arr) => s + arr.length, 0)) + idx + 1}
                                  </td>
                                  <td className="px-2 py-1 font-semibold text-foreground">{r.student_name}</td>
                                  <td className="px-2 py-1 font-mono text-xs text-primary">{r.reference}</td>
                                  <td className="px-2 py-1 text-muted-foreground">{r.current_grade}</td>
                                  <td className="px-2 py-1 text-muted-foreground capitalize">{r.gender || "—"}</td>
                                  <td className="px-2 py-1">{r.guardian_name}</td>
                                  <td className="px-2 py-1 text-muted-foreground">{r.guardian_phone}</td>
                                  <td className="px-2 py-1 text-muted-foreground">{r.ward || "—"}</td>
                                  <td className="px-2 py-1 text-right font-bold text-emerald-600">
                                    {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                                  </td>
                                  <td className="px-2 py-1">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button size="icon" variant="ghost" onClick={() => setSelected(r)} title="View">
                                        <Eye className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button size="icon" variant="ghost" onClick={() => openSms(r)} title="SMS">
                                        <Send className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        size="icon" variant="ghost"
                                        onClick={() => {
                                          const bsRows: BroadsheetRow[] = schoolRows.map((s) => ({
                                            reference: s.reference,
                                            student_name: s.student_name,
                                            registration_number: s.registration_number,
                                            current_grade: s.current_grade,
                                            gender: s.gender,
                                            guardian_name: s.guardian_name,
                                            guardian_phone: s.guardian_phone,
                                            ward: s.ward,
                                            amount_requested: s.amount_requested,
                                            school_name: s.school_name,
                                            school_category: s.school_category,
                                            school_bank_account: s.school_bank_account,
                                          }));
                                          generateBroadsheetPdf(bsRows, `${school} — Bursary Award List`);
                                        }}
                                        title="Download school PDF"
                                      >
                                        <Download className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-emerald-50 dark:bg-emerald-950/20">
                                <td colSpan={8} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                                  School sub-total — {schoolRows.length} student{schoolRows.length !== 1 ? "s" : ""}
                                </td>
                                <td className="px-3 py-1.5 text-right font-bold text-emerald-700">
                                  KSh {schoolTotal.toLocaleString()}
                                </td>
                                <td />
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Grand total card */}
                <div className="bg-primary rounded-2xl px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-white text-center sm:text-left">
                    <p className="text-xs font-semibold opacity-80">Grand Total</p>
                    <p className="text-2xl font-display font-bold">KSh {grandTotal.toLocaleString()}</p>
                    <p className="text-xs opacity-70 mt-0.5">
                      {approvedRows.length} students across {bySchool.size} school{bySchool.size !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 gap-2"
                      onClick={downloadBroadsheetExcel}
                    >
                      <FileSpreadsheet className="h-4 w-4" /> County List Details (Excel)
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 gap-2"
                      onClick={downloadWardListExcel}
                    >
                      <FileSpreadsheet className="h-4 w-4" /> Ward List Details (Excel)
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 gap-2"
                      onClick={downloadBroadsheet}
                    >
                      <Download className="h-4 w-4" /> School List Details (PDF)
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SCHOOL CONFIRMATION LETTERS TAB ─────────────────────────────────── */}
        {tab === "letters" && (
          <div className="grid lg:grid-cols-[360px_1fr] gap-2">

            {/* Left: school search & select */}
            <div className="bg-card border border-border rounded-2xl p-3 space-y-3 h-fit">
              <div>
                <h2 className="font-display font-bold text-sm flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gold" />
                  Confirmation Letter
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Search a school, then generate its official confirmation-of-beneficiaries letter.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search school name…"
                  value={letterSchoolSearch}
                  onChange={(e) => setLetterSchoolSearch(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox checked={showSentInLetters} onCheckedChange={(v) => setShowSentInLetters(!!v)} />
                Show schools whose letter was already sent this term
              </label>

              <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                {letterSchoolList.length === 0 ? (
                  <div className="text-center text-xs text-muted-foreground py-10">
                    <School className="h-7 w-7 mx-auto mb-2 opacity-30" />
                    {bySchool.size === 0
                      ? "No approved applications yet."
                      : "No school matches your search."}
                  </div>
                ) : (
                  letterSchoolList.map(({ school, count, total, category, letterSent }) => {
                    const active = letterSelectedSchool === school;
                    return (
                      <button
                        key={school}
                        onClick={() => { setLetterSelectedSchool(school); setLetterHiddenIds(new Set()); }}
                        className={`w-full text-left px-3.5 py-2 rounded-xl border transition-all ${
                          active
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40 hover:bg-muted/30"
                        }`}
                      >
                        <p className="font-semibold text-xs text-foreground truncate flex items-center gap-1.5">
                          {school}
                          {letterSent && <Badge className="bg-emerald-500/15 text-emerald-700 text-[10px]">Sent</Badge>}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {category && `${category} · `}{count} student{count !== 1 ? "s" : ""}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            KSh {total.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: letter preview details & generate */}
            <div className="bg-card border border-border rounded-2xl p-3">
              {!letterSelectedSchool ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mb-2 opacity-20" />
                  <p className="font-semibold">Select a school to get started</p>
                  <p className="text-xs mt-1 max-w-xs">
                    Pick a school from the list to preview its beneficiaries and generate the official confirmation letter.
                  </p>
                  <Button
                    variant="outline"
                    onClick={downloadBlankConfirmationLetter}
                    className="gap-2 mt-4"
                    title="Download a blank copy of this letter to fill in by hand"
                  >
                    <FileText className="h-4 w-4" /> Download Blank Template
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">{letterSelectedSchool}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {letterVisibleRows.length} of {letterSelectedRows.length} approved student{letterSelectedRows.length !== 1 ? "s" : ""} included · Total KSh {letterSelectedTotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" onClick={downloadBlankConfirmationLetter} className="gap-2" title="Download a blank copy of this letter to fill in by hand">
                        <FileText className="h-4 w-4" /> Blank Template
                      </Button>
                      <Button variant="hero" onClick={downloadConfirmationLetter} disabled={letterVisibleRows.length === 0} className="gap-2">
                        <Download className="h-4 w-4" /> Download Letter
                      </Button>
                    </div>
                  </div>

                  {/* Letter details form */}
                  <div className="grid sm:grid-cols-2 gap-3 bg-muted/20 border border-border rounded-xl p-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Term / Year</label>
                      <Input
                        value={letterTerm}
                        onChange={(e) => { setLetterTerm(e.target.value); setLetterTermTouched(true); }}
                        placeholder="e.g. 2026 T2"
                        className="mt-1.5 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Date (optional)
                      </label>
                      <Input
                        value={letterDate}
                        onChange={(e) => setLetterDate(e.target.value)}
                        placeholder="Leave blank for a signing line"
                        className="mt-1.5 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cheque Number (optional)</label>
                      <Input
                        value={letterChequeNumber}
                        onChange={(e) => setLetterChequeNumber(e.target.value)}
                        placeholder="Leave blank for a signing line"
                        className="mt-1.5 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Amount (auto-calculated)</label>
                      <Input
                        value={`KSh ${letterSelectedTotal.toLocaleString()}.00`}
                        disabled
                        className="mt-1.5 h-9 font-semibold text-emerald-700 bg-emerald-50 border-emerald-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Field Officer Name</label>
                      <Input
                        value={letterOfficerName}
                        onChange={(e) => setLetterOfficerName(e.target.value)}
                        className="mt-1.5 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Field Officer Phone</label>
                      <Input
                        value={letterOfficerPhone}
                        onChange={(e) => setLetterOfficerPhone(e.target.value)}
                        className="mt-1.5 h-9"
                      />
                    </div>
                  </div>

                  {/* Student list preview */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Beneficiaries — auto-filled from approved applications. Uncheck a student to leave them off this
                      letter; check them again to bring them back in, any time before you download.
                    </p>
                    <div className="border border-border rounded-xl overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                          <tr>
                            <th className="text-left px-2 py-1 w-8"></th>
                            <th className="text-left px-2 py-1 w-8">#</th>
                            <th className="text-left px-2 py-1">Name</th>
                            <th className="text-left px-2 py-1">Form / Adm No.</th>
                            <th className="text-right px-2 py-1">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {letterSelectedRows.map((r, i) => {
                            const hidden = letterHiddenIds.has(r.id);
                            return (
                              <tr key={r.id} className={`${i % 2 === 1 ? "bg-muted/10" : ""} ${hidden ? "opacity-40" : ""}`}>
                                <td className="px-2 py-1">
                                  <Checkbox
                                    checked={!hidden}
                                    onCheckedChange={() => toggleLetterStudentHidden(r.id)}
                                    aria-label={`Include ${r.student_name} in this letter`}
                                  />
                                </td>
                                <td className="px-2 py-1 text-muted-foreground text-xs">{i + 1}</td>
                                <td className={`px-2 py-1 font-medium text-foreground ${hidden ? "line-through" : ""}`}>{r.student_name}</td>
                                <td className="px-2 py-1 text-muted-foreground text-xs">
                                  {[r.current_grade, r.registration_number].filter(Boolean).join(" / ")}
                                </td>
                                <td className="px-2 py-1 text-right font-semibold">
                                  {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-emerald-50">
                            <td colSpan={4} className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                              Total ({letterVisibleRows.length} included)
                            </td>
                            <td className="px-2 py-1 text-right font-bold text-emerald-700">
                              KSh {letterSelectedTotal.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    The downloaded letter follows the official Moha Education Kitty letterhead format —
                    ready to print and send to the school for signing and cheque collection.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SCHOOLS TAB — archive / unarchive the school directory ──────────── */}
        {tab === "schools" && (
          <div className="space-y-2">
            <div className="bg-card border border-border rounded-2xl p-3">
              <h2 className="font-display font-bold text-sm flex items-center gap-2">
                <Archive className="h-5 w-5 text-gold" />
                Schools
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Archive schools you no longer need to see in Review by Location or Confirmation Letters —
                archiving doesn't delete anything, it just tucks the school out of the way until you unarchive it.
                Select a single school, or use "Select all" to archive/unarchive every school currently listed at once.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search school name…"
                  value={schoolsSearch}
                  onChange={(e) => setSchoolsSearch(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex gap-1 bg-muted/50 border border-border rounded-lg p-1">
                {(["active", "archived", "all"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSchoolsShowArchivedOnly(k)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                      schoolsShowArchivedOnly === k ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {k === "active" ? "Active" : k === "archived" ? "Archived" : "All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk action bar */}
            {checkedSchools.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 px-2 py-1 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-primary">
                    {checkedSchools.size} school{checkedSchools.size !== 1 ? "s" : ""} selected
                  </span>
                  <button onClick={clearCheckedSchools} className="ml-1 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={schoolsBusy}
                    onClick={() => runSchoolArchiveAction([...checkedSchools], "archive")}
                    className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <Archive className="h-3.5 w-3.5" /> Archive selected
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={schoolsBusy}
                    onClick={() => runSchoolArchiveAction([...checkedSchools], "unarchive")}
                    className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <ArchiveRestore className="h-3.5 w-3.5" /> Unarchive selected
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="w-10 px-2 py-1">
                        <Checkbox
                          checked={allSchoolsChecked}
                          onCheckedChange={toggleAllSchools}
                          aria-label="Select all schools"
                        />
                      </th>
                      <th className="text-left px-2 py-1">School</th>
                      <th className="text-left px-2 py-1">Location</th>
                      <th className="text-right px-2 py-1">Applications</th>
                      <th className="text-left px-2 py-1">Status</th>
                      <th className="text-right px-2 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {schoolsDirectory.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">
                        <School className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        No schools match this view.
                      </td></tr>
                    ) : (
                      schoolsDirectory.map((s) => {
                        const isChecked = checkedSchools.has(s.school);
                        return (
                          <tr key={s.school} className={isChecked ? "bg-primary/5" : "hover:bg-muted/30"}>
                            <td className="px-2 py-1">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleOneSchool(s.school)}
                                aria-label={`Select ${s.school}`}
                              />
                            </td>
                            <td className="px-2 py-1">
                              <p className="font-semibold flex items-center gap-1.5">
                                <School className="h-3.5 w-3.5 text-primary shrink-0" /> {s.school}
                              </p>
                              {s.category && <p className="text-xs text-muted-foreground">{s.category}</p>}
                            </td>
                            <td className="px-2 py-1 text-muted-foreground text-xs">
                              {[s.subCounty, s.county].filter(Boolean).join(", ") || "—"}
                            </td>
                            <td className="px-2 py-1 text-right">
                              {s.count} {s.pending > 0 && (
                                <span className="text-amber-700 font-semibold">· {s.pending} pending</span>
                              )}
                            </td>
                            <td className="px-2 py-1">
                              <div className="flex flex-col gap-1 items-start">
                                {s.archived ? (
                                  <Badge className="bg-amber-500/15 text-amber-700">Archived</Badge>
                                ) : (
                                  <Badge className="bg-emerald-500/15 text-emerald-700">Active</Badge>
                                )}
                                {s.letterSent && (
                                  <Badge className="bg-blue-500/15 text-blue-700 flex items-center gap-1">
                                    <Mail className="h-3 w-3" /> Letter sent
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-2 py-1 text-right">
                              <div className="flex flex-wrap gap-1.5 justify-end">
                                {s.letterSent && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={schoolsBusy}
                                    onClick={() => restoreLetterSchool(s.school)}
                                    className="gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50"
                                  >
                                    <Mail className="h-3.5 w-3.5" /> Restore to Letters
                                  </Button>
                                )}
                                {s.archived ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={schoolsBusy}
                                    onClick={() => runSchoolArchiveAction([s.school], "unarchive")}
                                    className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                  >
                                    <ArchiveRestore className="h-3.5 w-3.5" /> Unarchive
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={schoolsBusy}
                                    onClick={() => runSchoolArchiveAction([s.school], "archive")}
                                    className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50"
                                  >
                                    <Archive className="h-3.5 w-3.5" /> Archive
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox checked={showArchivedInPickers} onCheckedChange={(v) => setShowArchivedInPickers(!!v)} />
                Also show archived schools in the Review by Location and Confirmation Letters pickers
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox checked={showSentInLetters} onCheckedChange={(v) => setShowSentInLetters(!!v)} />
                Also show "letter sent" schools in the Confirmation Letters picker
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail dialog ────────────────────────────────────────────────────── */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setIsEditing(false); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              {isEditing ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Pencil className="h-5 w-5 text-gold" />
                      Edit Application: {selected.student_name}
                    </DialogTitle>
                    <DialogDescription>
                      Ref <span className="font-mono font-bold text-primary">{selected.reference}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-1.5">
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-student-name">Student Name</Label>
                        <Input
                          id="edit-student-name"
                          value={editFields.student_name}
                          onChange={(e) => setEditFields(prev => ({ ...prev, student_name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-admission-number">Admission Number</Label>
                        <Input
                          id="edit-admission-number"
                          value={editFields.registration_number}
                          onChange={(e) => setEditFields(prev => ({ ...prev, registration_number: e.target.value }))}
                          placeholder="e.g. correct a mistyped digit"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-canonical-school-name">Standardized School Name</Label>
                        <Input
                          id="edit-canonical-school-name"
                          value={editFields.canonical_school_name}
                          onChange={(e) => setEditFields(prev => ({ ...prev, canonical_school_name: e.target.value }))}
                          list="school-suggestions"
                          placeholder="e.g. KANGA HIGH SCHOOL"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-school-name">School (as typed by applicant)</Label>
                        <Input
                          id="edit-school-name"
                          value={editFields.school_name}
                          onChange={(e) => setEditFields(prev => ({ ...prev, school_name: e.target.value }))}
                          list="school-suggestions"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-status">Status (Approval)</Label>
                        <Select
                          value={editFields.status}
                          onValueChange={(val) => setEditFields(prev => ({ ...prev, status: val }))}
                        >
                          <SelectTrigger id="edit-status" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-school-category">School/College Category</Label>
                        <Select
                          value={editFields.school_category}
                          onValueChange={(val) => setEditFields(prev => ({ ...prev, school_category: val }))}
                        >
                          <SelectTrigger id="edit-school-category" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="C1">C1 — National</SelectItem>
                            <SelectItem value="C2">C2 — Extra-County</SelectItem>
                            <SelectItem value="C3">C3 — County</SelectItem>
                            <SelectItem value="C4">C4 — Sub-County / Day</SelectItem>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="Private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-school-county">School County</Label>
                        <Select
                          value={editFields.school_county}
                          onValueChange={(val) => {
                            const subcounties = KENYA_COUNTIES[val] || [];
                            setEditFields(prev => ({
                              ...prev,
                              school_county: val,
                              school_sub_county: subcounties.includes(prev.school_sub_county) ? prev.school_sub_county : (subcounties[0] || ""),
                            }));
                          }}
                        >
                          <SelectTrigger id="edit-school-county" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTY_NAMES.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-school-sub-county">School Sub-County</Label>
                        <Select
                          value={editFields.school_sub_county}
                          onValueChange={(val) => setEditFields(prev => ({ ...prev, school_sub_county: val }))}
                          disabled={!editFields.school_county}
                        >
                          <SelectTrigger id="edit-school-sub-county" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(KENYA_COUNTIES[editFields.school_county] || []).map(sc => (
                              <SelectItem key={sc} value={sc}>{sc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-ward">Ward</Label>
                        <Select
                          value={editFields.ward}
                          onValueChange={(val) => setEditFields(prev => ({ ...prev, ward: val }))}
                        >
                          <SelectTrigger id="edit-ward" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MATHARE_WARDS.map(w => (
                              <SelectItem key={w} value={w}>{w}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-amount-requested">Amount Awarded (KSh)</Label>
                        <Input
                          id="edit-amount-requested"
                          value={editFields.amount_requested}
                          onChange={(e) => setEditFields(prev => ({ ...prev, amount_requested: digitsOnly(e.target.value) }))}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-2 pt-3 border-t">
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={editBusy}>Cancel</Button>
                    <Button variant="hero" onClick={saveEditApplication} disabled={editBusy}>
                      {editBusy ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-gold" />
                      {selected.student_name}
                    </DialogTitle>
                    <DialogDescription>
                      Ref <span className="font-mono font-bold text-primary">{selected.reference}</span>
                      {" · "}
                      <Badge className={STATUS_COLORS[selected.status] ?? ""}>{selected.status}</Badge>
                      {" · "}
                      <span className="text-xs">{selected.term}</span>
                    </DialogDescription>
                  </DialogHeader>

                  {/* Application History — every other application on record for this
                      same student, across all terms, so reviewers can see at a glance
                      whether they've received a bursary before and how it went. */}
                  {applicationHistory.length > 0 && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary flex items-center gap-1.5">
                        <History className="h-3.5 w-3.5" /> Application History ({applicationHistory.length})
                      </p>
                      <div className="space-y-1.5">
                        {applicationHistory.map((h) => (
                          <div key={h.id} className="flex items-center justify-between gap-2 bg-card border border-border rounded-lg px-2 py-1 text-xs">
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{h.term}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {effectiveSchoolName(h)} · {new Date(h.created_at).toLocaleDateString("en-KE")}
                                {h.amount_requested ? ` · KSh ${Number(h.amount_requested).toLocaleString()}` : ""}
                              </p>
                            </div>
                            <Badge className={`${STATUS_COLORS[h.status] ?? ""} shrink-0`}>{h.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <DetailGroup title="Student">
                      <Detail label="Term" value={selected.term} />
                      <Detail label="Registration No." value={selected.registration_number} />
                      <Detail label="ID / Birth Cert No." value={selected.id_or_birth_cert_number} />
                      <Detail label="DOB" value={selected.dob} />
                      <Detail label="Gender" value={selected.gender} />
                      <Detail label="Grade" value={selected.current_grade} />
                      <Detail label="Father Alive" value={yn(selected.father_alive)} />
                      <Detail label="Mother Alive" value={yn(selected.mother_alive)} />
                      <Detail label="Student Disability" value={selected.student_disability ? (selected.student_disability_detail || "Yes") : "No"} />
                      <Detail label="Student Annual Fee" value={selected.student_annual_fee ? `KSh ${Number(selected.student_annual_fee).toLocaleString()}` : null} />
                      <Detail label="Outstanding Balance" value={selected.outstanding_balance ? `KSh ${Number(selected.outstanding_balance).toLocaleString()}` : null} />
                      <Detail
                        label="Received bursary before"
                        value={selected.received_bursary_before ? `Yes${selected.previous_bursary_source ? ` — ${selected.previous_bursary_source}` : ""}${selected.previous_bursary_amount ? ` (KSh ${Number(selected.previous_bursary_amount).toLocaleString()})` : ""}` : "No"}
                      />
                    </DetailGroup>
                    {selected.father_alive && (
                      <DetailGroup title="Father">
                        <Detail label="Name" value={selected.father_name} />
                        <Detail label="Phone" value={selected.father_phone} />
                        <Detail label="Occupation" value={selected.father_occupation} />
                        <Detail label="National ID" value={selected.father_national_id} />
                      </DetailGroup>
                    )}
                    {selected.mother_alive && (
                      <DetailGroup title="Mother">
                        <Detail label="Name" value={selected.mother_name} />
                        <Detail label="Phone" value={selected.mother_phone} />
                        <Detail label="Occupation" value={selected.mother_occupation} />
                        <Detail label="National ID" value={selected.mother_national_id} />
                      </DetailGroup>
                    )}
                    <DetailGroup title="School">
                      <Detail label="School (as typed by applicant)" value={selected.school_name} />
                      {selected.canonical_school_name && selected.canonical_school_name.trim() !== selected.school_name.trim() && (
                        <Detail label="Standardized School Name" value={selected.canonical_school_name} />
                      )}
                      <Detail label="Category" value={selected.school_category} />
                      <Detail label="County" value={selected.school_county} />
                      <Detail label="Sub-County" value={selected.school_sub_county} />
                      <Detail label="Year of Admission" value={selected.year_of_admission} />
                      <Detail label="Bank Account" value={selected.school_bank_account} />
                    </DetailGroup>
                    <DetailGroup title="Primary Contactable Parent / Guardian">
                      <Detail label="Name" value={selected.guardian_name} />
                      <Detail label="Phone" value={selected.guardian_phone} />
                      <Detail label="National ID" value={selected.parent_national_id} />
                      <Detail label="Occupation" value={selected.parent_occupation} />
                      <Detail label="Sub-County" value={selected.parent_residence_sub_county} />
                      <Detail label="Ward" value={selected.ward} />
                      <Detail label="Polling Station" value={selected.polling_station} />
                      <Detail label="Disability" value={selected.parent_disability ? (selected.parent_disability_detail || "Yes") : "No"} />
                      <Detail label="Children in School" value={String(selected.siblings_in_school ?? "0")} />
                      <Detail label="Monthly Budget" value={selected.monthly_budget ? `KSh ${Number(selected.monthly_budget).toLocaleString()}` : null} />
                      <Detail label="Amount Requested" value={selected.amount_requested ? `KSh ${Number(selected.amount_requested).toLocaleString()}` : null} />
                      <Detail label="Submitted" value={new Date(selected.created_at).toLocaleString()} />
                    </DetailGroup>
                  </div>
                  {selected.reason && (
                    <div className="mt-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Reason</p>
                      <p className="text-xs whitespace-pre-line bg-muted/40 p-3 rounded-lg">{selected.reason}</p>
                    </div>
                  )}
                  {selected.sms_last_message && (
                    <div className="mt-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Last SMS · {selected.sms_last_sent_at ? new Date(selected.sms_last_sent_at).toLocaleString() : ""}
                      </p>
                      <p className="text-xs bg-gold/10 p-3 rounded-lg">{selected.sms_last_message}</p>
                    </div>
                  )}
                  <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                    <Button variant="outline" onClick={() => startEditing(selected)} className="gap-1.5">
                      <Pencil className="h-4 w-4 text-primary" /> Edit Details
                    </Button>
                    <Button variant="outline" onClick={() => generateBursaryPdf(toPdfData(selected))}>
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                    <Button variant="hero" onClick={() => { openSms(selected); setSelected(null); }}>
                      <Send className="h-4 w-4" /> Send SMS
                    </Button>
                  </DialogFooter>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Application History dialog — launched directly from the list via
          the History icon. Lays every term's application out as one linear
          register — one row per term, every field visible at once, no
          clicking to expand — the same way an admin would compare entries
          in a paper log book, and highlights any term whose student/school/
          ward details don't match the application currently under review —
          the quickest way to catch an inconsistent or duplicate applicant
          before approving. */}
      <Dialog open={!!historyRow} onOpenChange={(o) => { if (!o) setHistoryRow(null); }}>
        <DialogContent
          className={`max-h-[85vh] overflow-y-auto transition-[max-width] duration-200 ${
            historyRowHistory.length === 0 ? "max-w-sm" : "max-w-6xl"
          }`}
          style={
            historyDragOffset.x !== 0 || historyDragOffset.y !== 0
              ? { transform: `translate(calc(-50% + ${historyDragOffset.x}px), calc(-50% + ${historyDragOffset.y}px))` }
              : undefined
          }
        >
          <DialogHeader
            onPointerDown={handleHistoryDragStart}
            className="cursor-move select-none rounded-md -m-1 p-1 hover:bg-muted/40"
            title="Drag to move this window"
          >
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-gold" />
              Application History{historyRow ? ` — ${historyRow.student_name}` : ""}
            </DialogTitle>
          </DialogHeader>

          {historyRowHistory.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <History className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No previous applications found for this student — nothing to compare yet.

            </div>
          ) : (
            <>
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
                  historyMismatchCount === 0
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-destructive/40 bg-destructive/5 text-destructive"
                }`}
              >
                {historyMismatchCount === 0 ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    Consistent — name, school and ward match across every past term on record.
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    {historyMismatchCount} past term{historyMismatchCount > 1 ? "s" : ""} {historyMismatchCount > 1 ? "don't" : "doesn't"} match this application — check the highlighted rows before approving.
                  </>
                )}
              </div>

              <div className="mt-3 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-2.5 py-2 font-semibold">Term</th>
                      <th className="px-2.5 py-2 font-semibold">Student / Adm No.</th>
                      <th className="px-2.5 py-2 font-semibold">School / Grade</th>
                      <th className="px-2.5 py-2 font-semibold">Ward</th>
                      <th className="px-2.5 py-2 font-semibold">Amount</th>
                      <th className="px-2.5 py-2 font-semibold">Status</th>
                      <th className="px-2.5 py-2 font-semibold">Date &amp; Time of Application</th>
                      <th className="px-2.5 py-2 font-semibold">Birth Certificate No.</th>
                      <th className="px-2.5 py-2 font-semibold">Parent's Name / Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {historyComparisonRows.map((h) => {
                      const isCurrent = h.id === historyRow?.id;
                      const mismatch = historyMismatch(h);
                      return (
                        <tr key={h.id} className={isCurrent ? "bg-primary/5" : mismatch.any ? "bg-destructive/5" : ""}>
                          <td className="px-2.5 py-2 align-top whitespace-nowrap">{h.term || "—"}</td>
                          <td className={`px-2.5 py-2 align-top ${mismatch.student ? "font-semibold text-destructive" : ""}`}>
                            {h.student_name}
                            {h.registration_number && (
                              <div className="text-muted-foreground font-normal">{h.registration_number}</div>
                            )}
                          </td>
                          <td className={`px-2.5 py-2 align-top ${mismatch.school ? "font-semibold text-destructive" : ""}`}>
                            {effectiveSchoolName(h) || "—"}{h.current_grade ? ` / ${h.current_grade}` : ""}
                          </td>
                          <td className={`px-2.5 py-2 align-top ${mismatch.ward ? "font-semibold text-destructive" : ""}`}>
                            {h.ward || "—"}
                          </td>
                          <td className="px-2.5 py-2 align-top whitespace-nowrap">
                            {h.amount_requested ? `KSh ${Number(h.amount_requested).toLocaleString()}` : "—"}
                          </td>
                          <td className="px-2.5 py-2 align-top">
                            <Badge className={`${STATUS_COLORS[h.status] ?? ""} capitalize`}>{h.status}</Badge>
                          </td>
                          <td className="px-2.5 py-2 align-top whitespace-nowrap">
                            {new Date(h.created_at).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                            <div className="text-muted-foreground font-normal">
                              {new Date(h.created_at).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </td>
                          <td className="px-2.5 py-2 align-top whitespace-nowrap">{h.id_or_birth_cert_number || "—"}</td>
                          <td className="px-2.5 py-2 align-top">
                            {h.guardian_name || "—"}
                            {h.guardian_phone && (
                              <div className="text-muted-foreground font-normal">{h.guardian_phone}</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryRow(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── SMS dialog ───────────────────────────────────────────────────────── */}
      <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send SMS Feedback</DialogTitle>
            <DialogDescription>
              {smsTarget && <>To <strong>{smsTarget.guardian_name}</strong> ({smsTarget.guardian_phone || smsTarget.phone})</>}
            </DialogDescription>
          </DialogHeader>
          <Textarea value={smsText} onChange={(e) => setSmsText(e.target.value)} rows={5} maxLength={459} />
          <p className="text-xs text-muted-foreground">{smsText.length}/459 characters</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={sendSms} disabled={smsBusy || smsText.trim().length === 0}>
              <Send className="h-4 w-4" /> {smsBusy ? "Sending…" : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Rename / standardize school dialog ──────────────────────────────── */}
      <Dialog open={renameSchoolOpen} onOpenChange={setRenameSchoolOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-gold" /> Standardize School Details
            </DialogTitle>
            <DialogDescription>
              This sets one consistent school name, sub-county, and county across all {reviewStudents.length} application
              {reviewStudents.length !== 1 ? "s" : ""} currently grouped here. This corrects cases where applicants placed the school in the wrong sub-county.
            </DialogDescription>
          </DialogHeader>

          {reviewSchoolVariants.length > 1 && (
            <div className="rounded-lg bg-muted/40 border border-border px-2 py-1.5 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Spellings currently in this group:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {reviewSchoolVariants.map((v) => <li key={v}>{v}</li>)}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Official school name
              </label>
              <Input
                list="school-suggestions"
                value={renameSchoolDraft}
                onChange={(e) => setRenameSchoolDraft(e.target.value)}
                placeholder="e.g. KANGA HIGH SCHOOL"
                className="mt-1.5"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Sub-county
              </label>
              <Input
                list="subcounty-suggestions"
                value={renameSubCountyDraft}
                onChange={(e) => setRenameSubCountyDraft(e.target.value)}
                placeholder="e.g. MATHARE"
                className="mt-1.5"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                County
              </label>
              <Input
                list="county-suggestions"
                value={renameCountyDraft}
                onChange={(e) => setRenameCountyDraft(e.target.value)}
                placeholder="e.g. NAIROBI"
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameSchoolOpen(false)}>Cancel</Button>
            <Button
              variant="hero"
              onClick={renameSchool}
              disabled={renameSchoolBusy || !renameSchoolDraft.trim()}
            >
              {renameSchoolBusy ? "Saving…" : "Apply to All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; color: string;
}) {
  return (
    <div className="bg-muted/30 border border-border rounded-xl px-2 py-1 flex items-center gap-2">
      <Icon className={`h-5 w-5 shrink-0 ${color}`} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`font-display font-bold text-sm ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function Detail({ label, value, full }: { label: string; value: string | null | undefined; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground whitespace-pre-line">{value || "—"}</p>
    </div>
  );
}

function DetailGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/20 border border-border rounded-xl p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">{title}</p>
      <div className="grid sm:grid-cols-2 gap-2 text-xs">{children}</div>
    </div>
  );
}

const yn = (v: boolean | null | undefined) => (v === null || v === undefined ? "—" : v ? "Yes" : "No");

/**
 * Maps a saved database Row into the exact shape the PDF generator expects.
 * Keeping this as a single explicit function (rather than passing `selected`
 * straight into generateBursaryPdf) guarantees the downloadable form always
 * reflects the real columns that were actually saved — no stale/renamed
 * field names slipping through.
 */
function toPdfData(r: Row): BursaryPdfData {
  return {
    reference: r.reference,
    student_name: r.student_name,
    registration_number: r.registration_number,
    dob: r.dob,
    gender: r.gender,
    current_grade: r.current_grade,
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
  };
}