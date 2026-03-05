import { FC } from 'react'
import { resolveAvatar } from '@/utils/assetRegistry'

interface ProceduralAvatarProps {
  assetId: string
  size?: number
  className?: string
}

// Palette pools for diverse, inclusive avatars
const SKIN_TONES = ['#F5CBA7', '#E8A87C', '#C68642', '#8D5524', '#4A2912', '#FADADD']
const HAIR_COLORS = ['#1a1a1a', '#4a2c0a', '#c69c2a', '#e8341f', '#9b59b6', '#e8b4b8']
const BG_COLORS = [
  '#DBEAFE', '#D1FAE5', '#FEF3C7', '#FCE7F3', '#EDE9FE', '#FFEDD5',
  '#CFFAFE', '#F0FDF4', '#FFF7ED', '#F3E8FF',
]

function seedFrom(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff
  return Math.abs(h)
}

export const ProceduralAvatar: FC<ProceduralAvatarProps> = ({ assetId, size = 80, className }) => {
  const info = resolveAvatar(assetId)
  const seed = seedFrom(assetId)

  const bg = BG_COLORS[seed % BG_COLORS.length]
  const skin = SKIN_TONES[(seed >> 3) % SKIN_TONES.length]
  const hair = HAIR_COLORS[(seed >> 5) % HAIR_COLORS.length]
  const hairStyle = (seed >> 7) % 4  // 0-3 hair variants
  const isFemale = info.gender === 'f'

  const cx = size / 2
  const headR = size * 0.2
  const headY = size * 0.4

  // Hair paths
  const hairPaths = [
    // short crop
    `M ${cx - headR - 2} ${headY} Q ${cx} ${headY - headR * 1.6} ${cx + headR + 2} ${headY}`,
    // medium
    `M ${cx - headR - 4} ${headY + 4} Q ${cx - headR * 1.5} ${headY - headR * 1.8} ${cx} ${headY - headR * 1.6} Q ${cx + headR * 1.5} ${headY - headR * 1.8} ${cx + headR + 4} ${headY + 4}`,
    // long straight
    `M ${cx - headR - 4} ${headY + 10} Q ${cx - headR * 1.5} ${headY - headR * 2} ${cx} ${headY - headR * 1.7} Q ${cx + headR * 1.5} ${headY - headR * 2} ${cx + headR + 4} ${headY + 10}`,
    // wavy
    `M ${cx - headR - 4} ${headY + 8} Q ${cx - headR * 2} ${headY - headR} ${cx - headR} ${headY - headR * 1.8} Q ${cx} ${headY - headR * 2} ${cx + headR} ${headY - headR * 1.8} Q ${cx + headR * 2} ${headY - headR} ${cx + headR + 4} ${headY + 8}`,
  ]

  // Body color — varies slightly by index
  const bodyColors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
  const bodyColor = bodyColors[info.index % bodyColors.length]

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="Candidate avatar"
    >
      {/* Background circle */}
      <circle cx={cx} cy={cx} r={cx} fill={bg} />

      {/* Body / torso */}
      <ellipse
        cx={cx}
        cy={size * 0.82}
        rx={headR * 1.3}
        ry={size * 0.22}
        fill={bodyColor}
        opacity={0.9}
      />

      {/* Neck */}
      <rect
        x={cx - size * 0.04}
        y={headY + headR - 2}
        width={size * 0.08}
        height={size * 0.1}
        fill={skin}
      />

      {/* Head */}
      <ellipse
        cx={cx}
        cy={headY}
        rx={headR}
        ry={headR * (isFemale ? 0.95 : 1.0)}
        fill={skin}
      />

      {/* Hair fill */}
      <path
        d={hairPaths[hairStyle]}
        fill={hair}
        clipPath="none"
        opacity={0.95}
      />

      {/* Eyes */}
      <circle cx={cx - headR * 0.36} cy={headY - headR * 0.08} r={headR * 0.1} fill="#1a1a1a" />
      <circle cx={cx + headR * 0.36} cy={headY - headR * 0.08} r={headR * 0.1} fill="#1a1a1a" />

      {/* Smile */}
      <path
        d={`M ${cx - headR * 0.3} ${headY + headR * 0.3} Q ${cx} ${headY + headR * 0.55} ${cx + headR * 0.3} ${headY + headR * 0.3}`}
        stroke="#1a1a1a"
        strokeWidth={size * 0.015}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
