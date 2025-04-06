import json
from app import db, MenuItem

with open('menu_items.json') as f:
    menu_items = json.load(f)

for item in menu_items:
    menu_item = MenuItem(name=item['name'], description=item['description'], price=item['price'], image=item['image'])
    db.session.add(menu_item)

db.session.commit()