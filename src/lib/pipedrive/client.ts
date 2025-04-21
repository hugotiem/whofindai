import { Configuration, PersonsApi } from 'pipedrive/v2';
import { PersonFieldsApi } from 'pipedrive/v1';

const apiConfig = new Configuration({
  apiKey: process.env.PIPEDRIVE_API_KEY
});

const pipedrive = {
  persons: new PersonsApi(apiConfig),
  personFields: new PersonFieldsApi(apiConfig),
};

export default pipedrive;
