'use client';

import {
  Award,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Heart,
  Lightbulb,
  MessageCircle,
  Rocket,
  Target,
  User
} from 'lucide-react';
import { useState } from 'react';
import { APIProfile } from '@/app/api/completion/prompt';

export function ProfileDetailsNew({
  initialProfile
}: {
  initialProfile: APIProfile;
}) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    engagement_strategy: true,
    company_overview: false,
    professional_overview: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const profile = initialProfile.profileData;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Engagement Strategy Section */}
      <div className="bg-secondary/50 rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('engagement_strategy')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary"
        >
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-[#7FFFD4]" />
            <h3 className="text-lg font-semibold text-white">
              Engagement Strategy
            </h3>
          </div>
          {expandedSections.engagement_strategy ? (
            <ChevronUp className="w-5 h-5 text-[#7FFFD4]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.engagement_strategy && (  
          <div className="px-6 py-4 border-t border-border space-y-6">
            {profile?.engagementStrategy?.icebreakers &&
              profile?.engagementStrategy?.icebreakers?.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-[#7FFFD4]" />
                  Ice Breakers
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {profile?.engagementStrategy?.icebreakers?.map(
                    (icebreaker, index) => (
                      <li key={index}>{icebreaker}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {profile?.engagementStrategy?.strategicQuestions &&
              profile?.engagementStrategy?.strategicQuestions?.length > 0 && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-[#7FFFD4]" />
                  Strategic Questions
                </h4>
                <div className="space-y-4">
                  {profile?.engagementStrategy?.strategicQuestions?.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="bg-secondary rounded-lg p-4"
                      >
                        <p className="text-white font-medium mb-2">
                          {item?.question || ''}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {item?.context || ''}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Company Overview Section */}
      <div className="bg-secondary/50 rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('company_overview')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary"
        >
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#7FFFD4]" />
            <h3 className="text-lg font-semibold text-white">
              Company Overview
            </h3>
          </div>
          {expandedSections.company_overview ? (
            <ChevronUp className="w-5 h-5 text-[#7FFFD4]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.company_overview && (
          <div className="px-6 py-4 border-t border-border space-y-6">
            {profile?.companyOverview?.currentRoleSummary && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-[#7FFFD4]" />
                  Current Role
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {profile?.companyOverview?.currentRoleSummary}
                </p>
              </div>
            )}

            {profile?.companyOverview?.companyDescription && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-[#7FFFD4]" />
                  Company Description
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {profile?.companyOverview?.companyDescription}
                </p>
              </div>
            )}

            {profile?.companyOverview?.marketPosition && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-[#7FFFD4]" />
                  Market Position
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {profile?.companyOverview?.marketPosition}
                </p>
              </div>
            )}

            {profile?.companyOverview?.recentDevelopments && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Rocket className="w-4 h-4 text-[#7FFFD4]" />
                  Recent Developments
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {profile?.companyOverview?.recentDevelopments}
                </p>
              </div>
            )}

            {profile?.companyOverview?.productFit && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-[#7FFFD4]" />
                  Product Fit
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {profile?.companyOverview?.productFit}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Professional Overview Section */}
      <div className="bg-secondary/50 rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('professional_overview')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary"
        >
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#7FFFD4]" />
            <h3 className="text-lg font-semibold text-white">
              Professional Overview
            </h3>
          </div>
          {expandedSections.professional_overview ? (
            <ChevronUp className="w-5 h-5 text-[#7FFFD4]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.professional_overview && (
          <div className="px-6 py-4 border-t border-border space-y-6">
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-[#7FFFD4]" />
                Background
              </h4>
              <p className="text-gray-400 whitespace-pre-wrap">
                {profile?.professionalOverview?.background ||
                  'No background information available'}
              </p>
            </div>

            {profile?.professionalOverview?.achievements &&
              profile?.professionalOverview?.achievements?.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-[#7FFFD4]" />
                  Key Achievements
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {profile?.professionalOverview?.achievements?.map(
                    (achievement, index) => (
                      <li key={index}>{achievement}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {profile?.professionalOverview?.hobbiesAndPassions &&
              profile?.professionalOverview?.hobbiesAndPassions?.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-[#7FFFD4]" />
                  Hobbies & Passions
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {profile?.professionalOverview?.hobbiesAndPassions?.map(
                    (hobby, index) => (
                      <li key={index}>{hobby}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
