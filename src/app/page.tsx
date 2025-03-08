import { redirect } from "next/navigation";
import { useDisableZoomAndScrollOnTouch } from "../hooks";

export default function Home() {
  useDisableZoomAndScrollOnTouch();
  redirect("/editor");
}
