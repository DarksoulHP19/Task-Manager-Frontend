import { motion } from 'framer-motion';

function Sidebar({ isOpen, onAssignTasks, onCheckProgress }) {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-16 left-0 h-full w-64 bg-[#e6e7e9] z-40"
    >
      <div className="p-4 space-y-2">
        <button
          onClick={onAssignTasks}
          className="w-full px-4 py-2.5 text-left text-black hover:bg-[#3485f7] rounded-lg transition-colors text-sm font-medium"
        >
          Assign Task
        </button>
        <button
          onClick={onCheckProgress}
          className="w-full px-4 py-2.5 text-left text-black hover:bg-[#3485f7]  rounded-lg transition-colors text-sm font-medium"
        >
          Check Progress Report
        </button>
      </div>
    </motion.div>
  );
}

export default Sidebar;