/**
 * Generate URL query string from object.
 * @param {Record<string, string | string[] | undefined>} object - Object to generate URL query string.
 * @returns {string} URL query string.
 * @example generateURLQuery({ q: 'search', page: 1 }) // 'q=search&page=1'
 */
export const generateURLQuery = (
  object: Record<string, string | string[] | undefined>,
): string => {
  const params = new URLSearchParams();

  for (const key in object) {
    if (object[key]) {
      params.set(key, String(object[key]));
    } else {
      params.delete(key);
    }
  }

  return params.toString();
};
