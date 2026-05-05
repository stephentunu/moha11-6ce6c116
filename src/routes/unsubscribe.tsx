import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ token: z.string().optional() });

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Unsubscribe" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const { token } = useSearch({ from: "/unsubscribe" });
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [name, setName] = useState<string>("");

  const optOut = async () => {
    if (!token) {
      setState("error");
      return;
    }
    setState("working");
    const { data, error } = await supabase
      .from("supporters" as never)
      .update({ opted_out: true } as never)
      .eq("opt_out_token", token)
      .select("name")
      .maybeSingle();
    if (error || !data) {
      setState("error");
      return;
    }
    setName((data as unknown as { name: string }).name);
    setState("done");
  };

  useEffect(() => {
    if (token) optOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="bg-card border rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Unsubscribe</h1>
        {state === "working" && <p className="text-muted-foreground">Processing your request…</p>}
        {state === "done" && (
          <p className="text-foreground">
            {name ? `${name}, you have ` : "You have "} been opted out. You will not receive
            further SMS from Team Moha.
          </p>
        )}
        {state === "error" && (
          <>
            <p className="text-destructive mb-4">Invalid or expired link.</p>
            <Button onClick={optOut} disabled={!token}>
              Try again
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
