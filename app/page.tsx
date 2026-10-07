import type { Metadata } from "next";

import { Kiosk } from "@/components/kiosk/kiosk";

export const metadata: Metadata = {
  title: "Campus Store POS Kiosk",
};

export default function KioskPage() {
  return <Kiosk />;
}
