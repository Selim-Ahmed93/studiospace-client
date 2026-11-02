import LegalPage from "@/components/legal/legal-page";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern the use of StudioSpace, including accounts, studio listings, and booking requests.",
};

const sections = [
  {
    heading: "Using StudioSpace",
    paragraphs: [
      "StudioSpace is a peer-to-peer marketplace for discovering and booking creative spaces. By using the platform, you agree to these terms. If you do not agree, please do not use the service.",
      "You must be old enough to enter into a binding agreement in your jurisdiction to create an account or make a booking.",
    ],
  },
  {
    heading: "Your account",
    paragraphs: [
      "You are responsible for the information you provide and for keeping your login credentials secure. Do not share your account with another person.",
      "You are responsible for activity that happens through your account. If you believe your account has been compromised, contact us promptly.",
    ],
  },
  {
    heading: "Studio listings",
    paragraphs: [
      "Hosts are responsible for the accuracy of their listings, including photos, amenities, location, capacity, pricing, and availability.",
      "By uploading images or other content, you confirm that you have the right to use and display that content. StudioSpace may remove listings that are misleading, unlawful, or infringe someone else's rights.",
    ],
  },
  {
    heading: "Booking requests",
    paragraphs: [
      "Sending a booking request does not immediately confirm a reservation. A host must confirm the request, and the platform may reject overlapping confirmed bookings for the same studio and time.",
      "Booking totals are calculated from the studio's hourly rate and the selected duration. The total shown before you submit is an estimate; the server calculates the final amount when the request is created.",
      "Creators may cancel pending requests from My Bookings. Hosts and creators should communicate directly about changes to a confirmed booking.",
    ],
  },
  {
    heading: "Payments",
    paragraphs: [
      "StudioSpace currently records booking requests and totals but does not process payments. Hosts and creators are responsible for arranging payment directly and for any applicable taxes.",
      "StudioSpace is not a party to the agreement between a host and a creator, and does not guarantee the condition of a space or the conduct of either party.",
    ],
  },
  {
    heading: "Acceptable use",
    bullets: [
      "Do not use StudioSpace for unlawful, harmful, or fraudulent activity.",
      "Do not post false, misleading, or infringing content.",
      "Do not attempt to disrupt the service, access other accounts, or scrape data at scale.",
      "Do not use the platform to harass hosts, creators, or StudioSpace staff.",
    ],
  },
  {
    heading: "Content you share",
    paragraphs: [
      "You retain ownership of the content you submit. You grant StudioSpace a non-exclusive licence to display, resize, and promote that content for the purpose of operating and marketing the marketplace.",
      "You can remove your listing content by editing or deleting your listing. Some booking records may be retained for operational and legal reasons.",
    ],
  },
  {
    heading: "Availability and changes",
    paragraphs: [
      "We may update, suspend, or discontinue parts of StudioSpace. We aim to keep the service available, but we do not guarantee uninterrupted access.",
      "We may update these terms as the platform evolves. Continued use after an update means you accept the revised terms.",
    ],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      "To the extent permitted by law, StudioSpace is not liable for indirect or consequential losses arising from the use of the platform, a listing, or a booking. Nothing in these terms limits rights that cannot be limited by law.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "For questions about these terms, email mdselimahmed6467@gmail.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="November 3, 2026"
      sections={sections}
    />
  );
}
