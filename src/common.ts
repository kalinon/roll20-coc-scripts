const ICONS = {
    cthulhu: 'https://banner2.cleanpng.com/20180614/pwg/kisspng-the-call-of-cthulhu-cthulhu-mythos-miskatonic-univ-5b22d951ef43c5.09088352152901051398.jpg',
    elder: 'https://lh3.googleusercontent.com/proxy/DbU9DnMYkuNJaDvSsh2xGD7cdITNqF9m7LGAGFnRHY7lkLhjSvGXJ0utdFcAIwwPTlSgeF1iSTz9zeiNWJVBPxkJJmdD-M0UmHU1liXWZtROdmwIa1nQpI2_99ZYI-xn6-u7VwTSlNeAN6fw',
}

// -------------------------
// Formatting functions
// -------------------------

function send_chat(speakingAs: string, message: string, callback?: (operations: ChatEventData[]) => void, options?: ChatMessageHandlingOptions): void {
    if (!options) {
        options = {
            noarchive: true,
        }
    }

    sendChat(speakingAs, wrap_text(message), callback, options);
}

function wrap_text(value: string): string {
    return `${HtmlParts.divider}<div style="padding-top: 10px; padding-bottom: 10px;">${value}</div>`;
}

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
        return (result.msg === null ? '' : `${result.msg} - `) + attr_name + ' ' +
            (change_sym + String(diff)) +
            ' : ' + curr_val + ' -> ' + result.attr.value;
    } else {
        return (result.msg === null ? '' : `${result.msg} - `) + str_bold(attr_name) + ' ' +
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

function sendResults(action: string, charName: string, testResults: string[], updateResults: string[], otherMsgs: string[] = []) {
    let message = '<p>' + str_bold(charName + ' - Results for ' + action) + '</p>' + str_newline();
    message += createList('Skill tests', testResults);
    message += createList('Skill changes', updateResults);
    if (otherMsgs.length > 0) {
        message += createList('Other', otherMsgs);
    }
    log(message);
    sendSkillMessage(message);
}

function createList(title: string, items: string[]): string {
    let message = '';
    if (items.length > 0) {
        if (title != '') {
            message += title + ': '
        }
        message += str_newline() + '<ul>';
        items.forEach(value => {
            if (value !== undefined && value != null) {
                message += str_list_item(value)
            }
        });
        message += '</ul>';
    }
    return message;
}


// -------------------------
// Character functions
// -------------------------

function createAttribute(char_id: string, name: string, current: string, max: string = ''): Attribute {
    log(`Creating default ${name} attribute for ${char_id}`)
    createObj('attribute', {
        _characterid: char_id,
        name,
        current,
        max,
    });
    return getAttribute(char_id, name);
}

function getAttribute(character_id: string, name: string): Attribute {
    return <Attribute>findObjs({
        type: 'attribute',
        characterid: character_id,
        name
    }, {
        caseInsensitive: true
    })[0];
}

function getOrCreateAttribute(character_id: string, name: string): Attribute | null {
    // Check to see if it has a current value
    const attr = getAttribute(character_id, name);
    if (attr === undefined) {
        log('Found missing skill: ' + name + ' for ' + character_id + '.');
        let default_val = getDefaultValue(name, character_id);

        if (default_val < 0) {
            return null;
        } else {
            return createAttribute(character_id, name, default_val.toString());
        }
    } else {
        return attr;
    }
}

function getAttributeInt(character_id: string, name: string): number {
    const attr = getAttribute(character_id, name);
    if (attr === undefined) {
        return -1;
    } else {
        let val = getAttribute(character_id, name).get('current');
        if (val === '') {
            return -1;
        }
        return parseInt(val);
    }
}



