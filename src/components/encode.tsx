import { createResource, createSignal } from "solid-js";
import Button from "./button";
import DropFile from "./dropImage";
import GetBytes from "~/backend/test";

export default function Encode() {
  const [file, setFile] = createSignal<File | null>(null);
  const [bytes] = createResource(GetBytes);

  return (
    <section class="flex flex-col flex-grow">
      <p>Encoding:</p>
      <div class="flex flex-grow">
        <div class=" flex  flex-col flex-1  outline m-4">
          <h3 class="text-center">INPUTS</h3>
          <p class="text-center">Image</p>
          <DropFile getter={file} setter={setFile} />
          <p>Secure with password?</p>
          <input type="checkbox"></input>
          <div class="flex justify-center mt-auto mb-4">
            <Button click={() => {}} text="generate Image" />
          </div>
        </div>
        <div class="flex flex-col flex-1 outline m-4">
          <h3 class="text-center">OUTPUT</h3>
          <div class="flex-grow">
            <p>FILE</p>
            <p>{file() ? file()!.name : ""}</p>
          </div>
          <div class="flex-grow">
            <p>DISTORTED</p>
            <p>{file() ? file()!.name : ""}</p>
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
