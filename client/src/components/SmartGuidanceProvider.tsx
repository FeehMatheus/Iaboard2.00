import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface GuidanceState {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  currentContext: string;
  completedActions: Set<string>;
  sessionTime: number;
  guidanceEnabled: boolean;
}

interface GuidanceContextType {
  state: GuidanceState;
  updateContext: (context: string) => void;
  setUserLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  markActionCompleted: (action: string) => void;
  toggleGuidance: () => void;
  shouldShowGuidance: (conditions?: any) => boolean;
}

const GuidanceContext = createContext<GuidanceContextType | null>(null);

export const useGuidance = () => {
  const context = useContext(GuidanceContext);
  if (!context) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
};

interface SmartGuidanceProviderProps {
  children: React.ReactNode;
  initialContext?: string;
  initialUserLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export const SmartGuidanceProvider: React.FC<SmartGuidanceProviderProps> = ({
  children,
  initialContext = 'general',
  initialUserLevel = 'beginner'
}) => {
  const [state, setState] = useState<GuidanceState>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('ia-board-guidance-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        completedActions: new Set(parsed.completedActions || []),
        sessionTime: 0
      };
    }
    
    return {
      userLevel: initialUserLevel,
      currentContext: initialContext,
      completedActions: new Set(),
      sessionTime: 0,
      guidanceEnabled: true
    };
  });

  useEffect(() => {
    // Save to localStorage (excluding sessionTime)
    const toSave = {
      userLevel: state.userLevel,
      currentContext: state.currentContext,
      completedActions: Array.from(state.completedActions),
      guidanceEnabled: state.guidanceEnabled
    };
    localStorage.setItem('ia-board-guidance-state', JSON.stringify(toSave));
  }, [state.userLevel, state.currentContext, state.completedActions, state.guidanceEnabled]);

  useEffect(() => {
    // Track session time
    const interval = setInterval(() => {
      setState(prev => ({ ...prev, sessionTime: prev.sessionTime + 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateContext = useCallback((context: string) => {
    setState(prev => {
      if (prev.currentContext === context) return prev;
      return { ...prev, currentContext: context };
    });
  }, []);

  const setUserLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setState(prev => ({ ...prev, userLevel: level }));
  };

  const markActionCompleted = (action: string) => {
    setState(prev => ({
      ...prev,
      completedActions: new Set(Array.from(prev.completedActions).concat([action]))
    }));
  };

  const toggleGuidance = () => {
    setState(prev => ({ ...prev, guidanceEnabled: !prev.guidanceEnabled }));
  };

  const shouldShowGuidance = (conditions?: any) => {
    if (!state.guidanceEnabled) return false;
    
    if (conditions) {
      if (conditions.userLevel && conditions.userLevel !== state.userLevel) return false;
      if (conditions.context && conditions.context !== state.currentContext) return false;
      if (conditions.minSessionTime && state.sessionTime < conditions.minSessionTime) return false;
      if (conditions.requiredActions) {
        const hasRequiredActions = conditions.requiredActions.every((action: string) => 
          state.completedActions.has(action)
        );
        if (!hasRequiredActions) return false;
      }
    }
    
    return true;
  };

  const contextValue: GuidanceContextType = {
    state,
    updateContext,
    setUserLevel,
    markActionCompleted,
    toggleGuidance,
    shouldShowGuidance
  };

  return (
    <GuidanceContext.Provider value={contextValue}>
      {children}
    </GuidanceContext.Provider>
  );
};

export default SmartGuidanceProvider;