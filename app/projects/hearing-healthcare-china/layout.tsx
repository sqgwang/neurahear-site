import type { ReactNode } from "react";
import { createPageMetadata } from "../../data/site";

export const metadata = createPageMetadata({
  title: "Hearing Healthcare in China",
  description:
    "Health-services research on audiology roles, workforce development, access, and professional identity in Mainland China.",
  path: "/projects/hearing-healthcare-china/",
});

export default function HearingHealthcareChinaLayout({ children }: { children: ReactNode }) {
  return children;
}
