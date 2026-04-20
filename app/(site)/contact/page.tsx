import type { Metadata } from "next";
import ContactContent from "./contact-content";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Josh Wood. Let's discuss your next web development project.",
  openGraph: {
    title: "Contact | Josh Wood",
    description:
      "Get in touch with Josh Wood. Let's discuss your next web development project.",
  },
};

export default function ContactPage() {

  return notFound();

  return <ContactContent />;
}
