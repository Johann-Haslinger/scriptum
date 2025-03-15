import { useBlockEditorState, useDisableZoomAndScrollOnTouch } from "@/hooks";
import { useOpenRootDocument } from "../hooks/useOpenRootDocumentInitially";
import { useDocumentsStore, useDocumentsUIStore } from "../store";
import { BlockEditorState } from "../types";
import DocumentPage from "./DocumentPage";
import DocumentsTabBar from "./DocumentsTabBar";
import { EditBlocksMenu } from "./edit-blocks-menu";

export default function BlockEditor() {
  const { documents } = useDocumentsStore();
  const { currentDocumentId } = useDocumentsUIStore();
  const blockEditorState = useBlockEditorState();

  useDisableZoomAndScrollOnTouch();
  useOpenRootDocument();

  return (
    <div className={`${blockEditorState == BlockEditorState.EDITING_BLOCKS && "select-none"}`}>
      <DocumentsTabBar />

      {documents.map((doc) => doc.id === currentDocumentId && <DocumentPage key={doc.id} documentId={doc.id} />)}

      <EditBlocksMenu />
    </div>
  );
}
