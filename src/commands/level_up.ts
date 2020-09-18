class LevelUp {
    private readonly char_name: string;
    private skills: Attribute[];

    constructor(protected player_id: string, private character: Character) {
        this.char_name = this.character.get('name');

        this.skills = <Attribute[]>findObjs({
            type: 'attribute',
            characterid: character.id,
        });
    }

    public run(): void {
        // let tests = [];
        // let updates = [];

        this.skills.forEach(obj => {
            let checkedSkill = obj.get('name');
            if (checkedSkill && checkedSkill.indexOf('_checkbox') !== -1) {
                let skill = checkedSkill.substring(0, checkedSkill.indexOf('_checkbox'));
                log('Found checked skill: ' + skill + ' for ' + this.char_name);
            }
        });
    }
}
