"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PlayerList({
  playerList,
}: {
  playerList: {
    id: any;
    name: any;
    games: any;
    url: string;
  }[];
}) {
  const [searchText, setSearchText] = useState("");

  const filteredPlayerList = playerList.filter((player) =>
    player.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <input
        type="search"
        placeholder="Search..."
        className="bg-gray-800 p-2 mb-1 w-full"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div
        className="divide-y divide-gray-600 border border-gray-600"
        style={{
          boxShadow: "0px 0px 4px 2px rgba(120,120,120,0.2)",
        }}
      >
        {filteredPlayerList.map((player) => {
          return (
            <div
              key={player.id}
              className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center"
            >
              <Link
                href={`/evo-tracker/players/${player.id}`}
                style={{ fontSize: "1.2em" }}
                className="flex-none md:w-56 w-32 mr-2"
              >
                {player.name}
              </Link>
              <Link
                href={`/evo-tracker/players/${player.id}`}
                style={{ flex: "1", lineHeight: "1" }}
              >
                <span className="text-xs mr-2 hidden md:block">
                  {player.games.join(", ")}
                </span>
              </Link>
              <Link
                href={`/evo-tracker/players/${player.id}`}
                style={{
                  display: "flex",
                  flex: "0 0 120px",
                  textAlign: "right",
                  justifyContent: "flex-end",
                }}
              >
                <div className="text-blue-400 text-xs flex items-center">
                  Schedule / Results
                </div>
              </Link>
              <Link
                href={player.url}
                style={{
                  display: "flex",
                  flex: "0 0 90px",
                  textAlign: "right",
                  justifyContent: "flex-end",
                }}
              >
                <div className="text-blue-400 text-xs flex items-center">
                  <Image
                    src="/startgg-logo.svg"
                    className="mr-1"
                    width={16}
                    height={16}
                    alt="start.gg"
                  />
                  start.gg
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
