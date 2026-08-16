import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/principio/$id")({
  component: () => <div>Princípio em carregamento...</div>,
});
