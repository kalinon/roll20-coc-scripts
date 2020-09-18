class NewDay {
    public max_luck = 99;
    private readonly char_name: string;
    private default_mythos = 0;
    private san_max = 99;

    constructor(protected player_id: string, private character: Character) {
        this.char_name = this.character.get('name');
    }

    public run(): void {
        this.updateSan();
        this.dailyHeal();
    }

    private dailyHeal() {
        let hp = getAttribute(this.character.id, 'hp');
        let current_hp = parseInt(hp.get('current'));
        let new_hp = current_hp + 2;
        let max = (getAttributeInt(this.character.id, 'con') + getAttributeInt(this.character.id, 'siz')) / 5;

        if (current_hp < max && new_hp <= max) {
            hp.set('current', new_hp.toString());
            sendChat('Lord Cthulhu', `Healing this pitiful mortal. ${str_bold(this.char_name)}'s HP is now ${str_code(new_hp.toString())}`)
        } else if (current_hp < max && new_hp > max) {
            hp.set('current', max.toString());
            sendChat('Lord Cthulhu', `Healing this pitiful mortal. ${str_bold(this.char_name)}'s HP is now ${str_code(max.toString())}`)
        } else {
            sendChat('Lord Cthulhu', `${str_bold(this.char_name)}'s HP is already at max... ` + str_bold('for now.'))
        }
    }

    private updateSan() {
        log(`Setting daily sanity for ${this.char_name}`);

        let san = getAttribute(this.character.id, 'san');
        let san_start = getAttribute(this.character.id, 'san_start');
        let mythos = getAttribute(this.character.id, 'cthulhu_mythos');
        if (!mythos) {
            mythos = createAttribute(this.character.id, 'cthulhu_mythos',
                this.default_mythos.toString(), this.san_max.toString());
        }

        let current_san = san.get('current');
        san_start.set('current', current_san);

        sendChat('Lord Cthulhu', `Setting starting sanity to ${str_code(current_san)} for ${str_bold(this.char_name)}`)
    }
}
