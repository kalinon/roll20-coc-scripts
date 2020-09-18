function getCharacterLuck(character_id) {

  log("Looking up luck for char id: " + character_id);

  let obj = findObjs({
    type: 'attribute',
    characterid: character_id,
    name: 'luck'
  }, {
    caseInsensitive: true
  })[0];

  if (!obj) {
    obj = createObj('attribute', {
      characterid: character_id,
      name: 'luck',
      current: randomInteger(3 * 6) * 5,
      max: attribute_default_max
    });
  }

  return obj;
}

function refreshLuck(playerId, character) {
  let char_name = character.get("name");
  log("Refreshing luck for " + char_name);
  let luckObj = getCharacterLuck(character.id);
  let current = parseInt(luckObj.get('current'));

  let roll = randomInteger(100);
  let passed = skillCheck(current, roll);

  log(char_name + " rolled: " + roll + " current: " + current + " passed: " + passed);

  let testMsg = skillImproveTestMsg("luck", current, roll);

  let n = 0;
  let mod_text = "";
  if (!passed) {
    // Add 2D10+10
    n = randomInteger(20) + 10;
    mod_text = "2D10+10"

    // sendChat("Skill Doctor", "Adding 2D10+10 (" + n + ") to your luck.");
  } else {
    // Add 1D10+5
    n = randomInteger(10) + 5;
    mod_text = "1D10+5"
    // sendChat("Skill Doctor", "Adding 1D10+5 (" + n + ") to your luck.");
  }

  let total = n + current;
  if (total >= 100) {
    total = 99;
  }

  log(char_name + " rolled: " + roll + " current: " + current +
    " passed: " + passed + " gained: " + n + " total: " + total);

  let updateMsg = updateAttribute(character, luckObj, total, mod_text);

  sendResults("Luck Refresh", char_name, [testMsg], [updateMsg]);
}
