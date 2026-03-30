import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, Mic, Mail, Phone, Calendar, ChevronDown, ChevronUp, FileText, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import AdminBlogManager from "@/components/admin/AdminBlogManager";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  budget: string | null;
  type: string;
  created_at: string;
};

const Admin = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [activeTab, setActiveTab] = useState<"inquiries" | "blog">("inquiries");
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

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

  const totalInquiries = inquiries.length;
  const todayCount = inquiries.filter(
    (i) => format(parseISO(i.created_at), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  ).length;
  const weekCount = inquiries.filter(
    (i) => parseISO(i.created_at) >= startOfDay(subDays(new Date(), 7))
  ).length;

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold font-display">Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-lg p-0.5 mr-4">
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === "inquiries" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />Inquiries
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === "blog" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1.5" />Blog
            </button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {activeTab === "blog" ? (
          <AdminBlogManager />
        ) : (
          <>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Today", value: todayCount },
            { label: "This Week", value: weekCount },
            { label: "All Time", value: totalInquiries },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-semibold mt-1">{stat.value}</p>
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

        {/* Table */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Phone</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Budget</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No inquiries yet
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inq) => (
                  <>
                    <TableRow
                      key={inq.id}
                      className="border-border cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                    >
                      <TableCell>
                        <Badge variant="outline" className="text-xs border-border">
                          {inq.type === "contact" ? (
                            <><MessageSquare className="w-3 h-3 mr-1" /> Message</>
                          ) : (
                            <><Mic className="w-3 h-3 mr-1" /> Demo</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{inq.name}</TableCell>
                      <TableCell className="text-muted-foreground">{inq.email}</TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {inq.phone || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {inq.budget || "—"}
                      </TableCell>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
