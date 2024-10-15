import { useNavigate } from "@solidjs/router";

export default function NotFound() {
  const navigator = useNavigate();
  navigator("/");
  return <div />;
}
