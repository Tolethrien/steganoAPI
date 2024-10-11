import { createEffect, createResource, createSignal } from "solid-js";
import Button from "./button";
import DropFile from "./dropImage";
import GetBytes from "~/backend/test";
import {
  decodeMessageFromImage,
  encodeMessageInImage,
} from "~/backend/stegano";

export default function Encode() {
  const [rawFile, setRawFile] = createSignal<File | null>(null);
  const [image, setImage] = createSignal<string | null>(null);
  const [distortedImage, setDistortedImage] = createSignal<string | null>(null);
  const [message, setMessage] = createSignal<string>("");

  const [bytes] = createResource(GetBytes);

  const generateDistortedImage = async () => {
    if (!rawFile()) {
      alert("there is no file");
      return;
    }
    const img = await encodeMessageInImage({
      file: rawFile()!,
      message: message()!,
      channel: "blue",
    });
    if (!img) return;
    setDistortedImage(img);
  };

  createEffect(async () => {
    if (!rawFile()) return;
    const url = URL.createObjectURL(rawFile()!);
    setImage(url);
  });

  return (
    <section class="flex flex-col flex-grow">
      <p>Encoding:</p>
      <div class="flex flex-grow">
        <div class=" flex  flex-col flex-1  outline m-4">
          <h3 class="text-center">INPUTS</h3>
          <p class="text-center">Image</p>
          <DropFile getter={rawFile} setter={setRawFile} />
          <textarea
            placeholder="type your msg here"
            class="text-black"
            onInput={(e) => setMessage(e.currentTarget.value)}
          />
          <p>Secure with password?</p>
          <input type="checkbox"></input>
          <div class="flex justify-center mt-auto mb-4">
            <Button click={generateDistortedImage} text="generate Image" />
          </div>
        </div>
        <div class="flex flex-col flex-1 outline m-4">
          <h3 class="text-center">OUTPUT</h3>
          <div class="flex-grow">
            <p>FILE</p>
            {image() && <img src={image()!} alt="Original Image" />}
          </div>
          <div class="flex-grow">
            <p>DISTORTED</p>
            {distortedImage() && (
              <img src={distortedImage()!} alt="Distorted Image" />
            )}
          </div>
          <div>
            <p>Password:</p>
            <p>{bytes() ? bytes() : "no password"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
