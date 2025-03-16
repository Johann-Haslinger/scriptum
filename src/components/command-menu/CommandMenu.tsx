import { compareDesc, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useCommandMenuUIStore, useDocumentsStore, useDocumentsUIStore } from "../../store";
import BackgroundOverlay from "./BackgroundOverlay";
import CommandMenuInput from "./CommandMenuInput";
import CommandMenuWrapper from "./CommandMenuWrapper";
import RecentDocumentList from "./RecentDocumentList";
import ResultsList from "./ResultsList";

const CommandMenu = () => {
  const { isCommandMenuOpen, searchQuery } = useCommandMenuUIStore();

  useCommandMenuKeyboardNavigation();
  useDocumentFocus();
  useSearchQueryReset();

  return (
    <div>
      <BackgroundOverlay />
      <AnimatePresence>
        {isCommandMenuOpen && (
          <CommandMenuWrapper>
            <CommandMenuInput />
            {searchQuery.length > 0 ? <ResultsList /> : <RecentDocumentList />}
          </CommandMenuWrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandMenu;

const useSearchQueryReset = () => {
  const { isCommandMenuOpen, setSearchQuery } = useCommandMenuUIStore();

  useEffect(() => {
    if (!isCommandMenuOpen) setSearchQuery("");
  }, [isCommandMenuOpen, setSearchQuery]);
};

const useCommandMenuKeyboardNavigation = () => {
  const { isCommandMenuOpen, setIsCommandMenuOpen, focusedDocumentId } = useCommandMenuUIStore();
  const { setCurrentDocument, setDocumentOpen } = useDocumentsUIStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && event.metaKey) {
        setIsCommandMenuOpen(!isCommandMenuOpen);
      }

      if (!isCommandMenuOpen) return;

      if (event.key === "Escape") {
        setIsCommandMenuOpen(false);
      } else if (event.key === "Enter" && focusedDocumentId) {
        setCurrentDocument(focusedDocumentId);
        setDocumentOpen(focusedDocumentId, true);
        setIsCommandMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCommandMenuOpen, setIsCommandMenuOpen, focusedDocumentId, setCurrentDocument]);
};

const useDocumentFocus = () => {
  const { focusedDocumentId, setFocusedDocumentId, isCommandMenuOpen } = useCommandMenuUIStore();
  const documents = useVisibleDocuments();

  useEffect(() => {
    if (!isCommandMenuOpen) {
      setFocusedDocumentId(null);
    }
  }, [isCommandMenuOpen, setFocusedDocumentId]);

  useEffect(() => {
    if (!focusedDocumentId && documents.length > 0) {
      setFocusedDocumentId(documents[0].id);
    }
  }, [documents, focusedDocumentId, setFocusedDocumentId]);

  useEffect(() => {
    if (focusedDocumentId && !documents.find((doc) => doc.id === focusedDocumentId)) {
      setFocusedDocumentId(documents.length > 0 ? documents[0].id : null);
    }
  }, [documents, focusedDocumentId, setFocusedDocumentId]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      const currentIndex = documents.findIndex((doc) => doc.id === focusedDocumentId);
      const nextIndex = (currentIndex + 1) % documents.length;
      setFocusedDocumentId(documents[nextIndex].id);
    } else if (event.key === "ArrowUp") {
      const currentIndex = documents.findIndex((doc) => doc.id === focusedDocumentId);
      const prevIndex = (currentIndex - 1 + documents.length) % documents.length;
      setFocusedDocumentId(documents[prevIndex].id);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [documents, focusedDocumentId, setFocusedDocumentId]);
};

const useVisibleDocuments = () => {
  const documents = useDocumentsStore((state) => state.documents);
  const { searchQuery } = useCommandMenuUIStore();

  return documents
    .filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      return compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt));
    });
};
