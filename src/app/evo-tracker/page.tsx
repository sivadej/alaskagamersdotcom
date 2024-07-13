import Image from "next/image";
import { Suspense } from "react";
import Schedule from "./components/schedule";

export default async function Page() {
  return (
    <div className="p-2 md:p-8">
      <div
        className="flex mx-auto mb-2"
        style={{ minWidth: "350px", maxWidth: "720px" }}
      >
        <Image
          src="/akgamers-logo_500x175.png"
          alt="AKGamers"
          width={200}
          height={50}
        />
        <div className="flex-grow"></div>
        <Image src="/evo-logo.svg" alt="evo logo" width={50} height={50} />
      </div>
      <div
        style={{ maxWidth: 600 }}
        className="bg-yellow-600 p-4 mx-auto mb-5 border-2 border-yellow-700 rounded text-xs md:text-sm text-center"
      >
        Preview Mode: Using limited Evo 2023 results until 2024 data becomes
        available.
      </div>
      <Suspense fallback={<div>Loading Player Schedules</div>}>
        <Schedule />
      </Suspense>
    </div>
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
