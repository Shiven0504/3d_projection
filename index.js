const BACKGROUND = "#101010"
const COLORS = ["#50FF50", "#FF5050", "#5050FF", "#FFD700", "#FF50FF", "#50FFFF"]

const game = document.getElementById('game')
game.width = 600
game.height = 580
const ctx = game.getContext("2d")

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

function line(p1, p2, color) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = color
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function screen(p) {
    return {
        x: (p.x + 1) / 2 * game.width,
        y: (1 - (p.y + 1) / 2) * game.height,
    }
}

function project({ x, y, z }) {
    return { x: x / z, y: y / z }
}

function translate_z({ x, y, z }, dz) {
    return { x, y, z: z + dz }
}

function rotate_xz({ x, y, z }, angle) {
    const c = Math.cos(angle), s = Math.sin(angle)
    return { x: x * c - z * s, y, z: x * s + z * c }
}

function rotate_xy({ x, y, z }, angle) {
    const c = Math.cos(angle), s = Math.sin(angle)
    return { x: x * c - y * s, y: x * s + y * c, z }
}

let dz = 1
let angleXZ = 0
let angleXY = 0
let rotationSpeed = Math.PI
let paused = false

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        rotationSpeed += 0.1 * Math.sign(rotationSpeed) || 0.1
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        if (Math.abs(rotationSpeed) > 0.1) {
            rotationSpeed -= 0.1 * Math.sign(rotationSpeed)
        } else {
            rotationSpeed = 0
        }
    } else if (event.key === ' ') {
        paused = !paused
    } else if (event.key === 'r') {
        rotationSpeed = Math.PI
        angleXZ = 0
        angleXY = 0
    } else if (event.key === 'd') {
        rotationSpeed = -rotationSpeed
    }
})

game.tabIndex = 0
game.focus()

const vs = [
    { x:  0.25, y:  0.25, z:  0.25 },
    { x: -0.25, y:  0.25, z:  0.25 },
    { x: -0.25, y: -0.25, z:  0.25 },
    { x:  0.25, y: -0.25, z:  0.25 },
    { x:  0.25, y:  0.25, z: -0.25 },
    { x: -0.25, y:  0.25, z: -0.25 },
    { x: -0.25, y: -0.25, z: -0.25 },
    { x:  0.25, y: -0.25, z: -0.25 },
]

const fs = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

function drawHUD() {
    ctx.fillStyle = "#ffffff"
    ctx.font = "14px monospace"
    ctx.fillText(`Speed: ${Math.abs(rotationSpeed).toFixed(2)} rad/s ${rotationSpeed < 0 ? '(reverse)' : ''}`, 10, 20)
    ctx.fillText(`W/↑ = faster  S/↓ = slower  D = reverse  Space = pause  R = reset`, 10, 40)
    if (paused) {
        ctx.fillStyle = "#FFD700"
        ctx.font = "bold 20px monospace"
        ctx.fillText("PAUSED", game.width / 2 - 40, game.height / 2)
    }
}

let lastTime = null

function frame(timestamp) {
    const dt = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.1)
    lastTime = timestamp

    if (!paused) {
        angleXZ += rotationSpeed * dt
        angleXY += rotationSpeed * 0.4 * dt
    }

    clear()

    for (let fi = 0; fi < fs.length; fi++) {
        const f = fs[fi]
        const color = COLORS[fi % COLORS.length]
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]]
            const b = vs[f[(i + 1) % f.length]]
            const transform = v => screen(project(translate_z(rotate_xz(rotate_xy(v, angleXY), angleXZ), dz)))
            line(transform(a), transform(b), color)
        }
    }

    drawHUD()
    requestAnimationFrame(frame)
}

requestAnimationFrame(frame)
