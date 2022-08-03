import { IGunInstance } from "gun";
import { createContext, PropsWithChildren, useContext } from "react";

const gunContext = createContext<IGunInstance>(null as any);
gunContext.displayName = "Gun Context";
const GunProvider = gunContext.Provider;

interface IGunContextProps {
  gun: IGunInstance;
}

/**
 *  **Gun Context**
 *
 * Takes a gun instance as props and passes it down
 * through the react tree to the `useGunContext` hooks.
 */
export default function GunContext({
  gun,
  children,
}: PropsWithChildren<IGunContextProps>) {
  return <GunProvider value={gun}>{children}</GunProvider>;
}

/**
 * **Use Gun Context**
 *
 * Pulls the gun context into a react component or hook
 *
 * Used internally in `useGunState` to connect to your
 * gun data base instance
 *
 * ```jsx
 * const gun = useGunContext();
 * ```
 */
export function useGunContext(): IGunInstance {
  const gun = useContext(gunContext);
  return gun;
}
