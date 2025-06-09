import { useState, useEffect } from "react";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import FlowSteps from "@/components/FlowSteps";
import AIStatusPanel from "@/components/AIStatusPanel";
import ExportOptions from "@/components/ExportOptions";
import FunnelGenerator from "@/components/FunnelGenerator";
import ContentGenerator from "@/components/ContentGenerator";
import ProductTypeModal from "@/components/ProductTypeModal";
import StepProcessingModal from "@/components/StepProcessingModal";

export default function Home() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showFunnelGenerator, setShowFunnelGenerator] = useState(false);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [generatedFunnel, setGeneratedFunnel] = useState(null);
  
  const {
    steps,
    currentStep,
    isProcessing,
    startGeneration,
    processNextStep,
    resetGeneration,
    productType
  } = useAIGeneration();

  useEffect(() => {
    // Auto-show product type modal after 2 seconds if no product type selected
    const timer = setTimeout(() => {
      if (!productType && !showProductModal) {
        setShowProductModal(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [productType, showProductModal]);

  useEffect(() => {
    if (isProcessing && currentStep > 0) {
      setShowProcessingModal(true);
    } else {
      setShowProcessingModal(false);
    }
  }, [isProcessing, currentStep]);

  const handleStartClick = () => {
    if (productType) {
      handleStartGeneration(productType);
    } else {
      setShowProductModal(true);
    }
  };

  const handleProductTypeSelect = (selectedType: string) => {
    setShowProductModal(false);
    handleStartGeneration(selectedType);
  };

  const handleStartGeneration = async (selectedType: string) => {
    resetGeneration();
    await startGeneration(selectedType);
    // Start processing first step
    setTimeout(() => {
      processNextStep();
    }, 1000);
  };

  const handleStepComplete = () => {
    setShowProcessingModal(false);
    
    if (currentStep < steps.length) {
      // Continue to next step after a short delay
      setTimeout(() => {
        processNextStep();
      }, 1500);
    }
  };

  return (
    <div className="font-inter bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <WelcomeSection onStartClick={handleStartClick} />
        
        <FlowSteps steps={steps} />
        
        <AIStatusPanel />
        
        <ExportOptions />
      </main>

      <ProductTypeModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onConfirm={handleProductTypeSelect}
      />

      <StepProcessingModal
        isOpen={showProcessingModal}
        currentStep={currentStep}
        steps={steps}
        onComplete={handleStepComplete}
      />
    </div>
  );
}
