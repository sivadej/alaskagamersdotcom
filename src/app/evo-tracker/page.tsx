import { Suspense } from "react";
import Header from "./components/header";
import Schedule from "./components/schedule";
import PageBody from "./components/pagebody";

export default async function Page() {
  return (
    <PageBody>
      <Suspense fallback={<div>Loading Player Schedules</div>}>
        <Schedule />
      </Suspense>
    </PageBody>
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
