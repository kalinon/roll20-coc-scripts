function skillCheck(value, roll) {
  if (!roll) {
    roll = randomInteger(100);
  }

  return roll <= value;
}

function sendSkillMessage(msg) {
  sendChat("Skill Doctor", msg);
}

// -------------------------
// Formatting functions
// -------------------------

function str_bold(value) {
  return "<b>" + value + "</b>"
}

function str_code(value) {
  return "<code>" + value + "</code>"
}

function str_color(value, color, bold) {
  // #ff4845
  if (bold) {
    return "<span style='color: " + color + "'>" + str_bold(value) + "</span>"
  }
  return "<span style='color: " + color + "'>" + value + "</span>"
}

function str_color_passed(value) {
  return str_color(value, "#43a52d", true)
}

function str_color_failed(value) {
  return str_color(value, "#d73131", true)
}

function str_newline() {
  return "</br>"
}

function str_list_item(value) {
  return "<li>" + value + "</li>"
}

// -------------------------
// Attribute functions
// -------------------------

function getCharacterAttr(character_id, attr) {
  log("Looking up " + attr + " for char id: " + character_id);

  var obj = findObjs({
    type: 'attribute',
    characterid: character_id,
    name: attr
  }, {
    caseInsensitive: true
  })[0];

  if (obj) {
    return obj.get('current')
  }

  return null;
}

function updateAttribute(character, attribute, new_val, silent, mod_text) {
  let msg = getUpdateAttrMessage(attribute, new_val, silent, mod_text);
  log(character.get("name") + " - " + msg);
  attribute.set("current", new_val);
  return msg
}

function updateAttributeSilent(character, attribute, new_val) {
  updateAttribute(character, attribute, new_val, true)
}


// -------------------------
// Messages update
// -------------------------

function getUpdateAttrMessage(attribute, new_val, silent, mod_text) {
  let attr_name = attribute.get("name");
  let curr_val = parseInt(attribute.get("current"));
  let diff = new_val - curr_val;
  let change_sym = diff >= 0 ? "+" : "-";
  if (mod_text != "") {
    mod_text = " (" + mod_text + ") ";
  }

  if (silent) {
    return attr_name + " " +
      (change_sym + String(diff)) +
      " : " + curr_val + " -> " + new_val;
  } else {
    return str_bold(attr_name) + " " +
      str_color(change_sym + String(diff), (diff >= 0 ? "#43a52d" : "#d73131"), true) +
      mod_text + " : " + str_code(curr_val + " -> " + new_val);
  }
}

function skillImproveTestMsg(attr_name, current, roll) {
  let passed = skillCheck(current, roll);
  return "Tested skill: " + str_bold(attr_name) + " " +
    str_bold("Rolled") + ": " + roll + " against " + current + ". " +
    str_bold("Result") + ": " + (passed ? str_color_passed("Passed!") : str_color_failed("Failed!"))
}

function sendResults(action, charName, testResults, updateResults) {
  let message = "<p>" + str_bold(charName + " - Results for " + action) + "</p>" + str_newline();
  message += createList("Skill tests", testResults);
  message += createList("Skill changes", updateResults);
  log(message);
  sendSkillMessage(message);
}

function createList(title, items) {
  let message = "";
  if (items.length > 0) {
    message += title + ": " + str_newline() + "<ul>";
    items.forEach(value => {
      if (value !== undefined && value != null) {
        message += str_list_item(value)
      }
    });
    message += "</ul>";
  }
  return message;
}