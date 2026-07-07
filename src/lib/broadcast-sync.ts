// ============================================================================
// PROFUTBOL - BroadcastChannel Cross-Tab Sync
// ============================================================================
// Enables real-time communication between Control Panel and Display windows
// like Windows extended display on two monitors.
// ============================================================================

const CHANNEL_NAME = 'profutbol-scoreboard-sync';

export interface SyncMessage {
  type: 'state-update' | 'display-joined' | 'timer-tick';
  payload: unknown;
}

let channel: BroadcastChannel | null = null;
let isListening = false;

function getChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
  return channel;
}

/**
 * Broadcast the full scoreboard state from Control Panel to Display windows
 */
export function broadcastState(state: Record<string, unknown>): void {
  try {
    const ch = getChannel();
    ch.postMessage({ type: 'state-update', payload: state });
  } catch {
    // BroadcastChannel not supported or tab closed
  }
}

/**
 * Signal that a display window has joined and needs initial state
 */
export function broadcastDisplayJoined(): void {
  try {
    const ch = getChannel();
    ch.postMessage({ type: 'display-joined', payload: {} });
  } catch {
    // ignore
  }
}

/**
 * Listen for state updates (used by Display windows)
 */
export function onStateUpdate(callback: (state: Record<string, unknown>) => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent<SyncMessage>) => {
    if (event.data?.type === 'state-update') {
      callback(event.data.payload as Record<string, unknown>);
    }
  };
  ch.addEventListener('message', handler);
  isListening = true;
  return () => {
    ch.removeEventListener('message', handler);
    isListening = false;
  };
}

/**
 * Listen for display-joined messages (used by Control Panel to send initial state)
 */
export function onDisplayJoined(callback: () => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent<SyncMessage>) => {
    if (event.data?.type === 'display-joined') {
      callback();
    }
  };
  ch.addEventListener('message', handler);
  return () => {
    ch.removeEventListener('message', handler);
  };
}