import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, X, Check, Users, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import TeamMemberProfile from "./TeamMemberProfile";

const POSITIONS = [
  "Sales",
  "Marketing",
  "Operations",
  "Management",
  "Editing",
  "Creative",
  "Account Manager",
] as const;

type TeamMember = {
  id: string;
  name: string;
  position: string;
  description: string | null;
  email: string | null;
  interests: string | null;
  created_at: string;
};

const AdminSocialPostsManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: "", position: "", description: "", email: "", interests: "" });

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) setMembers(data as TeamMember[]);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const resetForm = () => {
    setForm({ name: "", position: "", description: "", email: "", interests: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.position) {
      toast.error("Name and position are required");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("team_members")
        .update({
          name: form.name.trim(),
          position: form.position,
          description: form.description.trim() || null,
          email: form.email.trim() || null,
          interests: form.interests.trim() || null,
        })
        .eq("id", editingId);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Team member updated");
    } else {
      const { error } = await supabase
        .from("team_members")
        .insert({
          name: form.name.trim(),
          position: form.position,
          description: form.description.trim() || null,
          email: form.email.trim() || null,
          interests: form.interests.trim() || null,
        });
      if (error) { toast.error("Failed to add"); return; }
      toast.success("Team member added");
    }

    resetForm();
    fetchMembers();
  };

  const handleEdit = (e: React.MouseEvent, member: TeamMember) => {
    e.stopPropagation();
    setForm({
      name: member.name,
      position: member.position,
      description: member.description || "",
      email: member.email || "",
      interests: member.interests || "",
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Team member removed");
    fetchMembers();
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading…</p>;

  if (selectedMember) {
    return <TeamMemberProfile member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-display flex items-center gap-2">
          <Users className="w-5 h-5" /> Team Members
        </h2>
        {!showForm && (
          <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Team Member
          </Button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-4">
          <h3 className="text-sm font-medium">{editingId ? "Edit" : "Add"} Team Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Select value={form.position} onValueChange={(v) => setForm((f) => ({ ...f, position: v }))}>
              <SelectTrigger><SelectValue placeholder="Position" /></SelectTrigger>
              <SelectContent>
                {POSITIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Email address" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <Textarea placeholder="Brief description of their role and expertise…" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
          <Textarea placeholder="Interests, topics and themes they care about…" value={form.interests} onChange={(e) => setForm((f) => ({ ...f, interests: e.target.value }))} rows={2} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}><Check className="w-4 h-4 mr-1" /> {editingId ? "Update" : "Save"}</Button>
            <Button size="sm" variant="ghost" onClick={resetForm}><X className="w-4 h-4 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      {members.length === 0 && !showForm ? (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No team members yet. Add your first team member to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{member.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {member.position}
                  </span>
                </div>
                {member.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{member.description}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => handleEdit(e, member)}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={(e) => handleDelete(e, member.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSocialPostsManager;
