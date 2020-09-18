class NewDay {
    public max_luck = 99;
    // public char_name: string;
    // private default_mythos = 0;
    private san_max = 99;
    private messages: string[] = [];

    get char_name(): string {
        return this.character.get('name');
    }

    constructor(protected player_id: string, private character: Character) {
    }

    public run(): void {
        this.updateSan();
        this.dailyHeal();

        let message = str_bold(`<p>${this.char_name} - New Day</p>`) + str_newline() + createList('', this.messages);
        send_chat('Lord Cthulhu', message);
    }

    private dailyHeal() {
        let hp = getAttribute(this.character.id, 'hp');
        if (!hp) {
            validateCharacter(this.character);
            hp = getAttribute(this.character.id, 'hp');
        }

        let current_hp = parseInt(hp.get('current'));
        let new_hp = current_hp + 2;
        let max = getMaxHp(this.character.id);

        log(`${this.char_name} dailyHeal - current: ${current_hp} max: ${max}`)

        if (current_hp > max) {
            hp.set('current', max.toString());
            this.messages.push(`<b>Mortal!</b> You dare break my rules? Setting ${str_bold(this.char_name)}'s health to its maximum: ${str_code(max.toString())}`);
        } else if (current_hp < max && new_hp <= max) {
            hp.set('current', new_hp.toString());
            this.messages.push(`Healing this pitiful mortal. ${str_bold(this.char_name)}'s HP is now ${str_code(new_hp.toString())}`)
        } else if (current_hp < max && new_hp > max) {
            hp.set('current', max.toString());
            this.messages.push(`Healing this pitiful mortal. ${str_bold(this.char_name)}'s HP is now ${str_code(max.toString())}`)
        } else if (current_hp === max) {
            this.messages.push(`${str_bold(this.char_name)}'s HP is already at max... ` + str_bold('for now.'))
        } else {
            this.messages.push(`${str_bold(this.char_name)}'s HP is already at max... ` + str_bold('for now.'))
        }
    }

    private updateSan() {
        log(`Setting daily sanity for ${this.char_name}`);

        let san = getAttribute(this.character.id, 'san');
        let san_start = getAttribute(this.character.id, 'san_start');
        let mythos = getAttribute(this.character.id, 'cthulhu_mythos');

        if (!san || !san_start || !mythos) {
            validateCharacter(this.character);
            san = getAttribute(this.character.id, 'san');
            san_start = getAttribute(this.character.id, 'san_start');
            mythos = getAttribute(this.character.id, 'cthulhu_mythos');
        }

        let current_san = san.get('current');
        san_start.set('current', current_san);
        mythos.set('max', (this.san_max - parseInt(current_san)).toString());

        this.messages.push(`Setting starting sanity to ${str_code(current_san)} for ${str_bold(this.char_name)}`)
    }
}
