export default function VerifyRequestPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A sign in link has been sent to your email address.
          </p>
        </div>

        <div className="mt-8">
          <a
            href="/auth/signin"
            className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
