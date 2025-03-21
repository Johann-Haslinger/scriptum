import { Block, BlockType } from "../types";

export const createNewBlock = (documentId: string): Block => {
  return {
    id: crypto.randomUUID(),
    documentId,
    content: "",
    type: BlockType.TEXT,
    order: 0,
  };
};
