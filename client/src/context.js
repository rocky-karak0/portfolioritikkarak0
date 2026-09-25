import { createContext, useContext } from 'react';

/** true once the preloader has finished — hero animations wait for this. */
export const ReadyContext = createContext(true);
export const useReady = () => useContext(ReadyContext);

/** Opens the full-screen showreel modal from anywhere. */
export const ReelContext = createContext({ open: () => {}, close: () => {} });
export const useReel = () => useContext(ReelContext);
