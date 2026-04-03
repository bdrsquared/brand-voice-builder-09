
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Sparkles, ExternalLink, Newspaper, Lightbulb, Loader2, PenLine, Copy, Check, X, Calendar as CalendarIcon, ThumbsUp, ThumbsDown, Trash2, CheckCircle } from "lucide-react";
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

type Topic = {
  id: string;
  title: string;
  description: string | null;
  topic_type: string;
  source_url: string | null;
  status: string;
  created_at: string;
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

interface TeamMemberProfileProps {
  member: TeamMember;
  onBack: () => void;
}

const TeamMemberProfile = ({ member, onBack }: TeamMemberProfileProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [researching, setResearching] = useState(false);
  const [draftingTopicId, setDraftingTopicId] = useState<string | null>(null);
  const [toneOfVoice, setToneOfVoice] = useState("earworm");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [activeTab, setActiveTab] = useState<"topics" | "calendar">("topics");

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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Not authenticated"); return; }
      const { data, error } = await supabase.functions.invoke("research-social-topics", {
        body: { team_member_id: member.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("5 new topic ideas generated!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to research topics");
    } finally {
      setResearching(false);
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
  const approvedTopics = topics.filter((t) => t.status === "approved" || t.status === "drafted");
  const declinedTopics = topics.filter((t) => t.status === "declined");
  const selectedTone = TONES.find((t) => t.value === toneOfVoice);

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
          <Sparkles className="w-3 h-3 inline mr-1" />Topics & Drafts
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
      ) : (
      <>
      {/* Research button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> LinkedIn Topic Ideas
        </h3>
        <Button size="sm" onClick={handleResearch} disabled={researching}>
          {researching ? (
            <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Researching…</>
          ) : (
            <><Search className="w-4 h-4 mr-1" /> Research Topics</>
          )}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading topics…</p>
      ) : topics.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No topics yet. Click "Research Topics" to generate LinkedIn post ideas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* New / Pending Review */}
          {newTopics.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Pending Review ({newTopics.length})
              </h4>
              {newTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  posts={posts.filter((p) => p.topic_id === topic.id)}
                  drafting={draftingTopicId === topic.id}
                  onDraft={() => handleDraftPost(topic.id)}
                  onCopy={handleCopyPost}
                  onApprove={() => handleTopicStatus(topic.id, "approved")}
                  onDecline={() => handleTopicStatus(topic.id, "declined")}
                  showReviewActions
                  expandedPostId={expandedPostId}
                  setExpandedPostId={setExpandedPostId}
                  editingPostId={editingPostId}
                  editContent={editContent}
                  onStartEdit={(post) => { setEditingPostId(post.id); setEditContent(post.content); }}
                  onCancelEdit={() => setEditingPostId(null)}
                  onSaveEdit={handleSaveEdit}
                  setEditContent={setEditContent}
                />
              ))}
            </div>
          )}

          {/* Approved / Ready to Draft */}
          {approvedTopics.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" /> Approved ({approvedTopics.length})
              </h4>
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
                />
              ))}
            </div>
          )}

          {/* Declined / Bin */}
          {declinedTopics.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-red-400" /> Declined ({declinedTopics.length})
              </h4>
              {declinedTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  posts={[]}
                  drafting={false}
                  onDraft={() => {}}
                  onCopy={handleCopyPost}
                  onRestore={() => handleTopicStatus(topic.id, "new")}
                  expandedPostId={expandedPostId}
                  setExpandedPostId={setExpandedPostId}
                  editingPostId={editingPostId}
                  editContent={editContent}
                  onStartEdit={(post) => { setEditingPostId(post.id); setEditContent(post.content); }}
                  onCancelEdit={() => setEditingPostId(null)}
                  onSaveEdit={handleSaveEdit}
                  setEditContent={setEditContent}
                />
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

interface TopicCardProps {
  topic: Topic;
  posts: SocialPost[];
  drafting: boolean;
  onDraft: () => void;
  onCopy: (content: string) => void;
  onApprove?: () => void;
  onDecline?: () => void;
  onRestore?: () => void;
  showReviewActions?: boolean;
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
  onApprove, onDecline, onRestore, showReviewActions,
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
        topic.status === 'new'
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          : topic.status === 'approved'
          ? 'bg-green-500/10 text-green-400 border-green-500/20'
          : topic.status === 'drafted'
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : topic.status === 'declined'
          ? 'bg-red-500/10 text-red-400 border-red-500/20'
          : 'bg-muted text-muted-foreground border-white/10'
      }`}>
        {topic.status}
      </span>
      {/* Approve / Decline for new topics */}
      {showReviewActions && (
        <>
          <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-green-400 hover:text-green-300 hover:bg-green-500/10" onClick={onApprove}>
            <ThumbsUp className="w-3 h-3 mr-1" /> Approve
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={onDecline}>
            <ThumbsDown className="w-3 h-3 mr-1" /> Decline
          </Button>
        </>
      )}
      {/* Restore for declined topics */}
      {onRestore && (
        <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={onRestore}>
          <ArrowLeft className="w-3 h-3 mr-1" /> Restore
        </Button>
      )}
      {/* Draft button only for approved topics */}
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

    {/* Drafted posts */}
    {posts.map((post) => (
      <div key={post.id} className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
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
    ))}
  </div>
);

export default TeamMemberProfile;
