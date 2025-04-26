import { HOME_TAB_ID, useDocumentTabsStore } from "../store";

export const useHomeTab = () => {
  const { currentTabId } = useDocumentTabsStore();
  const homeTab = useDocumentTabsStore((state) => state.tabs.find((tab) => tab.id === HOME_TAB_ID));

  const isHomeTabCurrent = currentTabId === HOME_TAB_ID;

  return {
    isHomeTabCurrent,
    homeTab,
  };
};
