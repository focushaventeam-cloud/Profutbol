import { Server } from 'socket.io';

const io = new Server(3001, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// In-memory state relay - just passes messages between clients
const rooms = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join:match', (matchId: string) => {
    socket.join(matchId);
    if (!rooms.has(matchId)) {
      rooms.set(matchId, new Set());
    }
    rooms.get(matchId)!.add(socket.id);
    console.log(`Socket ${socket.id} joined match ${matchId}`);
  });

  // Relay all state updates
  socket.on('scoreboard:update', (matchId: string, data: unknown) => {
    socket.to(matchId).emit('scoreboard:update', data);
  });

  socket.on('scoreboard:timer', (matchId: string, data: unknown) => {
    socket.to(matchId).emit('scoreboard:timer', data);
  });

  socket.on('scoreboard:skin', (matchId: string, data: unknown) => {
    socket.to(matchId).emit('scoreboard:skin', data);
  });

  socket.on('scoreboard:ad', (matchId: string, data: unknown) => {
    socket.to(matchId).emit('scoreboard:ad', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (const [matchId, sockets] of rooms.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) rooms.delete(matchId);
    }
  });
});

console.log('Scoreboard sync service running on port 3001');