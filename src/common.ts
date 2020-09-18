/// <reference path="..\roll20.d.ts" />


interface SkillCheckResults {
    test: {
        roll_text: string;
        roll_value: any;
        passed: boolean;
    }
    attr: {
        name: string;
        current: number;
        max: number;
        value: number;
    }
    change: {
        roll_text: string;
        roll_value: number;
    }
}


function skillCheck(value: number, roll: number): boolean {
    if (!roll) {
        roll = randomInteger(100);
    }
    return roll <= value;
}

function sendSkillMessage(msg: string) {
    sendChat('Skill Doctor', msg);
}

function createAttribute(char_id: string, name: string, current: string, max?: string): Attribute {
    log(`Creating default cthulhu_mythos attribute for ${char_id}`)
    createObj('attribute', {
        _characterid: char_id,
        name: name,
        current: current,
        max: max,
    });
    return getAttribute(char_id, name);
}

// -------------------------
// Formatting functions
// -------------------------

function str_bold(value: string): string {
    return '<b>' + value + '</b>'
}

function str_code(value: string): string {
    return '<code>' + value + '</code>'
}

function str_color(value: string, color: string, bold: boolean): string {
    // #ff4845
    if (bold) {
        return '<span style=\'color: ' + color + '\'>' + str_bold(value) + '</span>'
    }
    return '<span style=\'color: ' + color + '\'>' + value + '</span>'
}

function str_color_passed(value: string): string {
    return str_color(value, '#43a52d', true)
}

function str_color_failed(value: string): string {
    return str_color(value, '#d73131', true)
}

function str_newline(): string {
    return '</br>'
}

function str_list_item(value: string): string {
    return '<li>' + value + '</li>'
}

// -------------------------
// Messages update
// -------------------------

function getUpdateAttrMessage(result: SkillCheckResults, silent: boolean = false) {
    let attr_name = result.attr.name;
    let curr_val = result.attr.current;
    let diff = result.change.roll_value;

    let change_sym = diff >= 0 ? '+' : '-';
    let mod_text = '';
    if (result.change.roll_text != '') {
        mod_text = ' (' + result.change.roll_text + ') ';
    }

    if (silent) {
        return attr_name + ' ' +
            (change_sym + String(diff)) +
            ' : ' + curr_val + ' -> ' + result.attr.value;
    } else {
        return str_bold(attr_name) + ' ' +
            str_color(change_sym + String(diff), (diff >= 0 ? '#43a52d' : '#d73131'), true) +
            mod_text + ' : ' + str_code(curr_val + ' -> ' + result.attr.value);
    }
}

function skillImproveTestMsg(attr_name: string, current: number, roll: number): string {
    let passed = skillCheck(current, roll);
    return 'Tested skill: ' + str_bold(attr_name) + ' ' +
        str_bold('Rolled') + ': ' + roll + ' against ' + current + '. ' +
        str_bold('Result') + ': ' + (passed ? str_color_passed('Passed!') : str_color_failed('Failed!'))
}

function sendResults(action: string, charName: string, testResults: string[], updateResults: string[]) {
    let message = '<p>' + str_bold(charName + ' - Results for ' + action) + '</p>' + str_newline();
    message += createList('Skill tests', testResults);
    message += createList('Skill changes', updateResults);
    log(message);
    sendSkillMessage(message);
}

function createList(title: string, items: string[]): string {
    let message = '';
    if (items.length > 0) {
        message += title + ': ' + str_newline() + '<ul>';
        items.forEach(value => {
            if (value !== undefined && value != null) {
                message += str_list_item(value)
            }
        });
        message += '</ul>';
    }
    return message;
}

function getAttribute(character_id: string, name: string): Attribute {
    return <Attribute>findObjs({
        type: 'attribute',
        characterid: character_id,
        name: name
    }, {
        caseInsensitive: true
    })[0];
}

function getAttributeInt(character_id: string, name: string): number {
    return parseInt(getAttribute(character_id, name).get('current'));
}

