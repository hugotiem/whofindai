const client_id = process.env.LINKEDIN_CLIENT_ID;
const client_secret = process.env.LINKEDIN_CLIENT_SECRET;
const redirect_uri = process.env.LINKEDIN_REDIRECT_URI;

type LinkedinAccessTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
};

type GenerateAuthUrlOptions = {
  scope?: string;
  state?: string;
};

/**
 * LeedInsight LinkedIn client
 * @description LinkedIn client for generating auth URL and getting access token
 */
const linkedin = {
  /**
   * Generate auth URL
   * @description Generate auth URL for LinkedIn
   * @param options - GenerateAuthUrlOptions
   * @returns Auth URL
   */
  generateAuthUrl: (options?: GenerateAuthUrlOptions) => {
    const scope = options?.scope || 'r_liteprofile';
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
  },
  /**
   * Get access token
   * @description Get access token from LinkedIn
   * @param code - Authorization code
   * @returns Access token
   */
  getAccessToken: async (code: string) => {
    const response = await fetch(
      `https://www.linkedin.com/oauth/v2/accessToken`,
      {
        method: 'POST',
        body: JSON.stringify({ code, client_id, client_secret, redirect_uri })
      }
    );
    if (response.ok) {
      const data: LinkedinAccessTokenResponse = await response.json();
      return data;
    } else {
      throw new Error(response.statusText);
    }
  }
};

export default linkedin;
