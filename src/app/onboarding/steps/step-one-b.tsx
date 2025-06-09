'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { HelpCircle, Briefcase } from 'lucide-react';
import { OnboardingData } from '../page';

interface StepOneBProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
}

export default function StepOneB({ data, updateData }: StepOneBProps) {
  const callsOptions = [
    { value: 5, label: '1-5 calls' },
    { value: 15, label: '6-15 calls' },
    { value: 30, label: '16-30 calls' },
    { value: 50, label: '31-50 calls' },
    { value: 75, label: '50+ calls' }
  ];

  const meetingsOptions = [
    { value: 0, label: 'None' },
    { value: 3, label: '1-3 meetings' },
    { value: 8, label: '4-8 meetings' },
    { value: 15, label: '9-15 meetings' },
    { value: 25, label: '15+ meetings' }
  ];

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Your Workflow</h1>
          <p className="text-muted-foreground text-lg">
            Help us understand your typical sales activity
          </p>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Weekly Activity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="callsPerWeek">How many calls per week?</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Cold or outbound calls you initiate — a rough estimate is
                      fine!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={data.callsPerWeek.toString()}
                onValueChange={(value) =>
                  updateData({ callsPerWeek: parseInt(value) })
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select call volume" />
                </SelectTrigger>
                <SelectContent>
                  {callsOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="meetingsPerWeek">
                  How many meetings per week?
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Any prospect or client meetings you actively prepare for
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={data.meetingsPerWeek.toString()}
                onValueChange={(value) =>
                  updateData({ meetingsPerWeek: parseInt(value) })
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select meeting volume" />
                </SelectTrigger>
                <SelectContent>
                  {meetingsOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
