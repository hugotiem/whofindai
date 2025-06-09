'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Separator } from '@/components/ui/separator';
import { HelpCircle, User, Briefcase, Target } from 'lucide-react';
import { OnboardingData } from '../page';

interface StepOneProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
}

export default function StepOne({ data, updateData }: StepOneProps) {
  const jobRoles = ['SDR', 'AE', 'Sales Manager', 'RevOps', 'Other'];

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
          <h1 className="text-3xl font-bold">
            Let&apos;s personalize LeedInsight for you
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us about yourself and your workflow so we can tailor the
            experience
          </p>
        </div>

        {/* Section A: Who are you? */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Who are you?</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => updateData({ firstName: e.target.value })}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => updateData({ lastName: e.target.value })}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobRole">Job role</Label>
            <Select
              value={data.jobRole}
              onValueChange={(value) => updateData({ jobRole: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Section B: Your Workflow */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Your Workflow</h2>
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
                <SelectTrigger>
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
                <SelectTrigger>
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

        <Separator />

        {/* Section C: What Do You Sell? */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">What Do You Sell?</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="whatYouSell">What are you selling?</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Product, service or offer — e.g. AI lead tool, insurance,
                      consulting...
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="whatYouSell"
                value={data.whatYouSell}
                onChange={(e) => updateData({ whatYouSell: e.target.value })}
                placeholder="Describe what you're selling..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="whoYouSellTo">Who do you sell to?</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Describe your typical customer — like &apos;Heads of
                      Sales&apos;, or &apos;HR teams&apos;
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="whoYouSellTo"
                value={data.whoYouSellTo}
                onChange={(e) => updateData({ whoYouSellTo: e.target.value })}
                placeholder="Describe your target audience..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="mainBenefit">
                  Main benefit for your customer?
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      What value do they get from buying? Save time? Grow
                      revenue?
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="mainBenefit"
                value={data.mainBenefit}
                onChange={(e) => updateData({ mainBenefit: e.target.value })}
                placeholder="What's the main value proposition..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
