interface ViewAllCardProps {
  itemCount: number;
}

export const ViewAllCard: React.FC<ViewAllCardProps> = ({ itemCount }) => {
  return(
  <button className="rounded-lg p-4 border border-b-grey-2 flex items-center justify-center h-22 dark:border-[var(--dark-border-color)]">
    <span className="text-b-purple-1 font-semibold tracking-wide dark:text-b-grey-3">
      View all {itemCount} {itemCount === 1 ? "item" : "items"}
    </span>
  </button>
);}
