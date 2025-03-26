'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Profile } from '@prisma/client';

interface InfiniteProfilesProps {
  initialProfiles: Profile[];
  initialHasMore: boolean;
  initialNextCursor?: string;
}

export function InfiniteProfiles({
  initialProfiles,
  initialHasMore,
  initialNextCursor
}: InfiniteProfilesProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (!nextCursor) return;

    setIsLoading(true);
    try {
      const result = await fetch(
        `/api/profiles?cursor=${nextCursor}&limit=${10}`
      );
      const data = await result.json();
      setProfiles((prev) => [...prev, ...data.profiles]);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error('Failed to load more profiles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nextCursor]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="space-y-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="space-y-1">
            <p className="font-medium">{profile.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(profile.createdAt), {
                addSuffix: true
              })}
            </p>
          </div>
        ))}

        {/* Loading indicator */}
        {hasMore && (
          <div ref={ref} className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
