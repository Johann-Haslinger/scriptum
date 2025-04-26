"use client";

import {
  useAuthManager,
  useBlockEditorState,
  useBlockSelectionByKeyPress,
  useCurrentBlocks,
  useCurrentDocument,
  useDisableZoomAndScrollOnTouch,
  useDocumentEntry,
} from "@/hooks";
import { useBlocksUIStore, useDocumentsStore, useUserStore } from "../store";
import { BlockEditorState } from "../types";
import { AuthUI } from "./auth-ui";
import { CommandMenu } from "./command-menu";

import { useEffect, useMemo, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { DocumentEditor } from "./document-editor";
import SelectionControlWrapper from "./document-editor/SelectionControlWrapper";
import { DocumentTabsBar } from "./document-tabs-bar";
import { EditBlocksMenu } from "./edit-blocks-menu";

export default function BlockEditor() {
  const blockEditorState = useBlockEditorState();
  const isUserLoggedIn = useUserStore((state) => state.isUserLoggedIn);
  const { documents } = useDocumentsStore();
  const { currentDocumentId } = useCurrentDocument();
  const currentDocument = useMemo(() => {
    return documents.find((doc) => doc.id === currentDocumentId);
  }, [documents, currentDocumentId]);

  useDisableZoomAndScrollOnTouch();
  useDocumentEntry();
  useBlockSelectionByKeyPress();
  useAuthManager();
  useBlockFocusEntry();

  return isUserLoggedIn == false ? (
    <AuthUI />
  ) : (
    <div className={blockEditorState === BlockEditorState.EDITING_BLOCKS ? "select-none" : ""}>
      <DocumentTabsBar />

      <SelectionControlWrapper>
        {currentDocument ? (
          documents.map(
            (doc) => doc.id == currentDocumentId && <DocumentEditor key={doc.id} document={currentDocument} />
          )
        ) : (
          <DocumentLoadingState />
        )}
      </SelectionControlWrapper>

      <EditBlocksMenu />
      <CommandMenu />
    </div>
  );
}

const useBlockFocusEntry = () => {
  const currentBlocks = useCurrentBlocks();
  const { setFocused, focusedBlockId } = useBlocksUIStore();

  const handleFocusEntry = (e: KeyboardEvent) => {
    if (focusedBlockId) return;

    if (e.key == "ArrowUp") {
      const firstBlock = currentBlocks[0];
      setFocused(firstBlock.id);
    } else if (e.key == "ArrowDown") {
      const lastBlock = currentBlocks[currentBlocks.length - 1];
      setFocused(lastBlock.id);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleFocusEntry);
    return () => {
      window.removeEventListener("keydown", handleFocusEntry);
    };
  }, [currentBlocks, focusedBlockId]);
};

const DocumentLoadingState = () => {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setLoadFailed(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-4">
          <div className="relative animate-spin text-2xl" style={{ animationDuration: "0.7s" }}>
            <CgSpinner />
          </div>
        </div>
      )}

      {loadFailed && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fadeIn">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Document Not Found</h3>
          <p className="text-gray-600 text-center max-w-md">
            We couldn't locate the document you're looking for. It may have been moved or deleted.
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
