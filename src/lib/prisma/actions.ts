import { APIProfile } from '@/app/api/completion/prompt';
import { prisma } from '../prisma';
import { loadUserId } from '../supabase/session';
import { Prisma } from '@prisma/client';

export const getProfileById = async (
  id: string
): Promise<APIProfile | undefined> => {
  const userId = await loadUserId();
  if (!userId) return;

  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      experiences: true,
      education: true,
      citations: true,
      icebreakers: true,
      strategicQuestions: true
    }
  });

  if (!profile) return;

  return transformProfileToAPIProfile(profile);
};

export const getUserProfiles = async (
  userId: string
): Promise<APIProfile[]> => {
  const profiles = await prisma.profile.findMany({
    where: { userId },
    include: {
      experiences: true,
      education: true,
      citations: true,
      icebreakers: true,
      strategicQuestions: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return profiles.map(transformProfileToAPIProfile);
};

export const createProfile = async (
  userId: string,
  profileData: Omit<APIProfile, 'id' | 'userId' | 'created_at' | 'updated_at'>
): Promise<APIProfile> => {
  const {
    fullName,
    prompt,
    citations,
    professionalOverview,
    companyOverview,
    engagementStrategy,
    metadata,
    ...rest
  } = profileData;

  const data: Prisma.ProfileCreateInput = {
    user: { connect: { id: userId } },
    fullName,
    prompt,
    background: professionalOverview?.background,
    achievements: professionalOverview?.achievements || [],
    hobbiesAndPassions: professionalOverview?.hobbiesAndPassions || [],
    currentRoleSummary: companyOverview?.currentRoleSummary,
    companyDescription: companyOverview?.companyDescription,
    marketPosition: companyOverview?.marketPosition,
    recentDevelopments: companyOverview?.recentDevelopments,
    productFit: companyOverview?.productFit,
    pictureUrl: metadata?.pictureUrl,
    company: metadata?.company,
    linkedin: metadata?.linkedin,
    description: metadata?.description,
    currentOccupation: metadata?.currentOccupation,
    headline: metadata?.headline,
    location: metadata?.location,
    product: metadata?.product,
    experiences: {
      create:
        metadata?.experiences?.map((exp) => ({
          companyName: exp.companyName,
          occupation: exp.occupation,
          location: exp.location,
          startDate: exp.duration?.startDate,
          endDate: exp.duration?.endDate
        })) || []
    },
    education: {
      create:
        metadata?.education?.map((edu) => ({
          schoolName: edu.schoolName,
          degree: edu.degree
        })) || []
    },
    citations: {
      create:
        citations?.map((citation) => ({
          url: citation.url,
          title: citation.title,
          favicon: citation.favicon
        })) || []
    },
    icebreakers: {
      create:
        engagementStrategy?.icebreakers?.map((icebreaker) => ({
          text: icebreaker
        })) || []
    },
    strategicQuestions: {
      create:
        engagementStrategy?.strategicQuestions?.map((question) => ({
          question: question.question,
          context: question.context
        })) || []
    }
  };

  const profile = await prisma.profile.create({
    data,
    include: {
      experiences: true,
      education: true,
      citations: true,
      icebreakers: true,
      strategicQuestions: true
    }
  });

  return transformProfileToAPIProfile(profile);
};

export const updateProfile = async (
  id: string,
  profileData: Partial<
    Omit<APIProfile, 'id' | 'userId' | 'created_at' | 'updated_at'>
  >
): Promise<APIProfile | undefined> => {
  const userId = await loadUserId();
  if (!userId) return;

  const existingProfile = await prisma.profile.findUnique({
    where: { id, userId }
  });

  if (!existingProfile) return;

  const {
    fullName,
    prompt,
    citations,
    professionalOverview,
    companyOverview,
    engagementStrategy,
    metadata,
    ...rest
  } = profileData;

  const data: Prisma.ProfileUpdateInput = {
    fullName,
    prompt,
    background: professionalOverview?.background,
    achievements: professionalOverview?.achievements,
    hobbiesAndPassions: professionalOverview?.hobbiesAndPassions,
    currentRoleSummary: companyOverview?.currentRoleSummary,
    companyDescription: companyOverview?.companyDescription,
    marketPosition: companyOverview?.marketPosition,
    recentDevelopments: companyOverview?.recentDevelopments,
    productFit: companyOverview?.productFit,
    pictureUrl: metadata?.pictureUrl,
    company: metadata?.company,
    linkedin: metadata?.linkedin,
    description: metadata?.description,
    currentOccupation: metadata?.currentOccupation,
    headline: metadata?.headline,
    location: metadata?.location,
    product: metadata?.product
  };

  // Update the profile
  const profile = await prisma.profile.update({
    where: { id },
    data,
    include: {
      experiences: true,
      education: true,
      citations: true,
      icebreakers: true,
      strategicQuestions: true
    }
  });

  // If there are new experiences, update them
  if (metadata?.experiences) {
    // Delete existing experiences
    await prisma.experience.deleteMany({
      where: { profileId: id }
    });

    // Create new experiences
    await Promise.all(
      metadata.experiences.map((exp) =>
        prisma.experience.create({
          data: {
            profileId: id,
            companyName: exp.companyName,
            occupation: exp.occupation,
            location: exp.location,
            startDate: exp.duration?.startDate,
            endDate: exp.duration?.endDate
          }
        })
      )
    );
  }

  // If there are new education entries, update them
  if (metadata?.education) {
    // Delete existing education entries
    await prisma.education.deleteMany({
      where: { profileId: id }
    });

    // Create new education entries
    await Promise.all(
      metadata.education.map((edu) =>
        prisma.education.create({
          data: {
            profileId: id,
            schoolName: edu.schoolName,
            degree: edu.degree
          }
        })
      )
    );
  }

  // If there are new citations, update them
  if (citations) {
    // Delete existing citations
    await prisma.citation.deleteMany({
      where: { profileId: id }
    });

    // Create new citations
    await Promise.all(
      citations.map((citation) =>
        prisma.citation.create({
          data: {
            profileId: id,
            url: citation.url,
            title: citation.title,
            favicon: citation.favicon || ''
          }
        })
      )
    );
  }

  // If there are new icebreakers, update them
  if (engagementStrategy?.icebreakers) {
    // Delete existing icebreakers
    await prisma.icebreaker.deleteMany({
      where: { profileId: id }
    });

    // Create new icebreakers
    await Promise.all(
      engagementStrategy.icebreakers.map((icebreaker) =>
        prisma.icebreaker.create({
          data: {
            profileId: id,
            text: icebreaker
          }
        })
      )
    );
  }

  // If there are new strategic questions, update them
  if (engagementStrategy?.strategicQuestions) {
    // Delete existing strategic questions
    await prisma.strategicQuestion.deleteMany({
      where: { profileId: id }
    });

    // Create new strategic questions
    await Promise.all(
      engagementStrategy.strategicQuestions.map((question) =>
        prisma.strategicQuestion.create({
          data: {
            profileId: id,
            question: question.question,
            context: question.context
          }
        })
      )
    );
  }

  // Get the updated profile with all relations
  const updatedProfile = await prisma.profile.findUnique({
    where: { id },
    include: {
      experiences: true,
      education: true,
      citations: true,
      icebreakers: true,
      strategicQuestions: true
    }
  });

  if (!updatedProfile) return;

  return transformProfileToAPIProfile(updatedProfile);
};

export const deleteProfile = async (id: string): Promise<boolean> => {
  const userId = await loadUserId();
  if (!userId) return false;

  const profile = await prisma.profile.findUnique({
    where: { id, userId }
  });

  if (!profile) return false;

  await prisma.profile.delete({
    where: { id }
  });

  return true;
};

// Helper function to transform a Prisma Profile to an APIProfile
function transformProfileToAPIProfile(profile: any): APIProfile {
  return {
    id: profile.id,
    userId: profile.userId,
    fullName: profile.fullName,
    prompt: profile.prompt,
    created_at: profile.createdAt.toISOString(),
    updated_at: profile.updatedAt.toISOString(),
    professionalOverview: {
      background: profile.background || '',
      achievements: profile.achievements || [],
      hobbiesAndPassions: profile.hobbiesAndPassions || []
    },
    companyOverview: {
      currentRoleSummary: profile.currentRoleSummary || '',
      companyDescription: profile.companyDescription || '',
      marketPosition: profile.marketPosition || '',
      recentDevelopments: profile.recentDevelopments || '',
      productFit: profile.productFit || ''
    },
    engagementStrategy: {
      icebreakers: profile.icebreakers?.map((i: any) => i.text) || [],
      strategicQuestions:
        profile.strategicQuestions?.map((q: any) => ({
          question: q.question,
          context: q.context
        })) || []
    },
    metadata: {
      fullName: profile.fullName || '',
      pictureUrl: profile.pictureUrl || '',
      company: profile.company || '',
      linkedin: profile.linkedin || '',
      description: profile.description || '',
      currentOccupation: profile.currentOccupation || '',
      headline: profile.headline || '',
      location: profile.location || '',
      experiences:
        profile.experiences?.map((exp: any) => ({
          companyName: exp.companyName,
          occupation: exp.occupation,
          location: exp.location,
          duration: {
            startDate: exp.startDate || '',
            endDate: exp.endDate || ''
          }
        })) || [],
      education:
        profile.education?.map((edu: any) => ({
          schoolName: edu.schoolName,
          degree: edu.degree
        })) || [],
      product: profile.product || ''
    },
    citations:
      profile.citations?.map((citation: any) => ({
        url: citation.url,
        title: citation.title,
        favicon: citation.favicon || ''
      })) || []
  };
}
