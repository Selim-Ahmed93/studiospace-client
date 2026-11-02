import LegalPage from "@/components/legal/legal-page";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How StudioSpace collects, uses, and protects account, listing, and booking information.",
};

const sections = [
  {
    heading: "Information we collect",
    bullets: [
      "Account information such as your name, email address, and profile image if you sign in with Google.",
      "Listing information you provide as a host, including studio details, photos, location, amenities, and pricing.",
      "Booking information such as the studio, date, time range, total amount, and status.",
      "Technical information needed to operate the service, such as session data and basic request logs.",
    ],
  },
  {
    heading: "How we use information",
    bullets: [
      "To create and authenticate your account.",
      "To display studio listings and process booking requests.",
      "To help hosts review and manage requests for their spaces.",
      "To communicate about the service and protect against abuse or fraud.",
    ],
  },
  {
    heading: "Cookies and local storage",
    paragraphs: [
      "StudioSpace uses an HTTP-only session cookie from Better Auth to keep you signed in. The cookie is set with SameSite=None and Secure in HTTPS production environments so the frontend and API can communicate across domains.",
      "Your theme preference is stored in your browser. If you use the newsletter form, the email address is stored in your browser's local storage only; it is not sent to a newsletter server.",
    ],
  },
  {
    heading: "Sharing",
    paragraphs: [
      "We do not sell personal information. We use service providers for hosting, database storage, and authentication, including MongoDB Atlas, Render, Vercel, and Google when Google sign-in is enabled.",
      "We may disclose information if required by law or if necessary to protect the rights, safety, and security of StudioSpace, our users, or the public.",
    ],
  },
  {
    heading: "Data retention",
    paragraphs: [
      "Account and listing information is retained while your account is active. Booking records may be retained after a booking ends for operational, accounting, and dispute-resolution purposes.",
      "You can request deletion of your account or personal information by contacting us. Some records may be retained where required by law.",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "Passwords are handled by Better Auth, session cookies are HTTP-only, and production traffic is served over HTTPS. No online service can guarantee absolute security, so please use a strong, unique password.",
    ],
  },
  {
    heading: "Your choices",
    bullets: [
      "You can update listing details from My Listings.",
      "You can sign out at any time from the account menu.",
      "You can clear the newsletter email and theme preference by clearing site data in your browser.",
      "You can contact us to request access, correction, or deletion of your personal information.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "StudioSpace is not intended for children under 13. We do not knowingly collect personal information from children under 13.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy as the platform changes. The date at the top of this page shows when it was last revised.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "For privacy questions, email mdselimahmed6467@gmail.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="November 3, 2026"
      sections={sections}
    />
  );
}
