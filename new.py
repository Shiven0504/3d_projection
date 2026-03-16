from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina()

window.title = 'Voxel Builder'
window.borderless = False

player = FirstPersonController()
player.cursor.color = color.clear

Sky()

# Block types: (texture, color)
block_types = [
    ('grass.png', color.white),
    ('brick.png', color.white),
    ('white_cube', color.gray),
    ('white_cube', color.brown),
    ('white_cube', color.green),
]
selected_block = 0

boxes = []

def make_block(pos, block_index=0):
    tex, col = block_types[block_index]
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
for i in range(20):
    for j in range(20):
        boxes.append(make_block((j, 0, i), 0))

# Crosshair
crosshair = Text('+', origin=(0, 0), scale=2, color=color.white)

# HUD
hud = Text('', origin=(-0.85, -0.45), scale=1.2, color=color.white)

def update():
    hud.text = f'Block: {selected_block + 1}/{len(block_types)}  [1-{len(block_types)} to switch]'

def input(key):
    global selected_block

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
