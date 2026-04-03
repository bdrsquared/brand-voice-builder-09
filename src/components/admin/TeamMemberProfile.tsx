import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Sparkles, ExternalLink, Newspaper, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

interface TeamMemberProfileProps {
  member: TeamMember;
  onBack: () => void;
}

const TeamMemberProfile = ({ member, onBack }: TeamMemberProfileProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [researching, setResearching] = useState(false);

  const fetchTopics = async () => {
    const { data, error } = await supabase
      .from("social_post_topics")
      .select("*")
      .eq("team_member_id", member.id)
      .order("created_at", { ascending: false });
    if (!error && data) setTopics(data as Topic[]);
    setLoading(false);
  };

  useEffect(() => { fetchTopics(); }, [member.id]);

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
      fetchTopics();
    } catch (err: any) {
      toast.error(err.message || "Failed to research topics");
    } finally {
      setResearching(false);
    }
  };

  const newsTopics = topics.filter((t) => t.topic_type === "news");
  const generalTopics = topics.filter((t) => t.topic_type === "general");

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

      {/* Member details card */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3">
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
      </div>

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
        <div className="space-y-4">
          {newsTopics.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" /> News-Based ({newsTopics.length})
              </h4>
              {newsTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}
          {generalTopics.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> General Content ({generalTopics.length})
              </h4>
              {generalTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TopicCard = ({ topic }: { topic: Topic }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-1.5">
    <div className="flex items-start justify-between gap-3">
      <p className="font-medium text-sm">{topic.title}</p>
      {topic.source_url && (
        <a
          href={topic.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-primary hover:text-primary/80"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
    {topic.description && (
      <p className="text-xs text-muted-foreground">{topic.description}</p>
    )}
    <div className="flex items-center gap-2">
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
        topic.status === 'new' 
          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
          : 'bg-muted text-muted-foreground border-white/10'
      }`}>
        {topic.status}
      </span>
    </div>
  </div>
);

export default TeamMemberProfile;
