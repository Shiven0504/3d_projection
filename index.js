const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"

game.width = 600
game.height = 580
const ctx = game.getContext("2d")

// Clears the canvas with the background color
function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

// Draws a point (small square) at the given coordinates
function point({x, y}) {
    const s = 20;
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - s/2, y - s/2, s, s)
}

// Draws a line between two points
function line(p1, p2) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

// Converts 3D coordinates (-1 to 1) to screen coordinates (0 to canvas size)
function screen(p) {
    // -1..1 => 0..2 => 0..1 => 0..w
    return {
        x: (p.x + 1)/2*game.width,
        y: (1 - (p.y + 1)/2)*game.height,
    }
}

// Projects 3D point to 2D using perspective projection
function project({x, y, z}) {
    return {
        x: x/z,
        y: y/z,
    }
}

// Translates a point along the Z-axis
function translate_z({x, y, z}, dz) {
    return {x, y, z: z + dz};
}

// Rotates a point around the X-axis in the XZ plane
function rotate_xz({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x*c-z*s,
        y,
        z: x*s+z*c,
    };
}

let dz = 1;
let angle = 0;
let rotationSpeed = Math.PI; // Initial rotation speed

// Add event listeners for user controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        rotationSpeed += 0.1;
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        rotationSpeed = Math.max(0, rotationSpeed - 0.1);
    }
});

// Make canvas focusable for keyboard events
game.tabIndex = 0;
game.focus();

// Define vertices of the cube
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

// Define faces as arrays of vertex indices
const fs = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

let lastTime = null;

// Main animation loop
function frame(timestamp) {
    const dt = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;
    angle += rotationSpeed * dt;

    clear()
    
    // Draw each face by connecting vertices
    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(screen(project(translate_z(rotate_xz(a, angle), dz))),
                 screen(project(translate_z(rotate_xz(b, angle), dz))))
        }
    }
    
    // Display rotation speed as text
    ctx.fillStyle = FOREGROUND;
    ctx.font = "16px monospace";
    ctx.fillText(`Rotation Speed: ${rotationSpeed.toFixed(2)}`, 10, 20);
    
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);