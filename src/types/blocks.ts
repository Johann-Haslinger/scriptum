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

export interface TodoBlock extends ContentEditableBlockBase {
  type: BlockType.TODO;
  checked: boolean;
}

export interface ImageBlock extends BlockBase {
  type: BlockType.IMAGE;
  url: string;
}

export type Block = TextBlock | ImageBlock | TodoBlock;
