import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getLastGeneratedProfiles } from '@/app/actions/profiles';
import { InfiniteProfiles } from './infinite-profiles';
import { Separator } from '@/components/ui/separator';
const ProfilesSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Last generated profiles</CardTitle>
        <CardDescription>In the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

async function ProfilesContent() {
  const { profiles, hasMore, nextCursor } = await getLastGeneratedProfiles();

  return (
    <Card className="h-full overflow-y-auto max-h-full">
      <CardHeader>
        <CardTitle>Last generated profiles</CardTitle>
        <CardDescription>In the last 7 days</CardDescription>
      </CardHeader>
      <div className="px-4">
      <Separator />
      </div>
      <CardContent className="p-4">
        <InfiniteProfiles
          initialProfiles={profiles}
          initialHasMore={hasMore}
          initialNextCursor={nextCursor}
        />
      </CardContent>
    </Card>
  );
}

export const LastGeneratedProfiles = () => {
  return (
    <Suspense fallback={<ProfilesSkeleton />}>
      <ProfilesContent />
    </Suspense>
  );
};
