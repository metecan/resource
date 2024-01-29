export const startsWith = (str: string, search: string) => {
  return str.slice(0, search.length) === search;
};
