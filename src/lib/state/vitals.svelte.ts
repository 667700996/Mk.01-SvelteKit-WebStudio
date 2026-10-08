/**
 * Field measurements of the current visit, taken with the browser's own
 * Performance APIs. Shared by the performance HUD and the colophon page.
 * Nothing here is estimated or hard-coded: a value is null until measured.
 */

export type Rating = "good" | "needs-improvement" | "poor";

// Thresholds from web.dev/vitals (75th-percentile targets).
const THRESHOLDS = {
  lcp: [2500, 4000],
  inp: [200, 500],
  cls: [0.1, 0.25],
  fcp: [1800, 3000],
  ttfb: [800, 1800],
} as const;

export function rate(metric: keyof typeof THRESHOLDS, value: number | null): Rating | null {
  if (value === null) return null;
  const [good, poor] = THRESHOLDS[metric];
  return value <= good ? "good" : value <= poor ? "needs-improvement" : "poor";
}

type EventTimingEntry = PerformanceEntry & { interactionId?: number; duration: number };
type ShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean };

class Vitals {
  ttfb = $state<number | null>(null);
  fcp = $state<number | null>(null);
  lcp = $state<number | null>(null);
  cls = $state(0);
  inp = $state<number | null>(null);
  transfer = $state(0);
  requests = $state(0);
  /** Duration of the most recent client-side route change, in ms. */
  navigation = $state<number | null>(null);
  domNodes = $state(0);

  #started = false;
  #navStart = 0;

  start() {
    if (this.#started || typeof PerformanceObserver === "undefined") return;
    this.#started = true;

    const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (nav) {
      this.ttfb = nav.responseStart;
      this.transfer += nav.transferSize;
      this.requests += 1;
    }

    const observe = (type: string, callback: (entries: PerformanceEntry[]) => void, extra = {}) => {
      try {
        new PerformanceObserver((list) => callback(list.getEntries())).observe({
          type,
          buffered: true,
          ...extra,
        });
      } catch {
        // Entry type unsupported in this browser (e.g. Safari has no LCP/INP): leave it null.
      }
    };

    observe("paint", (entries) => {
      const fcp = entries.find((entry) => entry.name === "first-contentful-paint");
      if (fcp) this.fcp = fcp.startTime;
    });

    observe("largest-contentful-paint", (entries) => {
      this.lcp = entries[entries.length - 1].startTime;
    });

    // CLS as the largest session window: shifts within 1s of each other, capped at 5s.
    let windowValue = 0;
    let windowStart = 0;
    let windowLast = 0;
    observe("layout-shift", (entries) => {
      for (const entry of entries as ShiftEntry[]) {
        if (entry.hadRecentInput) continue;
        const continues = entry.startTime - windowLast < 1000 && entry.startTime - windowStart < 5000;
        windowValue = continues ? windowValue + entry.value : entry.value;
        if (!continues) windowStart = entry.startTime;
        windowLast = entry.startTime;
        this.cls = Math.max(this.cls, windowValue);
      }
    });

    // INP: the slowest interaction seen so far (the 98th percentile collapses to
    // the maximum below fifty interactions, which covers a portfolio visit).
    observe(
      "event",
      (entries) => {
        for (const entry of entries as EventTimingEntry[]) {
          if (!entry.interactionId) continue;
          this.inp = Math.max(this.inp ?? 0, entry.duration);
        }
      },
      { durationThreshold: 16 },
    );

    observe("resource", (entries) => {
      for (const entry of entries as PerformanceResourceTiming[]) {
        this.transfer += entry.transferSize;
        this.requests += 1;
      }
    });

    this.sampleDom();
  }

  sampleDom() {
    this.domNodes = document.getElementsByTagName("*").length;
  }

  navigationStarted() {
    this.#navStart = performance.now();
  }

  navigationFinished() {
    if (this.#navStart) this.navigation = performance.now() - this.#navStart;
    this.#navStart = 0;
    requestAnimationFrame(() => this.sampleDom());
  }
}

export const vitals = new Vitals();

export function formatMs(value: number | null) {
  if (value === null) return "—";
  return value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;
}

export function formatBytes(value: number) {
  return value >= 1024 * 1024
    ? `${(value / 1024 / 1024).toFixed(2)} MB`
    : `${Math.round(value / 1024)} KB`;
}
