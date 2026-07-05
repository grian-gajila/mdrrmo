import { images } from '@/constant/images';
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer id="contact" className=" lg:px-6 md:px-6 sm:px-6">
      <div className="mx-auto max-w-6xl py-16 md:rounded-t-lg px-6 lg:px-10 md:px-10 sm:px-10 lg:rounded-t-lg sm:rounded-lg bg-gray-100">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Image src={images.logo} alt="LOGO" className="h-10 w-10" />
              <span className="text-lg font-extrabold text-orange-500">
                MDRRMO
              </span>
            </div>
            <p className="max-w-55 text-xs leading-relaxed text-gray-500">
              Municipality Disaster Risk Reduction and Management Office
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-md mb-4 font-semibold tracking-wide text-gray-600 uppercase">
              Contact Us
            </p>
            {[
              { icon: Mail, text: 'mdrrmo@municipality.gov.ph' },
              { icon: Phone, text: '(042) 123-4567' },
              {
                icon: MapPin,
                text: 'Municipal Hall, Ground Floor, Main Office',
              },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 text-sm text-gray-500"
              >
                <Icon className="h-4 w-4 shrink-0 text-orange-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-300 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} MDRRMO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
