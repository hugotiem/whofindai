'use client';

import { Check, CircleDot, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'current' | 'completed';
}

interface ProgressBarProps {
  linkedInData: { status: string; content: string } | null;
  thinking: { status: string; content: string } | null;
  completion: { status: string; content: string } | null;
  sources: { status: string; content: string[] } | null;
}

export function ProgressBar({
  linkedInData,
  thinking,
  completion,
  sources
}: ProgressBarProps) {
  const [steps, setSteps] = useState<Step[]>([
    { id: 'sources', label: 'Browsing Sources', status: 'current' },
    { id: 'thinking', label: 'Analyzing Data', status: 'pending' },
    { id: 'profile', label: 'Generating Profile', status: 'pending' }
  ]);

  useEffect(() => {
    if (completion?.status === 'success') {
      // All steps completed
      setSteps([
        { id: 'sources', label: 'Sources Browsed', status: 'completed' },
        { id: 'thinking', label: 'Data Analyzed', status: 'completed' },
        { id: 'profile', label: 'Profile Generated', status: 'completed' }
      ]);
    } else if (thinking?.status === 'success') {
      // Sources and thinking completed, profile generation in progress
      setSteps([
        { id: 'sources', label: 'Sources Browsed', status: 'completed' },
        { id: 'thinking', label: 'Data Analyzed', status: 'completed' },
        { id: 'profile', label: 'Generating Profile', status: 'current' }
      ]);
    } else if (sources?.status === 'success') {
      // Sources completed, thinking in progress
      setSteps([
        { id: 'sources', label: 'Sources Browsed', status: 'completed' },
        { id: 'thinking', label: 'Analyzing Data', status: 'current' },
        { id: 'profile', label: 'Generating Profile', status: 'pending' }
      ]);
    } else {
      // Sources in progress
      setSteps([
        { id: 'sources', label: 'Browsing Sources', status: 'current' },
        { id: 'thinking', label: 'Analyzing Data', status: 'pending' },
        { id: 'profile', label: 'Generating Profile', status: 'pending' }
      ]);
    }
  }, [linkedInData, thinking, completion, sources]);

  return (
    <div className="w-[300px] p-4">
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute z-0 left-[15px] top-[30px] w-[2px] h-[calc(100%+8px)] ${
                  step.status === 'completed' ? 'bg-primary' : 'bg-secondary'
                }`}
              />
            )}

            {/* Step Item */}
            <div className="flex items-center gap-3">
              <div className="relative z-10">
                {step.status === 'completed' ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Check className="w-5 h-5" />
                  </div>
                ) : step.status === 'current' ? (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-secondary flex items-center justify-center">
                    <CircleDot className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    step.status === 'current'
                      ? 'text-primary'
                      : step.status === 'completed'
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
                {step.status === 'current' && (
                  <span className="text-xs text-muted-foreground">
                    In progress...
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
