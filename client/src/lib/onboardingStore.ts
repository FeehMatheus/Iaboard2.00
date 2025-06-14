import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  isFirstVisit: boolean;
  hasCompletedOnboarding: boolean;
  isWizardOpen: boolean;
  currentWorkspace: string | null;
  onboardingData: {
    goal?: string;
    projectData?: {
      name: string;
      description: string;
      targetAudience: string;
      industry: string;
      budget: string;
    };
    workflowNodes?: number;
    createdAt?: string;
  } | null;
  
  // Actions
  setFirstVisit: (isFirst: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setWizardOpen: (open: boolean) => void;
  setCurrentWorkspace: (workspace: string | null) => void;
  setOnboardingData: (data: any) => void;
  resetOnboarding: () => void;
  shouldShowWizard: () => boolean;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      isFirstVisit: true,
      hasCompletedOnboarding: false,
      isWizardOpen: false,
      currentWorkspace: null,
      onboardingData: null,

      setFirstVisit: (isFirst) => 
        set({ isFirstVisit: isFirst }),

      setOnboardingCompleted: (completed) => 
        set({ hasCompletedOnboarding: completed, isFirstVisit: false }),

      setWizardOpen: (open) => 
        set({ isWizardOpen: open }),

      setCurrentWorkspace: (workspace) => 
        set({ currentWorkspace: workspace }),

      setOnboardingData: (data) => 
        set({ onboardingData: data }),

      resetOnboarding: () => 
        set({ 
          isFirstVisit: true, 
          hasCompletedOnboarding: false, 
          onboardingData: null,
          currentWorkspace: null 
        }),

      shouldShowWizard: () => {
        const state = get();
        return state.isFirstVisit && !state.hasCompletedOnboarding && !state.isWizardOpen;
      }
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        isFirstVisit: state.isFirstVisit,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        currentWorkspace: state.currentWorkspace,
        onboardingData: state.onboardingData,
      }),
    }
  )
);