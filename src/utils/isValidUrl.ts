export const isValidUrl = (url: string) => {
  try {
    new URL(url);
  } catch (_) {
    return false;
  }

  return true;
};
