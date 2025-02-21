import { PlusIcon } from "lucide-react";

export const MemoriesListCompact: React.FC = () => (
  <div className="flex flex-col items-center justify-center font-montserrat">
    <p className="mb-4 text-xs tracking-wide text-b-grey-5">
      No memories to display
    </p>
    <button className="flex items-center text-base font-semibold tracking-wide text-b-purple-1">
      <PlusIcon className="mr-2" /> Create memory
    </button>
  </div>
);
