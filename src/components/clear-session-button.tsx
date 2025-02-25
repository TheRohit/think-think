"use client";

export default function ClearSessionButton() {
  const handleClearAndSignIn = (e: React.MouseEvent) => {
    e.preventDefault();

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.trim().split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to sign in page
    window.location.href = "/auth/signin";
  };

  return (
    <a
      href="/auth/signin"
      className="mt-4 inline-block rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      onClick={handleClearAndSignIn}
    >
      Sign In
    </a>
  );
}
