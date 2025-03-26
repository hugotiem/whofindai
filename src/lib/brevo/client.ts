import * as brevo from '@getbrevo/brevo';

const apiKey = process.env.BREVO_API_KEY!;
if (!apiKey) {
  throw new Error('BREVO_API_KEY environment variable is not set');
} else {
  console.log('BREVO API KEY WELL SET');
}

// Create the contacts API instance
const contactClient = new brevo.ContactsApi();
contactClient.setApiKey(brevo.ContactsApiApiKeys.apiKey, apiKey);

const brevoClient = {
  contacts: contactClient
};

export default brevoClient;
