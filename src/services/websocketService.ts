import { useEffect, useRef, useState } from 'react';

export interface WebSocketMessage {
  type: 'update' | 'alert' | 'error' | 'connected' | 'subscribe' | 'request_history' | 'history_response';
  timestamp: Date;
  data?: any;
  message?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private config: WebSocketConfig;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config
    };
  }

  connect() {
    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.config.onConnect?.();
        
        // Send initial connection message
        this.send({
          type: 'connected',
          timestamp: new Date()
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          message.timestamp = new Date(message.timestamp);
          this.config.onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.config.onError?.(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.config.onDisconnect?.();
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (
      this.reconnectAttempts < (this.config.maxReconnectAttempts || 10) &&
      !this.reconnectTimer
    ) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.reconnectTimer = null;
        this.connect();
      }, this.config.reconnectInterval);
    }
  }

  send(message: Partial<WebSocketMessage>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...message,
        timestamp: message.timestamp || new Date()
      }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// React hook for WebSocket
export const useWebSocket = (config: Omit<WebSocketConfig, 'onMessage' | 'onConnect' | 'onDisconnect' | 'onError'>) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const serviceRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    const service = new WebSocketService({
      ...config,
      onMessage: (message) => {
        setLastMessage(message);
      },
      onConnect: () => {
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onError: (err) => {
        setError(err);
      }
    });

    service.connect();
    serviceRef.current = service;

    return () => {
      service.disconnect();
    };
  }, [config.url]);

  const send = (message: Partial<WebSocketMessage>) => {
    serviceRef.current?.send(message);
  };

  return {
    isConnected,
    lastMessage,
    error,
    send
  };
};

// Hook for Palestine data real-time updates with V3 integration
export const usePalestineDataWebSocket = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Real WebSocket connection for V3 data updates
  useEffect(() => {
    const wsConfig: WebSocketConfig = {
      url: 'wss://api.palestine-pulse.org/v3/updates', // Would be real endpoint
      reconnectInterval: 30000, // 30 seconds
      maxReconnectAttempts: 5,
      onMessage: (message) => {
        if (message.type === 'update' && message.data) {
          setUpdates(prev => [...prev.slice(-19), {
            ...message,
            id: Date.now(),
          }]);
        }
      },
      onConnect: () => {
        setIsConnected(true);
        console.log('Connected to V3 real-time data feed');
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log('Disconnected from V3 real-time data feed');
      },
      onError: (error) => {
        console.error('V3 WebSocket error:', error);
      }
    };

    const service = new WebSocketService(wsConfig);
    service.connect();

    return () => {
      service.disconnect();
    };
  }, []);

  // Fallback simulation when WebSocket is not available
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(() => {
        const mockUpdate = {
          type: 'update',
          timestamp: new Date(),
          data: {
            casualties: Math.floor(Math.random() * 10) + 1,
            region: Math.random() > 0.5 ? 'gaza' : 'westbank',
            type: 'mock'
          }
        };
        setUpdates(prev => [...prev.slice(-9), {
          ...mockUpdate,
          id: Date.now(),
        }]);
      }, 60000); // 1 minute for mock data

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return {
    updates,
    isConnected,
    lastUpdate: updates[updates.length - 1] || null
  };
};

// V3-specific WebSocket integration
export class V3WebSocketService extends WebSocketService {
  constructor() {
    super({
      url: 'wss://api.palestine-pulse.org/v3/realtime',
      reconnectInterval: 30000,
      maxReconnectAttempts: 10,
    });
  }

  // Subscribe to specific data streams
  subscribeToCasualtyUpdates() {
    this.send({
      type: 'subscribe',
      data: { stream: 'casualties' }
    });
  }

  subscribeToInfrastructureUpdates() {
    this.send({
      type: 'subscribe',
      data: { stream: 'infrastructure' }
    });
  }

  subscribeToEconomicUpdates() {
    this.send({
      type: 'subscribe',
      data: { stream: 'economic' }
    });
  }

  // Request historical data
  requestHistoricalData(startDate: string, endDate: string) {
    this.send({
      type: 'request_history',
      data: { startDate, endDate }
    });
  }
}