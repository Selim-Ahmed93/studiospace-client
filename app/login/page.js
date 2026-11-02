import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Log in",
  description: "Log in to your StudioSpace account to manage listings and bookings.",
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
