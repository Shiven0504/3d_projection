// ...existing code...
const FPS = 60;
const ROT_SPEED = Math.PI * 0.5; // radians per second - lower value -> smoother rotation

function frame(now) {
    if (!frame._last) frame._last = now;
    const dt = (now - frame._last) / 1000;
    frame._last = now;

    angle += ROT_SPEED * dt;
    clear();

    for (const f of fs) {
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(
                screen(project(translate_z(rotate_xz(a, angle), dz))),
                screen(project(translate_z(rotate_xz(b, angle), dz)))
            );
        }
    }

    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
// ...existing code...