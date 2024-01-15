// utmGenerator.js

export const generateUTMParameters = (source, medium, campaign) => {
    const utmParameters = {
      utm_source: source || 'default_source',
      utm_medium: medium || 'default_medium',
      utm_campaign: campaign || 'default_campaign',
      // Add more UTM parameters as needed
    };
  
    return new URLSearchParams(utmParameters).toString();
  };
  