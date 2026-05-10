import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(onSlotBooked) {
  const callbackRef = useRef(onSlotBooked);
  callbackRef.current = onSlotBooked;

  useEffect(() => {
    const explicit = import.meta.env.VITE_SERVER_URL?.trim();
    const url =
      explicit ||
      (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

    const sameOriginProxy = !import.meta.env.DEV && !explicit;
    const socket = io(url, {
      ...(sameOriginProxy ? { path: '/socket.io/' } : {}),
      transports: ['websocket', 'polling'],
    });

    socket.on('slot:booked', (payload) => {
      callbackRef.current?.(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
