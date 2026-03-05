/**
 * AssetRegistry — thin lookup layer so swapping placeholder assets for
 * production assets is a single manifest.json change.
 */

const AVATAR_MANIFEST: Record<string, string> = {
  // These keys map to procedural SVG generator IDs
  avatar_f_01: 'procedural:f:1',
  avatar_f_02: 'procedural:f:2',
  avatar_f_03: 'procedural:f:3',
  avatar_f_04: 'procedural:f:4',
  avatar_f_05: 'procedural:f:5',
  avatar_f_06: 'procedural:f:6',
  avatar_f_07: 'procedural:f:7',
  avatar_f_08: 'procedural:f:8',
  avatar_m_01: 'procedural:m:1',
  avatar_m_02: 'procedural:m:2',
  avatar_m_03: 'procedural:m:3',
  avatar_m_04: 'procedural:m:4',
  avatar_m_05: 'procedural:m:5',
  avatar_m_06: 'procedural:m:6',
  avatar_m_07: 'procedural:m:7',
}

/**
 * Resolves an avatar asset ID to a React-renderable element descriptor.
 * Returns { type: 'procedural', gender, index } for SVG generation.
 */
export function resolveAvatar(assetId: string): {
  type: 'procedural'
  gender: 'f' | 'm'
  index: number
} {
  const raw = AVATAR_MANIFEST[assetId]
  if (raw && raw.startsWith('procedural:')) {
    const [, gender, idx] = raw.split(':')
    return { type: 'procedural', gender: gender as 'f' | 'm', index: parseInt(idx, 10) }
  }
  // Fallback: derive from id pattern
  const match = assetId.match(/avatar_(f|m)_(\d+)/)
  if (match) {
    return { type: 'procedural', gender: match[1] as 'f' | 'm', index: parseInt(match[2], 10) }
  }
  return { type: 'procedural', gender: 'f', index: 1 }
}
