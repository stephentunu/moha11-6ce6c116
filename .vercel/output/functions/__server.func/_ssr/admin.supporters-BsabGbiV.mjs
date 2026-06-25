import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { r as readSync, u as utils, w as writeFileSync } from "../_libs/e965__xlsx.mjs";
import { B as Button, c as cn } from "./router-CXbsBUWo.mjs";
import { I as Input } from "./input-DKkwU37r.mjs";
import { T as Textarea } from "./textarea-PZUwCibH.mjs";
import { B as Badge } from "./badge--Vxi6TND.mjs";
import { C as Checkbox } from "./checkbox-5WWmtZFV.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bbw65E3G.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, I as Item2, S as Separator2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2, L as Label2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { A as AdminLayout } from "./AdminLayout-J4mXK0Nj.mjs";
import { M as MATHARE_WARDS } from "./admin-store-Pu01Ao05.mjs";
import { s as supabase } from "./client-r8zzNwlx.mjs";
import { an as UserPlus, ao as FileSpreadsheet, ac as Upload, D as Download, O as Search, ap as SquareCheckBig, X, aq as BellRing, ar as BellOff, as as Trash2, C as ChevronDown, ae as ChevronRight, n as Check, at as Circle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/zod.mjs";
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
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
const BATCH_SIZE = 300;
function normalizePhone(raw) {
  if (raw === null || raw === void 0) return "";
  const digits = String(raw).replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("254")) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+254" + digits.slice(1);
  if (digits.length === 9 && digits.startsWith("7")) return "+254" + digits;
  return digits;
}
function pick(obj, keys) {
  for (const k of keys) {
    const found = Object.keys(obj).find((kk) => kk.trim().toLowerCase() === k);
    if (found) {
      const v = obj[found];
      if (v !== null && v !== void 0 && String(v).trim() !== "") return String(v).trim();
    }
  }
  return "";
}
function AdminSupportersPage() {
  const [list, setList] = reactExports.useState([]);
  const [q, setQ] = reactExports.useState("");
  const [wardFilter, setWardFilter] = reactExports.useState("all");
  const [form, setForm] = reactExports.useState({
    name: "",
    phone: "",
    id_number: "",
    ward: "",
    notes: ""
  });
  const [bulkPaste, setBulkPaste] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [importing, setImporting] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [bulkBusy, setBulkBusy] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("supporters").select("*").order("created_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setList(data || []);
  };
  reactExports.useEffect(() => {
    load();
    const ch = supabase.channel("supporters-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "supporters"
    }, () => load()).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);
  const filtered = reactExports.useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.filter((r) => (wardFilter === "all" || r.ward === wardFilter) && (!s || r.name.toLowerCase().includes(s) || r.phone.includes(s) || r.id_number.includes(s)));
  }, [list, q, wardFilter]);
  const stats = reactExports.useMemo(() => ({
    total: list.length,
    active: list.filter((r) => !r.opted_out).length,
    opted: list.filter((r) => r.opted_out).length
  }), [list]);
  const allFilteredIds = filtered.map((s) => s.id);
  const allChecked = allFilteredIds.length > 0 && allFilteredIds.every((id) => selected.has(id));
  const someChecked = allFilteredIds.some((id) => selected.has(id));
  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (allChecked) {
      setSelected((prev) => {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };
  const clearSelection = () => setSelected(/* @__PURE__ */ new Set());
  const bulkDelete = async () => {
    const ids = [...selected];
    const names = list.filter((s) => ids.includes(s.id)).map((s) => s.name);
    if (!window.confirm(`Delete ${ids.length} supporter${ids.length !== 1 ? "s" : ""}?

${names.slice(0, 5).join(", ")}${names.length > 5 ? ` and ${names.length - 5} more` : ""}

This cannot be undone.`)) return;
    setBulkBusy(true);
    const {
      error
    } = await supabase.from("supporters").delete().in("id", ids);
    setBulkBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setList((prev) => prev.filter((s) => !ids.includes(s.id)));
    clearSelection();
    toast.success(`${ids.length} supporter${ids.length !== 1 ? "s" : ""} deleted`);
    load();
  };
  const bulkOptOut = async (optedOut) => {
    const ids = [...selected];
    setBulkBusy(true);
    const {
      error
    } = await supabase.from("supporters").update({
      opted_out: optedOut
    }).in("id", ids);
    setBulkBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${ids.length} supporter${ids.length !== 1 ? "s" : ""} ${optedOut ? "opted out" : "reactivated"}`);
    clearSelection();
    load();
  };
  const addOne = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.id_number.trim()) {
      toast.error("Name, phone and ID number are required");
      return;
    }
    const phone = normalizePhone(form.phone);
    if (!phone) {
      toast.error("Invalid phone number");
      return;
    }
    setBusy(true);
    const {
      error
    } = await supabase.from("supporters").upsert({
      name: form.name.trim(),
      phone,
      id_number: form.id_number.trim(),
      ward: form.ward || null,
      notes: form.notes.trim()
    }, {
      onConflict: "phone"
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setForm({
      name: "",
      phone: "",
      id_number: "",
      ward: "",
      notes: ""
    });
    toast.success("Supporter saved");
    load();
  };
  const upsertBatch = async (rows) => {
    let inserted = 0;
    let failed = 0;
    setProgress({
      done: 0,
      total: rows.length
    });
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const {
        error
      } = await supabase.from("supporters").upsert(batch, {
        onConflict: "phone"
      });
      if (error) {
        failed += batch.length;
      } else {
        inserted += batch.length;
      }
      setProgress({
        done: Math.min(i + BATCH_SIZE, rows.length),
        total: rows.length
      });
    }
    return {
      inserted,
      failed
    };
  };
  const importBulk = async () => {
    const lines = bulkPaste.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) {
      toast.error("Paste at least one line");
      return;
    }
    const rows = [];
    const skipped = [];
    for (const line of lines) {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const [name, phoneRaw, id_number, ward] = parts;
      const phone = normalizePhone(phoneRaw);
      if (name && phone && id_number) rows.push({
        name,
        phone,
        id_number,
        ward: ward || null
      });
      else skipped.push(line);
    }
    if (!rows.length) {
      toast.error("No valid rows. Format per line: Name, Phone, ID, Ward");
      return;
    }
    setImporting(true);
    const {
      inserted,
      failed
    } = await upsertBatch(rows);
    setImporting(false);
    setProgress(null);
    if (failed) toast.error(`${failed} rows failed`);
    toast.success(`Imported ${inserted} supporters${skipped.length ? ` · skipped ${skipped.length} invalid` : ""}`);
    setBulkPaste("");
    load();
  };
  const onFilePicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = readSync(buf, {
        type: "array"
      });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = utils.sheet_to_json(ws, {
        defval: ""
      });
      const rows = [];
      const skipped = [];
      json.forEach((r, idx) => {
        const name = pick(r, ["name", "full name", "fullname", "supporter", "supporter name"]);
        const phoneRaw = pick(r, ["phone", "phone number", "mobile", "msisdn", "tel", "telephone", "contact"]);
        const id_number = pick(r, ["id", "id number", "id no", "id_number", "national id", "idno"]);
        const ward = pick(r, ["ward", "location"]);
        const notes = pick(r, ["notes", "note", "remark", "remarks"]);
        const phone = normalizePhone(phoneRaw);
        if (name && phone && id_number) rows.push({
          name,
          phone,
          id_number,
          ward: ward || null,
          notes
        });
        else skipped.push(idx + 2);
      });
      if (!rows.length) {
        toast.error("No valid rows found. Required columns: name, phone, id");
        setImporting(false);
        return;
      }
      const {
        inserted,
        failed
      } = await upsertBatch(rows);
      if (failed) toast.error(`${failed} rows failed`);
      toast.success(`Imported ${inserted} from ${file.name}${skipped.length ? ` · skipped ${skipped.length} invalid` : ""}`);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Could not read file. Use .xlsx, .xls or .csv");
    } finally {
      setImporting(false);
      setProgress(null);
    }
  };
  const downloadTemplate = () => {
    const ws = utils.json_to_sheet([{
      name: "Jane Doe",
      phone: "0712345678",
      id: "32145678",
      ward: "Mabatini",
      notes: ""
    }, {
      name: "John Kamau",
      phone: "0723000111",
      id: "11223344",
      ward: "Huruma",
      notes: ""
    }]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Supporters");
    writeFileSync(wb, "supporters-template.xlsx");
  };
  const toggleOpt = async (s) => {
    const {
      error
    } = await supabase.from("supporters").update({
      opted_out: !s.opted_out
    }).eq("id", s.id);
    if (error) toast.error(error.message);
    else load();
  };
  const removeOne = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from supporters? This cannot be undone.`)) return;
    const {
      error
    } = await supabase.from("supporters").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setList((prev) => prev.filter((s) => s.id !== id));
    toast.success(`${name} removed`);
    load();
  };
  const selectedCount = selected.size;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Supporters", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total supporters", value: stats.total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Active (will receive SMS)", value: stats.active }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Opted out", value: stats.opted })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
          " Add supporter"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Full name", value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Phone (e.g. 0712345678)", value: form.phone, onChange: (e) => setForm({
            ...form,
            phone: e.target.value
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "ID number", value: form.id_number, onChange: (e) => setForm({
            ...form,
            id_number: e.target.value
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.ward, onValueChange: (v) => setForm({
            ...form,
            ward: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Ward (optional)" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MATHARE_WARDS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: w, children: w }, w)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "sm:col-span-2", placeholder: "Notes (optional)", value: form.notes, onChange: (e) => setForm({
            ...form,
            notes: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 w-full", onClick: addOne, disabled: busy, children: busy ? "Saving…" : "Add supporter" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border p-5 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
            " Import from Excel / CSV"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
            "Pick an ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: ".xlsx" }),
            ", ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: ".xls" }),
            " or ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: ".csv" }),
            " file. Required columns:",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: " name" }),
            ", ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "phone" }),
            ", ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "id" }),
            ". Optional: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "ward" }),
            ", ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "notes" }),
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".xlsx,.xls,.csv", className: "hidden", onChange: onFilePicked }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1", onClick: () => fileRef.current?.click(), disabled: importing, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
              importing ? "Importing…" : "Choose file"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: downloadTemplate, disabled: importing, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
              " Template"
            ] })
          ] }),
          progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
            "Processed ",
            progress.done,
            " / ",
            progress.total
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold mb-2", children: "Or paste rows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-2", children: [
            "One per line — format: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Name, Phone, ID, Ward" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 5, placeholder: `Jane Doe, 0712345678, 32145678, Mabatini
John Kamau, 0723000111, 11223344, Huruma`, value: bulkPaste, onChange: (e) => setBulkPaste(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-3 w-full", variant: "secondary", onClick: importBulk, disabled: importing || !bulkPaste.trim(), children: importing ? "Importing…" : "Import pasted rows" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b flex flex-col md:flex-row gap-3 md:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "pl-9", placeholder: "Search name, phone, ID…", value: q, onChange: (e) => setQ(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: wardFilter, onValueChange: setWardFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "md:w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All wards" }),
            MATHARE_WARDS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: w, children: w }, w))
          ] })
        ] })
      ] }),
      selectedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-primary/5 border-b border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-4 w-4 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-primary", children: [
            selectedCount,
            " supporter",
            selectedCount !== 1 ? "s" : "",
            " selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearSelection, className: "ml-1 text-muted-foreground hover:text-foreground transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => bulkOptOut(false), disabled: bulkBusy, className: "gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "h-3.5 w-3.5 text-emerald-600" }),
            "Reactivate"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => bulkOptOut(true), disabled: bulkBusy, className: "gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-3.5 w-3.5 text-amber-600" }),
            "Opt out"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", onClick: bulkDelete, disabled: bulkBusy, className: "gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
            "Delete ",
            selectedCount
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: allChecked, onCheckedChange: toggleAll, "aria-label": "Select all", className: cn(someChecked && !allChecked && "data-[state=unchecked]:opacity-50"), "data-state": allChecked ? "checked" : someChecked ? "indeterminate" : "unchecked" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Ward" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "p-10 text-center text-muted-foreground", children: "No supporters found." }) }) : filtered.map((s) => {
          const isSelected = selected.has(s.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: cn("transition-colors hover:bg-muted/20", isSelected && "bg-primary/5"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: isSelected, onCheckedChange: () => toggleOne(s.id), "aria-label": `Select ${s.name}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs", children: s.phone }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs", children: s.id_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: s.ward || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: s.opted_out ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Opted out" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/15 text-emerald-700", children: "Active" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-1", children: [
                "Actions ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => toggleOpt(s), children: s.opted_out ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "h-4 w-4 mr-2 text-emerald-600" }),
                  " Reactivate"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-4 w-4 mr-2 text-amber-600" }),
                  " Opt out"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: () => removeOne(s.id, s.name), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                  " Delete"
                ] })
              ] })
            ] }) })
          ] }, s.id);
        }) })
      ] }) }),
      filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Showing ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: filtered.length }),
          " of",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: list.length }),
          " supporters"
        ] }),
        selectedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
          selectedCount,
          " selected"
        ] })
      ] })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border p-5 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-3xl font-display font-bold", children: value.toLocaleString() })
  ] });
}
export {
  AdminSupportersPage as component
};
