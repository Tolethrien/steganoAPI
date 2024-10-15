import { Accessor, Setter } from "solid-js";
import { Mode } from "~/routes";

interface Props {
  mode: Accessor<Mode>;
  setMode: Setter<Mode>;
}
export default function Header({ mode, setMode }: Props) {
  const changeMode = (newMode: Mode) => newMode !== mode() && setMode(newMode);

  return (
    <header>
      <h1 class="text-4xl pt-4 pb-2 text-center text-main-text">
        Steganography
      </h1>
      <p class="text-xl p-2 text-center text-sub-text">choose mode</p>
      <div class="flex gap-8 items-center justify-center">
        <button
          onClick={() => changeMode("encode")}
          class={`border-main-color rounded-md w-24 h-10 border-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all ${
            mode() === "encode" ? "scale-125" : "brightness-75"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => changeMode("decode")}
          class={`border-main-color rounded-md w-24 h-10 border-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all ${
            mode() === "decode" ? "scale-125" : "brightness-75"
          }`}
        >
          Decode
        </button>
      </div>
      <div class="w-11/12 h-1 mx-auto bg-main-color my-4"></div>
    </header>
  );
}
