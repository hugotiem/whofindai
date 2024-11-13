import { Skeleton } from '../ui/skeleton';

export const ChatSkeleton = () => {
  return (
    <div className="max-w-[700px] mx-auto w-full flex flex-col items-start gap-3 my-12 relative">
      <Skeleton className=" animate-expand w-48 h-4 rounded-full" />

      {/* Contact Details */}
      <Skeleton className=" animate-expand w-32 h-4 rounded-full" />
      <Skeleton className=" animate-expand w-64 h-4 rounded-full" />

      {/* Contact Sub-details (indented) */}
      <div className="w-full gap-3 flex flex-col my-1">
        <Skeleton className=" animate-expand w-full h-4 rounded-full ml-4" />
        <Skeleton className=" animate-expand w-3/4 h-4 rounded-full ml-4" />
        <Skeleton className=" animate-expand w-3/4 h-4 rounded-full ml-4" />
        <Skeleton className=" animate-expand w-1/2 h-4 rounded-full ml-4" />
      </div>

      {/* Professional Insights and Personality Analysis */}
      <Skeleton className=" animate-expand w-48 h-4 rounded-full mt-6" />
      <Skeleton className=" animate-expand w-full h-4 rounded-full" />
      <Skeleton className=" animate-expand w-5/6 h-4 rounded-full" />
      <Skeleton className=" animate-expand w-4/6 h-4 rounded-full" />
      <Skeleton className=" animate-expand w-full h-4 rounded-full" />

      {/* Inferred Personality Analysis */}
      <Skeleton className=" animate-expand w-48 h-4 rounded-full mt-6" />

      {/* MBTI and DISC Analysis (indented) */}
      <Skeleton className=" animate-expand w-full h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-5/6 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-4/6 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-full h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-4/5 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-3/5 h-4 rounded-full ml-4" />

      {/* Note */}
      <Skeleton className=" animate-expand w-1/2 h-4 rounded-full mt-6" />
      <Skeleton className=" animate-expand w-full h-4 rounded-full" />
      <Skeleton className=" animate-expand w-3/4 h-4 rounded-full" />

      {/* MBTI and DISC Analysis (indented) */}
      <Skeleton className=" animate-expand w-full h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-5/6 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-4/6 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-full h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-4/5 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-3/5 h-4 rounded-full ml-4" />

      {/* Note */}
      <Skeleton className=" animate-expand w-1/2 h-4 rounded-full mt-6" />
      <Skeleton className=" animate-expand w-full h-4 rounded-full" />
      <Skeleton className=" animate-expand w-3/4 h-4 rounded-full" />

      {/* MBTI and DISC Analysis (indented) */}
      <Skeleton className=" animate-expand w-full h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-5/6 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-4/6 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-full h-4 rounded-full" />
      <Skeleton className=" animate-expand w-4/5 h-4 rounded-full ml-4" />
      <Skeleton className=" animate-expand w-3/5 h-4 rounded-full ml-4" />

      {/* Note */}
      <Skeleton className=" animate-expand w-1/2 h-4 rounded-full mt-6" />
      <Skeleton className=" animate-expand w-full h-4 rounded-full" />
      <Skeleton className=" animate-expand w-3/4 h-4 rounded-full" />

      <div className="fixed top-0 w-full bg-background/10 backdrop-blur-sm h-dvh flex flex-col justify-center items-center" />
    </div>
  );
};
