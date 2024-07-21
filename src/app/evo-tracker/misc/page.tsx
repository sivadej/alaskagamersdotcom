import PageBody from '../components/pagebody';
import Image from 'next/image';

export default function MiscLinks() {
  return (
    <PageBody>
      <h3 className="text-blue-400 mb-1 text-xl w-full">Links</h3>
      {[
        {
          text: 'Evo Twitch Stream (Main)',
          url: 'https://www.twitch.tv/evo',
          icon: '/twitch.svg',
        },
        // {
        //   text: 'Evo Twitch Stream #2',
        //   url: 'https://www.twitch.tv/evo2',
        //   icon: '/twitch.svg',
        // },
        // {
        //   text: 'Evo Twitch Stream #3',
        //   url: 'https://www.twitch.tv/evo3',
        //   icon: '/twitch.svg',
        // },
        // {
        //   text: 'Evo Twitch Stream #4',
        //   url: 'https://www.twitch.tv/evo4',
        //   icon: '/twitch.svg',
        // },
        // {
        //   text: 'Evo Twitch Stream #5',
        //   url: 'https://www.twitch.tv/evo5',
        //   icon: '/twitch.svg',
        // },
        // {
        //   text: 'Evo Twitch Stream #6',
        //   url: 'https://www.twitch.tv/evo6',
        //   icon: '/twitch.svg',
        // },
        // {
        //   text: 'Evo Twitch Stream #7',
        //   url: 'https://www.twitch.tv/evo7',
        //   icon: '/twitch.svg',
        // },
        {
          text: 'Stream Schedule',
          url: '/evo24/evostreamschedule.jpg',
        },
        {
          text: 'Venue Map',
          url: '/evo24/evovenuemap.jpg',
        },
      ].map(({ text, url, icon }) => {
        return (
          <a
            key={url}
            href={url}
            className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center mb-1"
            target="_blank"
          >
            {icon ? (
              <Image
                src={icon}
                className="mr-2"
                width={24}
                height={24}
                alt={text}
              />
            ) : null}

            {text}
            <Image
              src="/external-link.svg"
              className="ml-2"
              width={16}
              height={16}
              alt={text}
            />
          </a>
        );
      })}
      <h3 className="text-blue-400 mb-1 text-xl w-full mt-8">About</h3>
      <div className="text-gray-300">
        Created by Bomby Kitchpanich for AlaskaGamers. Contact{' '}
        <span className="text-blue-400">
          <a
            href="https://discordapp.com/users/141447155280773122"
            target="_blank"
          >
            ebomb9201
          </a>
        </span>{' '}
        on Discord to report bugs or request features.
      </div>
      <a
        href={'https://www.buymeacoffee.com/ebomby'}
        className="bg-gray-900 hover:bg-gray-800 flex p-2 items-center mb-1 mt-2 text-sm"
        target="_blank"
      >
        <Image
          src="/coffee.svg"
          className="mr-1"
          width={24}
          height={24}
          alt="Buy Me A Coffee"
        />
        Support the developer! All server and hosting costs for this page are
        out of pocket.
      </a>
    </PageBody>
  );
}
