'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, SendHorizontal } from 'lucide-react';
import { TextCompletion } from './text-completion';
import { useState } from 'react';

export default function Home() {
  const [firstName, setFirstName] = useState<string>('');
  const [LastName, setLastName] = useState<string>('');
  const [saleService, setSaleService] = useState<string>('');

  const [generate, setGenerate] = useState<boolean>(false);

  const onFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(event.target.value);

  const onLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(event.target.value);

  const onSaleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSaleService(event.target.value);

  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <main className="container mx-auto flex flex-col justify-center items-center min-h-fit">
        <div className="flex flex-col items-center">
          <div className="max-w-[400px]  space-y-4">
            <div className="text-5xl font-bold">Search anyone</div>
            <div className="w-full border rounded-2xl p-4">
              <div className="w-full flex items-center">
                <Input
                  variant="ghost"
                  className="w-full"
                  placeholder="FirstName"
                  onChange={onFirstNameChange}
                />
                <Separator orientation="vertical" className="h-10" />
                <Input
                  variant="ghost"
                  className="w-full"
                  placeholder="lastName"
                  onChange={onLastNameChange}
                />
              </div>
              <Separator className="" />
              <Input
                variant="ghost"
                className="w-full"
                placeholder="What i want to sell is..."
                onChange={onSaleServiceChange}
              />
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setGenerate(true)} disabled={generate}>
                  <SendHorizontal />
                  {generate && <Loader2 className='animate-spin'/>}
                </Button>
              </div>
            </div>
          </div>
          {generate && (
            <TextCompletion
              firstName={firstName}
              lastName={LastName}
              saleService={saleService}
            />
          )}
        </div>
      </main>
    </div>
  );
}
