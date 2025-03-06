import { BlockType } from "./blockType";

interface BlockBase {
  id: string;
  type: BlockType;
}

interface EditableTextBlock extends BlockBase {
  content: string;
}

export interface TextBlock extends EditableTextBlock {
  type: BlockType.TEXT;
}

export interface TodoBlock extends EditableTextBlock {
  type: BlockType.TODO;
  checked: boolean;
}

export interface ImageBlock extends BlockBase {
  type: BlockType.IMAGE;
  url: string;
}

export type Block = TextBlock | ImageBlock | TodoBlock;
