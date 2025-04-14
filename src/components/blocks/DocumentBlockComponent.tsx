import { DocumentBlock } from "@/types";
import { File } from "lucide-react";
import { useDocumentsUIStore } from "../../store";
import BlockWrapper from "./BlockWrapper";

const DocumentBlockComponent = ({ block }: { block: DocumentBlock }) => {
  const { setCurrentDocument } = useDocumentsUIStore();
  const { documentId, name } = block;

  const handleOpenDocument = () => {
    setCurrentDocument(documentId);
  };

  return (
    <BlockWrapper block={block}>
      <div onClick={handleOpenDocument} className="flex">
        <File />
        {name}
      </div>
    </BlockWrapper>
  );
};

export default DocumentBlockComponent;
