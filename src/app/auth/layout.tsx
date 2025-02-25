const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="mt-6 flex h-16 items-center justify-center">
        <h1 className="border-4 border-black bg-green-400 px-4 py-2 text-2xl font-black uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-500 md:text-6xl">
          MindCache
        </h1>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
