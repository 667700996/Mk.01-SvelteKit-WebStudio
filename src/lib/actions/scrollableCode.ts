import type { Action } from "svelte/action";

/**
 * Makes every code block inside the node a keyboard-reachable, labelled region,
 * so horizontally scrolling code can be scrolled without a pointer (WCAG 2.1.1).
 */
export const scrollableCode: Action = (node) => {
  const label = () => {
    node.querySelectorAll("pre").forEach((pre) => {
      pre.tabIndex = 0;
      pre.setAttribute("role", "region");
      pre.setAttribute("aria-label", "Code example");
    });
  };
  label();
  // The article body is swapped on client-side navigation between posts.
  const observer = new MutationObserver(label);
  observer.observe(node, { childList: true, subtree: true });
  return { destroy: () => observer.disconnect() };
};
