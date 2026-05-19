import { Metadata } from "next";
import { PlaygroundShell } from "@/components/playground/PlaygroundShell";

export const metadata: Metadata = {
  title: "API Playground | DevMarket",
  description: "Send live HTTP requests, inspect responses, and format JSON in the DevMarket API playground.",
};

export default function PlaygroundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1300px]">
        <PlaygroundShell />
      </div>
    </main>
  );
}
