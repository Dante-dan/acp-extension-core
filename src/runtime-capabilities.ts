/** Runtime-owned optional capabilities; clients never install into runtime data directories. */
export type RuntimeCapabilityStatus = {
  id: string;
  displayName: string;
  description: string;
  supported: boolean;
  state: 'not_installed' | 'partial' | 'ready' | 'unsupported';
  version?: string;
  steps: readonly { id: string; state: 'ok' | 'missing' | 'failed'; detail?: string; optional?: boolean }[];
  install: { running: boolean; step?: string; percent?: number; error?: string; note?: string };
};
export type RuntimeCapabilitiesRequest =
  | { action: 'list' }
  | { action: 'get'; id: string }
  | { action: 'install'; id: string; confirmed: true };
export type RuntimeCapabilitiesResponse = { capabilities: readonly RuntimeCapabilityStatus[] };

/** Validate the untrusted response before rendering it or deciding installation is complete. */
export function isRuntimeCapabilitiesResponse(value: unknown): value is RuntimeCapabilitiesResponse {
  const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
  return record(value) && Array.isArray(value['capabilities']) && value['capabilities'].every((v: unknown) => {
    if (!record(v) || typeof v['id'] !== 'string' || !v['id'] || typeof v['displayName'] !== 'string' || typeof v['description'] !== 'string' || typeof v['supported'] !== 'boolean') return false;
    if (!['not_installed', 'partial', 'ready', 'unsupported'].includes(String(v['state']))) return false;
    if (v['version'] !== undefined && typeof v['version'] !== 'string') return false;
    if (!Array.isArray(v['steps']) || !v['steps'].every((step: unknown) => record(step) && typeof step['id'] === 'string' && ['ok', 'missing', 'failed'].includes(String(step['state'])) && (step['detail'] === undefined || typeof step['detail'] === 'string') && (step['optional'] === undefined || typeof step['optional'] === 'boolean'))) return false;
    const install = v['install'];
    return record(install) && typeof install['running'] === 'boolean' && ['step', 'error', 'note'].every(key => install[key] === undefined || typeof install[key] === 'string') && (install['percent'] === undefined || (typeof install['percent'] === 'number' && Number.isFinite(install['percent']) && install['percent'] >= 0 && install['percent'] <= 100));
  });
}
