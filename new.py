from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

# Initialize application
app = Ursina()

# Window configuration
window.title = 'Voxel Builder'
window.borderless = False

# Player setup
player = FirstPersonController()
player.cursor.color = color.clear

# Environment
Sky()

# Block definitions: (texture, color, label)
block_types = [
    ('grass.png', color.white, 'Grass'),
    ('brick.png', color.white, 'Brick'),
    ('white_cube', color.gray, 'Stone'),
    ('white_cube', color.brown, 'Wood'),
    ('white_cube', color.green, 'Leaves'),
]

# Game state
selected_block = 0
boxes = []
TERRAIN_SIZE = 20

def make_block(pos, block_index=0):
    """Create a voxel block at the specified position."""
    tex, col, _label = block_types[block_index]
    b = Button(
        color=col,
        model='cube',
        position=pos,
        texture=tex,
        parent=scene,
        origin_y=0.5
    )
    b.block_index = block_index
    return b

# Generate flat terrain
for i in range(TERRAIN_SIZE):
    for j in range(TERRAIN_SIZE):
        boxes.append(make_block((j, 0, i), 0))

# Crosshair
crosshair = Text('+', origin=(0, 0), scale=2, color=color.white)

# HUD
hud = Text('', origin=(-0.85, -0.45), scale=1.2, color=color.white)

def update():
    texture_name = block_types[selected_block][2]
    hud.text = (
        f'Block: {selected_block + 1}/{len(block_types)} ({texture_name})\n'
        f'[1-{len(block_types)} to switch, scroll to cycle, Esc to quit]'
    )

def input(key):
    """Handle user input for block selection and placement/removal."""
    global selected_block

    if key == 'escape':
        application.quit()

    # Number keys to select block type
    for n in range(len(block_types)):
        if key == str(n + 1):
            selected_block = n

    # Scroll to cycle blocks
    if key == 'scroll up':
        selected_block = (selected_block + 1) % len(block_types)
    if key == 'scroll down':
        selected_block = (selected_block - 1) % len(block_types)

    for box in boxes:
        if box.hovered:
            if key == 'left mouse down':
                new = make_block(box.position + mouse.normal, selected_block)
                boxes.append(new)
            if key == 'right mouse down':
                boxes.remove(box)
                destroy(box)

app.run()
