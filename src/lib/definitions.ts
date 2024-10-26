// export type User = {
//   id: string;
//   email: string;
//   // plan: 'FREE' | 'GROWTH' | 'SCALE';
//   betaAccess: boolean;
//   displayName: string;
//   createdAt: Date;
// }

export type Profile = {
  id?: string;
  userId?: string;
  content?: string;
  fullName: string;
  company: string;
  createdAt?: Date;
}