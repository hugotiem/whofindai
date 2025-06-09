'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Chrome,
  Download,
  Clock,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react';

export default function StepThree() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Install the Chrome Extension</h1>
        <p className="text-muted-foreground text-lg">
          Get AI-powered LinkedIn insights while you browse
        </p>
      </div>

      {/* Main Installation Card */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#7FFFD4]/10 rounded-full flex items-center justify-center mb-4">
              <Chrome className="h-8 w-8 text-[#7FFFD4]" />
            </div>
            <CardTitle>Chrome Extension Required</CardTitle>
            <p className="text-muted-foreground">
              Install our extension to continue using LeedInsight
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">90% Faster</p>
                  <p className="text-xs text-muted-foreground">Research time</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">2x Better</p>
                  <p className="text-xs text-muted-foreground">Call results</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">10,000+</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
              </div>
            </div>

            {/* Installation Button */}

            <Button size="lg" className="w-full" onClick={() => {
              window.open(
                'https://chromewebstore.google.com/detail/leedinsight/cajahcmijndaehcpgdecbijaklbbnmne',
                '_blank'
              );
            }}>
              <Download className="h-4 w-4 mr-2" />
              Install Chrome Extension
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Free • Works inside LinkedIn • 30 second setup
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What happens next */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              What happens next?
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <p>Install the Chrome extension from the Chrome Web Store</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <p>Visit any LinkedIn profile and see LeedInsight in action</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <p>Get personalized conversation starters and insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional benefits specific to their use case could be added here */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Once installed, you&apos;ll be ready to make your sales conversations
          more personalized and effective!
        </p>
      </div>
    </div>
  );
}
