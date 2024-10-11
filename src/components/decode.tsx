import { createEffect, createSignal } from "solid-js";
import Button from "./button";
import DropFile from "./dropImage";
import { decodeMessageFromImage } from "~/backend/stegano";

export default function Decode() {
  const [rawFile, setRawFile] = createSignal<File | null>(null);
  const [image, setImage] = createSignal<string | null>(null);

  createEffect(async () => {
    if (!rawFile()) return;
    const url = URL.createObjectURL(rawFile()!);
    setImage(url);
  });
  const decodeImage = async () => {
    console.log(
      await decodeMessageFromImage({ file: rawFile()!, channel: "blue" })
    );
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
          <input type="checkbox"></input>
          <div class="flex justify-center mt-auto mb-4">
            <Button click={decodeImage} text="Read Message" />
          </div>
        </div>
        <div class="flex flex-col flex-1 outline m-4">
          <h3 class="text-center">OUTPUT</h3>
          <div class="flex-grow">
            <p>DISTORTED FILE</p>
            {image() && <img src={image()!} alt="Distorted Image" />}
          </div>
        </div>
      </div>
    </section>
  );
}
