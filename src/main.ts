/// <reference path="..\roll20.d.ts" />

on('chat:message', function (msg) {
    // log(msg);
    if (msg.content.startsWith('!') && msg.type == 'api') {
        const cmd = new Command(msg);
        cmd.process();
    }
});

on('ready', function () {
    const results = findObjs({
        _type: 'character',
    });

    results.forEach(value => {
        const char = (<Character>value);
        validateCharacter(char);
    });
});

