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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Engagement Strategy Section */}
      <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('engagement_strategy')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
        >
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-[#7FFFD4]" />
            <h3 className="text-lg font-semibold text-white">
              Engagement Strategy
            </h3>
          </div>
          {expandedSections.engagement_strategy ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.engagement_strategy && (
          <div className="px-6 py-4 border-t border-gray-700 space-y-6">
            {initialProfile.engagementStrategy?.icebreakers?.length > 0 && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-[#7FFFD4]" />
                  Ice Breakers
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {initialProfile.engagementStrategy.icebreakers.map(
                    (icebreaker, index) => (
                      <li key={index}>{icebreaker}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {initialProfile.engagementStrategy?.strategicQuestions?.length >
              0 && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-[#7FFFD4]" />
                  Strategic Questions
                </h4>
                <div className="space-y-4">
                  {initialProfile.engagementStrategy.strategicQuestions.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/30 rounded-lg p-4"
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
      <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('company_overview')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
        >
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#7FFFD4]" />
            <h3 className="text-lg font-semibold text-white">
              Company Overview
            </h3>
          </div>
          {expandedSections.company_overview ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.company_overview && (
          <div className="px-6 py-4 border-t border-gray-700 space-y-6">
            {initialProfile.companyOverview?.currentRoleSummary && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-[#7FFFD4]" />
                  Current Role
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {initialProfile.companyOverview.currentRoleSummary}
                </p>
              </div>
            )}

            {initialProfile.companyOverview?.companyDescription && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-[#7FFFD4]" />
                  Company Description
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {initialProfile.companyOverview.companyDescription}
                </p>
              </div>
            )}

            {initialProfile.companyOverview?.marketPosition && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-[#7FFFD4]" />
                  Market Position
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {initialProfile.companyOverview.marketPosition}
                </p>
              </div>
            )}

            {initialProfile.companyOverview?.recentDevelopments && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Rocket className="w-4 h-4 text-[#7FFFD4]" />
                  Recent Developments
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {initialProfile.companyOverview.recentDevelopments}
                </p>
              </div>
            )}

            {initialProfile.companyOverview?.productFit && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-[#7FFFD4]" />
                  Product Fit
                </h4>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {initialProfile.companyOverview.productFit}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Professional Overview Section */}
      <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('professional_overview')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
        >
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#7FFFD4]" />
            <h3 className="text-lg font-semibold text-white">
              Professional Overview
            </h3>
          </div>
          {expandedSections.professional_overview ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.professional_overview && (
          <div className="px-6 py-4 border-t border-gray-700 space-y-6">
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-[#7FFFD4]" />
                Background
              </h4>
              <p className="text-gray-400 whitespace-pre-wrap">
                {initialProfile.professionalOverview?.background ||
                  'No background information available'}
              </p>
            </div>

            {initialProfile.professionalOverview?.achievements?.length > 0 && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-[#7FFFD4]" />
                  Key Achievements
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {initialProfile.professionalOverview.achievements.map(
                    (achievement, index) => (
                      <li key={index}>{achievement}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {initialProfile.professionalOverview?.hobbiesAndPassions?.length >
              0 && (
              <div>
                <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-[#7FFFD4]" />
                  Hobbies & Passions
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {initialProfile.professionalOverview.hobbiesAndPassions.map(
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
