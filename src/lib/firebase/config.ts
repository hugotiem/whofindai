export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_SA_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_SA_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_SA_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_SA_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_SA_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_SA_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_SA_MEASUREMENT_ID
};

export const serviceAccount = {
  type: process.env.SA_TYPE,
  project_id: process.env.SA_PROJECT_ID,
  private_key_id: process.env.SA_PRIVATE_KEY_ID,
  private_key: process.env.SA_PRIVATE_KEY,
  client_email: process.env.SA_CLIENT_EMAIL,
  client_id: process.env.SA_CLIENT_ID,
  auth_uri: process.env.SA_AUTH_URI,
  token_uri: process.env.SA_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SA_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.SA_CLIENT_CERT_URL,
  universe_domain: process.env.SA_UNIVERSE_DOMAIN
};
