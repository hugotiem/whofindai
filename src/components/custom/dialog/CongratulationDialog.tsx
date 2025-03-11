'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function CongratulationDialog({
  initialOpen,
  plan
}: {
  initialOpen: boolean;
  plan: string;
}) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    window.history.replaceState({}, '', window.location.pathname);
  }, [initialOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Congratulations!</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            You have successfully subscribed to the {plan.replaceAll('_', ' ')}
            plan.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
