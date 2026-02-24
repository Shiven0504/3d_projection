from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController

app = Ursina()
player = FirstPersonController()
Sky()

# reuse model/texture references
CUBE_MODEL = 'cube'
CUBE_TEXTURE = 'grass.png'

# map positions -> entity for O(1) checks/removals
boxes_map = {}

# create initial grid
for i in range(20):
    for j in range(20):
        pos = (j, 0, i)
        e = Entity(model=CUBE_MODEL,
                   color=color.white,
                   texture=CUBE_TEXTURE,
                   position=Vec3(*pos),
                   parent=scene,
                   origin_y=0.5,
                   collider='box')  # needed for mouse picking
        boxes_map[pos] = e

def input(key):
    # try to get the hovered entity directly (fast)
    hovered = getattr(mouse, 'hovered_entity', None)

    # fallback: no hovered_entity available -> simple scan (rare)
    if not hovered:
        for e in boxes_map.values():
            if getattr(e, 'hovered', False):
                hovered = e
                break

    if not hovered:
        return

    # get integer snapped position of hovered
    hp = hovered.position
    if key == 'left mouse down':
        new_pos = (round(hp.x + mouse.normal.x),
                   round(hp.y + mouse.normal.y),
                   round(hp.z + mouse.normal.z))
        if new_pos in boxes_map:
            return
        e = Entity(model=CUBE_MODEL,
                   color=color.white,
                   texture=CUBE_TEXTURE,
                   position=Vec3(*new_pos),
                   parent=scene,
                   origin_y=0.5,
                   collider='box')
        boxes_map[new_pos] = e

    if key == 'right mouse down':
        pos = (round(hp.x), round(hp.y), round(hp.z))
        e = boxes_map.pop(pos, None)
        if e:
            destroy(e)

app.run()