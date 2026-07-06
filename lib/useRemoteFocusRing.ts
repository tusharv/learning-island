import { useCallback, useState } from "react";

/** Shows TV/keyboard focus rings only after directional or select input. */
export function useRemoteFocusRing() {
  const [active, setActive] = useState(false);
  const activate = useCallback(() => {
    setActive(true);
  }, []);

  return { active, activate };
}
