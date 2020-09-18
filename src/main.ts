on('chat:message', function (msg) {
    // log(msg);
    if (msg.content.startsWith('!') && msg.type == 'api') {
        const cmd = new Command(msg);
        cmd.process();
    }
});
