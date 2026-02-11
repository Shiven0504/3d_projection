from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina()
player = FirstPersonController()
Sky()

boxes = []
for i in range(20):
    for j in range(20):
        box = Button(
            color=color.white,
            model='cube',
            position=Vec3(j, 0, i),
            texture='grass.png',
            parent=scene,
            origin_y=0.5,
            collider='box'
        )
        boxes.append(box)

def input(key):
    # iterate over a shallow copy to avoid modifying the list while iterating
    for box in boxes[:]:
        if not box.hovered:
            continue

        if key == 'left mouse down':
            # place new block snapped to integer grid and avoid duplicates
            new_pos = box.position + mouse.normal
            new_pos = Vec3(round(new_pos.x), round(new_pos.y), round(new_pos.z))
            if not any(b.position == new_pos for b in boxes):
                new = Button(
                    color=color.white,
                    model='cube',
                    position=new_pos,
                    texture='grass.png',
                    parent=scene,
                    origin_y=0.5,
                    collider='box'
                )
                boxes.append(new)
            break

        if key == 'right mouse down':
            boxes.remove(box)
            destroy(box)
            break

app.run()