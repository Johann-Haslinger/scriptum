import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { useCommandMenuUIStore } from "../../store";

const SearchDocumentButton = () => {
  const { setIsCommandMenuOpen } = useCommandMenuUIStore();

  const openCommandMenu = () => setIsCommandMenuOpen(true);

  return (
    <div>
      <motion.button
        onMouseDown={(e) => e.preventDefault()}
        onClick={openCommandMenu}
        data-tooltip-id="open-new-document"
        className="p-2 rounded-lg ml-2 focus:outline-2 focus:bg-blue-500/20  outline-blue-500/40 outline-offset-1 opacity-60 active:opacity-40 hover:opacity-100 transition-all text-xl cursor-pointer"
      >
        <IoSearch />
      </motion.button>
      <Tooltip place="right" id="open-new-document">
        Search document
      </Tooltip>
    </div>
  );
};

export default SearchDocumentButton;
