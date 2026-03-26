"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type DemoRoute = {
  href: string;
  label: string;
  duration: number;
};

type AutoDemoContextValue = {
  autoMode: boolean;
  currentStep: number;
  totalSteps: number;
  countdown: number;
  currentLabel: string;
  isPaused: boolean;
  navigateTo: (href: string, pauseMs?: number) => void;
};

const demoRoutes: DemoRoute[] = [
  { href: "/", label: "Intro", duration: 6 },
  { href: "/onboarding", label: "Onboarding", duration: 5 },
  { href: "/operations", label: "Operations", duration: 6 },
  { href: "/twin", label: "Digital Twin", duration: 6 },
  { href: "/investor", label: "Investment", duration: 6 },
  { href: "/simulation", label: "Simulation", duration: 8 },
];

const AutoDemoContext = createContext<AutoDemoContextValue | null>(null);

function findRouteIndex(pathname: string) {
  const normalized = pathname === "" ? "/" : pathname;
  const index = demoRoutes.findIndex((route) => route.href === normalized);
  return index === -1 ? 0 : index;
}

export function AutoDemoProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const routeIndex = findRouteIndex(pathname);
  const route = demoRoutes[routeIndex];
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const pauseRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState(route.duration);
  const [isPaused, setIsPaused] = useState(false);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startSequence = useCallback(
    (delayMs = 0) => {
      clearTimers();
      setCountdown(route.duration);

      timeoutRef.current = window.setTimeout(() => {
        intervalRef.current = window.setInterval(() => {
          setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);

        timeoutRef.current = window.setTimeout(() => {
          const nextRoute = demoRoutes[(routeIndex + 1) % demoRoutes.length];
          router.push(nextRoute.href);
        }, route.duration * 1000);
      }, delayMs);
    },
    [clearTimers, route.duration, routeIndex, router]
  );

  useEffect(() => {
    if (!isPaused) {
      startSequence(450);
    }

    return clearTimers;
  }, [clearTimers, isPaused, pathname, startSequence]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const navigateTo = useCallback(
    (href: string, pauseMs = 8000) => {
      clearTimers();
      setIsPaused(true);
      pauseRef.current = window.setTimeout(() => {
        setIsPaused(false);
      }, pauseMs);
      router.push(href);
    },
    [clearTimers, router]
  );

  useEffect(() => {
    return () => {
      if (pauseRef.current !== null) {
        window.clearTimeout(pauseRef.current);
      }
    };
  }, []);

  const value = useMemo<AutoDemoContextValue>(
    () => ({
      autoMode: true,
      currentStep: routeIndex + 1,
      totalSteps: demoRoutes.length,
      countdown,
      currentLabel: route.label,
      isPaused,
      navigateTo,
    }),
    [countdown, isPaused, navigateTo, route.label, routeIndex]
  );

  return <AutoDemoContext.Provider value={value}>{children}</AutoDemoContext.Provider>;
}

export function useAutoDemo() {
  const context = useContext(AutoDemoContext);
  if (!context) {
    throw new Error("useAutoDemo must be used within AutoDemoProvider");
  }
  return context;
}
