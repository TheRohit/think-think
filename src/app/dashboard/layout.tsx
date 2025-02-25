import { MainNav } from "../components/main-nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-screen grid-rows-[auto,1fr] font-[family-name:var(--font-geist-sans)]">
      <MainNav />
      <main className="h-[calc(100vh-64px)] overflow-y-scroll">{children}</main>
    </div>
  );
};

export default DashboardLayout;
