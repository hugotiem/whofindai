# WinAnyCall - AI-Powered Sales Call Assistant

WinAnyCall is a sophisticated web application that helps sales professionals prepare for calls and meetings by generating detailed prospect profiles and engagement strategies using AI.

## Features

- 🎯 **Prospect Profiling**: Generate detailed profiles based on name and company
- 💡 **Smart Ice Breakers**: Get contextual conversation starters
- 📊 **Company Analysis**: Access relevant company information and market position
- 🤝 **Engagement Strategy**: Receive tailored communication tips and questions
- 🌙 **Dark/Light Mode**: Support for system and manual theme switching
- 🔐 **Authentication**: Secure user authentication with Firebase
- 📱 **Responsive Design**: Fully responsive across all devices

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) with shadcn/ui
- **Authentication**: [Firebase](https://firebase.google.com/)
- **AI Integration**: OpenAI API
- **Analytics**: Google Analytics
- **Animation**: Framer Motion

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd winanycall
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```bash
# Firebase Configuration
NEXT_PUBLIC_SA_API_KEY=
NEXT_PUBLIC_SA_AUTH_DOMAIN=
NEXT_PUBLIC_SA_PROJECT_ID=
NEXT_PUBLIC_SA_STORAGE_BUCKET=
NEXT_PUBLIC_SA_MESSAGING_SENDER_ID=
NEXT_PUBLIC_SA_APP_ID=
NEXT_PUBLIC_SA_MEASUREMENT_ID=

# Firebase Admin
SA_TYPE=
SA_PROJECT_ID=
SA_PRIVATE_KEY_ID=
SA_PRIVATE_KEY=
SA_CLIENT_EMAIL=
SA_CLIENT_ID=
SA_AUTH_URI=
SA_TOKEN_URI=
SA_AUTH_PROVIDER_CERT_URL=
SA_CLIENT_CERT_URL=
SA_UNIVERSE_DOMAIN=

# Base URL
BASE_URL=http://localhost:3000

# Encryption
ENCRYPTION_KEY=
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Application pages and API routes
- `/src/components` - Reusable components
  - `/custom` - Custom application components
  - `/ui` - Base UI components
- `/src/lib` - Utility functions and configurations
- `/src/hooks` - Custom React hooks
- `/src/providers` - Context providers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@winanycall.com or join our Slack channel.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - a utility-first CSS framework
- [Firebase Documentation](https://firebase.google.com/docs) - explore Firebase features
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction) - learn about Radix UI components

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
