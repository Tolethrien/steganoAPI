import { Accessor, JSX, Show } from "solid-js";

interface Props {
  children?: JSX.Element;
  title: string;
  onButtonAction?: { name: string; callback: () => void };
  onButtonDownload?: { filename: string; getter: Accessor<string> };
}
export default function Tile({
  children,
  title,
  onButtonAction,
  onButtonDownload,
}: Props) {
  const downloadImage = () => {
    if (!onButtonDownload?.getter()) {
      alert("no image");
      return;
    }
    const downloadImage = document.createElement("a");
    document.body.appendChild(downloadImage);
    downloadImage.setAttribute("download", onButtonDownload.filename);
    downloadImage.href = onButtonDownload?.getter();
    downloadImage.click();
    downloadImage.remove();
  };
  return (
    <div class="flex flex-col items-center justify-evenly border-4  border-main-color shadow-tile-shadow bg-white bg-opacity-10 p-4 m-4 rounded-lg">
      <h2 class="text-main-text text-xl text-center">{title}</h2>
      <div class="flex flex-col items-center justify-evenly flex-grow w-full">
        {children}
      </div>
      <Show when={typeof onButtonAction === "object"}>
        <button
          onClick={onButtonAction?.callback}
          class="border-main-color  rounded-md w-3/4 h-8 border-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all"
        >
          {onButtonAction?.name}
        </button>
      </Show>

      <Show when={typeof onButtonDownload === "object"}>
        <button
          onClick={downloadImage}
          class="border-main-color text-center  rounded-md w-3/4 h-8 border-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all"
        >
          Save Image!
        </button>
      </Show>
    </div>
  );
}
