/* eslint-disable @typescript-eslint/no-explicit-any */
export const toSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`), value])
  );
};
/* eslint-enable @typescript-eslint/no-explicit-any */
