interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepNames = [
  'State',
  'Profile',
  'Family',
  'Assets',
  'Preferences',
  'Calculate',
  'Results',
  'Action Plan'
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full border-b bg-card py-4 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-2">
          {stepNames.slice(0, totalSteps).map((name, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isComplete = stepNum < currentStep;
            
            return (
              <div key={stepNum} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isComplete
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isComplete ? '✓' : stepNum}
                  </div>
                  <span className={`text-xs hidden sm:block ${
                    isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {name}
                  </span>
                </div>
                {stepNum < totalSteps && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      isComplete ? 'bg-success' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
