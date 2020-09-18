function processMessage(msg) {
  var playerId = msg.playerid;
  var characters = findObjs({
    _type: "character",
  });

  _.each(characters, function (obj) {
    if (!obj.get("archived") && obj.get("controlledby") === playerId) {
      log("Name: " + obj.get("name") + " Controlled by: " + obj.get("controlledby") +
        " Request by: " + playerId + " archived:  " + obj.get("archived"));
      if (getCharacterAttr(obj.id, "active")) {

        // Process commands for active character
        if (msg.content === "!levelup") {
          improveSkills(playerId, obj);
        } else if (msg.content === "!luckplz") {
          refreshLuck(playerId, obj);
        }

      }
    }
  });
}

on("chat:message", function (msg) {
  if (msg.type === "api" && msg.content.startsWith("!")) {
    if (msg.content === "!help") {
      let list = createList("Available commands", [
          str_code("!luckplz") + " - Refresh your luck",
          str_code("!levelup") + " - Perform a level up!"
        ]
      );

      sendChat("Skill Doctor", list,
        null, {
          noarchive: true
        });
      return;
    } else {
      processMessage(msg);
    }
  }
});
