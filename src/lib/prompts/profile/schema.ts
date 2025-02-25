export interface Experience {
  companyName: string;
  occupation: string;
  location: string;
  duration: {
    startDate: string;
    endDate: string;
  };
}

export interface Education {
  schoolName: string;
  degree: string;
}

export interface ProfileResponseSchema {
  professionalOverview: {
    background: string;
    achievements: string[];
    hobbiesAndPassions: string[];
  };
  companyOverview: {
    currentRoleSummary: string;
    companyDescription: string;
    marketPosition: string;
    recentDevelopments: string;
    productFit: string;
  };
  engagementStrategy: {
    icebreakers: string[];
    strategicQuestions: {
      question: string;
      context: string;
    }[];
  };
  metadata: {
    fullName: string;
    pictureUrl: string;
    company: string;
    linkedin: string;
    description: string;
    currentOccupation: string;
    headline: string;
    location: string;
    experiences: Experience[];
    education: Education[];
    product: string;
  };
  // citations: string[];
}

export type CitationSection = {
  citations: string[];
  [key: string]: string | string[] | object[];
};
