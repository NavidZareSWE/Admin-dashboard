import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { navItems } from "../config/navigation";

const SEQUENCE_TIMEOUT_MS = 1200;

const isTyping = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/**
 * Global shortcuts, ignored while typing in a field:
 *   g then <letter>  go to a page (letters come from config/navigation)
 *   ?                open the shortcuts help
 *   [                show or hide the sidebar
 */
const useKeyboardShortcuts = ({ onToggleSidebar, onShowHelp }) => {
  const navigate = useNavigate();
  const pendingG = useRef(0);
  // Keep the latest callbacks without re-binding the listener every render.
  const handlers = useRef({ onToggleSidebar, onShowHelp });
  useEffect(() => {
    handlers.current = { onToggleSidebar, onShowHelp };
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return;
      if (isTyping(event.target)) return;
      // A dialog or menu is open: leave its keys alone.
      if (
        document.querySelector(
          '.MuiModal-root [role="dialog"], .MuiModal-root [role="menu"]',
        )
      )
        return;

      const key = event.key;
      const now = Date.now();

      if (pendingG.current && now - pendingG.current < SEQUENCE_TIMEOUT_MS) {
        pendingG.current = 0;
        const target = navItems.find(
          (item) => item.shortcut === key.toLowerCase(),
        );
        if (target) {
          event.preventDefault();
          navigate(target.path);
        }
        return;
      }

      if (key === "g") {
        pendingG.current = now;
      } else if (key === "?") {
        event.preventDefault();
        handlers.current.onShowHelp?.();
      } else if (key === "[") {
        event.preventDefault();
        handlers.current.onToggleSidebar?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);
};

export default useKeyboardShortcuts;
