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
  generatePrincipleDiagnosis, 
  completePrincipleProtocol 
} from "@/lib/principles.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "@tanstack/react-router";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated/principio/$id")({
  component: PrincipleJourneyPage,
});

function PrincipleJourneyPage() {
    const { id } = useParams({ from: "/_authenticated/principio/$id" });
    const principioId = parseInt(id);
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-black text-white p-12">
            <h1 className="text-4xl font-display">PRINCÍPIO {id} EM CARREGAMENTO</h1>
            <Button onClick={() => navigate({ to: "/treinamento-premium" })}>Voltar</Button>
        </div>
    );
}
