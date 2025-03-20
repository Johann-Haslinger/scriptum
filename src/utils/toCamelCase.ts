/* eslint-disable @typescript-eslint/no-explicit-any */
export const toCamelCase = (obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()), value])
  );
};
/* eslint-enable @typescript-eslint/no-explicit-any */
