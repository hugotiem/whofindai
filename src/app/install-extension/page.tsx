import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { Chrome, Download, Clock, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function InstallExtensionPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return redirect('/auth/signIn');

  const userData = await prisma.user.findUnique({
    where: { id: user.id }
  });
  if (userData?.useExtension) {
    return redirect('/');
  }
  
  return (
    <section className="container mx-auto flex flex-col gap-6 p-4 max-w-2xl min-h-screen items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Install Chrome Extension</h1>
        <p className="text-muted-foreground">
          Get AI-powered LinkedIn insights while you browse
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#7FFFD4]/10 rounded-full flex items-center justify-center mb-4">
            <Chrome className="h-8 w-8 text-[#7FFFD4]" />
          </div>
          <CardTitle>Chrome Extension Required</CardTitle>
          <CardDescription>
            Install our extension to continue using LeedInsight
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <Link
            href="https://chromewebstore.google.com/detail/leedinsight/cajahcmijndaehcpgdecbijaklbbnmne"
            target="_blank"
          >
            <Button size="lg" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Install Chrome Extension
            </Button>
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            Free • Works inside LinkedIn • 30 second setup
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
