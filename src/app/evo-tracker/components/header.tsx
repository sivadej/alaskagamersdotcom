import Image from "next/image";
import NavButtonGroup from "./nav";

export default function Header() {
  return (
    <>
      <div className="flex mx-auto mb-2">
        <Image
          src="/akgamers-logo_500x175.png"
          alt="AKGamers"
          width={200}
          height={50}
        />
        <div className="flex-grow"></div>
        <Image src="/evo-logo.svg" alt="evo logo" width={50} height={50} />
      </div>
      <div className="bg-yellow-600 p-4 mx-auto mb-5 border-2 border-yellow-700 rounded text-xs md:text-sm text-center">
        Preview Mode: Using limited Evo 2023 results until 2024 data becomes
        available.
      </div>
      <NavButtonGroup />
    </>
  );
}
