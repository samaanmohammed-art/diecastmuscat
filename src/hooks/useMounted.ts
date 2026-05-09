import { useSyncExternalStore } from "react";

const subscribe = (): (() => void) => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
