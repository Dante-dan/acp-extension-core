/** Caller-generated identity, unique for each capture on this connection. */
export type LodyDictationStartRequest = {
  captureId: string;
  /** WebRTC offer only. Audio goes directly to the provider, never through ACP. */
  sdp: string;
};

/** Acknowledges signaling acceptance, not microphone readiness. */
export type LodyDictationStartResponse = Record<string, never>;
export type LodyDictationStopRequest = { captureId: string };
export type LodyDictationStopResponse = Record<string, never>;

/**
 * Only matching live captures may consume these events. An SDP answer is not a
 * listening signal: the client waits for its WebRTC data channel before capture.
 * No credentials, transcript, model audio or ordinary session id belong here.
 */
export type LodyDictationUpdate = { captureId: string } & (
  | { type: 'sdp'; sdp: string }
  | { type: 'closed' }
  | { type: 'error'; message: string }
);
