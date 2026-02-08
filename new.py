from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController
app = Ursina()
player = FirstPersonController()
Sky()

boxes = []
for i in range(20):
  for j in range(20):
    box = Button(color=color.white, model='cube', position=(j,0,i),
          texture='grass.png', parent=scene, origin_y=0.5)
    boxes.append(box)

# ...existing code...
def input(key):
  # iterate over a copy to avoid mutating the list while iterating
  for box in boxes[:]:
    if box.hovered:
      if key == 'left mouse down':
        target_pos = box.position + mouse.normal
        # prevent placing a duplicate block at the same position
        if not any(b.position == target_pos for b in boxes):
          new = Button(color=color.white, model='cube', position=target_pos,
                       texture='grass.png', parent=scene, origin_y=0.5)
          boxes.append(new)
      if key == 'right mouse down':
        if box in boxes:
          boxes.remove(box)
          destroy(box)

  # keyboard shortcuts
  if key == 'c':  # clear all
    for b in boxes[:]:
      destroy(b)
    boxes.clear()

  if key == 'r':  # reset initial grid
    for b in boxes[:]:
      destroy(b)
    boxes.clear()
    for i in range(20):
      for j in range(20):
        box = Button(color=color.white, model='cube', position=(j,0,i),
              texture='grass.png', parent=scene, origin_y=0.5)
        boxes.append(box)

app.run()