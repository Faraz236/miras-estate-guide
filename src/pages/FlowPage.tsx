import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { SessionData } from '@/types/miras';
import { saveSession, clearSession } from '@/lib/sessionStorage';
import { useNavigate } from 'react-router-dom';
import StateSelector from './steps/StateSelector';
import ProfileStep from './steps/ProfileStep';
import FamilyStep from './steps/FamilyStep';
import AssetStep from './steps/AssetStep';
import PreferencesStep from './steps/PreferencesStep';
import ResultsStep from './steps/ResultsStep';

interface FlowPageProps {
  initialData: SessionData;
}

export default function FlowPage({ initialData }: FlowPageProps) {
  const [sessionData, setSessionData] = useState<SessionData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [showDisclaimer, setShowDisclaimer] = useState(!initialData.disclaimerAccepted);
  const navigate = useNavigate();

  useEffect(() => {
    saveSession(sessionData);
  }, [sessionData]);

  const handleWipeData = () => {
    if (confirm('Are you sure you want to end this session and clear all data?')) {
      clearSession();
      navigate('/');
    }
  };

  const handleDisclaimerAccept = () => {
    setSessionData(prev => ({ ...prev, disclaimerAccepted: true }));
    setShowDisclaimer(false);
  };

  const handleDisclaimerCancel = () => {
    navigate('/');
  };

  const updateSession = (updates: Partial<SessionData>) => {
    setSessionData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onWipeData={handleWipeData} />
      <ProgressBar currentStep={currentStep} totalSteps={6} />
      
      <DisclaimerModal 
        open={showDisclaimer}
        onAccept={handleDisclaimerAccept}
        onCancel={handleDisclaimerCancel}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentStep === 1 && (
          <StateSelector 
            selectedState={sessionData.state}
            onStateChange={(state) => updateSession({ state })}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <ProfileStep
            decedent={sessionData.decedent}
            date={sessionData.date}
            onUpdate={(decedent) => updateSession({ decedent })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 3 && (
          <FamilyStep
            family={sessionData.family}
            onUpdate={(family) => updateSession({ family })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 4 && (
          <AssetStep
            assets={sessionData.assets}
            family={sessionData.family}
            onUpdate={(assets) => updateSession({ assets })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 5 && (
          <PreferencesStep
            preferences={sessionData.preferences}
            onUpdate={(preferences) => updateSession({ preferences })}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        
        {currentStep === 6 && (
          <ResultsStep
            sessionData={sessionData}
            onBack={prevStep}
            onEdit={() => setCurrentStep(3)}
          />
        )}
      </main>
    </div>
  );
}
