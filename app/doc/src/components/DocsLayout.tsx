import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { DocsSidebar } from "./DocsSidebar";

export const DocsLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex gap-12">
          <DocsSidebar />
          <main className="flex-1 min-w-0 max-w-3xl">{children}</main>
        </div>
      </div>
    </div>
  );
};