export type User = {
  id: string;
  email: string;
  // plan: 'FREE' | 'GROWTH' | 'SCALE';
  betaAccess: boolean;
  displayName: string;
  createdAt: Date;
}