import { useBlockEditorState, useDisableZoomAndScrollOnTouch } from "@/hooks";
import { useDocumentsStore } from "../store/documentsStore";
import { BlockEditorState } from "../types";
import DocumentPage from "./DocumentPage";
import { EditBlocksMenu } from "./edit-blocks-menu";

export default function BlockEditor() {
  const { documents, currentDocumentId } = useDocumentsStore();
  const blockEditorState = useBlockEditorState();

  useDisableZoomAndScrollOnTouch();

  return (
    <div className={`${blockEditorState == BlockEditorState.EDITING_BLOCKS && "select-none"}`}>
      {documents.map((doc) => doc.id === currentDocumentId && <DocumentPage key={doc.id} documentId={doc.id} />)}

      <EditBlocksMenu />
    </div>
  );
}
