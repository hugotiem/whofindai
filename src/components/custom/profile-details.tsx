import React, { useEffect, useState } from 'react';
import {
  Building2,
  GraduationCap,
  Briefcase,
  User,
  MapPin,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { APIProfile } from '@/app/api/completion/prompt';
import { LinkedInLogoIcon } from '@radix-ui/react-icons';

// type Profile = Database['public']['Tables']['profiles']['Row'];

// Add date formatting utility
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(new Date(dateString));
};

export function ProfileDetails({
  initialProfile
}: {
  initialProfile?: APIProfile;
}) {
  const [profile] = useState(initialProfile);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  // const [updating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    professional_overview: false,
    company_overview: false,
    engagement_insights: false,
    ice_breaker: false
  });

  useEffect(() => {
    async function loadProfile() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      <div>
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              Loading profile...
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Key Information Card */}
              {/* TODO: create row with 2 columns. one is twice as wide as the other */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-[#1C2128] rounded-lg p-6 border border-gray-700 w-full md:w-2/3">
                  <div className="flex items-start space-x-4">
                    <User className="w-12 h-12 text-[#7FFFD4] mt-1" />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {profile.fullName}
                      </h2>
                      <div className="space-y-2 text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-[#7FFFD4]" />
                          <span>
                            {profile.role} at {profile.company}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-[#7FFFD4]" />
                          <span>
                            {profile.city}, {profile.country}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-[#7FFFD4]" />
                          <span>{profile.industry}</span>
                        </div>
                      </div>
                      {profile.updated_at && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-sm text-gray-500">
                            Last updated: {formatDate(profile.updated_at)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-[#1C2128] rounded-lg p-6 border border-gray-700 w-full md:w-1/3">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Contact Details
                  </h2>
                  <div className="flex flex-col gap-2 text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-[#7FFFD4]" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-[#7FFFD4]" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LinkedInLogoIcon className="w-4 h-4 text-[#7FFFD4]" />
                      <span>{profile.linkedin || 'Not available'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1C2128] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-5 h-5 text-[#7FFFD4]" />
                    <h3 className="text-white font-semibold">Experience</h3>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {profile.missions}
                  </p>
                </div>

                <div className="bg-[#1C2128] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-[#7FFFD4]" />
                    <h3 className="text-white font-semibold">Education</h3>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {profile.education || 'No education information available'}
                  </p>
                </div>

                <div className="bg-[#1C2128] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-[#7FFFD4]" />
                    <h3 className="text-white font-semibold">Communication</h3>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {profile.communication_insights}
                  </p>
                </div>
              </div>

              {/* Detailed Sections */}
              <div className="space-y-4">
                {/* Ice Breakers Section */}
                <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('ice_breaker')}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-[#7FFFD4]" />
                      <h3 className="text-lg font-semibold text-white">
                        Ice Breakers
                      </h3>
                    </div>
                    {expandedSections.ice_breaker ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.ice_breaker && (
                    <div className="px-6 py-4 border-t border-gray-700">
                      <p className="text-gray-400 whitespace-pre-wrap">
                        <ul className="list-disc list-inside space-y-2">
                          {profile.ice_breaker?.map((ice_breaker, index) => (
                            <li key={index}>{ice_breaker}</li>
                          ))}
                        </ul>
                      </p>
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
                      <Building2 className="w-5 h-5 text-[#7FFFD4]" />
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
                    <div className="px-6 py-4 border-t border-gray-700 space-y-4">
                      <h4 className="text-white font-semibold">
                        Role and Responsibilities
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {
                          profile.professional_overview
                            ?.role_and_responsibilities
                        }
                      </p>
                      <h4 className="text-white font-semibold">
                        Professional Background
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {profile.professional_overview?.background}
                      </p>
                      <h4 className="text-white font-semibold">
                        Personality Insights
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {profile.professional_overview?.personality_traits}
                      </p>
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
                      <MessageCircle className="w-5 h-5 text-[#7FFFD4]" />
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
                    <div className="px-6 py-4 border-t border-gray-700 space-y-4">
                      <h4 className="text-white font-semibold">
                        Basic Information
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {profile.company_overview?.basic_info}
                      </p>
                      <h4 className="text-white font-semibold">
                        Market Position
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {profile.company_overview?.market_position}
                      </p>
                      <h4 className="text-white font-semibold">
                        Challenges and Opportunities
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {profile.company_overview?.challenges}
                      </p>
                      <h4 className="text-white font-semibold">
                        Industry Trends
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {profile.company_overview?.industry_trends}
                      </p>
                    </div>
                  )}
                </div>

                {/* Engagement Insights Section */}
                <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('engagement_insights')}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-[#7FFFD4]" />
                      <h3 className="text-lg font-semibold text-white">
                        Engagement Insights
                      </h3>
                    </div>
                    {expandedSections.engagement_insights ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.engagement_insights && (
                    <div className="px-6 py-4 border-t border-gray-700 space-y-4">
                      <h4 className="text-white font-semibold">
                        Communication Tips
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        {profile.engagement_insights?.communication_tips}
                      </p>
                      <h4 className="text-white font-semibold">
                        Key Questions
                      </h4>
                      <p className="text-gray-400 whitespace-pre-wrap">
                        <ul className="list-disc list-inside space-y-2">
                          {profile.engagement_insights?.key_questions?.map(
                            (key_question, index) => (
                              <li key={index}>{key_question}</li>
                            )
                          )}
                        </ul>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Card */}
              {/* <div className="bg-[#1C2128] rounded-lg p-8 border border-gray-700 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Unlock Personalized Sales Insight For Free</h3>
                <p className="text-gray-400 mb-6">
                  Get access to tailored sales insights adapted to what you sell, including custom icebreakers, strategic questions, and detailed analysis of this person's readiness for your specific product or service.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center px-6 py-3 bg-[#7FFFD4] text-[#0D1117] rounded-lg font-medium hover:bg-[#6CE9C1] transition-colors"
                >
                  Start Free Trial
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div> */}
            </div>
          ) : (
            <div className="bg-[#1C2128] rounded-lg p-6 border border-gray-700 text-center">
              <p className="text-gray-400">Profile not found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
