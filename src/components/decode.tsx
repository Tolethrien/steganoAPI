import { createEffect, createResource, createSignal, Show } from "solid-js";
import DropFile from "./dropImage";
import { decodeMessageFromImage } from "~/backend/stegano";
import { decipher } from "~/backend/cipher";

export default function Decode() {
  const [rawFile, setRawFile] = createSignal<File | null>(null);
  const [image, setImage] = createSignal("");
  const [msg, setMsg] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [hasPassword, sethasPassword] = createSignal(false);

  createEffect(async () => {
    if (!rawFile()) return;
    const url = URL.createObjectURL(rawFile()!);
    setImage(url);
  });
  const decodeImage = async () => {
    const text = await decodeMessageFromImage({
      file: rawFile()!,
      channel: "blue",
    });
    if (hasPassword()) {
      const decodeText = await decipher(password()!, text);
      if (decodeText === null) return;
      setMsg(decodeText);
    } else setMsg(text);
  };
  return (
    <section class="flex flex-col flex-grow">
      <p>Decoding:</p>
      <div class="flex flex-grow">
        <div class=" flex  flex-col flex-1  outline m-4">
          <h3 class="text-center">INPUTS</h3>
          <p class="text-center">Image</p>
          <DropFile getter={rawFile} setter={setRawFile} />
          <p>Secure with password?</p>
          <input
            type="checkbox"
            onChange={() => sethasPassword((prev) => !prev)}
          ></input>
          <Show when={hasPassword()}>
            <input
              onChange={(e) => setPassword(e.target.value)}
              class="text-black"
            />
          </Show>
          <div class="flex justify-center mt-auto mb-4">
            <button onClick={decodeImage}>ss</button>
          </div>
        </div>
        <div class="flex flex-col flex-1 outline m-4">
          <h3 class="text-center">OUTPUT</h3>
          <div class="flex-grow">
            <p>DISTORTED FILE</p>
            <p>{"msg is: " + msg()}</p>
            <Show when={image()}>
              <img src={image()!} alt="Distorted Image" />
            </Show>
          </div>
        </div>
      </div>
    </section>
  );
}
