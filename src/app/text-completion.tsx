'use client';

import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import breaks from 'remark-breaks';

interface TextCompletionProps {
  firstName: string;
  lastName: string;
  saleService: string;
}

export const TextCompletion = ({
  firstName,
  lastName,
  saleService
}: TextCompletionProps) => {
  const [_, setChatResponse] = useState('');
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/completion/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          service: saleService
        })
      });

      if (!response.ok) {
        console.error('Error starting chat stream');
        return;
      }

      const reader = response?.body?.getReader();
      const decoder = new TextDecoder();

      while (true && reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        try {
          setChatResponse((prev) => {
            const next = prev + chunk;
            const formatted = remark()
              .use(html)
              .use(breaks)
              .processSync(next)
              .toString();
            setMarkdown(formatted);
            return next;
          });
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    };

    fetchData();
    return () => {};
  }, []);

  return (
    markdown.length > 0 && (
      <div className="flex flex-col justify-end">
        <div
          dangerouslySetInnerHTML={{ __html: markdown }}
          className="markdown border px-16 py-5 m-16 rounded-3xl"
        />
      </div>
    )
  );
};
