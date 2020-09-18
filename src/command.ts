class Command {
    private readonly player_id: string;

    constructor(private msg: ChatEventData) {
        this.player_id = msg.playerid;
        log(`Command: ${msg.content}`)
    }

    private characters(): Character[] {
        const characters: Character[] = [];
        const results = findObjs({
            _type: 'character',
        });

        results.forEach(value => {
            const char = (<Character>value);
            if (!char.get('archived') && char.get('controlledby') === this.player_id) {
                log('Name: ' + char.get('name') + ' Controlled by: ' + char.get('controlledby') +
                    ' Request by: ' + this.player_id + ' archived:  ' + char.get('archived'));
                characters.push(char);
            }
        });

        return characters;
    }

    public help() {
        let list = createList('Available commands', [
                '[' + str_code('!luckplz  ') + '](!luckplz) - Refresh your luck',
                '[' + str_code('!levelup  ') + '](!levelup) - Perform a level up!',
                '[' + str_code('!newday   ') + '](!newday) - Update your daily sanity value',
                '[' + str_code('!validate ') + '](!validate) - Validate/fix characters',
            ]
        );

        // @ts-ignore
        send_chat('Skill Doctor', list, null, {
            noarchive: true,
        });
    }

    public process(): void {
        if (this.msg.content === '!help') {
            this.help();
        } else if (this.msg.content === '!luckplz') {
            this.characters().forEach(char => {
                let job = new LuckRefresh(this.player_id, char);
                job.run();
            });
        } else if (this.msg.content === '!levelup') {
            this.characters().forEach(char => {
                let job = new LevelUp(this.player_id, char);
                job.run();
            });
        } else if (this.msg.content === '!newday') {
            this.characters().forEach(char => {
                let job = new NewDay(this.player_id, char);
                job.run();
            });
        } else if (this.msg.content === '!validate') {
            this.characters().forEach(char => {
                validateCharacter(char);
            });
        }

    }
}
