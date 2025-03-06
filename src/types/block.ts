interface BlockBase {
  id: string;
  type: BlockType;
}

interface EditableTextBlock extends BlockBase {
  content: string;
}

interface TextBlock extends EditableTextBlock {
  type: BlockType.Text;
}

interface TodoBlock extends EditableTextBlock {
  type: BlockType.Todo;
  checked: boolean;
}

interface ImageBlock extends BlockBase {
  type: BlockType.Image;
  url: string;
}

type Block = TextBlock | ImageBlock | TodoBlock;
