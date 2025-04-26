import { DocumentBlock } from "@/types";
import { IoArrowForward } from "react-icons/io5";
import { useDocumentsStore, useDocumentTabsStore } from "../../store";
import BlockWrapper from "./BlockWrapper";

const DocumentBlockComponent = ({ block }: { block: DocumentBlock }) => {
  const { loadDocument } = useDocumentsStore();
  const { openDocument, currentTabId } = useDocumentTabsStore();
  const { refId, content } = block;

  const handleOpenDocument = async () => {
    const { data: doc, error } = await loadDocument(refId);
    if (error) {
      console.error("Error loading document", error);
      return;
    }
    if (doc) {
      console.log("Open doc", doc.name);
      openDocument(currentTabId, doc.id);
    }
  };

  return (
    <BlockWrapper block={block}>
      <div onClick={handleOpenDocument} className="flex items-center cursor-pointer">
        <div className="text-xl opacity-70 mr-3">
          <IoArrowForward />
        </div>
        <div>
          <p className="font-semibold truncate">{content}</p>
          <p className="opacity-40 text-sm">Click to open document</p>
        </div>
      </div>
    </BlockWrapper>
  );
};

export default DocumentBlockComponent;
