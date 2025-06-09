import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface StepProcessingModalProps {
  isOpen: boolean;
  currentStep: number;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    status: string;
    completed: boolean;
  }>;
  onComplete: () => void;
}

export default function StepProcessingModal({ 
  isOpen, 
  currentStep, 
  steps, 
  onComplete 
}: StepProcessingModalProps) {
  const [progress, setProgress] = useState(0);
  
  const activeStep = steps[currentStep - 1];

  useEffect(() => {
    if (!isOpen || !activeStep) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen, activeStep, onComplete]);

  if (!activeStep) return null;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg max-h-[90vh] overflow-y-auto bg-black/50 backdrop-blur-sm z-50 p-0 border-0 scrollbar-hide">
        <div className="glass-effect rounded-3xl w-full p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{activeStep.title}</h3>
          <p className="text-gray-300 mb-6">{activeStep.description}</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">{activeStep.status}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
