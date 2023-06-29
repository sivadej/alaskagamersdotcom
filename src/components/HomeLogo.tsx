import Image from "next/image";

export default function HomeLogo() {
  return (
    <div className="relative mb-8">
      <Image
        className="drop-shadow"
        src="/akgamers-logo-pngcmyk.png"
        alt="AKGamers"
        width={200}
        height={50}
        priority
      />
    </div>
  );
}