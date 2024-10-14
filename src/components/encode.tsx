import { createEffect, createSignal, Show } from "solid-js";
import Button from "./button";
import DropFile from "./dropImage";
import { Cipher, cipher } from "~/backend/cipher";
import { encodeMessageInImage } from "~/backend/stegano";

export default function Encode() {
  const [rawFile, setRawFile] = createSignal<File | null>(null);
  const [image, setImage] = createSignal<string | null>(null);
  const [distortedImage, setDistortedImage] = createSignal<string | null>(null);
  const [message, setMessage] = createSignal<string>("");
  const [hasPassword, sethasPassword] = createSignal(false);
  const [password, setPassword] = createSignal<string | null>(null);

  const generateDistortedImage = async () => {
    if (!rawFile()) {
      alert("there is no file");
      return;
    }
    let passwordData: Cipher | undefined = undefined;
    if (hasPassword()) {
      passwordData = await cipher(message());
      setPassword(passwordData.password);
    }
    const img = await encodeMessageInImage({
      file: rawFile()!,
      message: passwordData !== undefined ? passwordData.msg : message(),
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
          <input
            type="checkbox"
            onChange={() => sethasPassword((prev) => !prev)}
          ></input>
          <div class="flex justify-center mt-auto mb-4">
            <Button click={generateDistortedImage} text="generate Image" />
          </div>
        </div>
        <div class="flex flex-col flex-1 outline m-4">
          <h3 class="text-center">OUTPUT</h3>
          <div class="flex-grow">
            <p>FILE</p>
            <Show when={image()}>
              <img src={image()!} alt="Original Image" />
            </Show>
          </div>
          <div class="flex-grow">
            <p>DISTORTED</p>
            <Show when={distortedImage()}>
              <img src={distortedImage()!} alt="Distorted Image" />
            </Show>
          </div>
          <div>
            <p>Password:</p>
            <p>{password()}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
