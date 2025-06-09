'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import StepOneA from './steps/step-one-a';
import StepOneB from './steps/step-one-b';
import StepOneC from './steps/step-one-c';
import StepTwo from './steps/step-two';
import StepThree from './steps/step-three';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface OnboardingData {
  firstName: string;
  lastName: string;
  jobRole: string;
  callsPerWeek: number;
  meetingsPerWeek: number;
  whatYouSell: string;
  whoYouSellTo: string;
  mainBenefit: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    jobRole: '',
    callsPerWeek: 0,
    meetingsPerWeek: 0,
    whatYouSell: '',
    whoYouSellTo: '',
    mainBenefit: ''
  });

  const router = useRouter();
  const supabase = createClient();

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setIsLoading(true);
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (user) {
          const response = await fetch('/api/onboarding/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });

          if (response.ok) {
            router.push('/install-extension');
          }
        }
      } catch (error) {
        console.error('Error completing onboarding:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.firstName && data.lastName && data.jobRole;
      case 2:
        return data.callsPerWeek > 0 && data.meetingsPerWeek >= 0;
      case 3:
        return data.whatYouSell && data.whoYouSellTo && data.mainBenefit;
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Info';
      case 2:
        return 'Your Workflow';
      case 3:
        return 'Sales Info';
      case 4:
        return 'Sales Snapshot';
      case 5:
        return 'Install Extension';
      default:
        return '';
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto max-w-4xl p-4 pt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of 5 • {getStepTitle()}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-colors ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="min-h-[600px]">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <StepOneA data={data} updateData={updateData} />
            )}
            {currentStep === 2 && (
              <StepOneB data={data} updateData={updateData} />
            )}
            {currentStep === 3 && (
              <StepOneC data={data} updateData={updateData} />
            )}
            {currentStep === 4 && <StepTwo data={data} />}
            {currentStep === 5 && <StepThree />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="flex items-center gap-2"
          >
            {currentStep === 5 ? 'Complete' : 'Next'}
            {currentStep < 5 && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
