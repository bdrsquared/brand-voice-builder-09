import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Copy, Search, ChevronLeft, ChevronRight, ExternalLink, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

type Contact = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  job_title: string | null;
  linkedin_url: string | null;
  source: string | null;
  created_at: string;
};

const ITEMS_PER_PAGE = 25;

const AdminGojiBerryContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showWebhook, setShowWebhook] = useState(false);

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gojiberry-webhook`;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("gojiberry_contacts" as any)
      .select("id, email, first_name, last_name, company, job_title, linkedin_url, source, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setContacts(data as unknown as Contact[]);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.email.toLowerCase().includes(q) ||
        (c.first_name || "").toLowerCase().includes(q) ||
        (c.last_name || "").toLowerCase().includes(q) ||
        (c.company || "").toLowerCase().includes(q)
    );
  }, [contacts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((c) => c.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from("gojiberry_contacts" as any).delete().in("id", ids);
    if (!error) {
      setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
      toast.success(`Deleted ${ids.length} contact(s)`);
    } else {
      toast.error("Failed to delete contacts");
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success("Webhook URL copied");
  };

  if (loading) {
    return <div className="text-muted-foreground text-sm py-8 text-center">Loading contacts...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">GojiBerry Contacts</h2>
          <p className="text-xs text-muted-foreground">{contacts.length} contact{contacts.length !== 1 ? "s" : ""} imported</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowWebhook(!showWebhook)} className="text-xs">
            {showWebhook ? "Hide" : "Show"} Webhook URL
          </Button>
        </div>
      </div>

      {/* Webhook URL */}
      {showWebhook && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-2">
          <p className="text-xs text-muted-foreground">
            Use this URL in your Zapier zap as a <strong>Webhooks by Zapier → POST</strong> action. Map GojiBerry fields to: <code className="bg-white/10 px-1 rounded">email</code>, <code className="bg-white/10 px-1 rounded">first_name</code>, <code className="bg-white/10 px-1 rounded">last_name</code>, <code className="bg-white/10 px-1 rounded">company</code>, <code className="bg-white/10 px-1 rounded">job_title</code>, <code className="bg-white/10 px-1 rounded">linkedin_url</code>
          </p>
          <div className="flex items-center gap-2">
            <Input value={webhookUrl} readOnly className="text-xs font-mono bg-white/5" />
            <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Search + Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-8 text-sm bg-white/5"
          />
        </div>
        {selectedIds.size > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <MoreHorizontal className="w-3.5 h-3.5 mr-1" />
                Actions ({selectedIds.size})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleBulkDelete} className="text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={paginated.length > 0 && selectedIds.size === paginated.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-xs hidden md:table-cell">Company</TableHead>
              <TableHead className="text-xs hidden lg:table-cell">Job Title</TableHead>
              <TableHead className="text-xs hidden lg:table-cell">LinkedIn</TableHead>
              <TableHead className="text-xs">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground text-sm py-8">
                  {search ? "No matching contacts" : "No contacts yet. Set up your Zapier webhook to start importing."}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((contact) => (
                <TableRow key={contact.id} className="border-white/10">
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(contact.id)}
                      onCheckedChange={() => toggleSelect(contact.id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {[contact.first_name, contact.last_name].filter(Boolean).join(" ") || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{contact.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{contact.company || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{contact.job_title || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {contact.linkedin_url ? (
                      <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(parseISO(contact.created_at), "MMM d")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-xs text-muted-foreground">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)} className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground px-2">{currentPage} / {totalPages}</span>
              <Button variant="ghost" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="h-8 w-8 p-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGojiBerryContacts;
