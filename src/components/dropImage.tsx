import { Accessor, batch, createSignal, Setter, Show } from "solid-js";
import imgIcon from "../assets/img_icon.svg";
interface Props {
  getter: Accessor<File | null>;
  setter: Setter<File | null>;
}
export default function DropFile({ getter: file, setter: setFile }: Props) {
  const [dragging, setDragging] = createSignal(false);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const imageFile = droppedFiles[0];
      batch(() => {
        setDragging(false);
        setFile(imageFile);
      });
    }
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };
  return (
    <div class="w-full">
      <p class="text-sub-text text-base text-center">
        Drag & Drop your image here &darr; or click to upload
      </p>
      <div
        class={`relative hover:bg-opacity-10 hover:bg-white transition-all border-4 border-dashed w-full p-4 text-center rounded-md border-main-color ${
          dragging() && "bg-white bg-opacity-10 transition duration-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          class="hidden"
          id="fileInput"
        />
        <label for="fileInput" class="cursor-pointer">
          <Show
            when={file() !== null}
            fallback={<p class="text-sub-text">Drop or Click</p>}
          >
            <p class="text-sub-text overflow-hidden text-nowrap text-ellipsis">
              {file()!.name}
            </p>
          </Show>
        </label>
        <div class="absolute w-12 flex items-center justify-center h-8 border-2 border-main-color rounded-md border-dashed top-2 right-2 rotate-6">
          <Show
            when={file()}
            fallback={
              <img
                src={imgIcon}
                alt="image icon"
                class="object-cover w-10 h-6"
              />
            }
          >
            <img
              src={URL.createObjectURL(file()!)}
              alt="image icon"
              class="object-cover w-10 h-6"
            />
          </Show>
        </div>
      </div>
    </div>
  );
}
