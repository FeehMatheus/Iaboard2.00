import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActionStatus, ActionResult } from "@/lib/aiActions";

interface ActionButtonProps {
  label: string;
  loadingLabel: string;
  successLabel: string;
  action: () => Promise<ActionResult>;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSuccess?: (result: ActionResult) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function ActionButton({
  label,
  loadingLabel,
  successLabel,
  action,
  variant = "default",
  size = "default",
  className = "",
  onSuccess,
  onError,
  disabled = false
}: ActionButtonProps) {
  const [status, setStatus] = useState<ActionStatus>({
    loading: false,
    completed: false,
    error: null,
    progress: 0
  });
  const { toast } = useToast();

  const handleClick = async () => {
    if (status.loading || disabled) return;

    setStatus({
      loading: true,
      completed: false,
      error: null,
      progress: 0
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 20, 90)
        }));
      }, 300);

      const result = await action();

      clearInterval(progressInterval);

      if (result.success) {
        setStatus({
          loading: false,
          completed: true,
          error: null,
          progress: 100
        });

        toast({
          title: "Ação concluída com sucesso!",
          description: "A operação foi executada corretamente.",
        });

        onSuccess?.(result);

        // Reset after 3 seconds
        setTimeout(() => {
          setStatus({
            loading: false,
            completed: false,
            error: null,
            progress: 0
          });
        }, 3000);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      setStatus({
        loading: false,
        completed: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        progress: 0
      });

      toast({
        title: "Erro na operação",
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
        variant: "destructive",
      });

      onError?.(error instanceof Error ? error.message : 'Erro desconhecido');

      // Reset error after 5 seconds
      setTimeout(() => {
        setStatus({
          loading: false,
          completed: false,
          error: null,
          progress: 0
        });
      }, 5000);
    }
  };

  const getButtonContent = () => {
    if (status.loading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel} ({Math.round(status.progress)}%)
        </>
      );
    }
    
    if (status.completed) {
      return (
        <>
          <Check className="mr-2 h-4 w-4" />
          {successLabel}
        </>
      );
    }
    
    if (status.error) {
      return (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          Erro - Tentar Novamente
        </>
      );
    }
    
    return label;
  };

  const getButtonVariant = () => {
    if (status.completed) return "default";
    if (status.error) return "destructive";
    return variant;
  };

  return (
    <Button
      onClick={handleClick}
      variant={getButtonVariant()}
      size={size}
      className={`transition-all duration-300 ${className} ${
        status.loading ? 'cursor-wait' : ''
      } ${status.completed ? 'bg-green-600 hover:bg-green-700' : ''}`}
      disabled={status.loading || disabled}
    >
      {getButtonContent()}
    </Button>
  );
}

interface DownloadButtonProps {
  label: string;
  downloadAction: () => Promise<ActionResult>;
  filename?: string;
  className?: string;
}

export function DownloadButton({
  label,
  downloadAction,
  filename = "download",
  className = ""
}: DownloadButtonProps) {
  return (
    <ActionButton
      label={label}
      loadingLabel="Preparando download"
      successLabel="Download pronto!"
      action={downloadAction}
      className={className}
      onSuccess={(result) => {
        if (result.downloadUrl) {
          // Create download link
          const link = document.createElement('a');
          link.href = result.downloadUrl;
          link.download = result.data?.filename || filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }}
    />
  );
}