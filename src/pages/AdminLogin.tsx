import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import earwormLogo from "@/assets/earworm-logo-white.png";

declare global {
  interface Window {
    VANTA: any;
  }
}

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    const initVanta = () => {
      if (window.VANTA && vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.HALO({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
        });
      }
    };

    initVanta();
    const timer = setInterval(() => {
      if (window.VANTA) {
        initVanta();
        clearInterval(timer);
      }
    }, 100);

    return () => {
      clearInterval(timer);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.endsWith("@earworm.co")) {
      setError("Only @earworm.co emails are allowed");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        setError("Check your email to confirm your account, then sign in.");
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Login failed");

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        setError("You do not have admin access.");
        setLoading(false);
        return;
      }

      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2a3333] relative overflow-hidden">
      <div className="relative w-full max-w-4xl mx-6 z-10">
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden flex min-h-[520px]">
          {/* Left: Form */}
          <div className="flex-1 flex flex-col justify-center px-10 py-12 lg:px-14">
            <img src={earwormLogo} alt="Earworm" className="h-[17px] w-auto object-contain object-left max-w-[140px] mb-8" />
            <h1 className="text-2xl font-heading text-foreground mb-1">
              {isSignUp ? "Create account ✨" : "Welcome back 👋"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">Admin Dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-transparent border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
                  placeholder="Password"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className={`text-sm text-center ${error.includes("Check your email") ? "text-purple-400" : "text-destructive"}`}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium transition-all hover:from-purple-700 hover:to-purple-600 disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-purple-500/25"
              >
                {loading
                  ? isSignUp ? "Creating account..." : "Signing in..."
                  : isSignUp ? "Create Account" : "Log In"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-muted-foreground text-sm mt-6">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                className="text-foreground font-semibold hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Right: Vanta Halo animation (desktop only) */}
          <div className="hidden lg:flex w-[45%] p-3">
            <div
              ref={vantaRef}
              className="w-full h-full rounded-2xl overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
