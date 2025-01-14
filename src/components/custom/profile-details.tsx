import React, { useEffect, useState } from 'react';
import { Building2, GraduationCap, Briefcase, User, MapPin, ArrowLeft, RefreshCw, Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { APIProfile } from '@/app/api/completion/route';

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

export function ProfileDetails({ initialProfile }: { initialProfile?: APIProfile }) {
  const [profile] = useState(initialProfile);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [updating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    background: true,
    company: true,
    communication: true,
    personality: true,
  });

  useEffect(() => {
    async function loadProfile() {
      if (!id) {
        setLoading(false);
        return;
      };

      try {
        // const profile = await getProfileById(id);
        // setProfile(profile);

        // let query = supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('name', decodedName)
        //   .eq('company', decodedCompany);

        // Add additional filters if available
        // if (decodedRole) query = query.eq('role', decodedRole);
        // if (decodedIndustry) query = query.eq('industry', decodedIndustry);
        // if (decodedCity) query = query.eq('city', decodedCity);
        // if (decodedCountry) query = query.eq('country', decodedCountry);

        // let { data, error } = await query.maybeSingle();

        // if (error) {
        //   console.error('Error loading profile:', error);
        //   return;
        // }
        // setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  // const handleUpdate = async () => {
  //   if (!profile) return;
    
  //   setUpdating(true);
  //   try {
  //     const updatedProfile = await updateProfile(profile);
  //     if (updatedProfile) {
  //       setProfile(updatedProfile);
  //     }
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* {profile && (
        <SEO 
          title={`${profile.name} - ${profile.role} at ${profile.company}`}
          description={`Professional profile of ${profile.name}, ${profile.role} at ${profile.company}. Learn about their background, experience, and insights.`}
          keywords={[
            profile.name,
            profile.company,
            profile.role,
            profile.industry,
            'professional profile',
            'business insights'
          ]}
          type="profile"
          name={profile.name}
        />
      )} */}

      <div>
        <div className="flex justify-between items-center mb-6">
          <Link href="/browse" className="inline-flex items-center text-[#7FFFD4] hover:text-[#6CE9C1]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Link>
          {profile && (
            <button
              // onClick={handleUpdate}
              disabled={updating}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                updating
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#7FFFD4] text-[#0D1117] hover:bg-[#6CE9C1]'
              }`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading profile...</div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Key Information Card */}
              <div className="bg-[#1C2128] rounded-lg p-6 border border-gray-700">
                <div className="flex items-start space-x-4">
                  <User className="w-12 h-12 text-[#7FFFD4] mt-1" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{profile.fullName}</h2>
                    <div className="space-y-2 text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-[#7FFFD4]" />
                        <span>{profile.role} at {profile.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-[#7FFFD4]" />
                        <span>{profile.city}, {profile.country}</span>
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

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1C2128] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-5 h-5 text-[#7FFFD4]" />
                    <h3 className="text-white font-semibold">Experience</h3>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{profile.missions}</p>
                </div>

                <div className="bg-[#1C2128] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-[#7FFFD4]" />
                    <h3 className="text-white font-semibold">Education</h3>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{profile.education}</p>
                </div>

                <div className="bg-[#1C2128] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-[#7FFFD4]" />
                    <h3 className="text-white font-semibold">Communication</h3>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{profile.communication_insights}</p>
                </div>
              </div>

              {/* Detailed Sections */}
              <div className="space-y-4">
                {/* Background Section */}
                <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('background')}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-[#7FFFD4]" />
                      <h3 className="text-lg font-semibold text-white">Professional Background</h3>
                    </div>
                    {expandedSections.background ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.background && (
                    <div className="px-6 py-4 border-t border-gray-700">
                      <p className="text-gray-400 whitespace-pre-wrap">{profile.background}</p>
                    </div>
                  )}
                </div>

                {/* Company Section */}
                <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('company')}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-[#7FFFD4]" />
                      <h3 className="text-lg font-semibold text-white">Company Information</h3>
                    </div>
                    {expandedSections.company ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.company && (
                    <div className="px-6 py-4 border-t border-gray-700">
                      <p className="text-gray-400 whitespace-pre-wrap">{profile.company_description}</p>
                    </div>
                  )}
                </div>

                {/* Communication Section */}
                <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('communication')}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
                  >
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-[#7FFFD4]" />
                      <h3 className="text-lg font-semibold text-white">Communication Style</h3>
                    </div>
                    {expandedSections.communication ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.communication && (
                    <div className="px-6 py-4 border-t border-gray-700">
                      <p className="text-gray-400 whitespace-pre-wrap">{profile.communication_insights}</p>
                    </div>
                  )}
                </div>

                {/* Personality Section */}
                <div className="bg-[#1C2128] rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('personality')}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-[#7FFFD4]" />
                      <h3 className="text-lg font-semibold text-white">Personality Traits</h3>
                    </div>
                    {expandedSections.personality ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.personality && (
                    <div className="px-6 py-4 border-t border-gray-700">
                      <p className="text-gray-400 whitespace-pre-wrap">{profile.personality_traits}</p>
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