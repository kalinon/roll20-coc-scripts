class LevelUp {
    private skills: Attribute[];
    private results: SkillCheckResults[] = [];
    private missing: string[] = [];
    private testResults: string[] = []
    private updateResults: string[] = []
    private otherMsgs: string[] = []

    get char_name(): string {
        return this.character.get('name');
    }

    constructor(protected player_id: string, private character: Character) {
        this.skills = <Attribute[]>findObjs({
            type: 'attribute',
            characterid: character.id,
        });
    }

    public run(): void {
        this.skills.forEach(obj => {
            let checkedSkill = obj.get('name');
            if (checkedSkill && checkedSkill.indexOf('_checkbox') !== -1) {
                const skill_name = checkedSkill.substring(0, checkedSkill.indexOf('_checkbox'));
                this.improveSkill(skill_name);
            }
        });

        this.results.forEach(result => {
            if (result.test !== null) {
                log(`${this.char_name} skill check: ${result.attr.name} rolled: ${result.test.roll_value} current: ${result.attr.current} `
                    + `passed: ${result.test.passed} gained: ${result.change.roll_value} total: ${result.attr.value}`);
                this.testResults.push(skillImproveTestMsg(result.attr.name, result.attr.current, result.test.roll_value));
            }

            const updateMsg = getUpdateAttrMessage(result);
            log(`${this.char_name} - ${updateMsg}`);
            this.updateResults.push(updateMsg);
            const attr = getAttribute(this.character.id, result.attr.name);
            attr.set('current', result.attr.value.toString());
            attr.set('max', result.attr.max.toString());
            this.uncheckSkill(result.attr.name);
        });

        if (this.otherMsgs.length > 0) {
            this.otherMsgs.push(`Unable to update the following skills : ${str_color(this.missing.join(', '), 'red', true)}`);
        }
        sendResults('Level Up', this.char_name, this.testResults, this.updateResults, this.otherMsgs);
    }

    private uncheckSkill(skill_name: string) {
        let attr = getAttribute(this.character.id, skill_name + '_checkbox');
        if (attr) {
            attr.set('current', 'off');
        }
    }

    private improveSkill(skill_name: string) {
        const attr = getOrCreateAttribute(this.character.id, skill_name);
        if (attr === null) {
            this.missing.push(skill_name);
            return;
        }

        let current = parseInt(attr.get('current'));
        let skill_roll = randomInteger(100);
        let passed = skillCheck(current, skill_roll);
        log(`${this.char_name} rolled: ${skill_roll} current: ${current} passed: ${passed}`);
        const improvement = LevelUp.improvement_roll(passed, skill_roll);
        let total = improvement.roll_value + current;

        this.results.push({
            attr: {
                name: skill_name,
                current,
                max: 999,
                value: total,
            },
            test: {
                roll_text: '1D100',
                roll_value: skill_roll,
                passed,
            },
            change: improvement,
            msg: null,
        });

        if (current < 90 && total >= 90) {
            // updateMsg + ' ()';
            // TODO: Add 2d6 SAN
            this.sanImprovement(skill_name);
        }

    }

    private sanImprovement(skill_name: string) {
        let n = randomInteger(6) + randomInteger(6);
        let mod_text = '2D6';
        let current = getAttributeInt(this.character.id, 'san');
        let total = n + current;

        this.results.push({
            attr: {
                name: 'san',
                current,
                max: 999,
                value: total,
            },
            test: null,
            change: {
                roll_text: mod_text,
                roll_value: n,
            },
            msg: `Skill ${skill_name} is over 90`
        });
    }

    private static improvement_roll(passed: boolean, roll: number): { roll_text: string; roll_value: number } {
        let n = 0;
        let mod_text = '';

        // fail or > 95
        if (!passed || roll > 95) {
            // Add 1D10
            n = randomInteger(10);
            mod_text = '1D10';
        }

        return {
            roll_text: mod_text,
            roll_value: n,
        }
    }
}
