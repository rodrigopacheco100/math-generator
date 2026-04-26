"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface DeviceContextType {
  isDesktop: boolean;
  isMobile: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  isDesktop: false,
  isMobile: true,
});

export function useDevice() {
  return useContext(DeviceContext);
}

interface DeviceProviderProps {
  children: ReactNode;
}

export function DeviceProvider({ children }: DeviceProviderProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <DeviceContext.Provider value={{ isDesktop, isMobile: !isDesktop }}>
      {children}
    </DeviceContext.Provider>
  );
}
