'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { handleSave } from '@/lib/supabase/auth';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { User } from '@supabase/supabase-js';
const CompleteProfileDialog = ({ user }: { user: User }) => {
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [companyName, setCompanyName] = useState(user?.user_metadata?.company_name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const initialState: {
    status: 'error' | 'success' | 'initial';
    errorMessage?: string;
  } = { status: 'initial' };

  const [state, formAction] = useFormState(handleSave, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      setIsOpen(false);
    }
    if (state.status === 'error') {
      toast.error(state.errorMessage);
      setIsOpen(false);
    }
  }, [state.status]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <form action={formAction} onSubmit={() => setIsLoading(true)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Profile</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Please complete your profile to continue.
          </AlertDialogDescription>
          <div className="flex flex-col gap-4 py-4">
            <Input
              type="text"
              placeholder="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Company Name"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <Button
              disabled={isLoading || !fullName || !companyName}
              type="submit"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteProfileDialog;

