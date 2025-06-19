import { useState, useEffect, useCallback } from 'react';

interface TooltipContextData {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  showTips: boolean;
  lastViewedFeatures: string[];
  sessionStartTime: number;
  interactionCount: number;
}

interface TooltipPreferences {
  autoShow: boolean;
  delay: number;
  showShortcuts: boolean;
  showExamples: boolean;
  contextAware: boolean;
}

export const useTooltipContext = () => {
  const [contextData, setContextData] = useState<TooltipContextData>(() => {
    const saved = localStorage.getItem('tooltip-context');
    return saved ? JSON.parse(saved) : {
      userLevel: 'beginner',
      showTips: true,
      lastViewedFeatures: [],
      sessionStartTime: Date.now(),
      interactionCount: 0
    };
  });

  const [preferences, setPreferences] = useState<TooltipPreferences>(() => {
    const saved = localStorage.getItem('tooltip-preferences');
    return saved ? JSON.parse(saved) : {
      autoShow: true,
      delay: 300,
      showShortcuts: true,
      showExamples: true,
      contextAware: true
    };
  });

  // Save to localStorage whenever context changes
  useEffect(() => {
    localStorage.setItem('tooltip-context', JSON.stringify(contextData));
  }, [contextData]);

  useEffect(() => {
    localStorage.setItem('tooltip-preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Determine user level based on interactions
  const updateUserLevel = useCallback(() => {
    const { interactionCount, sessionStartTime } = contextData;
    const sessionDuration = Date.now() - sessionStartTime;
    const hoursUsed = sessionDuration / (1000 * 60 * 60);

    let newLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

    if (interactionCount > 100 || hoursUsed > 5) {
      newLevel = 'advanced';
    } else if (interactionCount > 25 || hoursUsed > 1) {
      newLevel = 'intermediate';
    }

    if (newLevel !== contextData.userLevel) {
      setContextData(prev => ({ ...prev, userLevel: newLevel }));
    }
  }, [contextData]);

  // Track feature interaction
  const trackFeatureInteraction = useCallback((featureName: string) => {
    setContextData(prev => {
      const updatedFeatures = [featureName, ...prev.lastViewedFeatures.filter(f => f !== featureName)].slice(0, 10);
      
      return {
        ...prev,
        lastViewedFeatures: updatedFeatures,
        interactionCount: prev.interactionCount + 1
      };
    });
  }, []);

  // Check if feature is new to user
  const isNewFeature = useCallback((featureName: string) => {
    return !contextData.lastViewedFeatures.includes(featureName);
  }, [contextData.lastViewedFeatures]);

  // Get contextual tooltip content based on user level
  const getContextualContent = useCallback((baseContent: any) => {
    const { userLevel } = contextData;
    
    switch (userLevel) {
      case 'beginner':
        return {
          ...baseContent,
          showExamples: true,
          showShortcuts: preferences.showShortcuts,
          delay: preferences.delay + 200, // Longer delay for beginners
          autoShow: true
        };
      
      case 'intermediate':
        return {
          ...baseContent,
          showExamples: preferences.showExamples,
          showShortcuts: true,
          delay: preferences.delay,
          autoShow: preferences.autoShow
        };
      
      case 'advanced':
        return {
          ...baseContent,
          showExamples: false,
          showShortcuts: true,
          delay: Math.max(100, preferences.delay - 100), // Faster for advanced users
          autoShow: false // Advanced users prefer manual control
        };
      
      default:
        return baseContent;
    }
  }, [contextData.userLevel, preferences]);

  // Smart tooltip visibility logic
  const shouldShowTooltip = useCallback((featureName: string) => {
    if (!preferences.autoShow) return false;
    
    const { userLevel, lastViewedFeatures } = contextData;
    
    // Always show for beginners
    if (userLevel === 'beginner') return true;
    
    // Show for new features
    if (isNewFeature(featureName)) return true;
    
    // Show occasionally for intermediate users
    if (userLevel === 'intermediate') {
      return Math.random() < 0.3; // 30% chance
    }
    
    // Rarely show for advanced users
    return Math.random() < 0.1; // 10% chance
  }, [contextData, preferences.autoShow, isNewFeature]);

  // Update preferences
  const updatePreferences = useCallback((newPrefs: Partial<TooltipPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  // Reset context (for testing or user request)
  const resetContext = useCallback(() => {
    setContextData({
      userLevel: 'beginner',
      showTips: true,
      lastViewedFeatures: [],
      sessionStartTime: Date.now(),
      interactionCount: 0
    });
  }, []);

  // Get adaptive delay based on user behavior
  const getAdaptiveDelay = useCallback((featureName: string) => {
    const baseDelay = preferences.delay;
    const recentlyViewed = contextData.lastViewedFeatures.slice(0, 3);
    
    // Faster for recently viewed features
    if (recentlyViewed.includes(featureName)) {
      return Math.max(100, baseDelay - 150);
    }
    
    return baseDelay;
  }, [preferences.delay, contextData.lastViewedFeatures]);

  // Update user level periodically
  useEffect(() => {
    updateUserLevel();
  }, [updateUserLevel]);

  return {
    contextData,
    preferences,
    trackFeatureInteraction,
    isNewFeature,
    shouldShowTooltip,
    getContextualContent,
    updatePreferences,
    resetContext,
    getAdaptiveDelay
  };
};