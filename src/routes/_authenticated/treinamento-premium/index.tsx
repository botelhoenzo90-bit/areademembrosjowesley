import { createFileRoute } from "@tanstack/react-router";
import PrinciplesDashboard from "../treinamento-premium.route";

export const Route = createFileRoute("/_authenticated/treinamento-premium/")({
  component: PrinciplesDashboard,
});
