import { PlusIcon } from "lucide-react";
import Link from "next/link";

interface CreateButtonProps {
  btnText: string;
  href: string;
}

export const CreateButton: React.FC<CreateButtonProps> = ({
  btnText,
  href,
}) =>{ 
  return(
  <Link
    href={href}
    className="ml-auto flex items-center font-montserrat text-xxs md:text-base hover:cursor-pointer"
  >
    <PlusIcon className="mr-1 text-b-purple-1 dark:text-b-grey-6" size={18} />
    <span className={"text-b-purple-1 font-semibold tracking-wide dark:text-b-grey-6"}>
      {btnText}
    </span>
  </Link>
);}
