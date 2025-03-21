import {
  useAuthManager,
  useBlockEditorState,
  useBlockSelectionByKeyPress,
  useDisableZoomAndScrollOnTouch,
  useOpenRootDocument,
} from "@/hooks";
import { useDocumentsStore, useDocumentsUIStore, useUserStore } from "../store";
import { BlockEditorState } from "../types";
import { AuthUI } from "./auth-ui";
import { CommandMenu } from "./command-menu";

import { DocumentEditor } from "./document-editor";
import SelectionControlWrapper from "./document-editor/SelectionControlWrapper";
import { DocumentsTabBar } from "./documents-tab-bar";
import { EditBlocksMenu } from "./edit-blocks-menu";

export default function BlockEditor() {
  const { documents } = useDocumentsStore();
  const { currentDocumentId } = useDocumentsUIStore();
  const blockEditorState = useBlockEditorState();
  const isUserLoggedIn = useUserStore((state) => state.isUserLoggedIn);

  useDisableZoomAndScrollOnTouch();
  useOpenRootDocument();
  useBlockSelectionByKeyPress();
  useAuthManager();

  return isUserLoggedIn == false ? (
    <AuthUI />
  ) : (
    <div className={`${blockEditorState == BlockEditorState.EDITING_BLOCKS && "select-none"}`}>
      <DocumentsTabBar />

      <SelectionControlWrapper>
        {documents.map((doc) => doc.id === currentDocumentId && <DocumentEditor key={doc.id} document={doc} />)}
      </SelectionControlWrapper>

      <EditBlocksMenu />
      <CommandMenu />
    </div>
  );
}
