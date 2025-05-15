import React from 'react';
import { Html, Container, Body, Markdown, Hr } from '@react-email/components';
import { CreateEmailOptions } from 'resend';

interface WelcomeTemplateProps {
  name: string;
  payAsYouGoPromoCode: string;
  proPromoCode: string;
}

const welcomeMarkdown = `
Hi {{name}},

Welcome to LeedInsight! We're excited to have you join us.

*Your account is now active with a 14-day trial to help you experience how our Chrome extension can transform your sales approach.*

These searches give you access to:

* **Time-saving insights**: Skip hours of manual research for each prospect
* **Personalized conversation starters**: Tailored to your specific offering
* **Comprehensive prospect data**: Company details and personal insights delivered directly in your browser

🎁 Use one of the following codes within the next 5 days to unlock exclusive discounts on paid plans:

* **{{proPromoCode}}** – Get **75% off** your first month on the **Pro plan**
* **{{payAsYouGoPromoCode}}** – Get **50% off** your first purchase on the **Pay-As-You-Go plan**

**Getting Started:**

* Install our Chrome extension from the Chrome Web Store (if not already done)
* Visit LinkedIn profiles to see LeedInsight in action
* Track your remaining free searches in your account dashboard

We're committed to helping you connect more effectively with prospects and close more deals through better-informed conversations.

If you have any questions, please don't hesitate to reach out to our support team (leedinsight@tiemh.com)

Best regards,

**The LeedInsight team**

![LeedInsight Logo](https://resend-attachments.s3.amazonaws.com/MtPJX7XyZU3Gm4D)
`;

const WelcomeTemplate = ({ name, payAsYouGoPromoCode, proPromoCode }: WelcomeTemplateProps) => {
  return (
    <Html>
      <Body>
        <Container>
          <Markdown>{welcomeMarkdown.replace('{{name}}', name).replace('{{payAsYouGoPromoCode}}', payAsYouGoPromoCode).replace('{{proPromoCode}}', proPromoCode)}</Markdown>
          <Hr />

        </Container>
      </Body>
    </Html>
  );
};

const welcomeEmailOptions = (
  email: string,
  name: string,
  payAsYouGoPromoCode: string,
  proPromoCode: string
): CreateEmailOptions => ({
  from: 'LeedInsight <leedinsight@tiemh.com>',
  to: [email],
  subject: 'Welcome to LeadInsight',
  react: WelcomeTemplate({ name, payAsYouGoPromoCode, proPromoCode })
});

export { welcomeEmailOptions };
