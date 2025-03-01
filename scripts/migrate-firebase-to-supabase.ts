import * as admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';
import { serviceAccount } from '../src/lib/firebase/config';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const firestore = admin.firestore();
const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('Migrating users...');
  const usersSnapshot = await admin.auth().listUsers();

  for (const user of usersSnapshot.users) {
    try {
      await prisma.user.upsert({
        where: { id: user.uid },
        update: {
          email: user.email || ''
        },
        create: {
          id: user.uid,
          email: user.email || ''
        }
      });
      console.log(`Migrated user: ${user.uid}`);
    } catch (error) {
      console.error(`Error migrating user ${user.uid}:`, error);
    }
  }
}

async function migrateProfiles() {
  console.log('Migrating profiles...');
  const profilesSnapshot = await firestore.collection('profiles').get();

  for (const doc of profilesSnapshot.docs) {
    try {
      const profileData = doc.data();
      const userId = profileData.userId;

      // Check if user exists in Prisma
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        console.log(`User ${userId} not found, creating placeholder user`);
        await prisma.user.create({
          data: {
            id: userId,
            email: `placeholder-${userId}@example.com`
          }
        });
      }

      // Extract data from Firebase document
      const {
        fullName,
        prompt,
        citations = [],
        professionalOverview = {},
        companyOverview = {},
        engagementStrategy = {},
        metadata = {},
        created_at,
        updated_at
      } = profileData;

      // Create profile in Prisma
      await prisma.profile.upsert({
        where: { id: doc.id },
        update: {
          fullName,
          prompt,
          background: professionalOverview.background,
          achievements: professionalOverview.achievements || [],
          hobbiesAndPassions: professionalOverview.hobbiesAndPassions || [],
          currentRoleSummary: companyOverview.currentRoleSummary,
          companyDescription: companyOverview.companyDescription,
          marketPosition: companyOverview.marketPosition,
          recentDevelopments: companyOverview.recentDevelopments,
          productFit: companyOverview.productFit,
          pictureUrl: metadata.pictureUrl,
          company: metadata.company,
          linkedin: metadata.linkedin,
          description: metadata.description,
          currentOccupation: metadata.currentOccupation,
          headline: metadata.headline,
          location: metadata.location,
          product: metadata.product,
          createdAt: created_at ? new Date(created_at) : new Date(),
          updatedAt: updated_at ? new Date(updated_at) : new Date()
        },
        create: {
          id: doc.id,
          userId,
          fullName,
          prompt,
          background: professionalOverview.background,
          achievements: professionalOverview.achievements || [],
          hobbiesAndPassions: professionalOverview.hobbiesAndPassions || [],
          currentRoleSummary: companyOverview.currentRoleSummary,
          companyDescription: companyOverview.companyDescription,
          marketPosition: companyOverview.marketPosition,
          recentDevelopments: companyOverview.recentDevelopments,
          productFit: companyOverview.productFit,
          pictureUrl: metadata.pictureUrl,
          company: metadata.company,
          linkedin: metadata.linkedin,
          description: metadata.description,
          currentOccupation: metadata.currentOccupation,
          headline: metadata.headline,
          location: metadata.location,
          product: metadata.product,
          createdAt: created_at ? new Date(created_at) : new Date(),
          updatedAt: updated_at ? new Date(updated_at) : new Date()
        }
      });

      // Create related records

      // Experiences
      if (metadata.experiences && metadata.experiences.length > 0) {
        await prisma.experience.deleteMany({
          where: { profileId: doc.id }
        });

        for (const exp of metadata.experiences) {
          await prisma.experience.create({
            data: {
              profileId: doc.id,
              companyName: exp.companyName,
              occupation: exp.occupation,
              location: exp.location,
              startDate: exp.duration?.startDate,
              endDate: exp.duration?.endDate
            }
          });
        }
      }

      // Education
      if (metadata.education && metadata.education.length > 0) {
        await prisma.education.deleteMany({
          where: { profileId: doc.id }
        });

        for (const edu of metadata.education) {
          await prisma.education.create({
            data: {
              profileId: doc.id,
              schoolName: edu.schoolName,
              degree: edu.degree
            }
          });
        }
      }

      // Citations
      if (citations && citations.length > 0) {
        await prisma.citation.deleteMany({
          where: { profileId: doc.id }
        });

        for (const citation of citations) {
          await prisma.citation.create({
            data: {
              profileId: doc.id,
              url: citation.url,
              title: citation.title,
              favicon: citation.favicon || ''
            }
          });
        }
      }

      // Icebreakers
      if (
        engagementStrategy.icebreakers &&
        engagementStrategy.icebreakers.length > 0
      ) {
        await prisma.icebreaker.deleteMany({
          where: { profileId: doc.id }
        });

        for (const icebreaker of engagementStrategy.icebreakers) {
          await prisma.icebreaker.create({
            data: {
              profileId: doc.id,
              text: icebreaker
            }
          });
        }
      }

      // Strategic Questions
      if (
        engagementStrategy.strategicQuestions &&
        engagementStrategy.strategicQuestions.length > 0
      ) {
        await prisma.strategicQuestion.deleteMany({
          where: { profileId: doc.id }
        });

        for (const question of engagementStrategy.strategicQuestions) {
          await prisma.strategicQuestion.create({
            data: {
              profileId: doc.id,
              question: question.question,
              context: question.context
            }
          });
        }
      }

      console.log(`Migrated profile: ${doc.id}`);
    } catch (error) {
      console.error(`Error migrating profile ${doc.id}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('Starting migration from Firebase to Supabase with Prisma...');

    // Migrate users first
    await migrateUsers();

    // Then migrate profiles and related data
    await migrateProfiles();

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
