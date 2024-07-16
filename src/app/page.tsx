import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import HomeLogo from "./components/HomeLogo";
import Challonge from "./components/LatestChallonge";

import styles from "./styles.module.css";

export default function Home() {
  return (
    <div className={styles.homeBody}>
      <main className="flex min-h-screen flex-col items-center p-8">
        <div className="relative mb-4">
          <Link href="/">
            <HomeLogo />
          </Link>
        </div>

        <a
          href="/evo-tracker"
          className="text-blue-300 group rounded-lg border px-5 py-4 border-neutral-700 bg-neutral-800/30 text-center mb-2 animate-pulse"
        >
          <div>
            <Image
              src="/evo-logo.svg"
              alt="evo logo"
              width={50}
              height={50}
              className="drop-shadow mx-auto mb-2"
            />
          </div>
          <h2 className={`mb-1 text-2xl font-semibold`}>
            <div>
              AKG Evo 2024 Tracker{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </div>
          </h2>
        </a>

        <a
          href="https://discord.gg/f6QjNZu"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
        >
          <h2 className={`mb-1 text-2xl font-semibold`}>
            Discord{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
        </a>

        <div className="grid text-center gap-2">
          <a
            href="https://twitch.tv/alaskagamers"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
          >
            <h2 className={`mb-1 text-2xl font-semibold`}>
              Stream{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </a>

          <a
            href="https://www.facebook.com/groups/AKGFGC/"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
          >
            <h2 className={`mb-1 text-2xl font-semibold`}>
              Facebook{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </a>

          <a
            href="https://www.youtube.com/alaskagamers"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
          >
            <h2 className={`mb-1 text-2xl font-semibold`}>
              YouTube{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </a>

          <hr className="my-8 border-gray-100 opacity-30" />
        </div>

        <Suspense fallback={<SkeletonLoader />}>
          <Challonge />
        </Suspense>

        <hr className="my-8 border-gray-100 opacity-30" />
        <div className="flex items-center space-x-4">
          <TwitterLink />
          <InstagramLink />
        </div>
      </main>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="group text-center rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30">
      <h2 className={`mb-1 text-2xl font-semibold`}>Latest Brackets</h2>
      <p className={`m-0 text-sm opacity-50`}>Getting latest from Challonge:</p>
      <div className="text-center">
        <GlowyLine />
        <GlowyLine />
        <GlowyLine />
        <GlowyLine />
        <GlowyLine />
        <GlowyLine />
      </div>
    </div>
  );
}

function GlowyLine() {
  const randomWidth = Math.floor(Math.random() * 100) + 300;
  return (
    <div
      className="text-center bg-blue-300 animate-pulse"
      style={{ height: 18, width: randomWidth, margin: "auto", marginTop: 12 }}
    />
  );
}

function InstagramLink() {
  return (
    <a
      href="https://www.instagram.com/alaskagamers"
      className="text-gray-400 hover:text-pink-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 6.5h-3.6l-1.9-2.5h-5.2L7.6 6.5H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 18.5h16a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
        />
      </svg>
    </a>
  );
}

function TwitterLink() {
  return (
    <a
      href="https://twitter.com/alaskagamers"
      className="text-gray-400 hover:text-blue-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M22.46 5.16c-.8.35-1.64.59-2.52.7a4.52 4.52 0 0 0 1.98-2.5 9.05 9.05 0 0 1-2.87 1.1 4.51 4.51 0 0 0-7.7 4.11 12.8 12.8 0 0 1-9.3-4.7 4.5 4.5 0 0 0 1.4 6.02 4.5 4.5 0 0 1-2.05-.56v.06a4.5 4.5 0 0 0 3.6 4.4 4.56 4.56 0 0 1-2 .08 4.5 4.5 0 0 0 4.2 3.1 9.05 9.05 0 0 1-5.6 1.9 9.54 9.54 0 0 1-1.1-.06 12.74 12.74 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8l-.01-.58a8.99 8.99 0 0 0 2.22-2.3z"
        />
      </svg>
    </a>
  );
}
