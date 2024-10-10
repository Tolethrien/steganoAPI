import { Accessor, createSignal, Setter } from "solid-js";
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
    setDragging(false);
    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const imageFile = droppedFiles[0];
      setFile(imageFile);
    }
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };
  return (
    <div>
      <p>Drag & Drop your image here or click to upload</p>
      <div
        class={`border-2 border-dashed p-4 text-center ${
          dragging() ? "bg-blue-100 border-blue-400" : "border-gray-400"
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
          {file() !== null ? <p>{file()!.name}</p> : <p>Drop or Click</p>}
        </label>
      </div>
    </div>
  );
}
