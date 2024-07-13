import Link from "next/link";

export default function NavButtonGroup() {
  return (
    <div className="flex justify-center items-center">
      <div className="mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <Link
            href="/evo-tracker"
            aria-current="page"
            className="text-center w-24 px-4 py-2 text-sm font-medium border rounded-s-lg focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white"
          >
            Schedule
          </Link>
          <Link
            href="/evo-tracker/players"
            className="text-center w-24 px-4 py-2 text-sm font-medium border-t border-b focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white"
          >
            Players
          </Link>
          <Link
            href="/evo-tracker/misc"
            className="text-center w-24 px-4 py-2 text-sm font-medium border rounded-e-lg focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white"
          >
            Misc
          </Link>
        </div>
      </div>
    </div>
  );
}
