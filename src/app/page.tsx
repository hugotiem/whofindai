import { AppSidebar } from '@/components/app-sidebar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <main className="h-full container mx-auto flex flex-col justify-center items-center">
        <div className="max-w-[400px] flex flex-col items-center space-y-4">
          <div className="text-5xl font-bold">Search anyone</div>
          <div className="w-full border rounded-2xl p-4">
            <div className="w-full flex items-center">
              <Input variant="ghost" className="w-full" placeholder='FirstName'/>
              <Separator orientation="vertical" className="h-10" />
              <Input variant="ghost" className="w-full" placeholder='lastName'/>
            </div>
            <Separator className=''/>
            <Input variant="ghost" className="w-full" placeholder='What i want to sell is...'/>
          </div>
        </div>
      </main>
    </div>
  );
}
