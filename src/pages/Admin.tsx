import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, Mic, Mail, Phone, Calendar, ChevronDown, ChevronUp, FileText, BarChart3, Globe, Magnet, Archive, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleArchive = async (id: string) => {
    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry) return;
    const newArchived = !inquiry.archived;
    const { error } = await supabase
      .from("inquiries")
      .update({ archived: newArchived } as any)
      .eq("id", id);
    if (!error) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, archived: newArchived } : i))
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

  // Reset page when switching views
  useEffect(() => { setCurrentPage(1); }, [showArchived]);

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

        {/* Inquiries List */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          {/* Toggle active / archived */}
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
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Budget</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      {showArchived ? "No archived inquiries" : "No inquiries yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInquiries.map((inq) => (
                    <>
                      <TableRow
                        key={inq.id}
                        className="border-border cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                      >
                        <TableCell>{renderTypeBadge(inq)}</TableCell>
                        <TableCell className="font-medium">{inq.name}</TableCell>
                        <TableCell className="text-muted-foreground">{inq.email}</TableCell>
                        <TableCell className="text-muted-foreground">{inq.phone || " - "}</TableCell>
                        <TableCell className="text-muted-foreground">{inq.budget || " - "}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(parseISO(inq.created_at), "MMM d, HH:mm")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              title={inq.archived ? "Unarchive" : "Archive"}
                              onClick={(e) => { e.stopPropagation(); handleArchive(inq.id); }}
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </Button>
                            {expandedId === inq.id ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedId === inq.id && (
                        <TableRow key={`${inq.id}-detail`} className="border-border">
                          <TableCell colSpan={7} className="bg-muted/10 px-6 py-4">
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
                  className="p-4 cursor-pointer active:bg-muted/20 transition-colors"
                  onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{inq.name}</span>
                        <Badge variant="outline" className="text-[10px] border-border shrink-0">
                          {inq.type === "contact" ? "Message" : inq.type === "cal_booking" ? "Calendar" : inq.type === "playpack" ? "Magnet" : "Demo"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{inq.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(parseISO(inq.created_at), "MMM d, HH:mm")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        title={inq.archived ? "Unarchive" : "Archive"}
                        onClick={(e) => { e.stopPropagation(); handleArchive(inq.id); }}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </Button>
                      {expandedId === inq.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {expandedId === inq.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-sm">
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
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
