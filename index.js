// ...existing code...
const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"

const W = 600
const H = 580
game.width = W
game.height = H
const ctx = game.getContext("2d")

function clear() {
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, W, H)
}

function line(a, b) {
  if (!a || !b) return
  ctx.strokeStyle = FOREGROUND
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.stroke()
}

function screen(p) {
  return {
    x: (p.x + 1) / 2 * W,
    y: (1 - (p.y + 1) / 2) * H,
  }
}

function project(v, cam = 1.5) {
  const z = v.z + cam
  if (z <= 0) return null
  const s = 1 / z
  return { x: v.x * s, y: v.y * s }
}

function rotate_xz(v, a) {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: v.x * c - v.z * s, y: v.y, z: v.x * s + v.z * c }
}

const vs = [
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
]

const fs = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

let angle = 0
const camZ = 1.5

function frame() {
  angle += 0.02
  clear()

  for (const f of fs) {
    for (let i = 0; i < f.length; ++i) {
      const a = rotate_xz(vs[f[i]], angle)
      const b = rotate_xz(vs[f[(i + 1) % f.length]], angle)
      const pa = project(a, camZ)
      const pb = project(b, camZ)
      line(screen(pa), screen(pb))
    }
  }

  setTimeout(frame, 1000 / 60)
}
setTimeout(frame, 1000 / 60)    