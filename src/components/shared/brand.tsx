import { images } from '@/constant/images';
import Image from 'next/image';

interface Props {
  parentStyle?: string;
}

const Brand = ({ parentStyle }: Props) => {
  return (
    <div className={`flex items-center gap-2 ${parentStyle}`}>
      <div className="flex items-center justify-center">
        <Image src={images.logo} alt="LOGO" className="w-12" />
      </div>
      <div className="leading-none">
        <p className="text-lg font-bold text-orange-500">MDRRMO</p>
        <p className="mt-px text-[10px] text-center space-x-2 tracking-[0.5em] text-gray-400">
          Mansalay
        </p>
      </div>
    </div>
  );
};

export default Brand;
