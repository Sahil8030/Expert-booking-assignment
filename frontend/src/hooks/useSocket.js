import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(onSlotBooked) {
  const callbackRef = useRef(onSlotBooked);
  callbackRef.current = onSlotBooked;

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_URL;
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
