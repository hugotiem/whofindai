'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

export const ExternalLinkCitation = ({
  citation,
  profileId
}: {
  citation: { url: string; title: string; favicon: string };
  profileId: string;
}) => {
  const { url } = citation;
  const [title, setTitle] = useState(citation.title);
  const [favicon, setFavicon] = useState(citation.favicon);

  useEffect(() => {
    if (!title && !favicon) {
      fetch(`/api/load-page-info?url=${url}&profileId=${profileId}`)
        .then((response) => response.json())
        .then((data) => {
          setTitle(data.title);
          setFavicon(data.favicon);
        });
    }
  }, [citation]);

  return title && favicon ? (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2"
    >
      <img src={favicon} alt={title} width={16} height={16} />
      <span>{title}</span>
    </Link>
  ) : (
    <Skeleton className="h-4 w-10" />
  );
};
