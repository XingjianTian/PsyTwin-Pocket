import os
filepath = r"C:\Users\txj12\Desktop\PsyTwin\PsyTwin-Pocket\pages\pet\index.js"
with open(filepath, "rb") as f:
    content = f.read()

marker = b"saveBagToStorage"
idx = content.find(marker)
blank_line = content.rfind(b"\r\n\r\n", 0, idx)
if blank_line < 0:
    blank_line = content.rfind(b"\n\n", 0, idx)

enrich = b'\r\n  enrichBagItems(bagItems) {\r\n    if (!bagItems || bagItems.length === 0) return bagItems;\r\n    return bagItems.map(function(item) {\r\n      var template = ITEM_DATABASE.find(function(t) { return t.itemId === item.itemId; });\r\n      if (!template) return item;\r\n      return Object.assign({}, template, {\r\n        quantity: item.quantity || 1,\r\n        name: item.name || template.name,\r\n        icon: item.icon || template.icon,\r\n        rarity: item.rarity || template.rarity,\r\n        type: item.type || template.type,\r\n        description: item.description || template.description,\r\n        effect: item.effect && (item.effect.mood || item.effect.energy || item.effect.social) ? item.effect : template.effect,\r\n      });\r\n    });\r\n  },\r\n'

new_content = content[:blank_line + 4] + enrich + content[blank_line + 4:]
with open(filepath, "wb") as f:
    f.write(new_content)
print("Done - enrichBagItems inserted")
