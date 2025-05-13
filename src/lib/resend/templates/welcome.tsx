import React from 'react';
import { Html, Container, Body, Markdown, Hr } from '@react-email/components';
import { CreateEmailOptions } from 'resend';

interface WelcomeTemplateProps {
  name: string;
}

const welcomeMarkdown = `
Hi {{name}},

Welcome to LeedInsight! We're excited to have you join us.

Your account is now active with **5 free searches** to help you experience how our Chrome extension can transform your sales approach.

These searches give you access to:

* **Time-saving insights**: Skip hours of manual research for each prospect
* **Personalized conversation starters**: Tailored to your specific offering
* **Comprehensive prospect data**: Company details and personal insights delivered directly in your browser

Once you've used your 5 free searches, you can upgrade to our Pay-As-You-Go plan, which includes 5 free searches every week plus additional searches at just 0,5 $/€ each.

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

const WelcomeTemplate = ({ name }: WelcomeTemplateProps) => {
  return (
    <Html>
      <Body>
        <Container>
          <Markdown>{welcomeMarkdown.replace('{{name}}', name)}</Markdown>
          <Hr />

        </Container>
      </Body>
    </Html>
  );
};

const welcomeEmailOptions = (
  email: string,
  name: string
): CreateEmailOptions => ({
  from: 'LeedInsight <leedinsight@tiemh.com>',
  to: [email],
  subject: 'Welcome to LeadInsight',
  react: WelcomeTemplate({ name })
});

export { welcomeEmailOptions };
