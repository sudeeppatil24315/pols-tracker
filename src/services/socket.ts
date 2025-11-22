import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string, role: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    this.socket = io('http://localhost:5001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to WebSocket server');
      this.reconnectAttempts = 0;
      // Join rooms based on user role
      this.socket?.emit('join', { userId, role });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from WebSocket server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🔌 Max reconnection attempts reached');
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket disconnected');
    }
  }

  getSocket() {
    return this.socket;
  }

  // Job events
  onJobCreated(callback: (job: any) => void) {
    this.socket?.on('job:created', callback);
  }

  onJobAssigned(callback: (job: any) => void) {
    this.socket?.on('job:assigned', callback);
  }

  onJobStarted(callback: (job: any) => void) {
    this.socket?.on('job:started', callback);
  }

  onJobCompleted(callback: (job: any) => void) {
    this.socket?.on('job:completed', callback);
  }

  // Vehicle events
  onVehicleUpdated(callback: (vehicle: any) => void) {
    this.socket?.on('vehicle:updated', callback);
  }

  emitVehicleUpdate(vehicleData: any) {
    this.socket?.emit('vehicle:update', vehicleData);
  }

  // Remove listeners
  off(event: string, callback?: any) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();
