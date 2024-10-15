interface EncodeProps {
  file: File;
  message: string;
  channel?: keyof typeof RGB_CHANNEL_SKIP;
}
interface DecodeProps {
  file: File;
  password?: string;
  channel?: keyof typeof RGB_CHANNEL_SKIP;
}

const RGB_CHANNEL_SKIP = {
  red: 4,
  green: 5,
  blue: 6,
}; // skip for each color in RGB
const BINARY_MSG_MAX_BIT_LENGHT = 16; // how long in bits length of a msg can be

//TODO: show msg max lenght based on img size

export const encodeMessageInImage = async ({
  channel = "red",
  file,
  message,
}: EncodeProps) => {
  const { canvas, ctx, imageData } = await createCanvasFromImage(file);
  const data = imageData.data;

  const encodedMsg = new TextEncoder().encode(message);

  let binaryMessage = "";
  encodedMsg.forEach(
    (byte) => (binaryMessage += byte.toString(2).padStart(8, "0"))
  );
  const binaryLength = binaryMessage.length
    .toString(2)
    .padStart(BINARY_MSG_MAX_BIT_LENGHT, "0");

  const binaryData = binaryLength + binaryMessage;
  for (let i = 0; i < binaryData.length; i++) {
    const bit = binaryData[i];
    data[i * RGB_CHANNEL_SKIP[channel]] =
      (data[i * RGB_CHANNEL_SKIP[channel]] & 0xfe) | parseInt(bit);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
};
export const getImageByteLength = async (file: File) => {
  const image = await loadImage(file);
  const totalBits = image.width * image.height; //1bit per pixel 'couse 1 channel;
  return Math.floor(totalBits / 8);
};
export const getMessageByteLength = (msg: string) =>
  new TextEncoder().encode(msg).length;

export const decodeMessageFromImage = async ({
  file,
  channel = "red",
}: DecodeProps) => {
  const { imageData } = await createCanvasFromImage(file);

  const data = imageData.data;

  let binaryLength = "";
  for (let i = 0; i < BINARY_MSG_MAX_BIT_LENGHT; i++) {
    binaryLength += (data[i * RGB_CHANNEL_SKIP[channel]] & 1).toString();
  }
  const messageLength = parseInt(binaryLength, 2);

  let binaryMessage = "";
  for (
    let i = BINARY_MSG_MAX_BIT_LENGHT;
    i < BINARY_MSG_MAX_BIT_LENGHT + messageLength;
    i++
  ) {
    binaryMessage += (data[i * RGB_CHANNEL_SKIP[channel]] & 1).toString();
  }
  const bytes = [];
  for (let i = 0; i < binaryMessage.length; i += 8) {
    const byte = binaryMessage.substring(i, i + 8);
    bytes.push(parseInt(byte, 2));
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
};
const createCanvasFromImage = async (image: File) => {
  //TODO: convert to offscreen and blob
  //   const canvas = new OffscreenCanvas(img.width, img.height);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Can't create a canvas using JS");
  const img = await createImageBitmap(image);
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { canvas, ctx, imageData };
};
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
