"use client";

import { DeviceProvider } from "@/contexts/DeviceContext";
import ClientLayout from "./ClientLayout";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  userName: string;
  userImage: string | null;
}

export function ClientLayoutWrapper({
  children,
  userName,
  userImage,
}: ClientLayoutWrapperProps) {
  return (
    <DeviceProvider>
      <ClientLayout userName={userName} userImage={userImage}>
        {children}
      </ClientLayout>
    </DeviceProvider>
  );
}
