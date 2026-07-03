import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap, Send, Eye, Trash2, Download, Search,
  FileSpreadsheet, CheckCircle2, School, ArrowUpDown,
  ChevronDown, ChevronRight, Users, Banknote,
  CheckSquare, X, Mail, FileText, Calendar,
  MapPin, Pencil, ArrowLeft, XCircle, Clock3, UserPlus,
  Archive, ArchiveRestore, ArchiveX,
} from "lucide-react";
import { generateBursaryPdf, generateBroadsheetPdf, generateBroadsheetExcel, generateApprovedBroadsheetExcel, generateConfirmationLetter, type BroadsheetRow, type BursaryPdfData, type ConfirmationLetterRow } from "@/lib/bursary-pdf";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MATHARE_WARDS } from "@/lib/admin-store";
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
  student_name: string;
  registration_number: string | null;
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

type Tab = "applications" | "review" | "broadsheet" | "letters";
type SortField = "student_name" | "school_name" | "ward" | "amount_requested" | "current_grade";

function AdminBursariesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<Tab>("applications");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
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

  // School Confirmation Letter tab
  const [letterSchoolSearch, setLetterSchoolSearch] = useState("");
  const [letterSelectedSchool, setLetterSelectedSchool] = useState<string | null>(null);
  const [letterChequeNumber, setLetterChequeNumber] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [letterOfficerName, setLetterOfficerName] = useState("Nancy Otieno");
  const [letterOfficerPhone, setLetterOfficerPhone] = useState("0728827978");
  const [letterTerm, setLetterTerm] = useState(`${new Date().getFullYear()} T2`);

  // Archive state for confirmation letters
  const [archivedSchools, setArchivedSchools] = useState<Map<string, { archived_at: string; id: string }>>(new Map());
  const [showArchived, setShowArchived] = useState(false);
  const [archiveBusy, setArchiveBusy] = useState<string | null>(null);
  const [archiveConfirmSchool, setArchiveConfirmSchool] = useState<string | null>(null);

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

  const load = async () => {
    const { data, error } = await supabase
      .from("bursary_applications" as never)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data as unknown as Row[]) || []);
  };

  const loadArchives = async () => {
    const { data, error } = await supabase
      .from("letter_archives" as never)
      .select("*");
    if (!error && data) {
      const map = new Map<string, { archived_at: string; id: string }>();
      for (const row of data as Array<{ id: string; school_name: string; archived_at: string }>) {
        map.set(row.school_name, { archived_at: row.archived_at, id: row.id });
      }
      setArchivedSchools(map);
    }
  };

  useEffect(() => {
    load();
    loadArchives();
    const ch = supabase
      .channel("bursary-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bursary_applications" }, () => load())
      .subscribe();
    const archiveCh = supabase
      .channel("archive-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "letter_archives" }, () => loadArchives())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
      supabase.removeChannel(archiveCh);
    };
  }, []);

  const archiveSchool = async (school: string) => {
    setArchiveBusy(school);
    const { error } = await supabase
      .from("letter_archives" as never)
      .insert({ school_name: school } as never);
    if (error) {
      toast.error("Failed to archive: " + error.message);
    } else {
      toast.success(`"${school}" archived — it will no longer appear in the letters list.`);
      if (letterSelectedSchool === school) setLetterSelectedSchool(null);
      await loadArchives();
    }
    setArchiveBusy(null);
    setArchiveConfirmSchool(null);
  };

  const unarchiveSchool = async (school: string) => {
    setArchiveBusy(school);
    const entry = archivedSchools.get(school);
    if (!entry) { setArchiveBusy(null); return; }
    const { error } = await supabase
      .from("letter_archives" as never)
      .delete()
      .eq("id", entry.id as never);
    if (error) {
      toast.error("Failed to unarchive: " + error.message);
    } else {
      toast.success(`"${school}" restored — it's back in the active letters list.`);
      await loadArchives();
    }
    setArchiveBusy(null);
  };

  // ── Filtered list (Applications tab) ────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
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
  }, [rows, filter, search]);

  // ── Approved rows sorted for broadsheet ─────────────────────────────────────
  const approvedRows = useMemo(() => {
    const approved = rows.filter((r) => r.status === "approved");
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
  }, [rows, bsSort, bsOrder]);

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
  // distribution). Archived schools are hidden unless showArchived is true.
  const letterSchoolList = useMemo(() => {
    const q = letterSchoolSearch.trim().toLowerCase();
    return Array.from(bySchool.entries())
      .map(([school, schoolRows]) => ({
        school,
        count: schoolRows.length,
        total: schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0),
        category: schoolRows[0]?.school_category ?? null,
        isArchived: archivedSchools.has(school),
        archivedAt: archivedSchools.get(school)?.archived_at ?? null,
      }))
      .filter((s) => showArchived ? s.isArchived : !s.isArchived)
      .filter((s) => !q || s.school.toLowerCase().includes(q))
      .sort((a, b) => a.school.localeCompare(b.school));
  }, [bySchool, letterSchoolSearch, archivedSchools, showArchived]);

  const letterSelectedRows = useMemo(
    () => (letterSelectedSchool ? bySchool.get(letterSelectedSchool) ?? [] : []),
    [bySchool, letterSelectedSchool]
  );

  const letterSelectedTotal = useMemo(
    () => letterSelectedRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0),
    [letterSelectedRows]
  );

  // ── Review by Location: County → Sub-county → School → Students ────────────
  // Built from ALL applications (not just approved) since this is the
  // primary place admins triage pending/reviewing applications. Counties and
  // sub-counties come from the application form's standardized dropdown, so
  // they're already consistent. School names go through effectiveSchoolName()
  // so a canonical rename merges variant spellings immediately.

  const reviewCounties = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of rows) {
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
  }, [rows]);

  const reviewSubCounties = useMemo(() => {
    if (!reviewCounty) return [];
    const inCounty = rows.filter((r) => (r.school_county || "Unspecified").trim() === reviewCounty);
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
  }, [rows, reviewCounty]);

  const reviewSchools = useMemo(() => {
    if (!reviewCounty || !reviewSubCounty) return [];
    const inLocation = rows.filter(
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
      }))
      .sort((a, b) => a.school.localeCompare(b.school));
  }, [rows, reviewCounty, reviewSubCounty]);

  const reviewStudents = useMemo(() => {
    if (!reviewCounty || !reviewSubCounty || !reviewSchool) return [];
    return rows
      .filter(
        (r) =>
          (r.school_county || "Unspecified").trim() === reviewCounty &&
          (r.school_sub_county || "Unspecified").trim() === reviewSubCounty &&
          (effectiveSchoolName(r) || "Unspecified School") === reviewSchool,
      )
      .sort((a, b) => a.student_name.localeCompare(b.student_name));
  }, [rows, reviewCounty, reviewSubCounty, reviewSchool]);

  // Variant raw spellings feeding into the currently-selected canonical school
  // name — shown to the admin so they can see exactly what they're merging.
  const reviewSchoolVariants = useMemo(() => {
    const variants = new Set(reviewStudents.map((r) => r.school_name.trim()).filter(Boolean));
    return Array.from(variants);
  }, [reviewStudents]);

  const counts = useMemo(() => {
    const c = { all: rows.length, pending: 0, reviewing: 0, approved: 0, rejected: 0 };
    for (const r of rows) (c as Record<string, number>)[r.status] = ((c as Record<string, number>)[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const allSchoolNames = useMemo(() => {
    const names = new Set<string>();
    for (const r of rows) {
      const name = effectiveSchoolName(r);
      if (name) names.add(name);
    }
    return Array.from(names).sort();
  }, [rows]);

  const allSubCounties = useMemo(() => {
    const names = new Set<string>();
    for (const r of rows) {
      if (r.school_sub_county) names.add(r.school_sub_county.trim().toUpperCase());
    }
    return Array.from(names).sort();
  }, [rows]);

  const allCounties = useMemo(() => {
    const names = new Set<string>();
    for (const r of rows) {
      if (r.school_county) names.add(r.school_county.trim().toUpperCase());
    }
    return Array.from(names).sort();
  }, [rows]);

  // ── Bulk selection helpers ───────────────────────────────────────────────
  const filteredIds = filtered.map((r) => r.id);
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
    const { error } = await supabase
      .from("bursary_applications" as never)
      .update({
        student_name: studentName,
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
      toast.error("No approved applications to include in the cheque summary.");
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
      school_name: effectiveSchoolName(r),
      school_category: r.school_category,
      school_bank_account: r.school_bank_account,
      school_county: r.school_county,
    }));
    generateBroadsheetExcel(bsRows, `Moha Bursary Cheque Summary — ${new Date().toLocaleDateString("en-KE")}`);
    toast.success("Cheque summary Excel generated!");
  };

  const downloadConfirmationLetter = () => {
    if (!letterSelectedSchool || letterSelectedRows.length === 0) {
      toast.error("Select a school with approved applicants first.");
      return;
    }
    const rows: ConfirmationLetterRow[] = letterSelectedRows.map((r) => ({
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
    });
    toast.success(`Confirmation letter generated for ${letterSelectedSchool}`);
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
      <div className="space-y-6">

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 bg-muted/50 border border-border rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab("applications")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
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
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
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
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
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
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "letters"
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> School Confirmation Letters
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

        {/* ── APPLICATIONS TAB ──────────────────────────────────────────────── */}
        {tab === "applications" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                list="school-suggestions"
                placeholder="Search by student name, school, ward, guardian or reference…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11"
              />
            </div>

            <div className="grid sm:grid-cols-5 gap-3">
              {(["all", "pending", "reviewing", "approved", "rejected"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`bg-card border-2 rounded-xl p-4 text-left transition-all ${
                    filter === k ? "border-primary shadow-elegant" : "border-border hover:border-primary/40"
                  }`}
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{k}</p>
                  <p className="text-2xl font-display font-bold mt-1">
                    {(counts as Record<string, number>)[k] ?? 0}
                  </p>
                </button>
              ))}
            </div>

            {/* Bulk action bar */}
            {checkedIds.size > 0 && (
              <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-semibold text-primary">
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
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="w-10 px-4 py-3">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={toggleAll}
                          aria-label="Select all"
                        />
                      </th>
                      <th className="text-left px-4 py-3">Ref</th>
                      <th className="text-left px-4 py-3">Student</th>
                      <th className="text-left px-4 py-3">School / Grade</th>
                      <th className="text-left px-4 py-3">Ward</th>
                      <th className="text-right px-4 py-3">Amount</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">
                        <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        No applications match your filters.
                      </td></tr>
                    ) : (
                      filtered.map((r) => {
                        const isChecked = checkedIds.has(r.id);
                        return (
                        <tr key={r.id} className={isChecked ? "bg-primary/5" : "hover:bg-muted/30"}>
                          <td className="px-4 py-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleOne(r.id)}
                              aria-label={`Select ${r.student_name}`}
                            />
                          </td>
                          <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{r.reference}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold">{r.student_name}</p>
                            <p className="text-xs text-muted-foreground">{r.guardian_name} · {r.guardian_phone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p>{r.school_name}</p>
                            <p className="text-xs text-muted-foreground">{r.current_grade}</p>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{r.ward || "—"}</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                              <SelectTrigger className={`h-8 w-32 text-xs font-bold uppercase ${STATUS_COLORS[r.status] ?? ""}`}>
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
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button size="icon" variant="ghost" onClick={() => setSelected(r)} title="View">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => { setSelected(r); startEditing(r); }} title="Edit">
                                <Pencil className="h-4 w-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => openSms(r)} title="Send SMS">
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => remove(r.id)} title="Delete">
                                <Trash2 className="h-4 w-4 text-destructive" />
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
            <div className="md:hidden space-y-3">
              {filtered.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No applications match your filters.
                </div>
              ) : (
                filtered.map((r) => {
                  const isChecked = checkedIds.has(r.id);
                  return (
                  <div key={r.id} className={`bg-card border rounded-2xl p-4 space-y-3 ${isChecked ? "border-primary/40 bg-primary/5" : "border-border"}`}>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleOne(r.id)}
                        className="mt-1 shrink-0"
                        aria-label={`Select ${r.student_name}`}
                      />
                      <div>
                        <p className="font-mono text-xs font-bold text-primary">{r.reference}</p>
                        <p className="font-semibold text-foreground">{r.student_name}</p>
                        <p className="text-xs text-muted-foreground">{r.guardian_name} · {r.guardian_phone}</p>
                      </div>
                      <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                        <SelectTrigger className={`h-7 text-[10px] font-bold uppercase ${STATUS_COLORS[r.status] ?? ""}`}>
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
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">School</p>
                        <p className="font-medium">{r.school_name}</p>
                        <p className="text-xs text-muted-foreground">{r.current_grade}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</p>
                        <p className="font-semibold">
                          {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(r)}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => { setSelected(r); startEditing(r); }}>
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openSms(r)}>
                        <Send className="h-3.5 w-3.5 mr-1" /> SMS
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(r.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold" />
                Review by Location
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Drill down from County → Sub-county → School to review every applicant from that school together,
                and merge duplicate school name spellings into one consistent entry.
              </p>

              {/* Breadcrumb */}
              <div className="flex flex-wrap items-center gap-1.5 mt-4 text-sm">
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {reviewCounties.map(({ county, count, pending }) => (
                  <button
                    key={county}
                    onClick={() => setReviewCounty(county)}
                    className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold text-foreground">{county}</p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
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
              <div className="space-y-3">
                <Button variant="outline" size="sm" onClick={() => setReviewCounty(null)} className="gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Counties
                </Button>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {reviewSubCounties.map(({ subCounty, count, pending }) => (
                    <button
                      key={subCounty}
                      onClick={() => setReviewSubCounty(subCounty)}
                      className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-display font-bold text-foreground">{subCounty}</p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-3 mt-2">
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
              <div className="space-y-3">
                <Button variant="outline" size="sm" onClick={() => setReviewSubCounty(null)} className="gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to {reviewCounty}
                </Button>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {reviewSchools.map(({ school, count, pending, category }) => (
                    <button
                      key={school}
                      onClick={() => setReviewSchool(school)}
                      className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <School className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="font-display font-bold text-foreground leading-snug">{school}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                      <div className="flex items-center gap-3 mt-2 ml-6">
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
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
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
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <p className="font-semibold mb-1">⚠ Multiple spellings found for this school</p>
                    <p className="text-xs">
                      Applicants entered: {reviewSchoolVariants.map((v) => `"${v}"`).join(", ")}.
                      Use "Fix / Standardize School Details" above to merge them and ensure they have consistent county and sub-county values.
                    </p>
                  </div>
                )}

                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border">
                    <p className="font-display font-bold text-base text-foreground">{reviewSchool}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {reviewStudents.length} application{reviewStudents.length !== 1 ? "s" : ""} from this school
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="text-left px-4 py-2.5">Student</th>
                          <th className="text-left px-4 py-2.5">Grade</th>
                          <th className="text-left px-4 py-2.5">Guardian</th>
                          <th className="text-right px-4 py-2.5">
                            <span className="flex items-center justify-end gap-1" title="Click row amount to edit">
                              Amount Awarded
                              <Pencil className="h-2.5 w-2.5 opacity-50" />
                            </span>
                          </th>
                          <th className="text-left px-4 py-2.5">Status</th>
                          <th className="text-right px-4 py-2.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {reviewStudents.map((r) => (
                          <tr key={r.id} className="hover:bg-muted/20">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-foreground">{r.student_name}</p>
                              <p className="font-mono text-[11px] text-primary">{r.reference}</p>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{r.current_grade}</td>
                            <td className="px-4 py-3">
                              <p>{r.guardian_name}</p>
                              <p className="text-xs text-muted-foreground">{r.guardian_phone}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {editAmountId === r.id ? (
                                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="500"
                                    value={editAmountValue}
                                    onChange={(e) => setEditAmountValue(e.target.value)}
                                    className="h-8 w-28 text-right text-sm border-primary/50 focus-visible:ring-primary"
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
                            <td className="px-4 py-3">
                              <Badge className={STATUS_COLORS[r.status] ?? ""}>{r.status}</Badge>
                            </td>
                            <td className="px-4 py-3">
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
                  <strong>School Confirmation Letters</strong> tabs under this same school name.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── BROADSHEET TAB ────────────────────────────────────────────────── */}
        {tab === "broadsheet" && (
          <div className="space-y-5">

            {/* Header controls */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-lg flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-gold" />
                    Approved Bursary Broadsheet
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    All approved applications grouped by county and school. Download as a PDF (full detail) or Excel (cheque summary — county totals only).
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <Button
                    variant="hero"
                    onClick={downloadBroadsheet}
                    disabled={approvedRows.length === 0}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadBroadsheetExcel}
                    disabled={approvedRows.length === 0}
                    className="gap-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Cheque Summary Excel
                  </Button>
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={CheckCircle2} label="Approved" value={String(approvedRows.length)} color="text-emerald-600" />
                <StatCard icon={School} label="Schools" value={String(bySchool.size)} color="text-blue-600" />
                <StatCard icon={Users} label="Total Students" value={String(approvedRows.length)} color="text-primary" />
                <StatCard icon={Banknote} label="Grand Total" value={`KSh ${grandTotal.toLocaleString()}`} color="text-gold" />
              </div>

              {/* Sort controls */}
              <div className="flex flex-wrap items-center gap-3">
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
                <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No approved applications yet.</p>
                <p className="text-sm mt-1">Go to the Applications tab and mark applications as <strong>Approved</strong> to populate the broadsheet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Per-school accordion */}
                {Array.from(bySchool.entries()).map(([school, schoolRows], schoolIdx) => {
                  const schoolTotal = schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
                  const isOpen = bsExpanded.has(school);
                  return (
                    <div key={school} className="bg-card border border-border rounded-2xl overflow-hidden">
                      {/* School header */}
                      <button
                        onClick={() => toggleSchool(school)}
                        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <School className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-base text-foreground truncate">{school}</p>
                            <p className="text-xs text-muted-foreground">
                              {schoolRows[0].school_category && `${schoolRows[0].school_category} · `}
                              {schoolRows.length} student{schoolRows.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
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
                          <table className="w-full text-sm">
                            <thead className="bg-muted/20 text-[11px] uppercase tracking-wider text-muted-foreground">
                              <tr>
                                <th className="text-left px-4 py-2.5 w-8">#</th>
                                <th className="text-left px-4 py-2.5">Student Name</th>
                                <th className="text-left px-4 py-2.5">Ref</th>
                                <th className="text-left px-4 py-2.5">Grade</th>
                                <th className="text-left px-4 py-2.5">Gender</th>
                                <th className="text-left px-4 py-2.5">Guardian</th>
                                <th className="text-left px-4 py-2.5">Phone</th>
                                <th className="text-left px-4 py-2.5">Ward</th>
                                <th className="text-right px-4 py-2.5">Amount</th>
                                <th className="text-right px-4 py-2.5">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {schoolRows.map((r, idx) => (
                                <tr key={r.id} className={`hover:bg-muted/20 ${idx % 2 === 1 ? "bg-muted/10" : ""}`}>
                                  <td className="px-4 py-3 text-muted-foreground text-xs">
                                    {/* Global serial across all schools */}
                                    {(Array.from(bySchool.values()).slice(0, schoolIdx).reduce((s, arr) => s + arr.length, 0)) + idx + 1}
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-foreground">{r.student_name}</td>
                                  <td className="px-4 py-3 font-mono text-xs text-primary">{r.reference}</td>
                                  <td className="px-4 py-3 text-muted-foreground">{r.current_grade}</td>
                                  <td className="px-4 py-3 text-muted-foreground capitalize">{r.gender || "—"}</td>
                                  <td className="px-4 py-3">{r.guardian_name}</td>
                                  <td className="px-4 py-3 text-muted-foreground">{r.guardian_phone}</td>
                                  <td className="px-4 py-3 text-muted-foreground">{r.ward || "—"}</td>
                                  <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                    {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                                  </td>
                                  <td className="px-4 py-3">
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
                                <td colSpan={8} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                                  School sub-total — {schoolRows.length} student{schoolRows.length !== 1 ? "s" : ""}
                                </td>
                                <td className="px-4 py-2.5 text-right font-bold text-emerald-700">
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
                <div className="bg-primary rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-white text-center sm:text-left">
                    <p className="text-sm font-semibold opacity-80">Grand Total</p>
                    <p className="text-3xl font-display font-bold">KSh {grandTotal.toLocaleString()}</p>
                    <p className="text-xs opacity-70 mt-0.5">
                      {approvedRows.length} students across {bySchool.size} school{bySchool.size !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 gap-2"
                      onClick={downloadBroadsheet}
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-500 gap-2"
                      onClick={downloadBroadsheetExcel}
                    >
                      <FileSpreadsheet className="h-4 w-4" /> Cheque Summary Excel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SCHOOL CONFIRMATION LETTERS TAB ─────────────────────────────────── */}
        {tab === "letters" && (
          <>
          {/* Archive confirm modal */}
          <Dialog open={!!archiveConfirmSchool} onOpenChange={(o) => { if (!o) setArchiveConfirmSchool(null); }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-amber-500" /> Archive Confirmation Letter?
                </DialogTitle>
                <DialogDescription>
                  <strong>{archiveConfirmSchool}</strong> will be hidden from the active letters list.
                  No data is deleted — you can restore it at any time from the <em>Archived</em> view.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setArchiveConfirmSchool(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  disabled={archiveBusy === archiveConfirmSchool}
                  onClick={() => archiveConfirmSchool && archiveSchool(archiveConfirmSchool)}
                  className="gap-2"
                >
                  <Archive className="h-4 w-4" />
                  {archiveBusy === archiveConfirmSchool ? "Archiving…" : "Archive Letter"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid lg:grid-cols-[360px_1fr] gap-5">

            {/* Left: school search & select */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4 h-fit">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display font-bold text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gold" />
                    Confirmation Letters
                  </h2>
                  {/* Archive toggle */}
                  <button
                    onClick={() => { setShowArchived((v) => !v); setLetterSelectedSchool(null); }}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all shrink-0 ${
                      showArchived
                        ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {showArchived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                    {showArchived ? "Active" : `Archived${archivedSchools.size > 0 ? ` (${archivedSchools.size})` : ""}`}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {showArchived
                    ? "Archived letters are hidden from the active list. Restore any to make it downloadable again."
                    : "Search a school, then generate its official confirmation-of-beneficiaries letter."}
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

              <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                {letterSchoolList.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-10">
                    <School className="h-7 w-7 mx-auto mb-2 opacity-30" />
                    {showArchived
                      ? <><ArchiveX className="h-7 w-7 mx-auto mb-2 opacity-30" /><span>No archived letters yet.</span></>
                      : bySchool.size === 0
                        ? "No approved applications yet."
                        : "No school matches your search."}
                  </div>
                ) : (
                  letterSchoolList.map(({ school, count, total, category, isArchived, archivedAt }) => {
                    const active = letterSelectedSchool === school;
                    return (
                      <div
                        key={school}
                        className={`w-full rounded-xl border transition-all ${
                          active
                            ? "border-primary bg-primary/5 shadow-sm"
                            : isArchived
                              ? "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/10"
                              : "border-border hover:border-primary/40 hover:bg-muted/30"
                        }`}
                      >
                        <button
                          className="w-full text-left px-3.5 py-3"
                          onClick={() => setLetterSelectedSchool(school)}
                        >
                          <p className="font-semibold text-sm text-foreground truncate">{school}</p>
                          <div className="flex items-center justify-between mt-1 gap-2">
                            <span className="text-xs text-muted-foreground truncate">
                              {category && `${category} · `}{count} student{count !== 1 ? "s" : ""}
                              {isArchived && archivedAt && (
                                <span className="ml-1.5 text-amber-600 dark:text-amber-500">
                                  · archived {new Date(archivedAt).toLocaleDateString()}
                                </span>
                              )}
                            </span>
                            <span className="text-xs font-bold text-emerald-600 shrink-0">
                              KSh {total.toLocaleString()}
                            </span>
                          </div>
                        </button>
                        {/* Archive / Unarchive quick action */}
                        <div className="px-3.5 pb-2.5 -mt-1">
                          {isArchived ? (
                            <button
                              onClick={() => unarchiveSchool(school)}
                              disabled={archiveBusy === school}
                              className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:text-emerald-700 transition-colors disabled:opacity-50"
                            >
                              <ArchiveRestore className="h-3 w-3" />
                              {archiveBusy === school ? "Restoring…" : "Restore to active"}
                            </button>
                          ) : (
                            <button
                              onClick={() => setArchiveConfirmSchool(school)}
                              disabled={archiveBusy === school}
                              className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-amber-600 transition-colors disabled:opacity-50"
                            >
                              <Archive className="h-3 w-3" />
                              Archive letter
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: letter preview details & generate */}
            <div className="bg-card border border-border rounded-2xl p-6">
              {!letterSelectedSchool ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground">
                  {showArchived ? (
                    <>
                      <ArchiveRestore className="h-12 w-12 mb-3 opacity-20" />
                      <p className="font-semibold">Select an archived school</p>
                      <p className="text-sm mt-1 max-w-xs">
                        Click a school on the left to preview it, then restore it to make it downloadable again.
                      </p>
                    </>
                  ) : (
                    <>
                      <FileText className="h-12 w-12 mb-3 opacity-20" />
                      <p className="font-semibold">Select a school to get started</p>
                      <p className="text-sm mt-1 max-w-xs">
                        Pick a school from the list to preview its beneficiaries and generate the official confirmation letter.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-xl text-foreground">{letterSelectedSchool}</h3>
                        {archivedSchools.has(letterSelectedSchool) && (
                          <span className="flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                            <Archive className="h-3 w-3" /> Archived
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {letterSelectedRows.length} approved student{letterSelectedRows.length !== 1 ? "s" : ""} · Total KSh {letterSelectedTotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {archivedSchools.has(letterSelectedSchool) ? (
                        <Button
                          variant="outline"
                          onClick={() => unarchiveSchool(letterSelectedSchool)}
                          disabled={archiveBusy === letterSelectedSchool}
                          className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                          {archiveBusy === letterSelectedSchool ? "Restoring…" : "Restore"}
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => setArchiveConfirmSchool(letterSelectedSchool)} className="gap-2 text-muted-foreground hover:text-amber-600 hover:border-amber-300">
                          <Archive className="h-4 w-4" /> Archive
                        </Button>
                      )}
                      <Button variant="hero" onClick={downloadConfirmationLetter} disabled={archivedSchools.has(letterSelectedSchool)} className="gap-2">
                        <Download className="h-4 w-4" /> Download Letter
                      </Button>
                    </div>
                  </div>
                  {archivedSchools.has(letterSelectedSchool) && (
                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
                      <Archive className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <div className="text-sm text-amber-800 dark:text-amber-300">
                        <p className="font-semibold">This letter is archived</p>
                        <p className="text-xs mt-0.5">Downloading is disabled while archived. Click <strong>Restore</strong> to make it active again.</p>
                      </div>
                    </div>
                  )}

                  {/* Letter details form */}
                  <div className="grid sm:grid-cols-2 gap-4 bg-muted/20 border border-border rounded-xl p-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Term / Year</label>
                      <Input
                        value={letterTerm}
                        onChange={(e) => setLetterTerm(e.target.value)}
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
                      Beneficiaries — auto-filled from approved applications
                    </p>
                    <div className="border border-border rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                          <tr>
                            <th className="text-left px-3 py-2 w-8">#</th>
                            <th className="text-left px-3 py-2">Name</th>
                            <th className="text-left px-3 py-2">Form / Adm No.</th>
                            <th className="text-right px-3 py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {letterSelectedRows.map((r, i) => (
                            <tr key={r.id} className={i % 2 === 1 ? "bg-muted/10" : ""}>
                              <td className="px-3 py-2 text-muted-foreground text-xs">{i + 1}</td>
                              <td className="px-3 py-2 font-medium text-foreground">{r.student_name}</td>
                              <td className="px-3 py-2 text-muted-foreground text-xs">
                                {[r.current_grade, r.registration_number].filter(Boolean).join(" / ")}
                              </td>
                              <td className="px-3 py-2 text-right font-semibold">
                                {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-emerald-50">
                            <td colSpan={3} className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                              Total
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-emerald-700">
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
          </>
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
                  <div className="space-y-4 py-2">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-student-name">Student Name</Label>
                        <Input
                          id="edit-student-name"
                          value={editFields.student_name}
                          onChange={(e) => setEditFields(prev => ({ ...prev, student_name: e.target.value }))}
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
                        <Label htmlFor="edit-school-name">School (as typed by applicant)</Label>
                        <Input
                          id="edit-school-name"
                          value={editFields.school_name}
                          onChange={(e) => setEditFields(prev => ({ ...prev, school_name: e.target.value }))}
                          list="school-suggestions"
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
                        <Label htmlFor="edit-school-category">Category</Label>
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
                            <SelectItem value="Private">Private</SelectItem>
                            <SelectItem value="TVET">TVET / Vocational</SelectItem>
                            <SelectItem value="University">University</SelectItem>
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
                        <Label htmlFor="edit-school-sub-county">School Sub-county</Label>
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
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="edit-amount-requested">Amount Awarded (KSh)</Label>
                        <Input
                          id="edit-amount-requested"
                          type="number"
                          min="0"
                          step="500"
                          value={editFields.amount_requested}
                          onChange={(e) => setEditFields(prev => ({ ...prev, amount_requested: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t">
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
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <DetailGroup title="Student">
                      <Detail label="Registration No." value={selected.registration_number} />
                      <Detail label="DOB" value={selected.dob} />
                      <Detail label="Gender" value={selected.gender} />
                      <Detail label="Grade" value={selected.current_grade} />
                      <Detail label="Father alive" value={yn(selected.father_alive)} />
                      <Detail label="Mother alive" value={yn(selected.mother_alive)} />
                      <Detail label="Student disability" value={selected.student_disability ? (selected.student_disability_detail || "Yes") : "No"} />
                      <Detail label="Student annual fee" value={selected.student_annual_fee ? `KSh ${Number(selected.student_annual_fee).toLocaleString()}` : null} />
                      <Detail label="Outstanding balance" value={selected.outstanding_balance ? `KSh ${Number(selected.outstanding_balance).toLocaleString()}` : null} />
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
                        <Detail label="Standardized school name" value={selected.canonical_school_name} />
                      )}
                      <Detail label="Category" value={selected.school_category} />
                      <Detail label="County" value={selected.school_county} />
                      <Detail label="Sub-county" value={selected.school_sub_county} />
                      <Detail label="Year of admission" value={selected.year_of_admission} />
                      <Detail label="Bank account" value={selected.school_bank_account} />
                    </DetailGroup>
                    <DetailGroup title="Primary Contactable Parent / Guardian">
                      <Detail label="Name" value={selected.guardian_name} />
                      <Detail label="Phone" value={selected.guardian_phone} />
                      <Detail label="National ID" value={selected.parent_national_id} />
                      <Detail label="Occupation" value={selected.parent_occupation} />
                      <Detail label="Sub-county" value={selected.parent_residence_sub_county} />
                      <Detail label="Ward" value={selected.ward} />
                      <Detail label="Polling station" value={selected.polling_station} />
                      <Detail label="Disability" value={selected.parent_disability ? (selected.parent_disability_detail || "Yes") : "No"} />
                      <Detail label="Children in school" value={String(selected.siblings_in_school ?? "0")} />
                      <Detail label="Monthly budget" value={selected.monthly_budget ? `KSh ${Number(selected.monthly_budget).toLocaleString()}` : null} />
                      <Detail label="Amount requested" value={selected.amount_requested ? `KSh ${Number(selected.amount_requested).toLocaleString()}` : null} />
                      <Detail label="Submitted" value={new Date(selected.created_at).toLocaleString()} />
                    </DetailGroup>
                  </div>
                  {selected.reason && (
                    <div className="mt-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Reason</p>
                      <p className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-lg">{selected.reason}</p>
                    </div>
                  )}
                  {selected.sms_last_message && (
                    <div className="mt-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Last SMS · {selected.sms_last_sent_at ? new Date(selected.sms_last_sent_at).toLocaleString() : ""}
                      </p>
                      <p className="text-sm bg-gold/10 p-3 rounded-lg">{selected.sms_last_message}</p>
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
            <div className="rounded-lg bg-muted/40 border border-border px-3 py-2.5 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Spellings currently in this group:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {reviewSchoolVariants.map((v) => <li key={v}>{v}</li>)}
              </ul>
            </div>
          )}

          <div className="space-y-4">
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
    <div className="bg-muted/30 border border-border rounded-xl px-4 py-3 flex items-center gap-3">
      <Icon className={`h-5 w-5 shrink-0 ${color}`} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`font-display font-bold text-base ${color}`}>{value}</p>
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
      <div className="grid sm:grid-cols-2 gap-3 text-sm">{children}</div>
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