class LuckRefresh {

    public max_luck = 99;

    get char_name(): string {
        return this.character.get('name');
    }

    constructor(protected player_id: string, private character: Character) {
    }

    public run(): void {
        log(`Refreshing luck for ${this.char_name}`);
        const attr = this.getLuck();
        const result = this.improveLuck(attr);
        if (result.test !== null) {
            log(`${this.char_name} rolled: ${result.test.roll_value} current: ${result.attr.current} `
                + `passed: ${result.test.passed} gained: ${result.change.roll_value} total: ${result.attr.value}`);

            const testMsg = skillImproveTestMsg(result.attr.name, result.attr.current, result.test.roll_value)
            const updateMsg = getUpdateAttrMessage(result);
            log(`${this.char_name} - ${updateMsg}`);

            attr.set('current', result.attr.value.toString());
            attr.set('max', result.attr.max.toString());
            sendResults('Luck Refresh', this.char_name, [testMsg], [updateMsg])
        }
    }

    private getLuck(): Attribute {
        return getAttribute(this.character.id, 'luck');
    }

    private improveLuck(attr: Attribute): SkillCheckResults {
        const luck = attr.get('current');
        let current = parseInt(luck);

        let skill_roll = randomInteger(100);
        let passed = skillCheck(current, skill_roll);

        log(`${this.char_name} rolled: ${skill_roll} current: ${current} passed: ${passed}`);

        const improvement = LuckRefresh.improvement_roll(passed);

        let total = improvement.roll_value + current;
        if (total > this.max_luck) {
            total = this.max_luck;
        }

        return {
            attr: {
                name: 'luck',
                current,
                max: this.max_luck,
                value: total,
            },
            test: {
                roll_text: '1D100',
                roll_value: skill_roll,
                passed,
            },
            change: improvement,
            msg: null,
        };
    }

    private static improvement_roll(passed: boolean): { roll_text: string; roll_value: number } {
        let n = 0;
        let mod_text = '';

        if (!passed) {
            // Add 2D10+10
            n = randomInteger(20) + 10;
            mod_text = '2D10+10'
        } else {
            // Add 1D10+5
            n = randomInteger(10) + 5;
            mod_text = '1D10+5'
        }

        return {
            roll_text: mod_text,
            roll_value: n,
        }
    }
}
