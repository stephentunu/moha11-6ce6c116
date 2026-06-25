import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as generateBroadsheetPdf, g as generateBursaryPdf, b as generateConfirmationLetter } from "./bursary-pdf-ydo4wW3U.mjs";
import { B as Button } from "./router-CiepFxU2.mjs";
import { B as Badge } from "./badge-BKIhghu5.mjs";
import { C as Checkbox } from "./checkbox-C0fBgvvq.mjs";
import { T as Textarea } from "./textarea-DKi4YOWV.mjs";
import { I as Input } from "./input-CYFYh61W.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DBfein5v.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-BLk4vIxs.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { A as AdminLayout } from "./AdminLayout-w8YYfmWJ.mjs";
import { s as supabase } from "./client-r8zzNwlx.mjs";
import { c as createSsrRpc } from "./createSsrRpc-C2cGivNr.mjs";
import { c as createServerFn } from "./index.mjs";
import "../_libs/jspdf.mjs";
import "../_libs/seroval.mjs";
import { G as GraduationCap, a as MapPin, ao as FileSpreadsheet, b as Mail, O as Search, ap as SquareCheckBig, X, j as CircleCheck, as as Trash2, aC as Eye, e as Send, ae as ChevronRight, aD as Clock3, A as ArrowLeft, y as School, aE as Pencil, aF as CircleX, D as Download, w as Users, aa as Banknote, aG as ArrowUpDown, C as ChevronDown, aj as FileText, p as Calendar } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "./admin-store-Pu01Ao05.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
const Schema = objectType({
  applicationId: stringType().uuid(),
  message: stringType().min(1).max(459)
});
const sendBursarySms = createServerFn({
  method: "POST"
}).inputValidator((d) => Schema.parse(d)).handler(createSsrRpc("27f8cd9ab7ac84567f04dc5052c10bbeacba76f5b59d1ba5c3a99c55c25f96b5"));
const STATUS_COLORS = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  reviewing: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-400"
};
function effectiveSchoolName(r) {
  return (r.canonical_school_name?.trim() || r.school_name || "").trim().toUpperCase();
}
function AdminBursariesPage() {
  const [rows, setRows] = reactExports.useState([]);
  const [tab, setTab] = reactExports.useState("applications");
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(null);
  const [smsOpen, setSmsOpen] = reactExports.useState(false);
  const [smsTarget, setSmsTarget] = reactExports.useState(null);
  const [smsText, setSmsText] = reactExports.useState("");
  const [smsBusy, setSmsBusy] = reactExports.useState(false);
  const [bsSort, setBsSort] = reactExports.useState("school_name");
  const [bsOrder, setBsOrder] = reactExports.useState("asc");
  const [bsExpanded, setBsExpanded] = reactExports.useState(/* @__PURE__ */ new Set());
  const [checkedIds, setCheckedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [bulkBusy, setBulkBusy] = reactExports.useState(false);
  const [letterSchoolSearch, setLetterSchoolSearch] = reactExports.useState("");
  const [letterSelectedSchool, setLetterSelectedSchool] = reactExports.useState(null);
  const [letterChequeNumber, setLetterChequeNumber] = reactExports.useState("");
  const [letterDate, setLetterDate] = reactExports.useState("");
  const [letterOfficerName, setLetterOfficerName] = reactExports.useState("Benard Omondi");
  const [letterOfficerPhone, setLetterOfficerPhone] = reactExports.useState("0725104771");
  const [letterTerm, setLetterTerm] = reactExports.useState(`${(/* @__PURE__ */ new Date()).getFullYear()} T2`);
  const [reviewCounty, setReviewCounty] = reactExports.useState(null);
  const [reviewSubCounty, setReviewSubCounty] = reactExports.useState(null);
  const [reviewSchool, setReviewSchool] = reactExports.useState(null);
  const [renameSchoolOpen, setRenameSchoolOpen] = reactExports.useState(false);
  const [renameSchoolDraft, setRenameSchoolDraft] = reactExports.useState("");
  const [renameSubCountyDraft, setRenameSubCountyDraft] = reactExports.useState("");
  const [renameCountyDraft, setRenameCountyDraft] = reactExports.useState("");
  const [renameSchoolBusy, setRenameSchoolBusy] = reactExports.useState(false);
  const [editAmountId, setEditAmountId] = reactExports.useState(null);
  const [editAmountValue, setEditAmountValue] = reactExports.useState("");
  const [editAmountBusy, setEditAmountBusy] = reactExports.useState(false);
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("bursary_applications").select("*").order("created_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setRows(data || []);
  };
  reactExports.useEffect(() => {
    load();
    const ch = supabase.channel("bursary-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "bursary_applications"
    }, () => load()).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return r.student_name.toLowerCase().includes(q) || (r.school_name || "").toLowerCase().includes(q) || (r.ward || "").toLowerCase().includes(q) || (r.reference || "").toLowerCase().includes(q) || (r.guardian_name || "").toLowerCase().includes(q);
    });
  }, [rows, filter, search]);
  const approvedRows = reactExports.useMemo(() => {
    const approved = rows.filter((r) => r.status === "approved");
    return [...approved].sort((a, b) => {
      let va = a[bsSort] ?? "";
      let vb = b[bsSort] ?? "";
      if (bsSort === "amount_requested") {
        va = Number(va);
        vb = Number(vb);
        return bsOrder === "asc" ? va - vb : vb - va;
      }
      va = String(va).toLowerCase();
      vb = String(vb).toLowerCase();
      const cmp = va.localeCompare(vb);
      return bsOrder === "asc" ? cmp : -cmp;
    });
  }, [rows, bsSort, bsOrder]);
  const bySchool = reactExports.useMemo(() => {
    const base = [...approvedRows].sort((a, b) => effectiveSchoolName(a).localeCompare(effectiveSchoolName(b)) || a.student_name.localeCompare(b.student_name));
    const map = /* @__PURE__ */ new Map();
    for (const r of base) {
      const key = effectiveSchoolName(r);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return map;
  }, [approvedRows]);
  const grandTotal = reactExports.useMemo(() => approvedRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0), [approvedRows]);
  const letterSchoolList = reactExports.useMemo(() => {
    const q = letterSchoolSearch.trim().toLowerCase();
    return Array.from(bySchool.entries()).map(([school, schoolRows]) => ({
      school,
      count: schoolRows.length,
      total: schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0),
      category: schoolRows[0]?.school_category ?? null
    })).filter((s) => !q || s.school.toLowerCase().includes(q)).sort((a, b) => a.school.localeCompare(b.school));
  }, [bySchool, letterSchoolSearch]);
  const letterSelectedRows = reactExports.useMemo(() => letterSelectedSchool ? bySchool.get(letterSelectedSchool) ?? [] : [], [bySchool, letterSelectedSchool]);
  const letterSelectedTotal = reactExports.useMemo(() => letterSelectedRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0), [letterSelectedRows]);
  const reviewCounties = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const key = (r.school_county || "Unspecified").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return Array.from(map.entries()).map(([county, countyRows]) => ({
      county,
      count: countyRows.length,
      pending: countyRows.filter((r) => r.status === "pending").length
    })).sort((a, b) => a.county.localeCompare(b.county));
  }, [rows]);
  const reviewSubCounties = reactExports.useMemo(() => {
    if (!reviewCounty) return [];
    const inCounty = rows.filter((r) => (r.school_county || "Unspecified").trim() === reviewCounty);
    const map = /* @__PURE__ */ new Map();
    for (const r of inCounty) {
      const key = (r.school_sub_county || "Unspecified").trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return Array.from(map.entries()).map(([subCounty, subRows]) => ({
      subCounty,
      count: subRows.length,
      pending: subRows.filter((r) => r.status === "pending").length
    })).sort((a, b) => a.subCounty.localeCompare(b.subCounty));
  }, [rows, reviewCounty]);
  const reviewSchools = reactExports.useMemo(() => {
    if (!reviewCounty || !reviewSubCounty) return [];
    const inLocation = rows.filter((r) => (r.school_county || "Unspecified").trim() === reviewCounty && (r.school_sub_county || "Unspecified").trim() === reviewSubCounty);
    const map = /* @__PURE__ */ new Map();
    for (const r of inLocation) {
      const key = effectiveSchoolName(r) || "Unspecified School";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return Array.from(map.entries()).map(([school, schoolRows]) => ({
      school,
      count: schoolRows.length,
      pending: schoolRows.filter((r) => r.status === "pending").length,
      category: schoolRows[0]?.school_category ?? null
    })).sort((a, b) => a.school.localeCompare(b.school));
  }, [rows, reviewCounty, reviewSubCounty]);
  const reviewStudents = reactExports.useMemo(() => {
    if (!reviewCounty || !reviewSubCounty || !reviewSchool) return [];
    return rows.filter((r) => (r.school_county || "Unspecified").trim() === reviewCounty && (r.school_sub_county || "Unspecified").trim() === reviewSubCounty && (effectiveSchoolName(r) || "Unspecified School") === reviewSchool).sort((a, b) => a.student_name.localeCompare(b.student_name));
  }, [rows, reviewCounty, reviewSubCounty, reviewSchool]);
  const reviewSchoolVariants = reactExports.useMemo(() => {
    const variants = new Set(reviewStudents.map((r) => r.school_name.trim()).filter(Boolean));
    return Array.from(variants);
  }, [reviewStudents]);
  const counts = reactExports.useMemo(() => {
    const c = {
      all: rows.length,
      pending: 0,
      reviewing: 0,
      approved: 0,
      rejected: 0
    };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);
  const allSchoolNames = reactExports.useMemo(() => {
    const names = /* @__PURE__ */ new Set();
    for (const r of rows) {
      const name = effectiveSchoolName(r);
      if (name) names.add(name);
    }
    return Array.from(names).sort();
  }, [rows]);
  const allSubCounties = reactExports.useMemo(() => {
    const names = /* @__PURE__ */ new Set();
    for (const r of rows) {
      if (r.school_sub_county) names.add(r.school_sub_county.trim().toUpperCase());
    }
    return Array.from(names).sort();
  }, [rows]);
  const allCounties = reactExports.useMemo(() => {
    const names = /* @__PURE__ */ new Set();
    for (const r of rows) {
      if (r.school_county) names.add(r.school_county.trim().toUpperCase());
    }
    return Array.from(names).sort();
  }, [rows]);
  const filteredIds = filtered.map((r) => r.id);
  const allChecked = filteredIds.length > 0 && filteredIds.every((id) => checkedIds.has(id));
  filteredIds.some((id) => checkedIds.has(id));
  const toggleOne = (id) => setCheckedIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleAll = () => {
    if (allChecked) {
      setCheckedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setCheckedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };
  const clearChecked = () => setCheckedIds(/* @__PURE__ */ new Set());
  const bulkUpdateStatus = async (status) => {
    const ids = [...checkedIds];
    setBulkBusy(true);
    const {
      error
    } = await supabase.from("bursary_applications").update({
      status
    }).in("id", ids);
    setBulkBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${ids.length} application${ids.length !== 1 ? "s" : ""} marked as ${status}`);
    clearChecked();
    load();
  };
  const bulkDelete = async () => {
    const ids = [...checkedIds];
    const names = rows.filter((r) => ids.includes(r.id)).map((r) => r.student_name);
    if (!window.confirm(`Delete ${ids.length} application${ids.length !== 1 ? "s" : ""}?

${names.slice(0, 5).join(", ")}${names.length > 5 ? ` and ${names.length - 5} more` : ""}

This cannot be undone.`)) return;
    setBulkBusy(true);
    const {
      error
    } = await supabase.from("bursary_applications").delete().in("id", ids);
    setBulkBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
    clearChecked();
    toast.success(`${ids.length} application${ids.length !== 1 ? "s" : ""} deleted`);
    load();
  };
  const updateStatus = async (id, status) => {
    const {
      error
    } = await supabase.from("bursary_applications").update({
      status
    }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Marked ${status}`);
      load();
    }
  };
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
    const {
      error
    } = await supabase.from("bursary_applications").update({
      canonical_school_name: newName,
      school_sub_county: newSubCounty || null,
      school_county: newCounty || null
    }).in("id", ids);
    setRenameSchoolBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${ids.length} application${ids.length !== 1 ? "s" : ""} updated`);
    setRenameSchoolOpen(false);
    if (newCounty !== reviewCounty || newSubCounty !== reviewSubCounty || newName !== reviewSchool) {
      setReviewSchool(null);
      if (newSubCounty !== reviewSubCounty) setReviewSubCounty(null);
      if (newCounty !== reviewCounty) setReviewCounty(null);
    } else {
      setReviewSchool(newName);
    }
    load();
  };
  const saveAmount = async (id) => {
    const parsed = parseFloat(editAmountValue.replace(/,/g, ""));
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Enter a valid amount (numbers only)");
      return;
    }
    setEditAmountBusy(true);
    const {
      error
    } = await supabase.from("bursary_applications").update({
      amount_requested: parsed
    }).eq("id", id);
    setEditAmountBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Amount updated");
    setEditAmountId(null);
    setEditAmountValue("");
    load();
  };
  const cancelEditAmount = () => {
    setEditAmountId(null);
    setEditAmountValue("");
  };
  const remove = async (id) => {
    if (!confirm("Delete this application permanently?")) return;
    const {
      error
    } = await supabase.from("bursary_applications").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      load();
    }
  };
  const openSms = (r) => {
    setSmsTarget(r);
    setSmsText(`Hello ${r.guardian_name.split(" ")[0]}, regarding ${r.student_name}'s bursary application (Ref ${r.reference}): `);
    setSmsOpen(true);
  };
  const sendSms = async () => {
    if (!smsTarget) return;
    setSmsBusy(true);
    try {
      const res = await sendBursarySms({
        data: {
          applicationId: smsTarget.id,
          message: smsText
        }
      });
      if (res.simulated) toast.success(`SMS simulated to ${res.phone}`);
      else toast.success(`SMS sent to ${res.phone}`);
      setSmsOpen(false);
      setSmsText("");
      setSmsTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send SMS");
    } finally {
      setSmsBusy(false);
    }
  };
  const downloadBroadsheet = () => {
    if (approvedRows.length === 0) {
      toast.error("No approved applications to include in the broadsheet.");
      return;
    }
    const bsRows = approvedRows.map((r) => ({
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
      // use canonical name if set
      school_category: r.school_category,
      school_bank_account: r.school_bank_account,
      school_county: r.school_county
      // needed for County → School grouping
    }));
    generateBroadsheetPdf(bsRows, `Moha Bursary Broadsheet — ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-KE")}`);
    toast.success("Broadsheet PDF generated!");
  };
  const downloadConfirmationLetter = () => {
    if (!letterSelectedSchool || letterSelectedRows.length === 0) {
      toast.error("Select a school with approved applicants first.");
      return;
    }
    const rows2 = letterSelectedRows.map((r) => ({
      student_name: r.student_name,
      registration_number: r.registration_number,
      current_grade: r.current_grade,
      amount_requested: r.amount_requested
    }));
    generateConfirmationLetter(rows2, {
      schoolName: letterSelectedSchool,
      termLabel: letterTerm,
      chequeNumber: letterChequeNumber.trim() || void 0,
      dateLabel: letterDate.trim() || void 0,
      officerName: letterOfficerName.trim() || void 0,
      officerPhone: letterOfficerPhone.trim() || void 0
    });
    toast.success(`Confirmation letter generated for ${letterSelectedSchool}`);
  };
  const toggleSchool = (school) => {
    setBsExpanded((prev) => {
      const next = new Set(prev);
      next.has(school) ? next.delete(school) : next.add(school);
      return next;
    });
  };
  const expandAll = () => setBsExpanded(new Set(bySchool.keys()));
  const collapseAll = () => setBsExpanded(/* @__PURE__ */ new Set());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Bursary Applications", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "school-suggestions", children: allSchoolNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: name }, name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "subcounty-suggestions", children: allSubCounties.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: name }, name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "county-suggestions", children: allCounties.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: name }, name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 bg-muted/50 border border-border rounded-xl p-1 w-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("applications"), className: `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "applications" ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-4 w-4" }),
          " All Applications"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("review"), className: `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "review" ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
          " Review by Location",
          counts.pending > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-amber-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5", children: counts.pending })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("broadsheet"), className: `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "broadsheet" ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
          " Approved Broadsheet",
          counts.approved > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-emerald-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5", children: counts.approved })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab("letters"), className: `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "letters" ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
          " School Confirmation Letters"
        ] }) })
      ] }),
      tab === "applications" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { list: "school-suggestions", placeholder: "Search by student name, school, ward, guardian or reference…", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9 h-11" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-5 gap-3", children: ["all", "pending", "reviewing", "approved", "rejected"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilter(k), className: `bg-card border-2 rounded-xl p-4 text-left transition-all ${filter === k ? "border-primary shadow-elegant" : "border-border hover:border-primary/40"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold mt-1", children: counts[k] ?? 0 })
        ] }, k)) }),
        checkedIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-4 w-4 text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-primary", children: [
              checkedIds.size,
              " application",
              checkedIds.size !== 1 ? "s" : "",
              " selected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearChecked, className: "ml-1 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: bulkBusy, onClick: () => bulkUpdateStatus("approved"), className: "gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              " Approve all"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", disabled: bulkBusy, onClick: () => bulkUpdateStatus("reviewing"), className: "gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50", children: "Reviewing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", disabled: bulkBusy, onClick: () => bulkUpdateStatus("pending"), className: "gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50", children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", disabled: bulkBusy, onClick: () => bulkUpdateStatus("rejected"), className: "gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50", children: "Reject all" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", disabled: bulkBusy, onClick: bulkDelete, className: "gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
              " Delete ",
              checkedIds.size
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block bg-card border border-border rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: allChecked, onCheckedChange: toggleAll, "aria-label": "Select all" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Ref" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "School / Grade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Ward" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 8, className: "text-center py-12 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
            "No applications match your filters."
          ] }) }) : filtered.map((r) => {
            const isChecked = checkedIds.has(r.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: isChecked ? "bg-primary/5" : "hover:bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: isChecked, onCheckedChange: () => toggleOne(r.id), "aria-label": `Select ${r.student_name}` }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs font-bold text-primary", children: r.reference }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: r.student_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  r.guardian_name,
                  " · ",
                  r.guardian_phone
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: r.school_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: r.current_grade })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.ward || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold", children: r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: r.status, onValueChange: (v) => updateStatus(r.id, v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: `h-8 w-32 text-xs font-bold uppercase ${STATUS_COLORS[r.status] ?? ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "reviewing", children: "Reviewing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "approved", children: "Approved" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "rejected", children: "Rejected" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setSelected(r), title: "View", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => openSms(r), title: "Send SMS", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(r.id), title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
              ] }) })
            ] }, r.id);
          }) })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden space-y-3", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
          "No applications match your filters."
        ] }) : filtered.map((r) => {
          const isChecked = checkedIds.has(r.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-card border rounded-2xl p-4 space-y-3 ${isChecked ? "border-primary/40 bg-primary/5" : "border-border"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: isChecked, onCheckedChange: () => toggleOne(r.id), className: "mt-1 shrink-0", "aria-label": `Select ${r.student_name}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-primary", children: r.reference }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: r.student_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  r.guardian_name,
                  " · ",
                  r.guardian_phone
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: r.status, onValueChange: (v) => updateStatus(r.id, v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: `h-7 text-[10px] font-bold uppercase ${STATUS_COLORS[r.status] ?? ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "reviewing", children: "Reviewing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "approved", children: "Approved" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "rejected", children: "Rejected" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "School" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: r.school_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: r.current_grade })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Amount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-2 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex-1", onClick: () => setSelected(r), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 mr-1" }),
                " View"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex-1", onClick: () => openSms(r), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5 mr-1" }),
                " SMS"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
            ] })
          ] }, r.id);
        }) })
      ] }),
      tab === "review" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-gold" }),
            "Review by Location"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Drill down from County → Sub-county → School to review every applicant from that school together, and merge duplicate school name spellings into one consistent entry." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 mt-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setReviewCounty(null);
              setReviewSubCounty(null);
              setReviewSchool(null);
            }, className: `px-2.5 py-1 rounded-lg font-semibold transition-colors ${!reviewCounty ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`, children: "All Counties" }),
            reviewCounty && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                setReviewSubCounty(null);
                setReviewSchool(null);
              }, className: `px-2.5 py-1 rounded-lg font-semibold transition-colors ${!reviewSubCounty ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`, children: reviewCounty })
            ] }),
            reviewSubCounty && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReviewSchool(null), className: `px-2.5 py-1 rounded-lg font-semibold transition-colors ${!reviewSchool ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`, children: reviewSubCounty })
            ] }),
            reviewSchool && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 rounded-lg font-semibold bg-primary/10 text-primary", children: reviewSchool })
            ] })
          ] })
        ] }),
        !reviewCounty && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: reviewCounties.map(({
          county,
          count,
          pending
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setReviewCounty(county), className: "bg-card border border-border rounded-xl p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: county }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              count,
              " application",
              count !== 1 ? "s" : ""
            ] }),
            pending > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-amber-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-3 w-3" }),
              " ",
              pending,
              " pending"
            ] })
          ] })
        ] }, county)) }),
        reviewCounty && !reviewSubCounty && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setReviewCounty(null), className: "gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
            " Back to Counties"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: reviewSubCounties.map(({
            subCounty,
            count,
            pending
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setReviewSubCounty(subCounty), className: "bg-card border border-border rounded-xl p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: subCounty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                count,
                " application",
                count !== 1 ? "s" : ""
              ] }),
              pending > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-amber-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-3 w-3" }),
                " ",
                pending,
                " pending"
              ] })
            ] })
          ] }, subCounty)) })
        ] }),
        reviewCounty && reviewSubCounty && !reviewSchool && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setReviewSubCounty(null), className: "gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
            " Back to ",
            reviewCounty
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: reviewSchools.map(({
            school,
            count,
            pending,
            category
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setReviewSchool(school), className: "bg-card border border-border rounded-xl p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground leading-snug", children: school })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground shrink-0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 ml-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                category && `${category} · `,
                count,
                " student",
                count !== 1 ? "s" : ""
              ] }),
              pending > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-amber-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-3 w-3" }),
                " ",
                pending,
                " pending"
              ] })
            ] })
          ] }, school)) })
        ] }),
        reviewCounty && reviewSubCounty && reviewSchool && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setReviewSchool(null), className: "gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
              " Back to Schools"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
              setRenameSchoolDraft(reviewSchool || "");
              setRenameSubCountyDraft(reviewSubCounty || "");
              setRenameCountyDraft(reviewCounty || "");
              setRenameSchoolOpen(true);
            }, className: "gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
              " Fix / Standardize School Details"
            ] })
          ] }),
          reviewSchoolVariants.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-1", children: "⚠ Multiple spellings found for this school" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", children: [
              "Applicants entered: ",
              reviewSchoolVariants.map((v) => `"${v}"`).join(", "),
              '. Use "Fix / Standardize School Details" above to merge them and ensure they have consistent county and sub-county values.'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground", children: reviewSchool }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                reviewStudents.length,
                " application",
                reviewStudents.length !== 1 ? "s" : "",
                " from this school"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Student" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Grade" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Guardian" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-end gap-1", title: "Click row amount to edit", children: [
                  "Amount Awarded",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-2.5 w-2.5 opacity-50" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: reviewStudents.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: r.student_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[11px] text-primary", children: r.reference })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.current_grade }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: r.guardian_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: r.guardian_phone })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: editAmountId === r.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", onClick: (e) => e.stopPropagation(), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", step: "500", value: editAmountValue, onChange: (e) => setEditAmountValue(e.target.value), className: "h-8 w-28 text-right text-sm border-primary/50 focus-visible:ring-primary", autoFocus: true, onKeyDown: (e) => {
                    if (e.key === "Enter") saveAmount(r.id);
                    if (e.key === "Escape") cancelEditAmount();
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-8 gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-2 shrink-0", onClick: () => saveAmount(r.id), disabled: editAmountBusy, children: editAmountBusy ? "…" : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-8 px-2 text-muted-foreground shrink-0", onClick: cancelEditAmount, disabled: editAmountBusy, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center justify-end gap-1.5 cursor-pointer group hover:text-primary transition-colors py-1 pl-3 pr-1 rounded-md hover:bg-muted/40", onClick: () => {
                  setEditAmountId(r.id);
                  setEditAmountValue(String(r.amount_requested ?? ""));
                }, title: "Click to edit awarded amount", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold border-b border-dashed border-muted-foreground/35 group-hover:border-primary/50", children: r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: STATUS_COLORS[r.status] ?? "", children: r.status }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setSelected(r), title: "View full application", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50", onClick: () => updateStatus(r.id, "approved"), disabled: r.status === "approved", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                    " Approve"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "gap-1 border-blue-300 text-blue-700 hover:bg-blue-50", onClick: () => updateStatus(r.id, "reviewing"), disabled: r.status === "reviewing", children: "Reviewing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-1 border-rose-300 text-rose-700 hover:bg-rose-50", onClick: () => updateStatus(r.id, "rejected"), disabled: r.status === "rejected", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
                    " Reject"
                  ] })
                ] }) })
              ] }, r.id)) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Approved applications appear automatically in the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Approved Broadsheet" }),
            " and",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "School Confirmation Letters" }),
            " tabs under this same school name."
          ] })
        ] })
      ] }),
      tab === "broadsheet" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-5 w-5 text-gold" }),
                "Approved Bursary Broadsheet"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "All approved applications sorted and grouped by school. Download as a PDF to send to schools." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", onClick: downloadBroadsheet, disabled: approvedRows.length === 0, className: "gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              "Download Broadsheet PDF"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheck, label: "Approved", value: String(approvedRows.length), color: "text-emerald-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: School, label: "Schools", value: String(bySchool.size), color: "text-blue-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "Total Students", value: String(approvedRows.length), color: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Banknote, label: "Grand Total", value: `KSh ${grandTotal.toLocaleString()}`, color: "text-gold" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Sort by:" }),
            [["student_name", "Student Name"], ["school_name", "School"], ["ward", "Ward"], ["current_grade", "Grade"], ["amount_requested", "Amount"]].map(([field, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              if (bsSort === field) setBsOrder((o) => o === "asc" ? "desc" : "asc");
              else {
                setBsSort(field);
                setBsOrder("asc");
              }
            }, className: `flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${bsSort === field ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`, children: [
              label,
              bsSort === field && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-3 w-3" })
            ] }, field)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: expandAll, className: "text-xs text-primary hover:underline", children: "Expand all" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: collapseAll, className: "text-xs text-primary hover:underline", children: "Collapse all" })
            ] })
          ] })
        ] }),
        approvedRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "No approved applications yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm mt-1", children: [
            "Go to the Applications tab and mark applications as ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Approved" }),
            " to populate the broadsheet."
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          Array.from(bySchool.entries()).map(([school, schoolRows], schoolIdx) => {
            const schoolTotal = schoolRows.reduce((s, r) => s + (r.amount_requested ?? 0), 0);
            const isOpen = bsExpanded.has(school);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleSchool(school), className: "w-full flex items-center justify-between gap-3 px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-5 w-5 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground truncate", children: school }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      schoolRows[0].school_category && `${schoolRows[0].school_category} · `,
                      schoolRows.length,
                      " student",
                      schoolRows.length !== 1 ? "s" : ""
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Sub-total" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-emerald-600", children: [
                      "KSh ",
                      schoolTotal.toLocaleString()
                    ] })
                  ] }),
                  isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-5 w-5 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
                ] })
              ] }),
              isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/20 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 w-8", children: "#" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Student Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Ref" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Grade" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Gender" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Guardian" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Phone" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5", children: "Ward" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5", children: "Amount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5", children: "Actions" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: schoolRows.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `hover:bg-muted/20 ${idx % 2 === 1 ? "bg-muted/10" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: Array.from(bySchool.values()).slice(0, schoolIdx).reduce((s, arr) => s + arr.length, 0) + idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-foreground", children: r.student_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-primary", children: r.reference }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.current_grade }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground capitalize", children: r.gender || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: r.guardian_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.guardian_phone }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.ward || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-bold text-emerald-600", children: r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setSelected(r), title: "View", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => openSms(r), title: "SMS", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
                      const bsRows = schoolRows.map((s) => ({
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
                        school_bank_account: s.school_bank_account
                      }));
                      generateBroadsheetPdf(bsRows, `${school} — Bursary Award List`);
                    }, title: "Download school PDF", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }) })
                  ] }) })
                ] }, r.id)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-emerald-50 dark:bg-emerald-950/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 8, className: "px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-700", children: [
                    "School sub-total — ",
                    schoolRows.length,
                    " student",
                    schoolRows.length !== 1 ? "s" : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-bold text-emerald-700", children: [
                    "KSh ",
                    schoolTotal.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {})
                ] }) })
              ] }) })
            ] }, school);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white text-center sm:text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold opacity-80", children: "Grand Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-display font-bold", children: [
                "KSh ",
                grandTotal.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs opacity-70 mt-0.5", children: [
                approvedRows.length,
                " students across ",
                bySchool.size,
                " school",
                bySchool.size !== 1 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "border-white/40 text-white hover:bg-white/10 gap-2", onClick: downloadBroadsheet, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              " Download Full Broadsheet PDF"
            ] })
          ] })
        ] })
      ] }),
      tab === "letters" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[360px_1fr] gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-4 h-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-lg flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-gold" }),
              "Confirmation Letters"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Search a school, then generate its official confirmation-of-beneficiaries letter." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search school name…", value: letterSchoolSearch, onChange: (e) => setLetterSchoolSearch(e.target.value), className: "pl-9 h-10" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 max-h-[480px] overflow-y-auto pr-1", children: letterSchoolList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-muted-foreground py-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-7 w-7 mx-auto mb-2 opacity-30" }),
            bySchool.size === 0 ? "No approved applications yet." : "No school matches your search."
          ] }) : letterSchoolList.map(({
            school,
            count,
            total,
            category
          }) => {
            const active = letterSelectedSchool === school;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setLetterSelectedSchool(school), className: `w-full text-left px-3.5 py-3 rounded-xl border transition-all ${active ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 hover:bg-muted/30"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: school }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  category && `${category} · `,
                  count,
                  " student",
                  count !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-emerald-600", children: [
                  "KSh ",
                  total.toLocaleString()
                ] })
              ] })
            ] }, school);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl p-6", children: !letterSelectedSchool ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full min-h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-12 w-12 mb-3 opacity-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "Select a school to get started" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1 max-w-xs", children: "Pick a school from the list to preview its beneficiaries and generate the official confirmation letter." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl text-foreground", children: letterSelectedSchool }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
                letterSelectedRows.length,
                " approved student",
                letterSelectedRows.length !== 1 ? "s" : "",
                " · Total KSh ",
                letterSelectedTotal.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", onClick: downloadConfirmationLetter, className: "gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              " Download Letter"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4 bg-muted/20 border border-border rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Term / Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letterTerm, onChange: (e) => setLetterTerm(e.target.value), placeholder: "e.g. 2026 T2", className: "mt-1.5 h-9" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                " Date (optional)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letterDate, onChange: (e) => setLetterDate(e.target.value), placeholder: "Leave blank for a signing line", className: "mt-1.5 h-9" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Cheque Number (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letterChequeNumber, onChange: (e) => setLetterChequeNumber(e.target.value), placeholder: "Leave blank for a signing line", className: "mt-1.5 h-9" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Total Amount (auto-calculated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: `KSh ${letterSelectedTotal.toLocaleString()}.00`, disabled: true, className: "mt-1.5 h-9 font-semibold text-emerald-700 bg-emerald-50 border-emerald-200" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Field Officer Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letterOfficerName, onChange: (e) => setLetterOfficerName(e.target.value), className: "mt-1.5 h-9" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Field Officer Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: letterOfficerPhone, onChange: (e) => setLetterOfficerPhone(e.target.value), className: "mt-1.5 h-9" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2", children: "Beneficiaries — auto-filled from approved applications" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 w-8", children: "#" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2", children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2", children: "Form / Adm No." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2", children: "Amount" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: letterSelectedRows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: i % 2 === 1 ? "bg-muted/10" : "", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground text-xs", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: r.student_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground text-xs", children: [r.current_grade, r.registration_number].filter(Boolean).join(" / ") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-semibold", children: r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—" })
              ] }, r.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-emerald-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "px-3 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700", children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right font-bold text-emerald-700", children: [
                  "KSh ",
                  letterSelectedTotal.toLocaleString()
                ] })
              ] }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "The downloaded letter follows the official Moha Education Kitty letterhead format — ready to print and send to the school for signing and cheque collection." })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selected, onOpenChange: (o) => !o && setSelected(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: selected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-5 w-5 text-gold" }),
          selected.student_name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Ref ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-primary", children: selected.reference }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: STATUS_COLORS[selected.status] ?? "", children: selected.status })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailGroup, { title: "Student", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Registration No.", value: selected.registration_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "DOB", value: selected.dob }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Gender", value: selected.gender }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Grade", value: selected.current_grade }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Father alive", value: yn(selected.father_alive) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Mother alive", value: yn(selected.mother_alive) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Student disability", value: selected.student_disability ? selected.student_disability_detail || "Yes" : "No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Student annual fee", value: selected.student_annual_fee ? `KSh ${Number(selected.student_annual_fee).toLocaleString()}` : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Outstanding balance", value: selected.outstanding_balance ? `KSh ${Number(selected.outstanding_balance).toLocaleString()}` : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Received bursary before", value: selected.received_bursary_before ? `Yes${selected.previous_bursary_source ? ` — ${selected.previous_bursary_source}` : ""}${selected.previous_bursary_amount ? ` (KSh ${Number(selected.previous_bursary_amount).toLocaleString()})` : ""}` : "No" })
        ] }),
        selected.father_alive && /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailGroup, { title: "Father", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Name", value: selected.father_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Phone", value: selected.father_phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Occupation", value: selected.father_occupation }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "National ID", value: selected.father_national_id })
        ] }),
        selected.mother_alive && /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailGroup, { title: "Mother", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Name", value: selected.mother_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Phone", value: selected.mother_phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Occupation", value: selected.mother_occupation }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "National ID", value: selected.mother_national_id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailGroup, { title: "School", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "School (as typed by applicant)", value: selected.school_name }),
          selected.canonical_school_name && selected.canonical_school_name.trim() !== selected.school_name.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Standardized school name", value: selected.canonical_school_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Category", value: selected.school_category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "County", value: selected.school_county }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Sub-county", value: selected.school_sub_county }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Year of admission", value: selected.year_of_admission }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Bank account", value: selected.school_bank_account })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailGroup, { title: "Primary Contactable Parent / Guardian", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Name", value: selected.guardian_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Phone", value: selected.guardian_phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "National ID", value: selected.parent_national_id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Occupation", value: selected.parent_occupation }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Sub-county", value: selected.parent_residence_sub_county }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Ward", value: selected.ward }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Polling station", value: selected.polling_station }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Disability", value: selected.parent_disability ? selected.parent_disability_detail || "Yes" : "No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Children in school", value: String(selected.siblings_in_school ?? "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Monthly budget", value: selected.monthly_budget ? `KSh ${Number(selected.monthly_budget).toLocaleString()}` : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Amount requested", value: selected.amount_requested ? `KSh ${Number(selected.amount_requested).toLocaleString()}` : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Submitted", value: new Date(selected.created_at).toLocaleString() })
        ] })
      ] }),
      selected.reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1", children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-line bg-muted/40 p-3 rounded-lg", children: selected.reason })
      ] }),
      selected.sms_last_message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1", children: [
          "Last SMS · ",
          selected.sms_last_sent_at ? new Date(selected.sms_last_sent_at).toLocaleString() : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm bg-gold/10 p-3 rounded-lg", children: selected.sms_last_message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setSelected(null), children: "Close" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => generateBursaryPdf(toPdfData(selected)), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
          " Download PDF"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", onClick: () => {
          openSms(selected);
          setSelected(null);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          " Send SMS"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: smsOpen, onOpenChange: setSmsOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Send SMS Feedback" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: smsTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "To ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: smsTarget.guardian_name }),
          " (",
          smsTarget.guardian_phone || smsTarget.phone,
          ")"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: smsText, onChange: (e) => setSmsText(e.target.value), rows: 5, maxLength: 459 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        smsText.length,
        "/459 characters"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setSmsOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", onClick: sendSms, disabled: smsBusy || smsText.trim().length === 0, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          " ",
          smsBusy ? "Sending…" : "Send"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: renameSchoolOpen, onOpenChange: setRenameSchoolOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4 text-gold" }),
          " Standardize School Details"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "This sets one consistent school name, sub-county, and county across all ",
          reviewStudents.length,
          " application",
          reviewStudents.length !== 1 ? "s" : "",
          " currently grouped here. This corrects cases where applicants placed the school in the wrong sub-county."
        ] })
      ] }),
      reviewSchoolVariants.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border border-border px-3 py-2.5 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "Spellings currently in this group:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-0.5", children: reviewSchoolVariants.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: v }, v)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Official school name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { list: "school-suggestions", value: renameSchoolDraft, onChange: (e) => setRenameSchoolDraft(e.target.value), placeholder: "e.g. KANGA HIGH SCHOOL", className: "mt-1.5", autoFocus: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Sub-county" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { list: "subcounty-suggestions", value: renameSubCountyDraft, onChange: (e) => setRenameSubCountyDraft(e.target.value), placeholder: "e.g. MATHARE", className: "mt-1.5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "County" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { list: "county-suggestions", value: renameCountyDraft, onChange: (e) => setRenameCountyDraft(e.target.value), placeholder: "e.g. NAIROBI", className: "mt-1.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRenameSchoolOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", onClick: renameSchool, disabled: renameSchoolBusy || !renameSchoolDraft.trim(), children: renameSchoolBusy ? "Saving…" : "Apply to All" })
      ] })
    ] }) })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded-xl px-4 py-3 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-5 w-5 shrink-0 ${color}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-display font-bold text-base ${color}`, children: value })
    ] })
  ] });
}
function Detail({
  label,
  value,
  full
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: full ? "sm:col-span-2" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground whitespace-pre-line", children: value || "—" })
  ] });
}
function DetailGroup({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border rounded-xl p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-gold mb-2", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-3 text-sm", children })
  ] });
}
const yn = (v) => v === null || v === void 0 ? "—" : v ? "Yes" : "No";
function toPdfData(r) {
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
    reason: r.reason
  };
}
export {
  AdminBursariesPage as component
};
