import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, Settings, Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Instituto Neuroconsciência" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setEmail(u.user?.email ?? "");
      if (u.user?.id) {
        const { data: p } = await supabase.from("profiles").select("display_name").eq("id", u.user.id).maybeSingle();
        setName(p?.display_name ?? "");
      }
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Até breve.");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="relative z-10 mx-auto max-w-xl px-6 pt-14">
        <div className="glass-strong rounded-3xl p-8 text-center shadow-elevated">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <span className="font-display text-2xl text-primary-foreground">
              {(name || email).slice(0, 1).toUpperCase()}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl">{name || "Sua jornada"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
        </div>

        <div className="mt-6 space-y-2">
          <Row icon={<User className="h-4 w-4" />} label="Editar perfil" />
          <Row icon={<Heart className="h-4 w-4" />} label="Meus favoritos" />
          <Row icon={<Settings className="h-4 w-4" />} label="Configurações" />
        </div>

        <button
          onClick={signOut}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm text-foreground transition-colors hover:bg-surface-elevated"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    </main>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="glass flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-surface-elevated">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated text-gold">
        {icon}
      </span>
      <span className="text-sm text-foreground">{label}</span>
    </button>
  );
}
