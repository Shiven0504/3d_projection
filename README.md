🧊 Canvas 3D Projection (Wireframe Renderer)

A lightweight 3D wireframe projection engine built using HTML5 Canvas and vanilla JavaScript.
This project demonstrates how 3D objects can be represented, rotated, projected, and rendered on a 2D screen without using any external libraries or WebGL.

📌 Features

3D point representation using (x, y, z) coordinates

Perspective projection (3D → 2D)

Rotation around the Y-axis (XZ plane)

Wireframe rendering using line segments

Smooth animation at a fixed FPS

Pure JavaScript + Canvas (no frameworks)

🛠️ Technologies Used

HTML5 Canvas

JavaScript (ES6)

2D Rendering Context

📂 Project Structure
/
├── index.html   # Canvas element
├── index.js     # 3D math, projection, rendering logic
└── README.md    # Project documentation

▶️ How It Works
1️⃣ 3D Model Definition

Vertices (vs) store points in 3D space.

Faces (fs) store connections between vertices using indices.

2️⃣ Rotation

Objects are rotated using trigonometric rotation formulas.

Rotation is applied in the XZ plane to simulate Y-axis rotation.

3️⃣ Perspective Projection

3D points are projected onto a 2D plane using:

x' = x / z
y' = y / z

4️⃣ Screen Mapping

Normalized coordinates (-1 to 1) are mapped to canvas pixels.

5️⃣ Rendering Loop

The scene is cleared each frame.

Edges of each face are drawn using canvas lines.

Animation is handled with a timed loop.

🧮 Core Concepts Demonstrated

Coordinate systems

Linear transformations

Perspective projection

3D rotation using sine and cosine

Real-time rendering loop

Basic graphics pipeline

🚀 How to Run

Clone or download the project

Open index.html in a browser

Open DevTools → Console (optional)

Watch the rotating 3D wireframe object

⚠️ No server or build tools required

🧠 Educational Use

This project is ideal for learning:

Computer Graphics fundamentals

How 3D engines work internally

Math behind 3D rendering

Canvas-based animations

🔧 Possible Enhancements

Add rotation on X and Z axes

Implement back-face culling

Add depth sorting (Painter’s Algorithm)

Replace setTimeout with requestAnimationFrame

Add keyboard or mouse controls

Add shading or filled polygons

📜 License

This project is open-source and free to use for educational purposes.
