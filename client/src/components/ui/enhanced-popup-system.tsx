import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface EnhancedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  showBackButton?: boolean;
  className?: string;
}

export function EnhancedPopup({ 
  isOpen, 
  onClose, 
  onBack, 
  title, 
  children, 
  maxWidth = "max-w-4xl",
  showBackButton = false,
  className = ""
}: EnhancedPopupProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-gray-900/95 border-orange-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-orange-500/20">
              <div className="flex items-center gap-3">
                {showBackButton && onBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <h2 className="text-xl font-bold text-white">{title}</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-red-500/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {children}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface CenteredModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CenteredModal({ isOpen, onClose, children, className = "" }: CenteredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-gray-900/95 rounded-2xl border border-orange-500/30 backdrop-blur-sm shadow-2xl max-w-md w-full ${className}`}
      >
        <div className="p-6">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}