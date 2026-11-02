import RegisterForm from "@/components/auth/register-form";

export const metadata = {
  title: "Create an account",
  description:
    "Create a StudioSpace account to list a creative studio or book a space by the hour.",
};

export default function RegisterPage() {
  return (
    <main>
      <RegisterForm />
    </main>
  );
}
