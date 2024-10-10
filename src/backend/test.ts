import { randomBytes } from "crypto";

let cashedString: string | null = null;
export default function GetBytes() {
  "use server";
  if (cashedString) {
    console.log("cashed: ", cashedString);
    return cashedString;
  }
  const bytes = randomBytes(32).toString("hex");
  console.log("dodaje do casha: ", bytes);
  cashedString = bytes;
  return bytes;
}
