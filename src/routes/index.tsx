import { createSignal } from "solid-js";
import Decode from "~/components/decode";
import Encode from "~/components/encode";
import Header from "~/components/header";
export type Mode = "encode" | "decode";
export default function Home() {
  const [mode, setMode] = createSignal<Mode>("encode");

  return (
    <main class="flex flex-col w-full h-full">
      <Header mode={mode} setMode={setMode} />
      {mode() === "encode" ? <Encode /> : <Decode />}
    </main>
  );
}
