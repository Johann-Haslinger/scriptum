import { compareDesc, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useCommandMenuUIStore, useDocumentsStore, useDocumentsUIStore, useUserStore } from "../../store";
import { newDocument } from "../../utils";
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
    if (isCommandMenuOpen) setSearchQuery("");
  }, [isCommandMenuOpen, setSearchQuery]);
};

const useCommandMenuKeyboardNavigation = () => {
  const { isCommandMenuOpen, setIsCommandMenuOpen, focusedMenuItem } = useCommandMenuUIStore();
  const { setCurrentDocument, setDocumentOpen } = useDocumentsUIStore();
  const { addDocument } = useDocumentsStore();
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && event.metaKey) {
        setIsCommandMenuOpen(!isCommandMenuOpen);
      }

      if (!isCommandMenuOpen) return;

      if (event.key === "Escape") {
        setIsCommandMenuOpen(false);
      } else if (event.key === "Enter" && focusedMenuItem) {
        event.preventDefault();

        if (focusedMenuItem === "new-document") {
          const newDoc = newDocument(userId);
          addDocument(newDoc);
          setCurrentDocument(newDoc.id);
          setDocumentOpen(newDoc.id, true);
          setIsCommandMenuOpen(false);
        } else {
          setCurrentDocument(focusedMenuItem);
          setDocumentOpen(focusedMenuItem, true);
          setIsCommandMenuOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isCommandMenuOpen,
    setIsCommandMenuOpen,
    focusedMenuItem,
    setCurrentDocument,
    addDocument,
    setDocumentOpen,
    userId,
  ]);
};

const useDocumentFocus = () => {
  const { focusedMenuItem, setFocusedMenuItem, isCommandMenuOpen } = useCommandMenuUIStore();
  const documents = useVisibleDocuments();

  useEffect(() => {
    if (isCommandMenuOpen) {
      setFocusedMenuItem(null);
    }
  }, [isCommandMenuOpen, setFocusedMenuItem]);

  useEffect(() => {
    if (focusedMenuItem == null) {
      setFocusedMenuItem("new-document");
    }
  }, [focusedMenuItem, setFocusedMenuItem]);

  useEffect(() => {
    const menuItems = ["new-document", ...documents.map((doc) => doc.id)];

    if (focusedMenuItem && !menuItems.find((item) => item === focusedMenuItem)) {
      setFocusedMenuItem(documents.length > 0 ? documents[0].id : null);
    }
  }, [documents, focusedMenuItem, setFocusedMenuItem]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const allItems = ["new-document", ...documents.map((doc) => doc.id)];
      if (event.key === "ArrowDown") {
        const currentIndex = allItems.findIndex((item) => item === focusedMenuItem);
        const nextIndex = (currentIndex + 1) % allItems.length;
        setFocusedMenuItem(allItems[nextIndex]);
      } else if (event.key === "ArrowUp") {
        const currentIndex = allItems.findIndex((item) => item === focusedMenuItem);
        const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length;
        setFocusedMenuItem(allItems[prevIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [documents, focusedMenuItem, setFocusedMenuItem, documents, setFocusedMenuItem]);
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
