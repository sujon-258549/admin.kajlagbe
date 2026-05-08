import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTrackPageViewMutation } from "../redux/features/analyticsApi/analyticsApi";

const SESSION_KEY = "kajlagbe_admin_session_id";

const ensureSessionId = (): string => {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid =
      crypto.randomUUID?.() ||
      `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
};

export const usePageViewTracker = () => {
  const location = useLocation();
  const [trackPageView] = useTrackPageViewMutation();
  const lastPathRef = useRef<string | null>(null);
  const enteredAtRef = useRef<number>(Date.now());

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPathRef.current) return;

    const now = Date.now();
    const previousDuration = lastPathRef.current
      ? now - enteredAtRef.current
      : undefined;

    const sessionId = ensureSessionId();
    const referrer = document.referrer || undefined;
    const search = new URLSearchParams(location.search);

    const payload = {
      sessionId,
      path,
      fullUrl: window.location.href,
      title: document.title,
      referrer,
      utmSource: search.get("utm_source") || undefined,
      utmMedium: search.get("utm_medium") || undefined,
      utmCampaign: search.get("utm_campaign") || undefined,
      durationMs: previousDuration,
      source: "admin",
    };

    trackPageView(payload).unwrap().catch(() => {
      /* swallow — tracking failures must not break navigation */
    });

    lastPathRef.current = path;
    enteredAtRef.current = now;
  }, [location.pathname, location.search, trackPageView]);
};

export default usePageViewTracker;
