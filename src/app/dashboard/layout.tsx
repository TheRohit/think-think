import { MainNav } from "../components/main-nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <MainNav />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
    </div>
  );
};

export default DashboardLayout;
