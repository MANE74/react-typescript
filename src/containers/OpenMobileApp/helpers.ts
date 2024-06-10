export const isMobileBrowser = () => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const didAskedToGoMobileApp = () => {
  sessionStorage.setItem('didAskedToGoMobileApp', 'Y');
};
