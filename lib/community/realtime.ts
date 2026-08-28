'use client';

type RealtimeConfig = { realtimeUrl: string; publishableKey: string; threadId: string; onChange: () => void; onStatus?: (status: 'connecting' | 'live' | 'fallback') => void };

export function subscribeToCommunityReplies({ realtimeUrl, publishableKey, threadId, onChange, onStatus }: RealtimeConfig) {
  let closed = false; let heartbeat: number | undefined; let socket: WebSocket | undefined; let ref = 1;
  try {
    const url = new URL(realtimeUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.pathname = '/realtime/v1/websocket';
    url.search = new URLSearchParams({ apikey: publishableKey, vsn: '1.0.0' }).toString();
    const topic = `realtime:community-replies-${threadId}`;
    onStatus?.('connecting');
    socket = new WebSocket(url);
    socket.addEventListener('open', () => {
      if (closed || !socket) return;
      socket.send(JSON.stringify({ topic, event: 'phx_join', payload: { config: { broadcast: { ack: false, self: false }, presence: { enabled: false }, postgres_changes: [{ event: 'INSERT', schema: 'public', table: 'community_reply_events', filter: `thread_id=eq.${threadId}` }], private: false } }, ref: String(ref), join_ref: String(ref++) }));
      heartbeat = window.setInterval(() => socket?.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(ref++) })), 25_000);
    });
    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(String(event.data)) as { event?: string; payload?: { status?: string } };
        if (message.event === 'phx_reply' && message.payload?.status === 'ok') onStatus?.('live');
        if (message.event === 'postgres_changes') onChange();
      } catch { /* malformed Realtime frames fall back to polling */ }
    });
    socket.addEventListener('error', () => onStatus?.('fallback'));
    socket.addEventListener('close', () => !closed && onStatus?.('fallback'));
  } catch { onStatus?.('fallback'); }
  return () => { closed = true; if (heartbeat) window.clearInterval(heartbeat); socket?.close(); };
}
