import { useState } from "react";
import { Monitor, Package, Users, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productType: string) => void;
}

export default function ProductTypeModal({ isOpen, onClose, onConfirm }: ProductTypeModalProps) {
  const [selectedType, setSelectedType] = useState<string>('');

  const productTypes = [
    {
      type: 'digital',
      icon: Monitor,
      title: 'Produto Digital',
      description: 'Cursos, e-books, software, apps',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      type: 'physical',
      icon: Package,
      title: 'Produto Físico',
      description: 'Objetos tangíveis, inventário',
      color: 'from-green-500 to-emerald-600'
    },
    {
      type: 'service',
      icon: Users,
      title: 'Serviço',
      description: 'Consultoria, coaching, freelance',
      color: 'from-purple-500 to-pink-600'
    },
    {
      type: 'ai-decide',
      icon: BrainCircuit,
      title: 'Deixe a IA Decidir',
      description: 'IA escolhe a melhor opção',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const handleConfirm = () => {
    if (selectedType) {
      onConfirm(selectedType);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 border-0 max-w-none">
        <div className="glass-effect rounded-3xl max-w-2xl w-full p-8 animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo ao IA Board V2!</h2>
            <p className="text-gray-300">Que tipo de produto você deseja criar hoje?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {productTypes.map((product) => {
              const IconComponent = product.icon;
              return (
                <button
                  key={product.type}
                  onClick={() => setSelectedType(product.type)}
                  className={`glass-dark hover:bg-white/15 transition-all duration-300 p-6 rounded-2xl text-left group ${
                    selectedType === product.type ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${product.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{product.title}</h3>
                      <p className="text-gray-300 text-sm">{product.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleConfirm}
              disabled={!selectedType}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 h-auto rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              Continuar com Seleção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
