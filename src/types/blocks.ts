import { BlockType } from "./enums/blockType";

interface BlockBase {
  id: string;
  documentId: string;
  type: BlockType;
  order: number;
}

interface ContentEditableBlockBase extends BlockBase {
  content: string;
}

export interface TextBlock extends ContentEditableBlockBase {
  type: BlockType.TEXT;
}

export interface ImageBlock extends BlockBase {
  type: BlockType.IMAGE;
  url: string;
}

export interface DocumentBlock extends BlockBase {
  type: BlockType.DOCUMENT;
  name: string;
  documentId: string;
}

export type Block = TextBlock | ImageBlock | DocumentBlock;
