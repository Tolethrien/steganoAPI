import { createSignal } from "solid-js";
import Button from "~/components/button";
import Decode from "~/components/decode";
import Encode from "~/components/encode";
type Mode = "encode" | "decode";
export default function Home() {
  const [mode, setMode] = createSignal<Mode>("encode");
  const changeMode = (newMode: Mode) => {
    if (newMode !== mode()) setMode(newMode);
  };
  return (
    <main class="flex flex-col w-full h-dvh">
      <h1 class="text-4xl pl-8">Steganography</h1>
      <div class="p-8 flex gap-4">
        <Button click={() => changeMode("encode")} text="Encode" />
        <Button click={() => changeMode("decode")} text="Decode" />
      </div>
      {mode() === "encode" ? <Encode /> : <Decode />}
    </main>
  );
}
