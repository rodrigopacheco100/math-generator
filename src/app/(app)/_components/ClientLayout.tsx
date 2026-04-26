"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { AppMenu } from "@/components/AppMenu";
import { MenuButton } from "@/components/MenuButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDevice } from "@/contexts/DeviceContext";

export default function ClientLayout({
  children,
  userName,
  userImage,
}: {
  children: React.ReactNode;
  userName: string;
  userImage: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDesktop } = useDevice();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getOperationName = () => {
    const map: Record<string, string> = {
      "/math/soma": "Soma",
      "/math/subtracao": "Subtração",
      "/math/multiplicacao": "Multiplicação",
      "/math/divisao": "Divisão",
    };
    return map[pathname] || "Math Generator";
  };

  const _isHome = pathname === "/";

  return (
    <div className="flex h-screen bg-gray-50">
      {isDesktop && (
        <div className="w-64 shrink-0">
          <AppMenu variant="sidebar" />
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isDesktop && (
              <MenuButton onClick={() => setMobileMenuOpen(true)} />
            )}
            <Link href="/" className="text-xl font-bold text-gray-800">
              {getOperationName()}
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 outline-none"
              >
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarImage src={userImage || undefined} alt={userName} />
                  <AvatarFallback>
                    {userName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="w-full cursor-pointer">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/api/auth/signout")}
                className="text-red-600 cursor-pointer"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>

      {mobileMenuOpen && !isDesktop && (
        <div className="fixed inset-0 z-50 bg-white">
          <AppMenu variant="mobile" onClose={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
}
