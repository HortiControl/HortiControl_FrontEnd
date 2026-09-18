import { useEffect } from "react";

/** Trava o scroll do body enquanto o componente estiver montado. */
export function useLockBodyScroll() {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.height = previousHeight;
    };
  }, []);
}
