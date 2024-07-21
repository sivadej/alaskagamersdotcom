import Image from 'next/image';
import NavButtonGroup from './nav';

export default function Header() {
  return (
    <>
      <div className="flex mx-auto mb-4">
        <a href="/">
          <Image
            src="/akgamers-logo_500x175.png"
            alt="AKGamers"
            width={200}
            height={50}
          />
        </a>
        <div className="flex-grow"></div>
        <Image src="/evo-logo.svg" alt="evo logo" width={50} height={50} />
      </div>
      {/* <div className="bg-green-600 p-4 mx-auto mb-5 mt-5 border-2 border-green-700 rounded text-xs md:text-sm text-center">
        GGs to all competitors!
      </div> */}
      <NavButtonGroup />
    </>
  );
}
