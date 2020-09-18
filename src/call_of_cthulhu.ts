// -------------------------
// CoC functions
// -------------------------

interface SkillCheckResults {
    test: {
        roll_text: string;
        roll_value: any;
        passed: boolean;
    } | null,
    attr: {
        name: string;
        current: number;
        max: number;
        value: number;
    }
    change: {
        roll_text: string;
        roll_value: number;
    },
    msg: string | null,
}

let SKILL_DEFAULTS: { [key: string]: number } = {
    accounting: 5,
    anthropology: 1,
    appraise: 5,
    archaeology: 1,
    charm: 15,
    climb: 20,
    disguise: 5,
    drive_auto: 20,
    elec_repair: 10,
    electronics: 1,
    engineering: 1,
    fast_talk: 5,
    first_aid: 30,
    history: 5,
    sleight_of_hand: 10,
    ride: 5,
    psychoanalysis: 1,
    persuade: 10,
    psychology: 10,
    op_hv_machine: 1,
    occult: 5,
    navigate: 10,
    natural_world: 10,
    medicine: 1,
    mech_repair: 10,
    locksmith: 1,
    listen: 20,
    library_use: 20,
    law: 5,
    jump: 20,
    intimidate: 15,
    spot_hidden: 25,
    stealth: 20,
    swim: 20,
    throw: 20,
    track: 10,
    fighting_axe: 15,
    fighting_brawl: 25,
    fighting_chainsaw: 10,
    fighting_flail: 10,
    fighting_garrote: 15,
    fighting_spear: 20,
    fighting_sword: 20,
    fighting_whip: 5,
    firearms_bow: 15,
    firearms_handgun: 20,
    firearms_heavy_weapons: 10,
    firearms_flamethrower: 10,
    firearms_machine_gun: 10,
    firearms_rifle: 25,
    firearms_submachine_gun: 15,
}

function skillCheck(value: number, roll: number): boolean {
    if (!roll) {
        roll = randomInteger(100);
    }
    return roll <= value;
}

function sendSkillMessage(msg: string) {
    send_chat('Skill Doctor', msg);
}

function getMaxHp(character_id: string): number {
    let raw_hp = (getAttributeInt(character_id, 'con') + getAttributeInt(character_id, 'siz'));
    let pulp_hp = getAttributeInt(character_id, 'pulp_hp');
    return Math.floor(raw_hp / (pulp_hp === -1 ? 10 : pulp_hp));
}

function getMaxMp(character_id: string): number {
    return Math.floor(getAttributeInt(character_id, 'pow') / 5);
}

function getDefaultValue(skillName: string, character_id: string = ''): number {
    if (skillName === 'dodge') {
        return Math.floor(getAttributeInt(character_id, 'dex') / 2);
    }

    if (skillName === 'language_own') {
        return getAttributeInt(character_id, 'edu');
    }

    if (SKILL_DEFAULTS[skillName] === undefined) {
        log(`Cannot determine default skill level for ${skillName}`)
        return -1;
    }

    return SKILL_DEFAULTS[skillName];
}

function validateCharacter(character: Character) {
    const character_id = character.id;
    log(`Validating character ${character.get('name')}`)
    // Fill in missing base chars
    const base_attr = ['str', 'con', 'dex', 'app', 'pow'];
    base_attr.forEach(value => {
        const attr = getAttribute(character_id, value);
        if (attr === undefined) {
            const n = (randomInteger(6) + randomInteger(6) + randomInteger(6)) * 5;
            createAttribute(character_id, value, n.toString());
        }
    });
    const othr_attr = ['siz', 'int', 'edu'];
    othr_attr.forEach(value => {
        const attr = getAttribute(character_id, value);
        if (attr === undefined) {
            const n = (randomInteger(6) + randomInteger(6) + 6) * 5;
            createAttribute(character_id, value, n.toString());
        }
    });

    let san = getAttribute(character_id, 'san');
    if (san === undefined) {
        let pow = getAttributeInt(character_id, 'pow');
        san = createAttribute(character_id, 'san', pow.toString());
    }

    let cur_san = parseInt(san.get('current'));
    let san_start = getAttribute(character_id, 'san_start');
    if (!san_start) {
        createAttribute(character_id, 'san_start', cur_san.toString());
    }

    let mythos = getAttribute(character_id, 'cthulhu_mythos');
    if (!mythos) {
        createAttribute(character_id, 'cthulhu_mythos', '0', (99 - cur_san).toString());
    }

    let hp = getAttribute(character_id, 'hp');
    if (!hp) {
        let max = getMaxHp(character_id);
        createAttribute(character_id, 'hp', max.toString(), max.toString());
    }

    let mp = getAttribute(character_id, 'mp');
    if (!mp) {
        let max = getMaxMp(character_id);
        createAttribute(character_id, 'mp', max.toString(), max.toString());
    }

    const luck = getAttribute(character_id, 'luck');
    if (!luck) {
        const n = (randomInteger(6) + randomInteger(6) + randomInteger(6)) * 5;
        createAttribute(character_id, 'luck', n.toString());
    }

    for (let skill in SKILL_DEFAULTS) {
        let attr = getAttribute(character_id, skill);
        let v = getDefaultValue(skill, character_id);
        if (!attr) {
            createAttribute(character_id, skill, v.toString());
        }
    }


}
