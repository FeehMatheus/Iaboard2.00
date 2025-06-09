interface Step {
  step: number;
  title: string;
  description: string;
  completed: boolean;
  color: string;
}

interface FlowStepsProps {
  steps: Step[];
}

export default function FlowSteps({ steps }: FlowStepsProps) {
  const stepColors = [
    'from-indigo-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-pink-500 to-rose-600',
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-cyan-600',
    'from-violet-500 to-purple-600',
    'from-orange-500 to-red-600',
    'from-green-500 to-emerald-600'
  ];

  return (
    <>
      {/* Steps 1-4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {steps.slice(0, 4).map((step, index) => (
          <div 
            key={step.step}
            className="glass-effect rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 animate-fade-in" 
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${stepColors[index]} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                {step.step}
              </div>
              <h3 className="text-white font-semibold">{step.title}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">{step.description}</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${stepColors[index]} h-2 rounded-full transition-all duration-1000`}
                style={{ width: step.completed ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Steps 5-8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {steps.slice(4, 8).map((step, index) => (
          <div 
            key={step.step}
            className="glass-effect rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 animate-fade-in" 
            style={{ animationDelay: `${(index + 5) * 0.1}s` }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${stepColors[index + 4]} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                {step.step}
              </div>
              <h3 className="text-white font-semibold">{step.title}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">{step.description}</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${stepColors[index + 4]} h-2 rounded-full transition-all duration-1000`}
                style={{ width: step.completed ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
