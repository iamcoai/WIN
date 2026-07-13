import type { Role } from "@/config/nav";
import { Topbar } from "./topbar";
import { BottomNav } from "./bottom-nav";
import { DesktopRail } from "./desktop-rail";

export function AppShell({
  role,
  userName,
  children,
}: {
  role: Role;
  userName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar role={role} userName={userName} />
      <div className="flex flex-1">
        <DesktopRail role={role} />
        {/* min-w-0: wide tables must scroll inside their own container,
            not stretch this flex item past the viewport */}
        <main className="min-w-0 flex-1 pb-20 md:pb-8">{children}</main>
      </div>
      <BottomNav role={role} />
    </div>
  );
}
