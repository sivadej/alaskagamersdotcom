import { ReactNode } from "react";
import Header from "./header";

export default function PageBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center p-2 md:p-8 w-full">
      <div className="w-full max-w-3xl">
        <Header />
        {children}
      </div>
    </div>
  );
}
