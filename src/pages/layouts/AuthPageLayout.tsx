import React from "react";
import Image from "next/image";
import LogoWithBrand from "@/components/ui/Auth/LogoWithBrand";
import SupportingTopGraphic from "@/assets/images/supporting-graphic-top.svg";
import SupportingBottomGraphic from "@/assets/images/supporting-graphic-bottom.svg";

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  actions: React.ReactNode;
  bottomText?: React.ReactNode;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  title,
  subtitle,
  actions,
  bottomText,
}) => {
  return (
    <div className="relative flex items-center min-h-screen bg-gradient-to-t from-[#18051a] via-[#18051a] to-transparent bg-[#18051a]">
      <div className="absolute top-0 left-0">
        <Image
          src={SupportingTopGraphic}
          alt="Top Graphic"
          width={300}
          height={232}
        />
      </div>
      <div className="absolute bottom-0 right-0">
        <Image
          src={SupportingBottomGraphic}
          alt="Bottom Graphic"
          width={368}
          height={413}
        />
      </div>

      <div className="flex flex-col gap-6 max-w-[724px] w-[100%] px-4 py-5 mx-auto text-[#F8E9F8] z-[1]">
        <div>
          <LogoWithBrand />

          <h2 className="text-4xl font-semibold text-white mt-5">
            {title}
            <br />
            <span className="font-extralight mt-2">{subtitle}</span>
          </h2>

          <div className="flex flex-col gap-6">{actions}</div>

          <div className="flex justify-center gap-1 text-white text-lg">
            {bottomText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
