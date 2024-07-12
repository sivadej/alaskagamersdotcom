import { Suspense } from "react";
// import EvoDB from "./evodb";
import Schedule from "./schedule";


export default async function Page() {
  return (
    <div>
      <Suspense fallback={<div>loading</div>}>
        <Schedule />
      </Suspense>
    </div>
  );
}
