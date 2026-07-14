'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_PORT = 3003;

export interface ScreenListItem {
  id: string;
  name: string;
  displays: number;
  remotes: number;
  status: string;
  homeScore: number;
  awayScore: number;
  homeTeam: string;
  awayTeam: string;
}

export interface ScreenState {
  match: import('@/types').MatchState;
  isTimerRunning: boolean;
  skins: import('@/types').SkinData[];
  activeSkinId: string;
  ads: import('@/types').AdData[];
  activeAdIndex: number;
}

export type ClientRole = 'control' | 'display' | 'remote';

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(`/?XTransformPort=${WS_PORT}`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
}

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Initial state sync
    if (socket.connected) {
      // Use queueMicrotask to avoid setState in effect body
      queueMicrotask(() => setConnected(true));
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const emit = useCallback((event: string, ...args: unknown[]) => {
    socketRef.current?.emit(event, ...args);
  }, []);

  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on(event as never, handler as never);
    return () => { socket.off(event as never, handler as never); };
  }, []);

  return { connected, emit, on, socket: socketRef };
}

export function useScreens() {
  const { connected, emit, on } = useSocket();
  const [screens, setScreens] = useState<ScreenListItem[]>([]);

  useEffect(() => {
    const unsub = on('screens:list', (data: unknown) => {
      setScreens(data as ScreenListItem[]);
    });
    return unsub;
  }, [on]);

  const createScreen = useCallback((name: string) => {
    emit('screen:create', name);
  }, [emit]);

  const deleteScreen = useCallback((screenId: string) => {
    emit('screen:delete', screenId);
  }, [emit]);

  const renameScreen = useCallback((screenId: string, name: string) => {
    emit('screen:rename', { screenId, name });
  }, [emit]);

  return { connected, screens, createScreen, deleteScreen, renameScreen };
}

export function useScreenSubscription(screenId: string | null) {
  const { emit, on } = useSocket();
  const [state, setState] = useState<ScreenState | null>(null);
  const stateRef = useRef<ScreenState | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!screenId) return;

    const unsub = on('screen:state', (data: unknown) => {
      const d = data as ScreenState & { screenId: string };
      if (d.screenId === screenId) {
        const { screenId: _, ...screenState } = d;
        setState(screenState);
      }
    });

    emit('screen:select', screenId);

    return unsub;
  }, [screenId, emit, on]);

  const sendAction = useCallback((action: Record<string, unknown>) => {
    if (!screenId) return;
    emit('action', { screenId, action });
  }, [screenId, emit]);

  const syncState = useCallback((fullState: Record<string, unknown>) => {
    if (!screenId) return;
    emit('screen:sync', { screenId, state: fullState });
  }, [screenId, emit]);

  return { state, stateRef, sendAction, syncState };
}

export function useDisplayClient(screenId: string | null) {
  const { connected, emit, on } = useSocket();
  const [state, setState] = useState<ScreenState | null>(null);

  useEffect(() => {
    if (!screenId || !connected) return;

    const unsubState = on('screen:state', (data: unknown) => {
      const d = data as ScreenState & { screenId: string };
      if (d.screenId === screenId) {
        const { screenId: _, ...screenState } = d;
        setState(screenState);
      }
    });

    emit('display:join', screenId);

    return unsubState;
  }, [screenId, connected, emit, on]);

  return { state, connected };
}

export function useRemoteClient(screenId: string | null) {
  const { connected, emit, on } = useSocket();
  const [state, setState] = useState<ScreenState | null>(null);
  const [screenName, setScreenName] = useState('');

  useEffect(() => {
    if (!screenId || !connected) return;

    const unsubState = on('screen:state', (data: unknown) => {
      const d = data as ScreenState & { screenId: string };
      if (d.screenId === screenId) {
        const { screenId: _, ...screenState } = d;
        setState(screenState);
        setScreenName(screenState.match.field);
      }
    });

    const unsubList = on('screens:list', (data: unknown) => {
      const list = data as ScreenListItem[];
      const found = list.find(s => s.id === screenId);
      if (found) setScreenName(found.name);
    });

    emit('remote:join', screenId);

    return () => {
      unsubState();
      unsubList();
    };
  }, [screenId, connected, emit, on]);

  const sendAction = useCallback((action: Record<string, unknown>) => {
    if (!screenId) return;
    emit('action', { screenId, action });
  }, [screenId, emit]);

  return { state, screenName, connected, sendAction };
}