import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Trash2, Pause, Play, ShieldCheck, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { useBusinesses, deleteBusiness, setBusinessStatus } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/businesses")({
  head: () => ({
    meta: [
      { title: "Business Moderation — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminBusinessesPage,
});

function AdminBusinessesPage() {
  const [businesses] = useBusinesses();
  const [q, setQ] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return businesses;
    return businesses.filter(
      (b) =>
        b.businessName.toLowerCase().includes(s) ||
        b.ownerName.toLowerCase().includes(s) ||
        b.ward.toLowerCase().includes(s) ||
        b.category.toLowerCase().includes(s)
    );
  }, [businesses, q]);

  const target = businesses.find((b) => b.id === confirmDelete) || null;

  return (
    <AdminLayout title="Business Moderation">
      <Toaster />
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ward, category…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> of {businesses.length} businesses
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No businesses found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-2.5 py-1.5 font-semibold">Business</th>
                    <th className="text-left px-2.5 py-1.5 font-semibold hidden md:table-cell">Owner</th>
                    <th className="text-left px-2.5 py-1.5 font-semibold hidden lg:table-cell">Location</th>
                    <th className="text-left px-2.5 py-1.5 font-semibold">Status</th>
                    <th className="text-right px-2.5 py-1.5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/30">
                      <td className="px-2.5 py-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={b.imageUrl}
                            alt={b.businessName}
                            className="h-12 w-12 rounded-lg object-cover bg-muted shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{b.businessName}</p>
                            <p className="text-xs text-muted-foreground truncate">{b.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2.5 py-1.5 hidden md:table-cell">
                        <p className="font-medium">{b.ownerName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {b.phone}
                        </p>
                      </td>
                      <td className="px-2.5 py-1.5 hidden lg:table-cell">
                        <p className="flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {b.ward}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{b.location}</p>
                      </td>
                      <td className="px-2.5 py-1.5">
                        {b.status === "active" ? (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 gap-1">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">
                            Suspended
                          </Badge>
                        )}
                      </td>
                      <td className="px-2.5 py-1.5">
                        <div className="flex items-center justify-end gap-2">
                          {b.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setBusinessStatus(b.id, "suspended");
                                toast.success(`${b.businessName} suspended`);
                              }}
                            >
                              <Pause className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Suspend</span>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setBusinessStatus(b.id, "active");
                                toast.success(`${b.businessName} reinstated`);
                              }}
                            >
                              <Play className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Reinstate</span>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmDelete(b.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!confirmDelete} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              {target ? `"${target.businessName}" will be permanently removed from the marketplace.` : ""} This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (confirmDelete) {
                  deleteBusiness(confirmDelete);
                  toast.success("Listing deleted");
                }
                setConfirmDelete(null);
              }}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}