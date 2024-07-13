import PageBody from "../components/pagebody";

export default function MiscLinks() {
  return (
    <PageBody>
      <h3 className="text-blue-400 mb-1 text-xl w-full">Links</h3>
      {[
        { text: "Main Evo Twitch Stream", url: "https://www.twitch.tv/evo" },
        { text: "Evo Twitch Stream #2", url: "https://www.twitch.tv/evo2" },
        { text: "Evo Twitch Stream #3", url: "https://www.twitch.tv/evo3" },
        { text: "Evo Twitch Stream #4", url: "https://www.twitch.tv/evo4" },
        { text: "Evo Twitch Stream #5", url: "https://www.twitch.tv/evo5" },
        { text: "Evo Twitch Stream #6", url: "https://www.twitch.tv/evo6" },
        { text: "Evo Twitch Stream #7", url: "https://www.twitch.tv/evo7" },
      ].map(({ text, url }) => {
        return (
          <a
            key={url}
            href={url}
            className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center mb-1"
            target="_blank"
          >
            {text}
          </a>
        );
      })}
      <h3 className="text-blue-400 mb-1 text-xl w-full mt-8">About</h3>
      <div className="text-gray-300">
        Created by Bomby Kitchpanich for AlaskaGamers. Contact{" "}
        <span className="text-blue-400">
          <a
            href="https://discordapp.com/users/141447155280773122"
            target="_blank"
          >
            ebomb9201
          </a>
        </span>{" "}
        on Discord to report bugs or request features.
      </div>
      <a
        href={"https://www.buymeacoffee.com/ebomby"}
        className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center mb-1 mt-2 text-sm"
        target="_blank"
      >
        Support the developer! All server and hosting costs for this page are
        out of pocket.
      </a>
    </PageBody>
  );
}
