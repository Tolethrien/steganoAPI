interface Props {
  click: () => void;
  text: string;
}
export default function Button({ click, text }: Props) {
  return (
    <button
      onClick={click}
      class="border-2 spacing-4 px-4 py-1 hover:border-yellow-200 transition duration-300"
    >
      {text}
    </button>
  );
}
