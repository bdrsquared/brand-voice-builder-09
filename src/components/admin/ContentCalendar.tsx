
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, GripVertical, X } from "lucide-react";
import { toast } from "sonner";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";

type SocialPost = {
  id: string;
  topic_id: string;
  content: string;
  status: string;
  scheduled_date: string | null;
  created_at: string;
};

type Topic = {
  id: string;
  title: string;
  topic_type: string;
};

interface ContentCalendarProps {
  posts: SocialPost[];
  topics: Topic[];
  onUpdate: () => void;
}

const ContentCalendar = ({ posts, topics, onUpdate }: ContentCalendarProps) => {
  const [view, setView] = useState<"week" | "month">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingPostId, setDraggingPostId] = useState<string | null>(null);

  const unscheduledPosts = posts.filter((p) => !p.scheduled_date);

  const getTopicTitle = (topicId: string) => {
    return topics.find((t) => t.id === topicId)?.title || "Untitled";
  };

  const days = useMemo(() => {
    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate, view]);

  const navigate = (direction: "prev" | "next") => {
    if (view === "week") {
      setCurrentDate((d) => (direction === "prev" ? subWeeks(d, 1) : addWeeks(d, 1)));
    } else {
      setCurrentDate((d) => (direction === "prev" ? subMonths(d, 1) : addMonths(d, 1)));
    }
  };

  const handleDrop = async (date: Date, postId: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const { error } = await supabase
      .from("social_posts")
      .update({ scheduled_date: dateStr, status: "scheduled" })
      .eq("id", postId);
    if (error) {
      toast.error("Failed to schedule post");
    } else {
      toast.success(`Post scheduled for ${format(date, "d MMM yyyy")}`);
      onUpdate();
    }
    setDraggingPostId(null);
  };

  const handleUnschedule = async (postId: string) => {
    const { error } = await supabase
      .from("social_posts")
      .update({ scheduled_date: null, status: "draft" })
      .eq("id", postId);
    if (error) {
      toast.error("Failed to unschedule");
    } else {
      toast.success("Post unscheduled");
      onUpdate();
    }
  };

  const postsForDay = (day: Date) =>
    posts.filter((p) => p.scheduled_date && isSameDay(new Date(p.scheduled_date + "T00:00:00"), day));

  const headerLabel =
    view === "week"
      ? `${format(days[0], "d MMM")} – ${format(days[6], "d MMM yyyy")}`
      : format(currentDate, "MMMM yyyy");

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium">Content Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(v) => setView(v as "week" | "month")}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-medium min-w-[140px] text-center">{headerLabel}</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Calendar grid */}
        <div className="flex-1">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-[10px] text-muted-foreground text-center py-1 font-medium uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 border border-white/10 rounded-xl overflow-hidden">
            {days.map((day) => {
              const dayPosts = postsForDay(day);
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`border border-white/5 p-1.5 transition-colors ${
                    view === "week" ? "min-h-[180px]" : "min-h-[90px]"
                  } ${!inMonth && view === "month" ? "opacity-30" : ""} ${
                    draggingPostId ? "hover:bg-primary/10 cursor-copy" : ""
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const postId = e.dataTransfer.getData("text/plain");
                    if (postId) handleDrop(day, postId);
                  }}
                >
                  <div className={`text-[10px] mb-1 ${today ? "bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center font-bold" : "text-muted-foreground"}`}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-0.5">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className="group text-[10px] leading-tight px-1.5 py-1 rounded bg-primary/15 text-primary border border-primary/20 truncate cursor-grab relative"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", post.id);
                          setDraggingPostId(post.id);
                        }}
                        onDragEnd={() => setDraggingPostId(null)}
                        title={getTopicTitle(post.topic_id)}
                      >
                        <span className="truncate block pr-3">{getTopicTitle(post.topic_id)}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUnschedule(post.id); }}
                          className="absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unscheduled posts sidebar */}
        {unscheduledPosts.length > 0 && (
          <div className="w-[200px] shrink-0 space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Unscheduled ({unscheduledPosts.length})
            </p>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {unscheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="text-xs px-2 py-2 rounded-lg border border-white/10 bg-white/5 cursor-grab flex items-start gap-1.5 hover:bg-white/10 transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", post.id);
                    setDraggingPostId(post.id);
                  }}
                  onDragEnd={() => setDraggingPostId(null)}
                >
                  <GripVertical className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getTopicTitle(post.topic_id)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{post.content.slice(0, 80)}…</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCalendar;
