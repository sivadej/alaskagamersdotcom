import Image from 'next/image';

export default async function Page() {
  return (
    <div className="m-auto text-center mt-8">
      <Image
        src="/events/jbbrawl_v1.png"
        alt=""
        width={748}
        height={965}
        className="inline"
      />
      <h1 className="mt-8 mb-12 text-2xl">More info coming soon</h1>
      <a href="/" className="text-blue-500 p-8">
        Return to Homepage
      </a>
    </div>
  );
}
