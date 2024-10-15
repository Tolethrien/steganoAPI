import { createSignal, Show } from "solid-js";
import DropFile from "./dropImage";
import { Cipher, cipher } from "~/backend/cipher";
import { encodeMessageInImage } from "~/backend/stegano";
import Tile from "./tile";
import imageIcon from "../assets/img_icon.svg";
export default function Encode() {
  const [rawFile, setRawFile] = createSignal<File | null>(null);
  const [distortedImage, setDistortedImage] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [hasPassword, sethasPassword] = createSignal(false);
  const [password, setPassword] = createSignal("");

  const generateDistortedImage = async () => {
    if (!rawFile()) {
      alert("there is no file");
      return;
    }
    if (message().length === 0) {
      alert("empty message");
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
  return (
    <section class="grid gap-4 grid-cols-2 flex-grow">
      {/* LEFT TILE */}
      <Tile
        title="INPUTS"
        onButtonAction={{
          callback: generateDistortedImage,
          name: "Generate Image!",
        }}
      >
        <DropFile getter={rawFile} setter={setRawFile} />
        <textarea
          placeholder="type your msg here..."
          class="resize-y shadow-input-shadow overflow-hidden max-h-44 w-full rounded-lg  bg-inputs-bg p-2 placeholder:text-white focus:outline-none text-white"
          onInput={(e) => setMessage(e.currentTarget.value)}
        />
        <div>
          <p class="text-center text-sub-text py-4 text-lg">
            Secure with password?
          </p>
          <div class="flex gap-4">
            <button
              onClick={() => sethasPassword(true)}
              class={`border-main-color rounded-md w-16 h-8 border-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all ${
                hasPassword() ? "scale-125" : "brightness-75"
              }`}
            >
              YES!
            </button>
            <button
              onClick={() => sethasPassword(false)}
              class={`border-main-color rounded-md w-16 h-8 border-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all ${
                !hasPassword() ? "scale-125" : "brightness-75"
              }`}
            >
              NO!
            </button>
          </div>
        </div>
      </Tile>
      {/* RIGHT TILE */}
      <Tile
        title="OUTPUT"
        onButtonDownload={{ getter: distortedImage, filename: "ImageMsg" }}
      >
        <div class="w-full flex flex-col items-center">
          <p class="text-center text-sub-text text-lg py-2">Distorted Image</p>
          <div class="w-3/4 h-52 flex items-center justify-center bg-inputs-bg">
            <Show
              when={distortedImage()}
              fallback={<img src={imageIcon} alt="Image icon" class="w-1/2" />}
            >
              <img
                src={distortedImage()!}
                alt="Distorted Image"
                class="w-full h-full object-fill"
              />
            </Show>
          </div>
        </div>
        <div class="w-full">
          <div class="text-center *:text-sub-text">
            <p class="text-xl">Password</p>
            <p class="-mt-2">(dont forget to copy!)</p>
          </div>
          <textarea
            readOnly
            placeholder="no password"
            value={password()}
            class="resize-none placeholder:text-center shadow-input-shadow overflow-hidden w-full rounded-lg  bg-inputs-bg p-2 placeholder:text-white focus:outline-none text-white"
          />
        </div>
      </Tile>
    </section>
  );
}
