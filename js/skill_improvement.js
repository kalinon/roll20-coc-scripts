function improveSkills(playerId, character) {

  let skills = findObjs({
    type: 'attribute',
    characterid: character.id,
  });

  let char_name = character.get("name");
  let tests = [];
  let updates = [];

  _.each(skills, function(obj) {
    let checkedSkill = obj.get("name");
    if (checkedSkill && checkedSkill.indexOf("_checkbox") !== -1) {
      let skill = checkedSkill.substring(0, checkedSkill.indexOf("_checkbox"));
      log("Found checked skill: " + skill + " for " + character.get("name"));

      let results = improveSkill(character, skill);
      if (results.length > 0) {
        updateAttributeSilent(character, obj, "off");
      }

      tests.push(results[1]);
      if (results[2] != null) {
        updates.push(results[2]);
      }
    }
  });

  sendResults("Level Up", char_name, tests, updates);
}

function improveSkill(character, skillName) {
  let skill = findObjs({
    type: 'attribute',
    characterid: character.id,
    name: skillName
  }, {
    caseInsensitive: true
  })[0];

  if (!skill) {
    log("Unable to find skill " + skillName + " for " + character.get("name"));
    return false;
  }

  let current = parseInt(skill.get('current'));
  let roll = randomInteger(100);
  let passed = skillCheck(current, roll);
  let testMsg = skillImproveTestMsg(skillName, current, roll);

  // fail or > 95
  // Add 1D10
  if (!passed || roll > 95) {
    let n = randomInteger(10);
    let total = n + current;
    let updateMsg = updateAttribute(character, skill, total);

    if (current < 90 && total >= 90) {
      updateMsg + " (Skill over 90 gain 2d6 SAN)";
      // TODO: Add 2d6 SAN
    }

    return [passed, testMsg, updateMsg]
  } else {
    // sendChat("Skill Doctor", character.get("name") + " has a " + skillName + " skill of " + current +
    //   " and rolled a " + roll + ". Sorry, no skill improvement.");
  }

  return [passed, testMsg, null];
}