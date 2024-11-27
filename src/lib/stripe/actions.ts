export const getCustomerSessionClientSecret = async () => {
  const response = await fetch('/api/stripe/session', {
    method: 'POST'
  });
  if (response.ok) {
    const { customer_session_client_secret } = await response.json();
    return customer_session_client_secret;
  }
};