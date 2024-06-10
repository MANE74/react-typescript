export const getSsoRedirectUrl = (email: string | null, provider?: string) => {
  var url;
  const host = 'https://' + window.location.host;

  if (email) {
    url = host + '/login/?sso=' + encodeURIComponent(email);
  } else {
    url = host + '/login/?sso_provider=' + provider;
  }

  return url;
};

export const getFragmentParams = (fragment?: any) => {
  var params:any= {};

  if (!fragment && window.location.hash) {
    fragment = window.location.hash.substring(1);
  }

  if (fragment) {
    fragment.split('&').forEach(function (part: any) {
      var values = part.split('=');
      var key = values[0];

      if (values.length >= 2) {
        values.shift();
        params[key] = values.join('=');
      }
    });
  }

  return params;
};
