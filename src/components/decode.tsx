import { createEffect, createResource, createSignal, Show } from "solid-js";
import DropFile from "./dropImage";
import { decodeMessageFromImage } from "~/backend/stegano";
import { decipher } from "~/backend/cipher";
import Tile from "./tile";

export default function Decode() {
  const [rawFile, setRawFile] = createSignal<File | null>(null);
  const [msg, setMsg] = createSignal("");
  const [password, setPassword] = createSignal("");

  const decodeImage = async () => {
    const text = await decodeMessageFromImage({
      file: rawFile()!,
      channel: "blue",
    });
    if (password().length > 0) {
      const decodeText = await decipher(password()!, text);
      if (decodeText === null) {
        alert("problem with decryption, check you password");
        return;
      }
      setMsg(decodeText);
    } else setMsg(text);
  };
  return (
    <section class="grid gap-4 grid-cols-2 flex-grow">
      {/* LEFT TILE */}
      <Tile
        title="INPUTS"
        onButtonAction={{
          callback: () => decodeImage(),
          name: "Read Message!",
        }}
      >
        <DropFile getter={rawFile} setter={setRawFile} />
        <div class="w-full">
          <p class="text-center text-sub-text py-4 text-lg">
            Secured with password?
          </p>
          <div class="flex gap-4 justify-center">
            <textarea
              placeholder="paste your password here"
              class="resize-y shadow-input-shadow overflow-hidden max-h-44 w-full rounded-lg  bg-inputs-bg p-2 placeholder:text-white focus:outline-none text-white"
              onInput={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </div>
      </Tile>
      {/* RIGHT TILE */}
      <Tile title="OUTPUT" view="top">
        <p class="p-4 text-sub-text">Message is: </p>
        <Show when={msg().length !== 0} fallback={<p>No message...</p>}>
          <p class="text-wrap break-words w-full">{msg()}</p>
        </Show>
      </Tile>
    </section>
  );
}
