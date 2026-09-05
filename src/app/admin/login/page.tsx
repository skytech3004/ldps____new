import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090E]" />}>
      <LoginForm />
    </Suspense>
  );
}
