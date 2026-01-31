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

function line(p1, p2) {
    if (!p1 || !p2) return
    ctx.lineWidth = 2
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

function screen(p) {
    return {
        x: (p.x + 1) / 2 * W,
        y: (1 - (p.y + 1) / 2) * H,
    }
}

// safer perspective projection (returns null if behind camera)
function project({x, y, z}, camZ) {
    const zCam = z + camZ
    if (zCam <= 0.0001) return null
    const s = 1 / zCam
    return { x: x * s, y: y * s }
}

function rotate_xz({x, y, z}, angle) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return { x: x * c - z * s, y, z: x * s + z * c }
}

const vs = [
    {x:  0.25, y:  0.25, z:  0.25},
    {x: -0.25, y:  0.25, z:  0.25},
    {x: -0.25, y: -0.25, z:  0.25},
    {x:  0.25, y: -0.25, z:  0.25},
    {x:  0.25, y:  0.25, z: -0.25},
    {x: -0.25, y:  0.25, z: -0.25},
    {x: -0.25, y: -0.25, z: -0.25},
    {x:  0.25, y: -0.25, z: -0.25},
]

const fs = [
    [0,1,2,3],
    [4,5,6,7],
    [0,4],
    [1,5],
    [2,6],
    [3,7],
]

let angle = 0
const CAM_Z = 1.2
const ROT_SPEED = Math.PI * 0.5 // radians per second, lower = smoother

let last = performance.now()
function frame(now) {
    const dt = (now - last) / 1000
    last = now

    angle += ROT_SPEED * dt

    clear()
    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = rotate_xz(vs[f[i]], angle)
            const b = rotate_xz(vs[f[(i+1) % f.length]], angle)
            const pa = project(a, CAM_Z)
            const pb = project(b, CAM_Z)
            line(pa ? screen(pa) : null, pb ? screen(pb) : null)
        }
    }

    requestAnimationFrame(frame)
}

requestAnimationFrame(frame)
// ...existing code...