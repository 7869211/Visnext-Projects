import { PlusIcon } from "lucide-react";

export const CreateMemotarButton: React.FC = () => {
  return (
    <button className="rounded-lg p-4 border border-b-grey-2 flex items-center justify-center h-22">
      <PlusIcon className="mr-2 text-b-purple-1" />
      <span className="text-b-purple-1 font-semibold tracking-wide">
        Create memotar
      </span>
    </button>
  );
};
