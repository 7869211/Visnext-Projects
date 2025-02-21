import Image from 'next/image';
import Logo from '@/assets/images/chase-labs-logo.svg';
import Brand from '@/assets/images/chase-labs-brand.svg';

interface LogoWithBrandProps {
  logoWidth?: number;
  logoHeight?: number;
  brandWidth?: number;
  brandHeight?: number;
}

const LogoWithBrand = ({
  logoWidth = 72,
  logoHeight = 72,
  brandHeight = 52,
}: LogoWithBrandProps) => (
  <div className="flex gap-3">
    <Image
      src={Logo}
      alt="Chase Labs Logo"
      width={logoWidth}
      height={logoHeight}
    />
    <Image
      src={Brand}
      alt="Chase Labs Brand"
      height={brandHeight}
    />
  </div>
);

export default LogoWithBrand;
