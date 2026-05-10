import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(onSlotBooked) {
  const callbackRef = useRef(onSlotBooked);
  callbackRef.current = onSlotBooked;

  useEffect(() => {
    const raw = import.meta.env.VITE_SERVER_URL?.trim();
    const url =
      raw ||
      (import.meta.env.DEV ? 'http://localhost:5000' : '');
    if (!url) {
      console.error(
        'Missing VITE_SERVER_URL. Set it in Vercel to your Socket.IO origin (e.g. https://YOUR-BACKEND-HOST), then redeploy.'
      );
      return;
    }
    const socket = io(url, {
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
