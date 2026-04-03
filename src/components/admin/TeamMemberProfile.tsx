
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Search, Sparkles, ExternalLink, Newspaper, Lightbulb, Loader2, PenLine, Copy, Check, X, Calendar as CalendarIcon, ThumbsUp, ThumbsDown, Trash2, CheckCircle, MoreHorizontal, ChevronDown, ChevronUp, BookOpen, Target, AlertTriangle, Quote, Link2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import ContentCalendar from "./ContentCalendar";

type TeamMember = {
  id: string;
  name: string;
  position: string;
  description: string | null;
  email: string | null;
  interests: string | null;
  created_at: string;
};

type ResearchData = {
  angle_summary?: string;
  why_now?: string;
  non_obvious_insight?: string;
  suggested_stance?: string;
  sources?: { url: string; title: string; description: string }[];
};

type DeepResearchData = {
  core_thesis?: string;
  mainstream_view?: string;
  what_makes_interesting?: string;
  supporting_arguments?: string[];
  counterarguments?: string[];
  examples?: { title: string; detail: string }[];
  sources?: { url: string; title: string; description: string }[];
  post_directions?: { type: string; description: string }[];
};

type Topic = {
  id: string;
  title: string;
  description: string | null;
  topic_type: string;
  source_url: string | null;
  status: string;
  created_at: string;
  research_data?: ResearchData | null;
  deep_research_data?: DeepResearchData | null;
};

type SocialPost = {
  id: string;
  topic_id: string;
  content: string;
  status: string;
  scheduled_date: string | null;
  created_at: string;
};

const TONES = [
  { value: "earworm", label: "Earworm (Default)", description: "Natural, opinionated, data-led — like a smart person who reads a lot" },
  { value: "professional", label: "Professional", description: "Polished and authoritative — data-driven, clear, confident" },
  { value: "casual", label: "Casual", description: "Relaxed and conversational — like texting a smart friend" },
];

