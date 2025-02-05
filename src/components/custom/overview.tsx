import { motion } from 'framer-motion';
import Link from 'next/link';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-[600px] mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="p-1 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        {/* <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <VercelIcon />
          <span>+</span>
          <MessageIcon />
        </p> */}
        <h1 className="font-semibold text-5xl text-[#7FFFD4]">Hi there,</h1>
        <h3 className="text-3xl text-white font-semibold">
          Who would you like to know about?
        </h3>
        <p className="">
          Get instant AI-generated insights about any professional. Discover
          their role, communication style, and business context—all in seconds.
        </p>
        <p>
          Save time, boost confidence, and make your cold calls more effective.
          All our pro tips available{' '}
          <Link
            href="https://probable-visitor-fcc.notion.site/Click-here-for-A-Step-by-Step-Guide-14997d1a0fc48067838ff1191fa6628c"
            target="_blank"
            className="text-blue-500 dark:text-blue-400"
          >
            here.
          </Link>
        </p>
        {/* <ul className="list-decimal ml-5 space-y-2">
          <li>
            Enter the <strong>full name</strong> and <strong>company</strong> of
            your prospect.
          </li>
          <li>
            <strong>One-time Setup</strong>: Fill in the &quot;What I want to
            sell&quot; field once to tailor all future insights to your specific
            product or service. You can update this anytime if needed{' '}
          </li>
        </ul>
        <p>
          Pro Tip: The more precise you are with the information, the better the
          insights you&apos;ll receive. Save time, boost your confidence, and
          make your cold calls more effective!
        </p>
        <p> */}

        {/* </p> */}
        {/* <p>
          This is an open source Chatbot template built with Next.js and the AI
          SDK by Vercel. It uses the{" "}
          <code className="rounded-md bg-muted px-1 py-0.5">streamText</code>{" "}
          function in the server and the{" "}
          <code className="rounded-md bg-muted px-1 py-0.5">useChat</code> hook
          on the client to create a seamless chat experience.
        </p>
        <p>
          {" "}
          You can learn more about the AI SDK by visiting the{" "}
          <Link
            className="text-blue-500 dark:text-blue-400"
            href="https://sdk.vercel.ai/docs"
            target="_blank"
          >
            Docs
          </Link>
          .
        </p> */}
      </div>
    </motion.div>
  );
};
