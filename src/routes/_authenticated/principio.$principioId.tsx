import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/principio/$principioId")({
  component: () => <div>Princípio em carregamento...</div>,
});
