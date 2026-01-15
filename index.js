// ...existing code...
const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"

const canvas = document.getElementById('game') || document.querySelector('canvas')
if (!canvas) throw new Error('Canvas element with id "game" not found')

const W = 600
const H = 580

const dpr = window.devicePixelRatio || 1
canvas.width = W * dpr
canvas.height = H * dpr
canvas.style.width = W + 'px'
canvas.style.height = H + 'px'

const ctx = canvas.getContext("2d")
ctx.scale(dpr, dpr)

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, W, H)
}

function point({x, y}) {
    const s = 20;
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - s/2, y - s/2, s, s)
}

function line(p1, p2) {
    if (!p1 || !p2) return
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function screen(p) {
    // -1..1 => 0..W / H
    return {
        x: (p.x + 1) / 2 * W,
        y: (1 - (p.y + 1) / 2) * H,
    }
}

// perspective projection: returns normalized coords (-inf..inf) or null if behind camera
function project({x, y, z}, camZ, focal = 1.2) {
    const zCam = z + camZ
    if (zCam <= 0.001) return null
    const s = focal / zCam
    return { x: x * s, y: y * s }
}

function translate_z({x, y, z}, dz) {
    return {x, y, z: z + dz};
}

function rotate_xz({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x * c - z * s,
        y,
        z: x * s + z * c,
    };
}

let camZ = 3.0
let angle = 0

// mouse wheel / touchpad to zoom camera
window.addEventListener('wheel', (e) => {
    camZ += e.deltaY * 0.01
    camZ = Math.max(0.5, camZ)
})

// simple keyboard controls: arrow up/down to move camera
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') camZ = Math.max(0.5, camZ - 0.2)
    if (e.key === 'ArrowDown') camZ += 0.2
})

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
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

// helper: world vertex -> screen point (or null if behind camera)
function worldToScreen(v) {
    const r = rotate_xz(v, angle)
    const p = project(r, camZ, 1.2)
    if (!p) return null
    return screen(p)
}

let lastTime = performance.now()
function frame(now) {
    const dt = (now - lastTime) / 1000
    lastTime = now

    angle += Math.PI * dt

    clear()

    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            const sa = worldToScreen(a)
            const sb = worldToScreen(b)
            line(sa, sb)
        }
    }

    requestAnimationFrame(frame)
}

requestAnimationFrame(frame)
// ...existing code...