const STANCE_COLORS: Record<string, string> = {
  practical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contrarian: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  strategic: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  cautionary: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "opinion-led": "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

interface TeamMemberProfileProps {
  member: TeamMember;
  onBack: () => void;
}

const TeamMemberProfile = ({ member, onBack }: TeamMemberProfileProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [researching, setResearching] = useState(false);
  const [deepResearchingId, setDeepResearchingId] = useState<string | null>(null);
  const [draftingTopicId, setDraftingTopicId] = useState<string | null>(null);
  const [polishingPostId, setPolishingPostId] = useState<string | null>(null);
  const [toneOfVoice, setToneOfVoice] = useState("earworm");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [activeTab, setActiveTab] = useState<"topics" | "drafts" | "calendar">("topics");
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());
  
  // Research dialog state
  const [showResearchDialog, setShowResearchDialog] = useState(false);
  const [researchTopicInput, setResearchTopicInput] = useState("");
  const [researchFocusInput, setResearchFocusInput] = useState("");
  
  // Deep research / expanded idea view
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [viewingDeepResearch, setViewingDeepResearch] = useState<string | null>(null);

  const fetchData = async () => {
    const [topicsRes, postsRes, memberRes] = await Promise.all([
      supabase
        .from("social_post_topics")
        .select("*")
        .eq("team_member_id", member.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("social_posts")
        .select("*")
        .eq("team_member_id", member.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("team_members")
        .select("tone_of_voice")
        .eq("id", member.id)
        .single(),
    ]);
    if (!topicsRes.error && topicsRes.data) setTopics(topicsRes.data as Topic[]);
    if (!postsRes.error && postsRes.data) setPosts(postsRes.data as SocialPost[]);
    if (!memberRes.error && memberRes.data) {
      setToneOfVoice((memberRes.data as any).tone_of_voice || "earworm");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [member.id]);

  const handleToneChange = async (value: string) => {
    setToneOfVoice(value);
    const { error } = await supabase
      .from("team_members")
      .update({ tone_of_voice: value })
      .eq("id", member.id);
    if (error) toast.error("Failed to update tone");
    else toast.success("Tone of voice updated");
  };

  const handleResearch = async () => {
    setResearching(true);
    setShowResearchDialog(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Not authenticated"); return; }
      const body: any = { team_member_id: member.id };
      if (researchTopicInput.trim()) body.custom_topic = researchTopicInput.trim();
      if (researchFocusInput.trim()) body.research_focus = researchFocusInput.trim();
      const { data, error } = await supabase.functions.invoke("research-social-topics", { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("5 new topic ideas generated!");
      setResearchTopicInput("");
      setResearchFocusInput("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to research topics");
    } finally {
      setResearching(false);
    }
  };

  const handleDeepResearch = async (topicId: string) => {
    setDeepResearchingId(topicId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Not authenticated"); return; }
      const { data, error } = await supabase.functions.invoke("deep-research-topic", {
        body: { topic_id: topicId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Deep research complete!");
      setViewingDeepResearch(topicId);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to deep research");
    } finally {
      setDeepResearchingId(null);
    }
  };

  const handleDraftPost = async (topicId: string) => {
    setDraftingTopicId(topicId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Not authenticated"); return; }
      const { data, error } = await supabase.functions.invoke("draft-social-post", {
        body: { topic_id: topicId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Post drafted!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to draft post");
    } finally {
      setDraftingTopicId(null);
    }
  };

  const handleCopyPost = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const handleSaveEdit = async (postId: string) => {
    const { error } = await supabase
      .from("social_posts")
      .update({ content: editContent, updated_at: new Date().toISOString() })
      .eq("id", postId);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Post updated");
    setEditingPostId(null);
    fetchData();
  };

  const handlePolishPost = async (postId: string) => {
    setPolishingPostId(postId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Not authenticated"); return; }
      const { data, error } = await supabase.functions.invoke("polish-social-post", {
        body: { post_id: postId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Post polished!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to polish post");
    } finally {
      setPolishingPostId(null);
    }

  const togglePostSelection = (postId: string) => {
    setSelectedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  };

  const approvedTopics = topics.filter((t) => t.status === "approved" || t.status === "drafted");
  const allDraftPostIds = posts.filter((p) => approvedTopics.some((t) => t.id === p.topic_id)).map((p) => p.id);

  const toggleSelectAll = () => {
    if (selectedPostIds.size === allDraftPostIds.length && allDraftPostIds.length > 0) {
      setSelectedPostIds(new Set());
    } else {
      setSelectedPostIds(new Set(allDraftPostIds));
    }
  };

  const handleBatchDeletePosts = async () => {
    if (selectedPostIds.size === 0) return;
    const { error } = await supabase
      .from("social_posts")
      .delete()
      .in("id", Array.from(selectedPostIds));
    if (error) { toast.error("Failed to delete posts"); return; }
    toast.success(`${selectedPostIds.size} post(s) deleted`);
    setSelectedPostIds(new Set());
    fetchData();
  };

  const handleTopicStatus = async (topicId: string, status: string) => {
    const { error } = await supabase
      .from("social_post_topics")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", topicId);
    if (error) toast.error("Failed to update topic");
    else toast.success(status === "approved" ? "Topic approved!" : status === "declined" ? "Topic declined" : "Status updated");
    fetchData();
  };

  const newTopics = topics.filter((t) => t.status === "new");
  const declinedTopics = topics.filter((t) => t.status === "declined");
  const selectedTone = TONES.find((t) => t.value === toneOfVoice);

  // Deep research view dialog
  const deepResearchTopic = viewingDeepResearch ? topics.find(t => t.id === viewingDeepResearch) : null;
  const deepResearch = deepResearchTopic?.deep_research_data as DeepResearchData | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold font-display">{member.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {member.position}
            </span>
          </div>
          {member.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{member.description}</p>
          )}
        </div>
      </div>

      {/* Member details + Tone of Voice */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {member.email && (
            <div>
              <span className="text-muted-foreground text-xs">Email</span>
              <p>{member.email}</p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground text-xs">Position</span>
            <p>{member.position}</p>
          </div>
        </div>
        {member.interests && (
          <div>
            <span className="text-muted-foreground text-xs">Interests & Topics</span>
            <p className="text-sm mt-0.5">{member.interests}</p>
          </div>
        )}

        {/* Tone of voice selector */}
        <div className="pt-2 border-t border-white/10">
          <span className="text-muted-foreground text-xs block mb-1.5">Tone of Voice</span>
          <Select value={toneOfVoice} onValueChange={handleToneChange}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTone && (
            <p className="text-xs text-muted-foreground mt-1">{selectedTone.description}</p>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab("topics")}
          className={`text-xs px-3 py-1.5 rounded-t-lg transition-colors ${activeTab === "topics" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Sparkles className="w-3 h-3 inline mr-1" />Topics & Ideas
        </button>
        <button
          onClick={() => setActiveTab("drafts")}
          className={`text-xs px-3 py-1.5 rounded-t-lg transition-colors ${activeTab === "drafts" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
        >
          <PenLine className="w-3 h-3 inline mr-1" />Drafts
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`text-xs px-3 py-1.5 rounded-t-lg transition-colors ${activeTab === "calendar" ? "bg-white/10 text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
        >
          <CalendarIcon className="w-3 h-3 inline mr-1" />Content Calendar
        </button>
      </div>

      {activeTab === "calendar" ? (
        <ContentCalendar posts={posts} topics={topics} onUpdate={fetchData} />
      ) : activeTab === "drafts" ? (
        <>
          {allDraftPostIds.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedPostIds.size === allDraftPostIds.length && allDraftPostIds.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-xs text-muted-foreground">
                  {selectedPostIds.size > 0 ? `${selectedPostIds.size} selected` : "Select all"}
                </span>
              </div>
              {selectedPostIds.size > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <MoreHorizontal className="w-3.5 h-3.5 mr-1" /> Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleBatchDeletePosts} className="text-red-400 focus:text-red-300">
                      <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete {selectedPostIds.size} post(s)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading drafts…</p>
          ) : approvedTopics.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-muted-foreground">
              <PenLine className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No approved topics yet. Approve ideas from the Topics & Ideas tab to start drafting.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {approvedTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  posts={posts.filter((p) => p.topic_id === topic.id)}
                  drafting={draftingTopicId === topic.id}
                  onDraft={() => handleDraftPost(topic.id)}
                  onCopy={handleCopyPost}
                  expandedPostId={expandedPostId}
                  setExpandedPostId={setExpandedPostId}
                  editingPostId={editingPostId}
                  editContent={editContent}
                  onStartEdit={(post) => { setEditingPostId(post.id); setEditContent(post.content); }}
                  onCancelEdit={() => setEditingPostId(null)}
                  onSaveEdit={handleSaveEdit}
                  setEditContent={setEditContent}
                  selectedPostIds={selectedPostIds}
                  onTogglePostSelection={togglePostSelection}
                />
              ))}
            </div>
          )}
        </>
      ) : (
      <>
      {/* Research dialog - Step 1 */}
      <Dialog open={showResearchDialog} onOpenChange={setShowResearchDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              What do you want to write about?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Topic</label>
              <Input
                placeholder="e.g. AI in content marketing, video podcasting for B2B, agency pricing…"
                value={researchTopicInput}
                onChange={(e) => setResearchTopicInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave blank to research based on {member.name}'s interests
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Research focus <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input
                placeholder="e.g. hot takes, controversial opinions, enterprise trends, founder perspective…"
                value={researchFocusInput}
                onChange={(e) => setResearchFocusInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleResearch()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Defaults to: hot takes, edge cases, contrarian opinions, trends
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowResearchDialog(false)}>Cancel</Button>
            <Button size="sm" onClick={handleResearch} disabled={researching}>
              {researching ? (
                <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Researching…</>
              ) : (
                <><Search className="w-4 h-4 mr-1" /> Find Angles</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deep Research Dialog - Step 4/5 */}
      <Dialog open={!!viewingDeepResearch} onOpenChange={(open) => !open && setViewingDeepResearch(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0">
          {deepResearchTopic && deepResearch && (
            <ScrollArea className="max-h-[85vh]">
              <div className="p-6 space-y-5">
                <DialogHeader>
                  <DialogTitle className="text-base leading-snug pr-8">{deepResearchTopic.title}</DialogTitle>
                  {deepResearchTopic.research_data?.suggested_stance && (
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border w-fit mt-1 ${STANCE_COLORS[deepResearchTopic.research_data.suggested_stance] || "bg-muted text-muted-foreground border-white/10"}`}>
                      {deepResearchTopic.research_data.suggested_stance}
                    </span>
                  )}
                </DialogHeader>

                {/* Core Thesis */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Core Thesis
                  </h4>
                  <p className="text-sm">{deepResearch.core_thesis}</p>
                </div>

                {/* Mainstream vs Interesting */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Mainstream View</h4>
                    <p className="text-xs leading-relaxed">{deepResearch.mainstream_view}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Why This Is Interesting</h4>
                    <p className="text-xs leading-relaxed">{deepResearch.what_makes_interesting}</p>
                  </div>
                </div>

                {/* Supporting Arguments */}
                {deepResearch.supporting_arguments && deepResearch.supporting_arguments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Supporting Arguments
                    </h4>
                    <ul className="space-y-1.5">
                      {deepResearch.supporting_arguments.map((arg, i) => (
                        <li key={i} className="text-xs leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-green-400/40">
                          {arg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Counterarguments */}
                {deepResearch.counterarguments && deepResearch.counterarguments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Counterarguments & Caveats
                    </h4>
                    <ul className="space-y-1.5">
                      {deepResearch.counterarguments.map((arg, i) => (
                        <li key={i} className="text-xs leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-400/40">
                          {arg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {deepResearch.examples && deepResearch.examples.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5" /> Examples & Proof Points
                    </h4>
                    <div className="space-y-2">
                      {deepResearch.examples.map((ex, i) => (
                        <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                          <p className="text-xs font-medium">{ex.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{ex.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Directions */}
                {deepResearch.post_directions && deepResearch.post_directions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5" /> Possible Post Directions
                    </h4>
                    <div className="space-y-2">
                      {deepResearch.post_directions.map((dir, i) => (
                        <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full border mb-1 ${STANCE_COLORS[dir.type] || "bg-muted text-muted-foreground border-white/10"}`}>
                            {dir.type}
                          </span>
                          <p className="text-xs leading-relaxed">{dir.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {deepResearch.sources && deepResearch.sources.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5" /> Sources ({deepResearch.sources.length})
                    </h4>
                    <div className="space-y-1">
                      {deepResearch.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 text-xs p-2 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 text-primary opacity-60 group-hover:opacity-100" />
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{src.title}</p>
                            <p className="text-muted-foreground">{src.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <Button
                    size="sm"
                    onClick={() => {
                      handleTopicStatus(deepResearchTopic.id, "approved");
                      setViewingDeepResearch(null);
                    }}
                    className="flex-1"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 mr-1.5" /> Approve & Draft Post
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingDeepResearch(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
          {deepResearchTopic && !deepResearch && (
            <div className="p-6 text-center">
              <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Loading deep research…</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Research button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> LinkedIn Topic Ideas
        </h3>
        <Button size="sm" onClick={() => setShowResearchDialog(true)} disabled={researching}>
          {researching ? (
            <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Researching…</>
          ) : (
            <><Search className="w-4 h-4 mr-1" /> Research Topics</>
          )}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading topics…</p>
      ) : newTopics.length === 0 && declinedTopics.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No topics to review. Click "Research Topics" to generate LinkedIn post ideas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Review - Rich idea cards */}
          {newTopics.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Pending Review ({newTopics.length})
              </h4>
              {newTopics.map((topic) => {
                const rd = topic.research_data as ResearchData | null;
                const isExpanded = expandedTopicId === topic.id;
                const isDeepResearching = deepResearchingId === topic.id;
                const hasDeepResearch = !!topic.deep_research_data;

                return (
                  <div key={topic.id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-3">
                    {/* Title + type badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm leading-snug">{topic.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                            topic.topic_type === "news"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-muted/50 text-muted-foreground border-white/10"
                          }`}>
                            {topic.topic_type === "news" ? "📰 News" : "💡 General"}
                          </span>
                          {rd?.suggested_stance && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${STANCE_COLORS[rd.suggested_stance] || "bg-muted text-muted-foreground border-white/10"}`}>
                              {rd.suggested_stance}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Angle summary - always visible */}
                    {rd?.angle_summary && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{rd.angle_summary}</p>
                    )}
                    {!rd?.angle_summary && topic.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{topic.description}</p>
                    )}

                    {/* Expanded details */}
                    {isExpanded && rd && (
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        {rd.why_now && (
                          <div>
                            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Why Now</h5>
                            <p className="text-xs leading-relaxed">{rd.why_now}</p>
                          </div>
                        )}
                        {rd.non_obvious_insight && (
                          <div>
                            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Non-Obvious Insight</h5>
                            <p className="text-xs leading-relaxed">{rd.non_obvious_insight}</p>
                          </div>
                        )}
                        {rd.sources && rd.sources.length > 0 && (
                          <div>
                            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Sources</h5>
                            <div className="space-y-1">
                              {rd.sources.map((src, i) => (
                                <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 text-xs hover:text-primary transition-colors group">
                                  <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 opacity-50 group-hover:opacity-100" />
                                  <span>
                                    <span className="font-medium">{src.title}</span>
                                    {src.description && <span className="text-muted-foreground"> — {src.description}</span>}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2.5 text-green-400 hover:text-green-300 hover:bg-green-500/10" onClick={() => handleTopicStatus(topic.id, "approved")}>
                        <ThumbsUp className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleTopicStatus(topic.id, "declined")}>
                        <ThumbsDown className="w-3 h-3 mr-1" /> Decline
                      </Button>
                      <div className="flex-1" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2.5"
                        onClick={() => {
                          if (hasDeepResearch) {
                            setViewingDeepResearch(topic.id);
                          } else {
                            handleDeepResearch(topic.id);
                          }
                        }}
                        disabled={isDeepResearching}
                      >
                        {isDeepResearching ? (
                          <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Researching…</>
                        ) : hasDeepResearch ? (
                          <><BookOpen className="w-3 h-3 mr-1" /> View Research</>
                        ) : (
                          <><BookOpen className="w-3 h-3 mr-1" /> Deep Research</>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Declined / Bin */}
          {declinedTopics.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-red-400" /> Declined ({declinedTopics.length})
              </h4>
              {declinedTopics.map((topic) => (
                <div key={topic.id} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-2 opacity-60">
                  <p className="font-medium text-sm">{topic.title}</p>
                  {topic.description && <p className="text-xs text-muted-foreground">{topic.description}</p>}
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => handleTopicStatus(topic.id, "new")}>
                    <ArrowLeft className="w-3 h-3 mr-1" /> Restore
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
};

// Simplified TopicCard for Drafts tab only
interface TopicCardProps {
  topic: Topic;
  posts: SocialPost[];
  drafting: boolean;
  onDraft: () => void;
  onCopy: (content: string) => void;
  selectedPostIds?: Set<string>;
  onTogglePostSelection?: (postId: string) => void;
  expandedPostId: string | null;
  setExpandedPostId: (id: string | null) => void;
  editingPostId: string | null;
  editContent: string;
  onStartEdit: (post: SocialPost) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  setEditContent: (content: string) => void;
}

const TopicCard = ({
  topic, posts, drafting, onDraft, onCopy,
  selectedPostIds, onTogglePostSelection,
  expandedPostId, setExpandedPostId,
  editingPostId, editContent, onStartEdit, onCancelEdit, onSaveEdit, setEditContent,
}: TopicCardProps) => (
  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-2">
    <div className="flex items-start justify-between gap-3">
      <p className="font-medium text-sm">{topic.title}</p>
      <div className="flex items-center gap-1 shrink-0">
        {topic.source_url && (
          <a href={topic.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
    {topic.description && (
      <p className="text-xs text-muted-foreground">{topic.description}</p>
    )}
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
        topic.status === 'approved'
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : topic.status === 'drafted'
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-muted text-muted-foreground border-white/10'
      }`}>
        {topic.status}
      </span>
      {(topic.status === 'approved' || topic.status === 'drafted') && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs px-2"
          onClick={onDraft}
          disabled={drafting}
        >
          {drafting ? (
            <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Drafting…</>
          ) : (
            <><PenLine className="w-3 h-3 mr-1" /> {posts.length > 0 ? 'Redraft' : 'Draft Post'}</>
          )}
        </Button>
      )}
    </div>

    {posts.map((post) => (
      <div key={post.id} className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <div className="flex gap-2">
          {selectedPostIds && onTogglePostSelection && (
            <Checkbox
              checked={selectedPostIds.has(post.id)}
              onCheckedChange={() => onTogglePostSelection(post.id)}
              className="mt-0.5 shrink-0"
            />
          )}
          <div className="flex-1">
        {editingPostId === post.id ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={8}
              className="text-xs"
            />
            <div className="flex gap-1">
              <Button size="sm" className="h-6 text-xs px-2" onClick={() => onSaveEdit(post.id)}>
                <Check className="w-3 h-3 mr-1" /> Save
              </Button>
              <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={onCancelEdit}>
                <X className="w-3 h-3 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs whitespace-pre-wrap leading-relaxed">
              {expandedPostId === post.id
                ? post.content
                : post.content.slice(0, 200) + (post.content.length > 200 ? '…' : '')}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {post.content.length > 200 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs px-2"
                  onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                >
                  {expandedPostId === post.id ? 'Collapse' : 'Expand'}
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => onCopy(post.content)}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => onStartEdit(post)}>
                <PenLine className="w-3 h-3 mr-1" /> Edit
              </Button>
            </div>
          </>
        )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default TeamMemberProfile;
