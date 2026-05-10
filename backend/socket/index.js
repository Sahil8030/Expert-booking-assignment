export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
  });
}
