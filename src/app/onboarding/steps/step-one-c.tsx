'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { HelpCircle, Target } from 'lucide-react';
import { OnboardingData } from '../page';

interface StepOneCProps {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
}

export default function StepOneC({ data, updateData }: StepOneCProps) {
  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">What Do You Sell?</h1>
          <p className="text-muted-foreground text-lg">
            Tell us about your product and customers so we can personalize your
            insights
          </p>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Sales Information</h2>
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
                className="min-h-[100px] resize-none"
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
                className="min-h-[100px] resize-none"
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
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
