import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, CheckCircle2, Play, Trophy, Sparkles, 
  ChevronRight, Brain, ClipboardList, Loader2,
  Star, Zap
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { 
  getPrinciplesData, 
  savePrincipleResponse, 
  completePrincipleProtocol 
} from "@/lib/principles.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "@tanstack/react-router";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated/principio/$principioId")({
  component: PrincipleJourneyPage,
});

function PrincipleJourneyPage() {
  return <div>Rendered</div>;
}
