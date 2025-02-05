import { LinkedInProfile } from "@/lib/definitions";

export async function searchLinkedInProfile(
  fullName: string,
  company: string,
  local: string
): Promise<LinkedInProfile> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?` +
        new URLSearchParams({
          key: process.env.GOOGLE_API_KEY!,
          cx: process.env.GOOGLE_CX!,
          q: `${fullName}`,
          siteSearch: `linkedin.com/in`,
          num: '1',
          gl: local,
          hq: company
        })
    );

    const data = await response.json();

    if (!data.items?.[0]) {
      throw new Error('No LinkedIn profile found');
    }

    return {
      profileImageUrl: data.items[0].pagemap.metatags[0]?.['og:image'],
      title: data.items[0].title,
      url: data.items[0].link
    };
  } catch (error) {
    console.error('Error searching LinkedIn profile:', error);
    throw error;
  }
}

