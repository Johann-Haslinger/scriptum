import { Document } from "../types";

export const newDocument = (userId: string): Document => {
  return {
    id: crypto.randomUUID(),
    ownerId: userId,
    name: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sharedWith: [],
  };
};
