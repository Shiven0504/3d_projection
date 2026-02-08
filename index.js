// ...existing code...
const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"

console.log(game)
game.width = 600
game.height = 580
const ctx = game.getContext("2d")
console.log(ctx)

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

function point({x, y}) {
    const s = 20;
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - s/2, y - s/2, s, s)
}

function line(p1, p2) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function screen(p) {
    // -1..1 => 0..2 => 0..1 => 0..w
    return {
        x: (p.x + 1)/2*game.width,
        y: (1 - (p.y + 1)/2)*game.height,
    }
}

function project({x, y, z}) {
    // simple perspective with focal length
    const FOCAL = 1.2;
    return {
        x: (x * FOCAL) / z,
        y: (y * FOCAL) / z,
    }
}

const FPS = 60;


function translate_z({x, y, z}, dz) {
    return {x, y, z: z + dz};
}

function rotate_xz({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c-z*s,
        y,
        z: x*s+z*c,
    };
}

let dz = 2; // move cube in front of camera
let angle = 0;


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

// frame-rate independent animation using requestAnimationFrame
let lastTime = performance.now();
function frame(time) {
    const dt = Math.max(1/120, (time - lastTime) / 1000); // clamp tiny dt
    lastTime = time;

    angle += Math.PI * dt;
    clear()

    // precompute transformed & projected vertices, skip ones behind camera
    const transformed = vs.map(v => translate_z(rotate_xz(v, angle), dz));
    const projected = transformed.map(v => {
        if (v.z <= 0.01) return null; // behind camera or too close -> skip
        return screen(project(v));
    });

    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const aIdx = f[i];
            const bIdx = f[(i+1)%f.length];
            const a = projected[aIdx];
            const b = projected[bIdx];
            if (!a || !b) continue; // skip edges with vertices behind camera
            line(a, b)
        }
    }

    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);