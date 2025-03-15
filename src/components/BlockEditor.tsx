import { useBlockEditorState, useBlockSelectionByKeyPress, useDisableZoomAndScrollOnTouch } from "@/hooks";
import { useOpenRootDocument } from "../hooks/useOpenRootDocumentInitially";
import { useDocumentsStore, useDocumentsUIStore } from "../store";
import { BlockEditorState } from "../types";
import DocumentEditor from "./DocumentEditor";
import DocumentsTabBar from "./DocumentsTabBar";
import { EditBlocksMenu } from "./edit-blocks-menu";

export default function BlockEditor() {
  const { documents } = useDocumentsStore();
  const { currentDocumentId } = useDocumentsUIStore();
  const blockEditorState = useBlockEditorState();

  useDisableZoomAndScrollOnTouch();
  useOpenRootDocument();
  useBlockSelectionByKeyPress();

  return (
    <div className={`${blockEditorState == BlockEditorState.EDITING_BLOCKS && "select-none"}`}>
      <DocumentsTabBar />

      {documents.map((doc) => doc.id === currentDocumentId && <DocumentEditor key={doc.id} document={doc} />)}

      <EditBlocksMenu />
    </div>
  );
}
