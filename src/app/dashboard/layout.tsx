import Dashboard from "@/components/ui/organisms/Dashboard";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Dashboard>{children}</Dashboard>;
}
