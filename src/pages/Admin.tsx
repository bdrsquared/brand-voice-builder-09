import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, Mic, Mail, Phone, Calendar, ChevronDown, ChevronUp, FileText, BarChart3, Globe, Magnet, Archive, ChevronLeft, ChevronRight, Eye, Trash2, CheckCircle, MoreHorizontal, BellDot } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import AdminBlogManager from "@/components/admin/AdminBlogManager";
import AdminPagesManager from "@/components/admin/AdminPagesManager";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  budget: string | null;
  type: string;
  created_at: string;
  source_page: string | null;
  archived: boolean;
  read: boolean;
};

const ITEMS_PER_PAGE = 20;

const Admin = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pageViews, setPageViews] = useState<Array<{ page_path: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [pvTimeRange, setPvTimeRange] = useState(30);
  const [activeTab, setActiveTab] = useState<"inquiries" | "blog" | "pages">("inquiries");
  const [showArchived, setShowArchived] = useState(false);
  const [insightsSubTab, setInsightsSubTab] = useState<"leads" | "pageviews">("leads");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionsOpen, setActionsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin/login"); return; }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      fetchInquiries();
      fetchPageViews();
    };
    checkAuth();
  }, [navigate]);

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setInquiries(data as Inquiry[]);
    }
    setLoading(false);
  };

  const fetchPageViews = async () => {
    const since = subDays(new Date(), 90).toISOString();
    const { data } = await supabase
      .from("page_views")
      .select("page_path, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false }) as any;
    if (data) setPageViews(data);
  };

  const handleBulkArchive = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const newArchived = !showArchived; // archive if viewing active, unarchive if viewing archived
    const { error } = await supabase
      .from("inquiries")
      .update({ archived: newArchived } as any)
      .in("id", ids);
    if (!error) {
      setInquiries((prev) =>
        prev.map((i) => (selectedIds.has(i.id) ? { ...i, archived: newArchived } : i))
      );
      setSelectedIds(new Set());
    }
    setActionsOpen(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .in("id", ids);
    if (!error) {
      setInquiries((prev) => prev.filter((i) => !selectedIds.has(i.id)));
      setSelectedIds(new Set());
    }
    setActionsOpen(false);
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const { error } = await supabase
      .from("inquiries")
      .update({ read: true } as any)
      .in("id", ids);
    if (!error) {
      setInquiries((prev) =>
        prev.map((i) => (selectedIds.has(i.id) ? { ...i, read: true } : i))
      );
      setSelectedIds(new Set());
    }
    setActionsOpen(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedInquiries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedInquiries.map((i) => i.id)));
    }
  };

  const handleExpand = async (inq: Inquiry) => {
    const isExpanding = expandedId !== inq.id;
    setExpandedId(isExpanding ? inq.id : null);
    if (isExpanding && !inq.read) {
      await supabase
        .from("inquiries")
        .update({ read: true } as any)
        .eq("id", inq.id);
      setInquiries((prev) =>
        prev.map((i) => (i.id === inq.id ? { ...i, read: true } : i))
      );
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const filteredInquiries = useMemo(
    () => inquiries.filter((i) => (showArchived ? i.archived : !i.archived)),
    [inquiries, showArchived]
  );

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedInquiries = filteredInquiries.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  // Reset page and selection when switching views
  useEffect(() => { setCurrentPage(1); setSelectedIds(new Set()); }, [showArchived]);

  const chartData = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = timeRange - 1; i >= 0; i--) {
      const day = format(subDays(new Date(), i), "yyyy-MM-dd");
      days[day] = 0;
    }
    inquiries.forEach((inq) => {
      const day = format(parseISO(inq.created_at), "yyyy-MM-dd");
      if (days[day] !== undefined) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: format(parseISO(date), timeRange <= 7 ? "EEE" : "MMM d"),
      count,
    }));
  }, [inquiries, timeRange]);

  const pvChartData = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = pvTimeRange - 1; i >= 0; i--) {
      const day = format(subDays(new Date(), i), "yyyy-MM-dd");
      days[day] = 0;
    }
    pageViews.forEach((pv) => {
      const day = format(parseISO(pv.created_at), "yyyy-MM-dd");
      if (days[day] !== undefined) days[day]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: format(parseISO(date), pvTimeRange <= 7 ? "EEE" : "MMM d"),
      count,
    }));
  }, [pageViews, pvTimeRange]);

  const pvToday = pageViews.filter(
    (pv) => format(parseISO(pv.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  ).length;
  const pvWeek = pageViews.filter(
    (pv) => parseISO(pv.created_at) >= startOfDay(subDays(new Date(), 7))
  ).length;

  const activeInquiries = inquiries.filter((i) => !i.archived);
  const totalInquiries = activeInquiries.length;
  const todayCount = activeInquiries.filter(
    (i) => format(parseISO(i.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  ).length;
  const weekCount = activeInquiries.filter(
    (i) => parseISO(i.created_at) >= startOfDay(subDays(new Date(), 7))
  ).length;
  const archivedCount = inquiries.filter((i) => i.archived).length;

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }

  const renderTypeBadge = (inq: Inquiry) => (
    <Badge variant="outline" className="text-xs border-border">
      {inq.type === "contact" ? (
        <><MessageSquare className="w-3 h-3 mr-1" /> Message</>
      ) : inq.type === "cal_booking" ? (
        <><Calendar className="w-3 h-3 mr-1" /> Calendar</>
      ) : inq.type === "playpack" ? (
        <><Magnet className="w-3 h-3 mr-1" /> Magnet</>
      ) : (
        <><Mic className="w-3 h-3 mr-1" /> Demo</>
      )}
    </Badge>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
        <p className="text-xs text-muted-foreground">
          {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredInquiries.length)} of {filteredInquiries.length}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="text-xs text-muted-foreground px-1">…</span>
              ) : (
                <Button
                  key={p}
                  variant={p === safeCurrentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(p as number)}
                  className="h-8 w-8 p-0 text-xs"
                >
                  {p}
                </Button>
              )
            )}
          <Button
            variant="ghost"
            size="sm"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-semibold font-display">Dashboard</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${activeTab === "inquiries" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <BarChart3 className="w-3.5 h-3.5 inline mr-1" />Inquiries
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${activeTab === "blog" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1" />Blog
            </button>
            <button
              onClick={() => setActiveTab("pages")}
              className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${activeTab === "pages" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Globe className="w-3.5 h-3.5 inline mr-1" />Pages
            </button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm">
            <LogOut className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {activeTab === "blog" ? (
          <AdminBlogManager />
        ) : activeTab === "pages" ? (
          <AdminPagesManager />
        ) : (
          <>
        {/* Sub-tabs: Leads / Page Views */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5 w-fit">
          <button
            onClick={() => setInsightsSubTab("leads")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors flex items-center gap-1.5 ${insightsSubTab === "leads" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BarChart3 className="w-3.5 h-3.5" />Leads
          </button>
          <button
            onClick={() => setInsightsSubTab("pageviews")}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors flex items-center gap-1.5 ${insightsSubTab === "pageviews" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Eye className="w-3.5 h-3.5" />Page Views
          </button>
        </div>

        {insightsSubTab === "leads" ? (
          <>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { label: "Today", value: todayCount },
            { label: "This Week", value: weekCount },
            { label: "All Time", value: totalInquiries },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 sm:p-5">
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl sm:text-3xl font-semibold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">Inquiries Over Time</h2>
            <div className="flex gap-1">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setTimeRange(d)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    timeRange === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fill: "hsl(0 0% 50%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(0 0% 50%)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 7%)",
                    border: "1px solid hsl(0 0% 15%)",
                    borderRadius: 8,
                    color: "hsl(0 0% 95%)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="hsl(0 0% 95%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
          </>
        ) : (
          <>
        {/* Page Views Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { label: "Today", value: pvToday },
            { label: "This Week", value: pvWeek },
            { label: "Total (90d)", value: pageViews.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 sm:p-5">
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl sm:text-3xl font-semibold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Page Views Chart */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">Page Views Over Time</h2>
            <div className="flex gap-1">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setPvTimeRange(d)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    pvTimeRange === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pvChartData}>
                <XAxis dataKey="date" tick={{ fill: "hsl(0 0% 50%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(0 0% 50%)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 7%)",
                    border: "1px solid hsl(0 0% 15%)",
                    borderRadius: 8,
                    color: "hsl(0 0% 95%)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="hsl(145 80% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
          </>
        )}

        {insightsSubTab === "leads" && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          {/* Toolbar: active/archived toggle + bulk actions */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowArchived(false)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${!showArchived ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Active ({inquiries.filter((i) => !i.archived).length})
              </button>
              <button
                onClick={() => setShowArchived(true)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center gap-1 ${showArchived ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Archive className="w-3 h-3" />
                Archived ({archivedCount})
              </button>
            </div>

            {/* Bulk actions dropdown */}
            {selectedIds.size > 0 && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 border-white/10"
                  onClick={() => setActionsOpen(!actionsOpen)}
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                  Actions ({selectedIds.size})
                  <ChevronDown className="w-3 h-3" />
                </Button>
                {actionsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActionsOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-lg border border-white/10 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden">
                      <button
                        onClick={handleBulkArchive}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-white/[0.06] transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5 text-muted-foreground" />
                        {showArchived ? "Unarchive" : "Archive"}
                      </button>
                      <button
                        onClick={handleBulkMarkRead}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-white/[0.06] transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        Mark as read
                      </button>
                      <div className="h-px bg-white/[0.08]" />
                      <button
                        onClick={handleBulkDelete}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={paginatedInquiries.length > 0 && selectedIds.size === paginatedInquiries.length}
                      onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-primary cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Budget</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      {showArchived ? "No archived inquiries" : "No inquiries yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInquiries.map((inq) => (
                    <>
                      <TableRow
                        key={inq.id}
                        className={`border-border cursor-pointer hover:bg-muted/30 transition-colors ${!inq.read ? "bg-white/[0.02]" : ""}`}
                        onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(inq.id)}
                            onChange={() => toggleSelect(inq.id)}
                            className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-primary cursor-pointer"
                          />
                        </TableCell>
                        <TableCell>{renderTypeBadge(inq)}</TableCell>
                        <TableCell className="font-medium">
                          {inq.name}
                          {!inq.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary ml-2" />}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{inq.email}</TableCell>
                        <TableCell className="text-muted-foreground">{inq.phone || " - "}</TableCell>
                        <TableCell className="text-muted-foreground">{inq.budget || " - "}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(parseISO(inq.created_at), "MMM d, HH:mm")}
                        </TableCell>
                        <TableCell>
                          {expandedId === inq.id ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedId === inq.id && (
                        <TableRow key={`${inq.id}-detail`} className="border-border">
                          <TableCell colSpan={8} className="bg-muted/10 px-6 py-4">
                            <div className="space-y-3 text-sm">
                              <div className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <span>{inq.email}</span>
                              </div>
                              {inq.phone && (
                                <div className="flex items-start gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                  <span>{inq.phone}</span>
                                </div>
                              )}
                              {inq.budget && (
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                  <span>Budget: {inq.budget}</span>
                                </div>
                              )}
                              {inq.source_page && (
                                <div className="flex items-start gap-2">
                                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                  <span>Source: {inq.source_page}</span>
                                </div>
                              )}
                              {inq.message && (
                                <div className="mt-2 p-3 rounded-lg bg-background border border-border">
                                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                                  <p className="text-foreground whitespace-pre-wrap">{inq.message}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-white/10">
            {paginatedInquiries.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground text-sm">
                {showArchived ? "No archived inquiries" : "No inquiries yet"}
              </p>
            ) : (
              paginatedInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`p-4 cursor-pointer active:bg-muted/20 transition-colors ${!inq.read ? "bg-white/[0.02]" : ""}`}
                  onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(inq.id)}
                      onChange={() => toggleSelect(inq.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-primary cursor-pointer mt-1 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{inq.name}</span>
                        {!inq.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        <Badge variant="outline" className="text-[10px] border-border shrink-0">
                          {inq.type === "contact" ? "Message" : inq.type === "cal_booking" ? "Calendar" : inq.type === "playpack" ? "Magnet" : "Demo"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{inq.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(parseISO(inq.created_at), "MMM d, HH:mm")}
                      </p>
                    </div>
                    {expandedId === inq.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    )}
                  </div>

                  {expandedId === inq.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-sm ml-6">
                      {inq.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs">{inq.phone}</span>
                        </div>
                      )}
                      {inq.budget && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs">Budget: {inq.budget}</span>
                        </div>
                      )}
                      {inq.source_page && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs">Source: {inq.source_page}</span>
                        </div>
                      )}
                      {inq.message && (
                        <div className="mt-2 p-2.5 rounded-lg bg-background border border-border">
                          <p className="text-[10px] text-muted-foreground mb-1">Message</p>
                          <p className="text-xs text-foreground whitespace-pre-wrap">{inq.message}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
