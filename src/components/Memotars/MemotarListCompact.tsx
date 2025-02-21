import { MemotarItem } from "./MemotarItem";
import { ViewAllCard } from "../Chat/ViewAllCard";
import { useFetchAvatars } from "@/app/nextapi/avatars/api";
import { useRouter } from "next/navigation";
export const MemotarListCompact: React.FC = () => {
  const { data: memotars = [], isLoading, error } = useFetchAvatars();
  const router = useRouter();

  if (error) {
    return <div className="text-poppy">Error loading memotars</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-22">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-b-purple-1"></div>
      </div>
    );
  }

  return (
    <>
      {memotars.length === 0 ? (
        <div className="flex flex-col items-center justify-center font-montserrat">
          <p className="mb-4 text-sm tracking-wide text-b-grey-5">
            No memotars to display
          </p>
        </div>
      ) : (
        <div className="flex flex-col font-montserrat gap-2 sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {memotars.slice(0, window.innerWidth < 768 ? 3 : 8).map((memotar) => (
            <div
              key={memotar.id}
              onClick={() => {
                router.push(`/memotars/details?id=${memotar.id}`);
              }}
            >
              <MemotarItem {...memotar} />
            </div>
          ))}
          <ViewAllCard itemCount={memotars.length} />
        </div>
      )}
    </>
  );
};
