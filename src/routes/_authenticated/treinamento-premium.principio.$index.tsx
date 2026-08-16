import { createFileRoute } from "@tanstack/react-router";
import { PrincipleJourneyPage } from "./treinamento-premium.principio.$index.route";

export const Route = createFileRoute("/_authenticated/treinamento-premium/principio/$index")({
  component: PrincipleJourneyPage,
});
