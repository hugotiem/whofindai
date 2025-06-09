'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  AlertTriangle,
  Brain,
  Clock,
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';
import { OnboardingData } from '../page';

interface StepTwoProps {
  data: OnboardingData;
}

export default function StepTwo({ data }: StepTwoProps) {
  // Calculate time savings based on user input
  const prepTimePerCall = 10; // minutes assumed prep time per call
  const timeSavedPerWeek = data.callsPerWeek * prepTimePerCall;
  const percentageOfReps = 15; // percentage of reps who personalize beyond basic info

  // Format time savings display
  const formatTimeSaved = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${remainingMinutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium border border-primary/30">
          <Sparkles className="h-4 w-4" />
          Your Personalized Analysis
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Here&apos;s what we found about your sales routine
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Based on your workflow, here&apos;s how LeedInsight can help you
        </p>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Good News */}
        <Card className="bg-card border-border/50 hover:border-border transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: '#7FFFD4' + '33',
                  borderColor: '#7FFFD4' + '4D'
                }}
              >
                <CheckCircle className="h-6 w-6" style={{ color: '#7FFFD4' }} />
              </div>
              <CardTitle
                className="text-xl font-bold"
                style={{ color: '#7FFFD4' }}
              >
                The Good News
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div
                className="flex items-start gap-4 p-4 rounded-lg border transition-colors"
                style={{
                  backgroundColor: '#7FFFD4' + '0D',
                  borderColor: '#7FFFD4' + '33'
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
                  style={{
                    backgroundColor: '#7FFFD4' + '33',
                    borderColor: '#7FFFD4' + '4D'
                  }}
                >
                  <TrendingUp
                    className="h-5 w-5"
                    style={{ color: '#7FFFD4' }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: '#7FFFD4' }}
                  >
                    High-Impact Activity
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re making{' '}
                    <span
                      className="font-bold px-2 py-1 rounded border"
                      style={{
                        color: '#7FFFD4',
                        backgroundColor: '#7FFFD4' + '33',
                        borderColor: '#7FFFD4' + '4D'
                      }}
                    >
                      {data.callsPerWeek} calls/week
                    </span>{' '}
                    — that&apos;s high-impact work! 💪
                  </p>
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-4 rounded-lg border transition-colors"
                style={{
                  backgroundColor: '#7FFFD4' + '0D',
                  borderColor: '#7FFFD4' + '33'
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
                  style={{
                    backgroundColor: '#7FFFD4' + '33',
                    borderColor: '#7FFFD4' + '4D'
                  }}
                >
                  <Clock className="h-5 w-5" style={{ color: '#7FFFD4' }} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: '#7FFFD4' }}
                  >
                    Time Savings Potential
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Save approximately{' '}
                    <span
                      className="font-bold px-2 py-1 rounded border"
                      style={{
                        color: '#7FFFD4',
                        backgroundColor: '#7FFFD4' + '33',
                        borderColor: '#7FFFD4' + '4D'
                      }}
                    >
                      {formatTimeSaved(timeSavedPerWeek)}/week
                    </span>{' '}
                    with LeedInsight&apos;s smart research.
                  </p>
                </div>
              </div>

              {data.meetingsPerWeek > 0 && (
                <div
                  className="flex items-start gap-4 p-4 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: '#7FFFD4' + '0D',
                    borderColor: '#7FFFD4' + '33'
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
                    style={{
                      backgroundColor: '#7FFFD4' + '33',
                      borderColor: '#7FFFD4' + '4D'
                    }}
                  >
                    <Target className="h-5 w-5" style={{ color: '#7FFFD4' }} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: '#7FFFD4' }}
                    >
                      Relationship Building
                    </p>
                    <p className="text-sm text-muted-foreground">
                      With{' '}
                      <span
                        className="font-bold px-2 py-1 rounded border"
                        style={{
                          color: '#7FFFD4',
                          backgroundColor: '#7FFFD4' + '33',
                          borderColor: '#7FFFD4' + '4D'
                        }}
                      >
                        {data.meetingsPerWeek} meetings/week
                      </span>
                      , you&apos;re actively building relationships.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reality Check */}
        <Card className="bg-card border-border/50 hover:border-border transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                <AlertTriangle className="h-6 w-6 text-orange-400" />
              </div>
              <CardTitle className="text-xl font-bold text-orange-400">
                The Reality Check
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20 hover:bg-orange-500/10 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <p className="text-sm font-semibold text-orange-400">
                    Generic Approach
                  </p>
                </div>
                <p className="text-sm text-muted-foreground ml-5">
                  Without personalization, most calls sound the same.
                </p>
              </div>

              <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20 hover:bg-orange-500/10 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <p className="text-sm font-semibold text-orange-400">
                    Industry Statistics
                  </p>
                </div>
                <p className="text-sm text-muted-foreground ml-5">
                  Only{' '}
                  <span className="font-bold text-orange-400 bg-orange-500/20 px-2 py-1 rounded border border-orange-500/30">
                    {percentageOfReps}% of reps
                  </span>{' '}
                  go beyond job title and company name.
                </p>
              </div>

              <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20 hover:bg-orange-500/10 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <p className="text-sm font-semibold text-orange-400">
                    Prospect Awareness
                  </p>
                </div>
                <p className="text-sm text-muted-foreground ml-5">
                  Most prospects can tell when you&apos;re reading from a
                  generic script.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Line */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Bottom Line</h3>
              <p className="text-muted-foreground">
                You&apos;re doing the hard part. Let us make it smarter, faster,
                and more effective.
              </p>
            </div>
          </div>

          {/* Personalized insight based on user data */}
          <div className="bg-primary/5 rounded-lg p-5 mb-6 border border-primary/20">
            <p className="text-muted-foreground mb-3">
              <span className="font-semibold text-foreground">
                For {data.firstName},
              </span>{' '}
              selling{' '}
              <span className="font-semibold text-primary bg-primary/20 px-2 py-1 rounded border border-primary/30">
                {data.whatYouSell.toLowerCase()}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-primary bg-primary/20 px-2 py-1 rounded border border-primary/30">
                {data.whoYouSellTo.toLowerCase()}
              </span>
              :
            </p>
            <p className="text-foreground font-medium">
              LeedInsight can help you find specific conversation starters about
              their{' '}
              <span className="font-bold text-primary">
                {data.mainBenefit.toLowerCase()}
              </span>{' '}
              challenges, making every call feel like a personalized
              consultation.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="text-2xl font-bold text-primary mb-1">
                {formatTimeSaved(timeSavedPerWeek)}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Saved per week
              </div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="text-2xl font-bold text-primary mb-1">2x</div>
              <div className="text-xs text-muted-foreground font-medium">
                Better call results
              </div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="text-2xl font-bold text-primary mb-1">90%</div>
              <div className="text-xs text-muted-foreground font-medium">
                Faster research
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value proposition summary */}
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold text-foreground">
          Ready to make your {data.callsPerWeek} weekly calls more effective?
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Let&apos;s get you set up with the Chrome extension to start
          personalizing your outreach.
        </p>
      </div>
    </div>
  );
}
