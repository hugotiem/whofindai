export type Profile = {
  id?: string;
  userId?: string;
  content?: string;
  fullName: string;
  company: string;
  prompt: string;
  lang: string;
  createdAt?: Date;
};

export type LinkedInProfile = {
  profileImageUrl: string;
  title: string;
  url: string;
};

export type HistoryItem = {
  id: string;
  fullName: string;
  company: string;
};
