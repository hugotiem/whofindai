import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { StripePricingTableDialog } from './StripePricingTableDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const UpgradeDialog = ({
  open,
  setOpen
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const [showStripeDialog, setShowStripeDialog] = useState(false);
  return (
    <>
      <StripePricingTableDialog
        open={showStripeDialog}
        setOpen={setShowStripeDialog}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Upgrade</DialogTitle>
          <DialogDescription>
            Upgrade to a paid plan to continue generating content.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setShowStripeDialog(true)}>
              View Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
