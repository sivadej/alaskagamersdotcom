import { Suspense } from "react";
import Evo from './evo';

export default async function Page() {
  return (
    <div>
      hello
      <Suspense fallback={<div>loading</div>}>
        <Evo />
      </Suspense>
    </div>
  );
}