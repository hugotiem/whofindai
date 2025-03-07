'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
// import { logEvent } from 'firebase/analytics';
// import { useAnalytics } from '@/hooks/use-analytics';
import { Loader2 } from 'lucide-react';
import { getCustomerSessionClientSecret } from '@/lib/stripe/actions';

export const StripePricingTable = () => {
  const [clientSecret, setClientSecret] = useState<string>();
  // const { analytics } = useAnalytics();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    getCustomerSessionClientSecret().then((client_secret) => {
      setClientSecret(client_secret);
      // if (analytics) logEvent(analytics, 'pricing_table_displayed');
    });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return clientSecret ? (
    React.createElement('stripe-pricing-table', {
      'pricing-table-id': process.env.NEXT_PUBLIC_STRIPE_DARK_PRICING_TABLE_ID,
      'publishable-key': process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      'customer-session-client-secret': clientSecret
    })
  ) : (
    <Loader2 className="animate-spin" />
  );
};

export const StripePricingTableDialog = ({
  open,
  setOpen
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  // updateState(setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-10 max-w-lg lg:max-w-4xl max-h-dvh overflow-scroll">
        <DialogTitle>View Plans</DialogTitle>
        <StripePricingTable />
      </DialogContent>
    </Dialog>
  );
};
