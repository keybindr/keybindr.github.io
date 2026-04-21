// ── WoW key parsing ───────────────────────────────────────────────────────────

const WOW_TO_BROWSER = {
  A:'KeyA', B:'KeyB', C:'KeyC', D:'KeyD', E:'KeyE', F:'KeyF',
  G:'KeyG', H:'KeyH', I:'KeyI', J:'KeyJ', K:'KeyK', L:'KeyL',
  M:'KeyM', N:'KeyN', O:'KeyO', P:'KeyP', Q:'KeyQ', R:'KeyR',
  S:'KeyS', T:'KeyT', U:'KeyU', V:'KeyV', W:'KeyW', X:'KeyX',
  Y:'KeyY', Z:'KeyZ',
  '1':'Digit1','2':'Digit2','3':'Digit3','4':'Digit4','5':'Digit5',
  '6':'Digit6','7':'Digit7','8':'Digit8','9':'Digit9','0':'Digit0',
  '-':'Minus','=':'Equal','[':'BracketLeft',']':'BracketRight',
  '\\':'Backslash',';':'Semicolon',"'":'Quote',',':'Comma','.':'Period',
  '/':'Slash','`':'Backquote',
  SPACE:'Space',TAB:'Tab',ENTER:'Enter',ESCAPE:'Escape',
  BACKSPACE:'Backspace',DELETE:'Delete',INSERT:'Insert',
  HOME:'Home',END:'End',PAGEUP:'PageUp',PAGEDOWN:'PageDown',
  UP:'ArrowUp',DOWN:'ArrowDown',LEFT:'ArrowLeft',RIGHT:'ArrowRight',
  F1:'F1',F2:'F2',F3:'F3',F4:'F4',F5:'F5',F6:'F6',
  F7:'F7',F8:'F8',F9:'F9',F10:'F10',F11:'F11',F12:'F12',
  NUMPAD0:'Numpad0',NUMPAD1:'Numpad1',NUMPAD2:'Numpad2',NUMPAD3:'Numpad3',
  NUMPAD4:'Numpad4',NUMPAD5:'Numpad5',NUMPAD6:'Numpad6',NUMPAD7:'Numpad7',
  NUMPAD8:'Numpad8',NUMPAD9:'Numpad9',
  NUMPADDIVIDE:'NumpadDivide',NUMPADMULTIPLY:'NumpadMultiply',
  NUMPADMINUS:'NumpadSubtract',NUMPADPLUS:'NumpadAdd',
  NUMPADDECIMAL:'NumpadDecimal',NUMPADENTER:'NumpadEnter',
  PRINTSCREEN:'PrintScreen',SCROLLLOCK:'ScrollLock',CAPSLOCK:'CapsLock',
  NUMLOCK:'NumLock',PAUSE:'Pause',
};

const WOW_MOD_MAP = { CTRL:'Ctrl', SHIFT:'Shift', ALT:'Alt' };

function parseWowKey(wowStr) {
  const parts = wowStr.split('-');
  const modifiers = [];
  let i = 0;
  while (i < parts.length - 1) {
    const m = WOW_MOD_MAP[parts[i]];
    if (m) { modifiers.push(m); i++; }
    else break;
  }
  const keyName = parts.slice(i).join('-');
  return { key: WOW_TO_BROWSER[keyName] ?? keyName, modifiers: modifiers.sort() };
}

// ── WoW bindings ──────────────────────────────────────────────────────────────

const WOW_LABELS = {
  MOVEFORWARD:'Move Forward', MOVEBACKWARD:'Move Backward',
  TURNLEFT:'Turn Left', TURNRIGHT:'Turn Right',
  STRAFELEFT:'Strafe Left', STRAFERIGHT:'Strafe Right',
  JUMP:'Jump', TOGGLERUN:'Toggle Run / Walk', SITSTAND:'Sit / Stand',
  ACTIONBUTTON1:'Action Button 1', ACTIONBUTTON2:'Action Button 2',
  ACTIONBUTTON3:'Action Button 3', ACTIONBUTTON4:'Action Button 4',
  ACTIONBUTTON5:'Action Button 5', ACTIONBUTTON6:'Action Button 6',
  ACTIONBUTTON7:'Action Button 7', ACTIONBUTTON8:'Action Button 8',
  ACTIONBUTTON9:'Action Button 9', ACTIONBUTTON10:'Action Button 10',
  ACTIONBUTTON11:'Action Button 11', ACTIONBUTTON12:'Action Button 12',
  MULTIACTIONBAR1BUTTON1:'Multi-Bar 1 · Slot 1',
  MULTIACTIONBAR1BUTTON2:'Multi-Bar 1 · Slot 2',
  MULTIACTIONBAR1BUTTON3:'Multi-Bar 1 · Slot 3',
  MULTIACTIONBAR1BUTTON4:'Multi-Bar 1 · Slot 4',
  MULTIACTIONBAR1BUTTON5:'Multi-Bar 1 · Slot 5',
  MULTIACTIONBAR1BUTTON6:'Multi-Bar 1 · Slot 6',
  MULTIACTIONBAR1BUTTON7:'Multi-Bar 1 · Slot 7',
  MULTIACTIONBAR1BUTTON8:'Multi-Bar 1 · Slot 8',
  MULTIACTIONBAR1BUTTON9:'Multi-Bar 1 · Slot 9',
  MULTIACTIONBAR1BUTTON10:'Multi-Bar 1 · Slot 10',
  MULTIACTIONBAR1BUTTON11:'Multi-Bar 1 · Slot 11',
  MULTIACTIONBAR1BUTTON12:'Multi-Bar 1 · Slot 12',
  TARGETNEARESTENEMY:'Target Nearest Enemy',
  TARGETPREVIOUSENEMY:'Target Previous Enemy',
  TARGETSELF:'Target Self',
  TARGETPARTYMEMBER1:'Target Party Member 1',
  TARGETPARTYMEMBER2:'Target Party Member 2',
  TARGETPARTYMEMBER3:'Target Party Member 3',
  TARGETPARTYMEMBER4:'Target Party Member 4',
  ASSISTTARGET:'Assist Target',
  CHARACTER:'Character Info', SPELLBOOK:'Spellbook & Abilities',
  MAP:'World Map', QUESTLOG:'Quest Log', TALENTS:'Talents',
  SOCIALFRAME:'Social / Friends', TOGGLEBAG:'Open Bag',
  TOGGLEALLBAGS:'Open All Bags', TOGGLEGAMEMENU:'Game Menu',
  OPENCHAT:'Open Chat', TOGGLEUI:'Toggle UI', SCREENSHOT:'Screenshot',
};

const WOW_DEFAULTS = [
  ['MOVEFORWARD','W'],['MOVEBACKWARD','S'],['TURNLEFT','A'],['TURNRIGHT','D'],
  ['STRAFELEFT','Q'],['STRAFERIGHT','E'],['JUMP','SPACE'],['TOGGLERUN','NUMLOCK'],
  ['SITSTAND','X'],
  ['ACTIONBUTTON1','1'],['ACTIONBUTTON2','2'],['ACTIONBUTTON3','3'],
  ['ACTIONBUTTON4','4'],['ACTIONBUTTON5','5'],['ACTIONBUTTON6','6'],
  ['ACTIONBUTTON7','7'],['ACTIONBUTTON8','8'],['ACTIONBUTTON9','9'],
  ['ACTIONBUTTON10','0'],['ACTIONBUTTON11','-'],['ACTIONBUTTON12','='],
  ['MULTIACTIONBAR1BUTTON1','SHIFT-1'],['MULTIACTIONBAR1BUTTON2','SHIFT-2'],
  ['MULTIACTIONBAR1BUTTON3','SHIFT-3'],['MULTIACTIONBAR1BUTTON4','SHIFT-4'],
  ['MULTIACTIONBAR1BUTTON5','SHIFT-5'],['MULTIACTIONBAR1BUTTON6','SHIFT-6'],
  ['MULTIACTIONBAR1BUTTON7','SHIFT-7'],['MULTIACTIONBAR1BUTTON8','SHIFT-8'],
  ['MULTIACTIONBAR1BUTTON9','SHIFT-9'],['MULTIACTIONBAR1BUTTON10','SHIFT-0'],
  ['MULTIACTIONBAR1BUTTON11','SHIFT--'],['MULTIACTIONBAR1BUTTON12','SHIFT-='],
  ['TARGETNEARESTENEMY','TAB'],['TARGETPREVIOUSENEMY','SHIFT-TAB'],
  ['TARGETSELF','F1'],['TARGETPARTYMEMBER1','F2'],['TARGETPARTYMEMBER2','F3'],
  ['TARGETPARTYMEMBER3','F4'],['TARGETPARTYMEMBER4','F5'],['ASSISTTARGET','F'],
  ['CHARACTER','C'],['SPELLBOOK','P'],['MAP','M'],['QUESTLOG','L'],
  ['TALENTS','N'],['SOCIALFRAME','O'],['TOGGLEBAG','B'],['TOGGLEALLBAGS','SHIFT-B'],
  ['TOGGLEGAMEMENU','ESCAPE'],['OPENCHAT','ENTER'],['TOGGLEUI','ALT-Z'],
  ['SCREENSHOT','PRINTSCREEN'],
];

const WOW_BINDINGS = WOW_DEFAULTS.map(([id, key]) => ({
  ...parseWowKey(key), action: `__wow:${id}`,
}));

// ── FFXIV bindings ────────────────────────────────────────────────────────────

const FFXIV_LABELS = {
  // Movement / Controls
  MOVE_FORWARD:'Move Forward', MOVE_BACKWARD:'Move Backward',
  TURN_LEFT:'Turn Left', TURN_RIGHT:'Turn Right',
  STRAFE_LEFT:'Strafe Left', STRAFE_RIGHT:'Strafe Right',
  JUMP:'Jump', AUTORUN:'Autorun',
  TARGET_CYCLE_FORWARD:'Target Nearest Enemy',
  TARGET_CYCLE_BACKWARD:'Target Previous Enemy',
  TARGET_FOCUS:'Focus Target',
  // Hotbar 1
  HOTBAR1_SLOT1:'Hotbar 1 · Slot 1', HOTBAR1_SLOT2:'Hotbar 1 · Slot 2',
  HOTBAR1_SLOT3:'Hotbar 1 · Slot 3', HOTBAR1_SLOT4:'Hotbar 1 · Slot 4',
  HOTBAR1_SLOT5:'Hotbar 1 · Slot 5', HOTBAR1_SLOT6:'Hotbar 1 · Slot 6',
  HOTBAR1_SLOT7:'Hotbar 1 · Slot 7', HOTBAR1_SLOT8:'Hotbar 1 · Slot 8',
  HOTBAR1_SLOT9:'Hotbar 1 · Slot 9', HOTBAR1_SLOT10:'Hotbar 1 · Slot 10',
  HOTBAR1_SLOT11:'Hotbar 1 · Slot 11', HOTBAR1_SLOT12:'Hotbar 1 · Slot 12',
  // Hotbar 2 (Ctrl)
  HOTBAR2_SLOT1:'Hotbar 2 · Slot 1', HOTBAR2_SLOT2:'Hotbar 2 · Slot 2',
  HOTBAR2_SLOT3:'Hotbar 2 · Slot 3', HOTBAR2_SLOT4:'Hotbar 2 · Slot 4',
  HOTBAR2_SLOT5:'Hotbar 2 · Slot 5', HOTBAR2_SLOT6:'Hotbar 2 · Slot 6',
  HOTBAR2_SLOT7:'Hotbar 2 · Slot 7', HOTBAR2_SLOT8:'Hotbar 2 · Slot 8',
  HOTBAR2_SLOT9:'Hotbar 2 · Slot 9', HOTBAR2_SLOT10:'Hotbar 2 · Slot 10',
  HOTBAR2_SLOT11:'Hotbar 2 · Slot 11', HOTBAR2_SLOT12:'Hotbar 2 · Slot 12',
  // Hotbar 3 (Shift)
  HOTBAR3_SLOT1:'Hotbar 3 · Slot 1', HOTBAR3_SLOT2:'Hotbar 3 · Slot 2',
  HOTBAR3_SLOT3:'Hotbar 3 · Slot 3', HOTBAR3_SLOT4:'Hotbar 3 · Slot 4',
  HOTBAR3_SLOT5:'Hotbar 3 · Slot 5', HOTBAR3_SLOT6:'Hotbar 3 · Slot 6',
  HOTBAR3_SLOT7:'Hotbar 3 · Slot 7', HOTBAR3_SLOT8:'Hotbar 3 · Slot 8',
  HOTBAR3_SLOT9:'Hotbar 3 · Slot 9', HOTBAR3_SLOT10:'Hotbar 3 · Slot 10',
  HOTBAR3_SLOT11:'Hotbar 3 · Slot 11', HOTBAR3_SLOT12:'Hotbar 3 · Slot 12',
  // UI
  CHARACTER:'Character', INVENTORY:'Inventory',
  ACTIONS_TRAITS:'Actions & Traits', JOURNAL:'Journal',
  WORLD_MAP:'World Map', SOCIAL:'Social List',
  OPEN_CHAT:'Open Chat', CANCEL:'Cancel / Close',
};

function ffxiv(key, modifiers, id) {
  return { key, modifiers: modifiers.slice().sort(), action: `__ffxiv:${id}` };
}

// ── ESO labels & bindings ────────────────────────────────────────────────────

const ESO_LABELS = {
  MOVE_FORWARD:'Move Forward', MOVE_BACKWARD:'Move Backward',
  TURN_LEFT:'Turn Left', TURN_RIGHT:'Turn Right',
  JUMP:'Jump', SPRINT:'Sprint', SNEAK:'Toggle Sneak',
  DODGE_ROLL:'Dodge Roll',
  ACTIVATE:'Activate / Interact',
  SKILL_1:'Skill Slot 1', SKILL_2:'Skill Slot 2', SKILL_3:'Skill Slot 3',
  SKILL_4:'Skill Slot 4', SKILL_5:'Skill Slot 5',
  ULTIMATE:'Ultimate Ability',
  QUICKSLOT:'Use Quickslot Item',
  TARGET_CYCLE:'Cycle Target',
  INVENTORY:'Inventory', CHARACTER:'Character',
  SKILLS_MENU:'Skills', JOURNAL:'Journal',
  MAP:'Map', GAME_MENU:'Game Menu', OPEN_CHAT:'Open Chat',
};

function eso(key, modifiers, id) {
  return { key, modifiers: modifiers.slice().sort(), action: `__eso:${id}` };
}

const ESO_BINDINGS = [
  // Movement
  eso('KeyW',        [], 'MOVE_FORWARD'),
  eso('KeyS',        [], 'MOVE_BACKWARD'),
  eso('KeyA',        [], 'TURN_LEFT'),
  eso('KeyD',        [], 'TURN_RIGHT'),
  eso('Space',       [], 'JUMP'),
  eso('ShiftLeft',   [], 'SPRINT'),
  eso('ControlLeft', [], 'SNEAK'),
  eso('AltLeft',     [], 'DODGE_ROLL'),
  eso('KeyE',        [], 'ACTIVATE'),
  // Skills
  eso('Digit1', [], 'SKILL_1'),
  eso('Digit2', [], 'SKILL_2'),
  eso('Digit3', [], 'SKILL_3'),
  eso('Digit4', [], 'SKILL_4'),
  eso('Digit5', [], 'SKILL_5'),
  eso('KeyR',   [], 'ULTIMATE'),
  eso('KeyQ',   [], 'QUICKSLOT'),
  // Targeting
  eso('Tab', [], 'TARGET_CYCLE'),
  // UI
  eso('KeyI',    [], 'INVENTORY'),
  eso('KeyC',    [], 'CHARACTER'),
  eso('KeyK',    [], 'SKILLS_MENU'),
  eso('KeyJ',    [], 'JOURNAL'),
  eso('KeyM',    [], 'MAP'),
  eso('Escape',  [], 'GAME_MENU'),
  eso('Enter',   [], 'OPEN_CHAT'),
];

// ── Arma 3 labels & bindings ─────────────────────────────────────────────────

const ARMA_LABELS = {
  // On Foot — Movement
  MOVE_FORWARD:'Move Forward', MOVE_BACKWARD:'Move Backward',
  TURN_LEFT:'Turn Left', TURN_RIGHT:'Turn Right',
  SPRINT:'Sprint', WALK:'Walk (slow)',
  JUMP:'Jump / Climb',
  COMBAT_PACE:'Combat Pace (Stand ↔ Crouch)',
  PRONE:'Toggle Prone',
  LEAN_LEFT:'Lean Left', LEAN_RIGHT:'Lean Right',
  VAULT:'Vault / Step Over',
  // On Foot — Combat
  RELOAD:'Reload', THROW:'Throw Grenade',
  ACTION:'Action Menu',
  ZOOM:'Hold Breath / Zoom',
  BINOCULARS:'Binoculars',
  WEAPON_1:'Primary Weapon', WEAPON_2:'Launcher',
  WEAPON_3:'Pistol / Sidearm', WEAPON_THROW:'Throw Item',
  NIGHT_VISION:'Night Vision',
  FLASHLIGHT:'Toggle Flashlight / Laser',
  // On Foot — UI
  MAP:'Map', SCOREBOARD:'Scoreboard',
  GAME_MENU:'Game Menu', CHAT:'Direct Chat',
  // Vehicle
  VEH_THROTTLE:'Accelerate', VEH_BRAKE:'Brake / Reverse',
  VEH_STEER_LEFT:'Steer Left', VEH_STEER_RIGHT:'Steer Right',
  VEH_HANDBRAKE:'Handbrake',
  VEH_MAP:'Map', VEH_GAME_MENU:'Game Menu',
  // Aircraft
  AC_PITCH_UP:'Pitch Up', AC_PITCH_DOWN:'Pitch Down',
  AC_BANK_LEFT:'Bank Left', AC_BANK_RIGHT:'Bank Right',
  AC_YAW_LEFT:'Rudder Left', AC_YAW_RIGHT:'Rudder Right',
  AC_COLLECTIVE_UP:'Collective Up / Throttle+',
  AC_COLLECTIVE_DOWN:'Collective Down / Throttle−',
  AC_GEAR:'Landing Gear', AC_LIGHTS:'Toggle Lights',
  AC_MAP:'Map', AC_GAME_MENU:'Game Menu',
};

function arma(key, modifiers, id) {
  return { key, modifiers: modifiers.slice().sort(), action: `__arma:${id}` };
}

const ARMA_FOOT_BINDINGS = [
  // Movement
  arma('KeyW',        [], 'MOVE_FORWARD'),
  arma('KeyS',        [], 'MOVE_BACKWARD'),
  arma('KeyA',        [], 'TURN_LEFT'),
  arma('KeyD',        [], 'TURN_RIGHT'),
  arma('ShiftLeft',   [], 'SPRINT'),
  arma('ControlLeft', [], 'WALK'),
  arma('Space',       [], 'JUMP'),
  arma('KeyC',        [], 'COMBAT_PACE'),
  arma('KeyX',        [], 'PRONE'),
  arma('KeyQ',        [], 'LEAN_LEFT'),
  arma('KeyE',        [], 'LEAN_RIGHT'),
  arma('KeyV',        [], 'VAULT'),
  // Combat
  arma('KeyR',        [], 'RELOAD'),
  arma('KeyG',        [], 'THROW'),
  arma('KeyF',        [], 'ACTION'),
  arma('KeyT',        [], 'ZOOM'),
  arma('KeyB',        [], 'BINOCULARS'),
  arma('Digit1',      [], 'WEAPON_1'),
  arma('Digit2',      [], 'WEAPON_2'),
  arma('Digit3',      [], 'WEAPON_3'),
  arma('Digit0',      [], 'WEAPON_THROW'),
  arma('KeyN',        [], 'NIGHT_VISION'),
  arma('KeyL',        [], 'FLASHLIGHT'),
  // UI
  arma('KeyM',        [], 'MAP'),
  arma('Tab',         [], 'SCOREBOARD'),
  arma('Escape',      [], 'GAME_MENU'),
  arma('Enter',       [], 'CHAT'),
];

const ARMA_VEHICLE_BINDINGS = [
  arma('KeyW',   [], 'VEH_THROTTLE'),
  arma('KeyS',   [], 'VEH_BRAKE'),
  arma('KeyA',   [], 'VEH_STEER_LEFT'),
  arma('KeyD',   [], 'VEH_STEER_RIGHT'),
  arma('Space',  [], 'VEH_HANDBRAKE'),
  arma('KeyM',   [], 'VEH_MAP'),
  arma('Escape', [], 'VEH_GAME_MENU'),
];

const ARMA_AIRCRAFT_BINDINGS = [
  arma('KeyW',        [], 'AC_PITCH_UP'),
  arma('KeyS',        [], 'AC_PITCH_DOWN'),
  arma('KeyA',        [], 'AC_BANK_LEFT'),
  arma('KeyD',        [], 'AC_BANK_RIGHT'),
  arma('KeyQ',        [], 'AC_YAW_LEFT'),
  arma('KeyE',        [], 'AC_YAW_RIGHT'),
  arma('ShiftLeft',   [], 'AC_COLLECTIVE_UP'),
  arma('ControlLeft', [], 'AC_COLLECTIVE_DOWN'),
  arma('KeyG',        [], 'AC_GEAR'),
  arma('KeyL',        [], 'AC_LIGHTS'),
  arma('KeyM',        [], 'AC_MAP'),
  arma('Escape',      [], 'AC_GAME_MENU'),
];

// ── GW2 labels & bindings ─────────────────────────────────────────────────────

const GW2_LABELS = {
  MOVE_FORWARD:'Move Forward', MOVE_BACKWARD:'Move Backward',
  TURN_LEFT:'Turn Left', TURN_RIGHT:'Turn Right',
  STRAFE_LEFT:'Strafe Left', STRAFE_RIGHT:'Strafe Right',
  JUMP:'Jump', DODGE:'Dodge',
  SWAP_WEAPONS:'Swap Weapons', INTERACT:'Interact',
  SKILL_1:'Skill 1', SKILL_2:'Skill 2', SKILL_3:'Skill 3',
  SKILL_4:'Skill 4', SKILL_5:'Skill 5',
  HEAL:'Healing Skill',
  UTILITY_1:'Utility Skill 1', UTILITY_2:'Utility Skill 2',
  UTILITY_3:'Utility Skill 3', ELITE:'Elite Skill',
  PROFESSION_1:'Profession Skill 1', PROFESSION_2:'Profession Skill 2',
  PROFESSION_3:'Profession Skill 3', PROFESSION_4:'Profession Skill 4',
  TARGET_NEAREST:'Target Nearest Enemy',
  TARGET_NEXT:'Target Next Enemy', TARGET_PREV:'Target Previous Enemy',
  TARGET_SELF:'Target Self',
  INVENTORY:'Inventory', HERO:'Hero Panel',
  MAP:'Map', GUILD:'Guild Panel',
  CONTACTS:'Contacts & LFG',
  OPEN_CHAT:'Open Chat', CANCEL:'Cancel / Close Menu',
  AUTORUN:'Autorun',
};

function gw2(key, modifiers, id) {
  return { key, modifiers: modifiers.slice().sort(), action: `__gw2:${id}` };
}

const GW2_BINDINGS = [
  // Movement
  gw2('KeyW',      [], 'MOVE_FORWARD'),
  gw2('KeyS',      [], 'MOVE_BACKWARD'),
  gw2('KeyA',      [], 'TURN_LEFT'),
  gw2('KeyD',      [], 'TURN_RIGHT'),
  gw2('KeyQ',      [], 'STRAFE_LEFT'),
  gw2('KeyE',      [], 'STRAFE_RIGHT'),
  gw2('Space',     [], 'JUMP'),
  gw2('KeyV',      [], 'DODGE'),
  gw2('Backquote', [], 'SWAP_WEAPONS'),
  gw2('KeyF',      [], 'INTERACT'),
  // Weapon skills
  gw2('Digit1', [], 'SKILL_1'),
  gw2('Digit2', [], 'SKILL_2'),
  gw2('Digit3', [], 'SKILL_3'),
  gw2('Digit4', [], 'SKILL_4'),
  gw2('Digit5', [], 'SKILL_5'),
  // Heal + utility + elite
  gw2('Digit6', [], 'HEAL'),
  gw2('Digit7', [], 'UTILITY_1'),
  gw2('Digit8', [], 'UTILITY_2'),
  gw2('Digit9', [], 'UTILITY_3'),
  gw2('Digit0', [], 'ELITE'),
  // Profession skills
  gw2('F1', [], 'PROFESSION_1'),
  gw2('F2', [], 'PROFESSION_2'),
  gw2('F3', [], 'PROFESSION_3'),
  gw2('F4', [], 'PROFESSION_4'),
  // Targeting
  gw2('Tab',  [],        'TARGET_NEAREST'),
  gw2('Tab',  ['Shift'], 'TARGET_PREV'),
  gw2('KeyT', [],        'TARGET_NEXT'),
  // UI
  gw2('KeyI',   [], 'INVENTORY'),
  gw2('KeyH',   [], 'HERO'),
  gw2('KeyM',   [], 'MAP'),
  gw2('KeyG',   [], 'GUILD'),
  gw2('KeyY',   [], 'CONTACTS'),
  gw2('Enter',  [], 'OPEN_CHAT'),
  gw2('Escape', [], 'CANCEL'),
];

const HOTBAR_KEYS = ['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6',
                     'Digit7','Digit8','Digit9','Digit0','Minus','Equal'];

const FFXIV_HOTBAR_BINDINGS = [
  ...HOTBAR_KEYS.map((k, i) => ffxiv(k, [],        `HOTBAR1_SLOT${i + 1}`)),
  ...HOTBAR_KEYS.map((k, i) => ffxiv(k, ['Ctrl'],  `HOTBAR2_SLOT${i + 1}`)),
  ...HOTBAR_KEYS.map((k, i) => ffxiv(k, ['Shift'], `HOTBAR3_SLOT${i + 1}`)),
];

const FFXIV_CONTROLS_BINDINGS = [
  ffxiv('KeyW',    [],        'MOVE_FORWARD'),
  ffxiv('KeyS',    [],        'MOVE_BACKWARD'),
  ffxiv('KeyA',    [],        'TURN_LEFT'),
  ffxiv('KeyD',    [],        'TURN_RIGHT'),
  ffxiv('KeyQ',    [],        'STRAFE_LEFT'),
  ffxiv('KeyE',    [],        'STRAFE_RIGHT'),
  ffxiv('Space',   [],        'JUMP'),
  ffxiv('NumLock', [],        'AUTORUN'),
  ffxiv('Tab',     [],        'TARGET_CYCLE_FORWARD'),
  ffxiv('Tab',     ['Shift'], 'TARGET_CYCLE_BACKWARD'),
  ffxiv('KeyF',    [],        'TARGET_FOCUS'),
  ffxiv('KeyC',    [],        'CHARACTER'),
  ffxiv('KeyI',    [],        'INVENTORY'),
  ffxiv('KeyK',    [],        'ACTIONS_TRAITS'),
  ffxiv('KeyJ',    [],        'JOURNAL'),
  ffxiv('KeyM',    [],        'WORLD_MAP'),
  ffxiv('KeyO',    [],        'SOCIAL'),
  ffxiv('Enter',   [],        'OPEN_CHAT'),
  ffxiv('Escape',  [],        'CANCEL'),
];

// ── WoW mouse bindings ────────────────────────────────────────────────────────

const WOW_MOUSE_BINDINGS = [
  { button: 'Mouse1',    modifiers: [],        action: 'Interact / Move',   keyboardKey: '' },
  { button: 'Mouse2',    modifiers: [],        action: 'Turn Camera / Move', keyboardKey: '' },
  { button: 'Mouse1',    modifiers: ['Shift'], action: 'Loot All',           keyboardKey: '' },
  { button: 'Mouse1',    modifiers: ['Ctrl'],  action: 'Split Stack',        keyboardKey: '' },
  { button: 'WheelUp',   modifiers: [],        action: 'Zoom In',            keyboardKey: '' },
  { button: 'WheelDown', modifiers: [],        action: 'Zoom Out',           keyboardKey: '' },
];

// ── FFXIV mouse bindings ──────────────────────────────────────────────────────

const FFXIV_MOUSE_BINDINGS = [
  { button: 'Mouse1',    modifiers: [], action: 'Confirm / Select Target',  keyboardKey: '' },
  { button: 'Mouse2',    modifiers: [], action: 'Cancel / Rotate Camera',   keyboardKey: '' },
  { button: 'WheelUp',   modifiers: [], action: 'Zoom In',                  keyboardKey: '' },
  { button: 'WheelDown', modifiers: [], action: 'Zoom Out',                 keyboardKey: '' },
];

// ── ESO mouse bindings ────────────────────────────────────────────────────────

const ESO_MOUSE_BINDINGS = [
  { button: 'Mouse1',    modifiers: [], action: 'Light Attack / Interact',  keyboardKey: '' },
  { button: 'Mouse2',    modifiers: [], action: 'Block / Rotate Camera',    keyboardKey: '' },
  { button: 'WheelUp',   modifiers: [], action: 'Zoom In',                  keyboardKey: '' },
  { button: 'WheelDown', modifiers: [], action: 'Zoom Out',                 keyboardKey: '' },
];

// ── Arma 3 mouse bindings ─────────────────────────────────────────────────────

const ARMA_FOOT_MOUSE_BINDINGS = [
  { button: 'Mouse1',    modifiers: [], action: 'Fire',              keyboardKey: '' },
  { button: 'Mouse2',    modifiers: [], action: 'Aim Down Sights',   keyboardKey: '' },
  { button: 'Mouse3',    modifiers: [], action: 'Hold Breath / Zoom',keyboardKey: '' },
  { button: 'WheelUp',   modifiers: [], action: 'Zoom In',           keyboardKey: '' },
  { button: 'WheelDown', modifiers: [], action: 'Zoom Out',          keyboardKey: '' },
];

const ARMA_VEHICLE_MOUSE_BINDINGS = [
  { button: 'Mouse1',    modifiers: [], action: 'Fire',     keyboardKey: '' },
  { button: 'Mouse2',    modifiers: [], action: 'Aim',      keyboardKey: '' },
  { button: 'WheelUp',   modifiers: [], action: 'Zoom In',  keyboardKey: '' },
  { button: 'WheelDown', modifiers: [], action: 'Zoom Out', keyboardKey: '' },
];

const ARMA_AIRCRAFT_MOUSE_BINDINGS = [
  { button: 'Mouse1',    modifiers: [], action: 'Fire Weapons', keyboardKey: '' },
  { button: 'Mouse2',    modifiers: [], action: 'Aim',          keyboardKey: '' },
  { button: 'WheelUp',   modifiers: [], action: 'Zoom In',      keyboardKey: '' },
  { button: 'WheelDown', modifiers: [], action: 'Zoom Out',     keyboardKey: '' },
];

// ── GW2 mouse bindings ────────────────────────────────────────────────────────

const GW2_MOUSE_BINDINGS = [
  { button: 'Mouse1',    modifiers: [], action: 'Attack / Interact',        keyboardKey: '' },
  { button: 'Mouse2',    modifiers: [], action: 'Rotate Camera / Move',     keyboardKey: '' },
  { button: 'WheelUp',   modifiers: [], action: 'Zoom In',                  keyboardKey: '' },
  { button: 'WheelDown', modifiers: [], action: 'Zoom Out',                 keyboardKey: '' },
];

// ── Preset key colors ─────────────────────────────────────────────────────────

const C = {
  movement:  '#3a481c',  // dark olive       — yellow-green, unique in the palette
  ability1:  '#564428',  // dark warm brass  — primary hotbar
  ability2:  '#28385a',  // dark indigo      — Shift-row, cooler than modifier blue
  ability3:  '#5a2e28',  // dark wine-red    — Ctrl-row, redder than modifier orange
  targeting: '#42285a',  // deep plum        — new hue, not in modifier palette
  ui:        '#28484e',  // dark steel-teal  — new hue, calm interface tone
};

// Maps raw action ID (after the prefix colon) → color
const WOW_ACTION_COLORS = {
  MOVEFORWARD:C.movement, MOVEBACKWARD:C.movement, TURNLEFT:C.movement,
  TURNRIGHT:C.movement, STRAFELEFT:C.movement, STRAFERIGHT:C.movement,
  JUMP:C.movement, TOGGLERUN:C.movement, SITSTAND:C.movement,
  ACTIONBUTTON1:C.ability1, ACTIONBUTTON2:C.ability1, ACTIONBUTTON3:C.ability1,
  ACTIONBUTTON4:C.ability1, ACTIONBUTTON5:C.ability1, ACTIONBUTTON6:C.ability1,
  ACTIONBUTTON7:C.ability1, ACTIONBUTTON8:C.ability1, ACTIONBUTTON9:C.ability1,
  ACTIONBUTTON10:C.ability1, ACTIONBUTTON11:C.ability1, ACTIONBUTTON12:C.ability1,
  MULTIACTIONBAR1BUTTON1:C.ability2, MULTIACTIONBAR1BUTTON2:C.ability2,
  MULTIACTIONBAR1BUTTON3:C.ability2, MULTIACTIONBAR1BUTTON4:C.ability2,
  MULTIACTIONBAR1BUTTON5:C.ability2, MULTIACTIONBAR1BUTTON6:C.ability2,
  MULTIACTIONBAR1BUTTON7:C.ability2, MULTIACTIONBAR1BUTTON8:C.ability2,
  MULTIACTIONBAR1BUTTON9:C.ability2, MULTIACTIONBAR1BUTTON10:C.ability2,
  MULTIACTIONBAR1BUTTON11:C.ability2, MULTIACTIONBAR1BUTTON12:C.ability2,
  TARGETNEARESTENEMY:C.targeting, TARGETPREVIOUSENEMY:C.targeting,
  TARGETSELF:C.targeting, TARGETPARTYMEMBER1:C.targeting,
  TARGETPARTYMEMBER2:C.targeting, TARGETPARTYMEMBER3:C.targeting,
  TARGETPARTYMEMBER4:C.targeting, ASSISTTARGET:C.targeting,
  CHARACTER:C.ui, SPELLBOOK:C.ui, MAP:C.ui, QUESTLOG:C.ui,
  TALENTS:C.ui, SOCIALFRAME:C.ui, TOGGLEBAG:C.ui, TOGGLEALLBAGS:C.ui,
  TOGGLEGAMEMENU:C.ui, OPENCHAT:C.ui, TOGGLEUI:C.ui, SCREENSHOT:C.ui,
};

const FFXIV_ACTION_COLORS = {
  MOVE_FORWARD:C.movement, MOVE_BACKWARD:C.movement, TURN_LEFT:C.movement,
  TURN_RIGHT:C.movement, STRAFE_LEFT:C.movement, STRAFE_RIGHT:C.movement,
  JUMP:C.movement, AUTORUN:C.movement,
  TARGET_CYCLE_FORWARD:C.targeting, TARGET_CYCLE_BACKWARD:C.targeting,
  TARGET_FOCUS:C.targeting,
  CHARACTER:C.ui, INVENTORY:C.ui, ACTIONS_TRAITS:C.ui, JOURNAL:C.ui,
  WORLD_MAP:C.ui, SOCIAL:C.ui, OPEN_CHAT:C.ui, CANCEL:C.ui,
  HOTBAR1_SLOT1:C.ability1, HOTBAR1_SLOT2:C.ability1, HOTBAR1_SLOT3:C.ability1,
  HOTBAR1_SLOT4:C.ability1, HOTBAR1_SLOT5:C.ability1, HOTBAR1_SLOT6:C.ability1,
  HOTBAR1_SLOT7:C.ability1, HOTBAR1_SLOT8:C.ability1, HOTBAR1_SLOT9:C.ability1,
  HOTBAR1_SLOT10:C.ability1, HOTBAR1_SLOT11:C.ability1, HOTBAR1_SLOT12:C.ability1,
  HOTBAR2_SLOT1:C.ability2, HOTBAR2_SLOT2:C.ability2, HOTBAR2_SLOT3:C.ability2,
  HOTBAR2_SLOT4:C.ability2, HOTBAR2_SLOT5:C.ability2, HOTBAR2_SLOT6:C.ability2,
  HOTBAR2_SLOT7:C.ability2, HOTBAR2_SLOT8:C.ability2, HOTBAR2_SLOT9:C.ability2,
  HOTBAR2_SLOT10:C.ability2, HOTBAR2_SLOT11:C.ability2, HOTBAR2_SLOT12:C.ability2,
  HOTBAR3_SLOT1:C.ability3, HOTBAR3_SLOT2:C.ability3, HOTBAR3_SLOT3:C.ability3,
  HOTBAR3_SLOT4:C.ability3, HOTBAR3_SLOT5:C.ability3, HOTBAR3_SLOT6:C.ability3,
  HOTBAR3_SLOT7:C.ability3, HOTBAR3_SLOT8:C.ability3, HOTBAR3_SLOT9:C.ability3,
  HOTBAR3_SLOT10:C.ability3, HOTBAR3_SLOT11:C.ability3, HOTBAR3_SLOT12:C.ability3,
};

function computeKeyColors(bindings, actionColors) {
  const colors = {};
  for (const b of bindings) {
    if (colors[b.key]) continue;
    const id = b.action?.includes(':') ? b.action.slice(b.action.indexOf(':') + 1) : '';
    const color = actionColors[id];
    if (color) colors[b.key] = color;
  }
  return colors;
}

const ESO_ACTION_COLORS = {
  MOVE_FORWARD:C.movement, MOVE_BACKWARD:C.movement,
  TURN_LEFT:C.movement, TURN_RIGHT:C.movement,
  JUMP:C.movement, SPRINT:C.movement, SNEAK:C.movement,
  DODGE_ROLL:C.movement, ACTIVATE:C.movement,
  SKILL_1:C.ability1, SKILL_2:C.ability1, SKILL_3:C.ability1,
  SKILL_4:C.ability1, SKILL_5:C.ability1,
  ULTIMATE:C.ability3, QUICKSLOT:C.ability2,
  TARGET_CYCLE:C.targeting,
  INVENTORY:C.ui, CHARACTER:C.ui, SKILLS_MENU:C.ui, JOURNAL:C.ui,
  MAP:C.ui, GAME_MENU:C.ui, OPEN_CHAT:C.ui,
};

const GW2_ACTION_COLORS = {
  MOVE_FORWARD:C.movement, MOVE_BACKWARD:C.movement, TURN_LEFT:C.movement,
  TURN_RIGHT:C.movement, STRAFE_LEFT:C.movement, STRAFE_RIGHT:C.movement,
  JUMP:C.movement, DODGE:C.movement, SWAP_WEAPONS:C.movement, INTERACT:C.movement,
  SKILL_1:C.ability1, SKILL_2:C.ability1, SKILL_3:C.ability1,
  SKILL_4:C.ability1, SKILL_5:C.ability1,
  HEAL:C.ability3, UTILITY_1:C.ability3, UTILITY_2:C.ability3,
  UTILITY_3:C.ability3, ELITE:C.ability3,
  PROFESSION_1:C.ability2, PROFESSION_2:C.ability2,
  PROFESSION_3:C.ability2, PROFESSION_4:C.ability2,
  TARGET_NEAREST:C.targeting, TARGET_NEXT:C.targeting, TARGET_PREV:C.targeting,
  INVENTORY:C.ui, HERO:C.ui, MAP:C.ui, GUILD:C.ui,
  CONTACTS:C.ui, OPEN_CHAT:C.ui, CANCEL:C.ui,
};

const ARMA_ACTION_COLORS = {
  // On Foot — movement
  MOVE_FORWARD:C.movement, MOVE_BACKWARD:C.movement,
  TURN_LEFT:C.movement, TURN_RIGHT:C.movement,
  SPRINT:C.movement, WALK:C.movement, JUMP:C.movement,
  COMBAT_PACE:C.movement, PRONE:C.movement,
  LEAN_LEFT:C.movement, LEAN_RIGHT:C.movement, VAULT:C.movement,
  // On Foot — combat
  RELOAD:C.ability1, THROW:C.ability3, ACTION:C.ability1,
  ZOOM:C.ability1, BINOCULARS:C.ability2,
  WEAPON_1:C.ability1, WEAPON_2:C.ability1, WEAPON_3:C.ability1,
  WEAPON_THROW:C.ability3,
  NIGHT_VISION:C.ability2, FLASHLIGHT:C.ability2,
  // On Foot — UI
  MAP:C.ui, SCOREBOARD:C.ui, GAME_MENU:C.ui, CHAT:C.ui,
  // Vehicle
  VEH_THROTTLE:C.movement, VEH_BRAKE:C.movement,
  VEH_STEER_LEFT:C.movement, VEH_STEER_RIGHT:C.movement,
  VEH_HANDBRAKE:C.ability3,
  VEH_MAP:C.ui, VEH_GAME_MENU:C.ui,
  // Aircraft
  AC_PITCH_UP:C.movement, AC_PITCH_DOWN:C.movement,
  AC_BANK_LEFT:C.movement, AC_BANK_RIGHT:C.movement,
  AC_YAW_LEFT:C.movement, AC_YAW_RIGHT:C.movement,
  AC_COLLECTIVE_UP:C.ability3, AC_COLLECTIVE_DOWN:C.ability3,
  AC_GEAR:C.ability2, AC_LIGHTS:C.ability2,
  AC_MAP:C.ui, AC_GAME_MENU:C.ui,
};

// ── Elite Dangerous ───────────────────────────────────────────────────────────

const ED_SHIP_BINDINGS = [
  { key: 'KeyW', modifiers: [], action: 'Thrust Forward' },
  { key: 'KeyS', modifiers: [], action: 'Thrust Backward' },
  { key: 'KeyA', modifiers: [], action: 'Yaw Left' },
  { key: 'KeyD', modifiers: [], action: 'Yaw Right' },
  { key: 'KeyQ', modifiers: [], action: 'Roll Left' },
  { key: 'KeyE', modifiers: [], action: 'Roll Right' },
  { key: 'KeyW', modifiers: ['Shift'], action: 'Thrust Up' },
  { key: 'KeyS', modifiers: ['Shift'], action: 'Thrust Down' },
  { key: 'KeyA', modifiers: ['Shift'], action: 'Strafe Left' },
  { key: 'KeyD', modifiers: ['Shift'], action: 'Strafe Right' },
  { key: 'Space', modifiers: [], action: 'Boost' },
  { key: 'KeyR', modifiers: [], action: 'Deploy Hardpoints' },
  { key: 'KeyG', modifiers: [], action: 'Landing Gear' },
  { key: 'KeyL', modifiers: [], action: 'External Lights' },
  { key: 'KeyN', modifiers: [], action: 'Night Vision' },
  { key: 'Tab', modifiers: [], action: 'Enable FSD' },
  { key: 'Tab', modifiers: ['Shift'], action: 'Supercruise' },
  { key: 'KeyJ', modifiers: [], action: 'Hyperspace Jump' },
  { key: 'Backspace', modifiers: [], action: 'Cargo Scoop' },
  { key: 'Delete', modifiers: [], action: 'Silent Running' },
  { key: 'F1', modifiers: [], action: 'Focus Radar' },
  { key: 'F2', modifiers: [], action: 'Focus Comms' },
  { key: 'F3', modifiers: [], action: 'Role Panel' },
  { key: 'F4', modifiers: [], action: 'Codex' },
  { key: 'Numpad5', modifiers: [], action: 'Center View' },
  { key: 'Numpad8', modifiers: [], action: 'View Up' },
  { key: 'Numpad2', modifiers: [], action: 'View Down' },
  { key: 'KeyU', modifiers: [], action: 'Target Ahead' },
  { key: 'KeyT', modifiers: [], action: 'Select Target' },
  { key: 'Escape', modifiers: [], action: 'Open Menu' },
];

const ED_SHIP_HOTAS = [
  { input: 'Joystick_Button1', action: 'Primary Fire' },
  { input: 'Joystick_Button2', action: 'Secondary Fire' },
  { input: 'Joystick_Button3', action: 'Boost' },
  { input: 'Joystick_Button4', action: 'Deploy Hardpoints' },
  { input: 'Joystick_Button5', action: 'Landing Gear' },
  { input: 'Joystick_Button6', action: 'External Lights' },
  { input: 'Joystick_Button7', action: 'Silent Running' },
  { input: 'Joystick_Button8', action: 'Cargo Scoop' },
  { input: 'Joystick_Hat1_Up',        action: 'Target Ahead' },
  { input: 'Joystick_Hat1_Down',       action: 'Next Hostile Target' },
  { input: 'Joystick_Hat1_Left',       action: 'Previous Target' },
  { input: 'Joystick_Hat1_Right',      action: 'Select Highest Threat' },
  { input: 'Joystick_Hat1_UpRight',    action: 'Next Subsystem' },
  { input: 'Joystick_Hat1_UpLeft',     action: 'Previous Subsystem' },
  { input: 'Joystick_Hat2_Up',         action: 'Power to Engines' },
  { input: 'Joystick_Hat2_Down',       action: 'Power to Weapons' },
  { input: 'Joystick_Hat2_Left',       action: 'Power to Systems' },
  { input: 'Joystick_Hat2_Right',      action: 'Balance Power' },
  { input: 'Throttle_Button1', action: 'Enable FSD' },
  { input: 'Throttle_Button2', action: 'Supercruise' },
  { input: 'Throttle_Button3', action: 'Hyperspace Jump' },
  { input: 'Throttle_Button4', action: 'Galaxy Map' },
  { input: 'Throttle_Button5', action: 'System Map' },
  { input: 'Throttle_Button6', action: 'Focus Comms' },
  { input: 'Throttle_Button7', action: 'Role Panel' },
  { input: 'Throttle_Hat1_Up',    action: 'Next Fire Group' },
  { input: 'Throttle_Hat1_Down',  action: 'Previous Fire Group' },
  { input: 'Throttle_Hat1_Left',  action: 'Select Wingman Target' },
  { input: 'Throttle_Hat1_Right', action: 'Wingman Nav Lock' },
  { input: 'Throttle_Switch1_On',  action: 'Hardpoints Deployed' },
  { input: 'Throttle_Switch1_Off', action: 'Hardpoints Retracted' },
  { input: 'Throttle_Rotary1_CW',  action: 'Next Subsystem Target' },
  { input: 'Throttle_Rotary1_CCW', action: 'Previous Subsystem Target' },
];

const ED_FOOT_BINDINGS = [
  { key: 'KeyW', modifiers: [], action: 'Walk Forward' },
  { key: 'KeyS', modifiers: [], action: 'Walk Backward' },
  { key: 'KeyA', modifiers: [], action: 'Strafe Left' },
  { key: 'KeyD', modifiers: [], action: 'Strafe Right' },
  { key: 'ShiftLeft', modifiers: [], action: 'Sprint' },
  { key: 'ControlLeft', modifiers: [], action: 'Crouch / Prone' },
  { key: 'Space', modifiers: [], action: 'Jump' },
  { key: 'KeyF', modifiers: [], action: 'Interact' },
  { key: 'KeyR', modifiers: [], action: 'Reload' },
  { key: 'KeyG', modifiers: [], action: 'Throw Grenade' },
  { key: 'KeyT', modifiers: [], action: 'Backpack' },
  { key: 'KeyX', modifiers: [], action: 'Holster Weapon' },
  { key: 'Tab', modifiers: [], action: 'Enter / Exit Ship' },
  { key: 'Escape', modifiers: [], action: 'Open Menu' },
];

const ED_FOOT_MOUSE = [
  { button: 'Mouse1', modifiers: [], action: 'Primary Fire', keyboardKey: '' },
  { button: 'Mouse2', modifiers: [], action: 'Aim Down Sights', keyboardKey: '' },
  { button: 'Mouse3', modifiers: [], action: 'Melee', keyboardKey: '' },
  { button: 'WheelUp', modifiers: [], action: 'Zoom In', keyboardKey: '' },
  { button: 'WheelDown', modifiers: [], action: 'Zoom Out', keyboardKey: '' },
];

const ED_SRV_BINDINGS = [
  { key: 'KeyW', modifiers: [], action: 'Drive Forward' },
  { key: 'KeyS', modifiers: [], action: 'Drive Backward' },
  { key: 'KeyA', modifiers: [], action: 'Steer Left' },
  { key: 'KeyD', modifiers: [], action: 'Steer Right' },
  { key: 'Space', modifiers: [], action: 'Handbrake' },
  { key: 'ShiftLeft', modifiers: [], action: 'Boost' },
  { key: 'KeyQ', modifiers: [], action: 'Turret Left' },
  { key: 'KeyE', modifiers: [], action: 'Turret Right' },
  { key: 'KeyR', modifiers: [], action: 'Toggle Drive Mode' },
  { key: 'KeyF', modifiers: [], action: 'Surface Scan' },
  { key: 'KeyG', modifiers: [], action: 'Cargo Scoop' },
  { key: 'KeyL', modifiers: [], action: 'Headlights' },
  { key: 'KeyU', modifiers: [], action: 'Target Ahead' },
  { key: 'Tab', modifiers: [], action: 'Enter / Exit SRV' },
  { key: 'Escape', modifiers: [], action: 'Open Menu' },
];

const ED_SRV_HOTAS = [
  { input: 'Joystick_Button1', action: 'Fire Weapons' },
  { input: 'Joystick_Button2', action: 'Secondary Fire' },
  { input: 'Joystick_Button3', action: 'Boost' },
  { input: 'Joystick_Hat1_Up',   action: 'Target Ahead' },
  { input: 'Joystick_Hat1_Down', action: 'Next Target' },
  { input: 'Joystick_Hat2_Up',    action: 'Turret Up' },
  { input: 'Joystick_Hat2_Down',  action: 'Turret Down' },
  { input: 'Joystick_Hat2_Left',  action: 'Turret Left' },
  { input: 'Joystick_Hat2_Right', action: 'Turret Right' },
  { input: 'Throttle_Button1', action: 'Cargo Scoop' },
  { input: 'Throttle_Button2', action: 'Surface Scan' },
];

const ED_SHIP_KEY_COLORS = {
  KeyW: C.movement, KeyS: C.movement, KeyA: C.movement, KeyD: C.movement,
  KeyQ: C.movement, KeyE: C.movement, Space: C.movement,
  KeyR: C.ability1, KeyG: C.ability1, KeyL: C.ability2, KeyN: C.ability2,
  Delete: C.ability2,
  Tab: C.ui, KeyJ: C.movement,
  Backspace: C.ability3,
  KeyU: C.targeting, KeyT: C.targeting,
  F1: C.ui, F2: C.ui, F3: C.ui, F4: C.ui,
  Escape: C.ui,
};

const ED_FOOT_KEY_COLORS = {
  KeyW: C.movement, KeyS: C.movement, KeyA: C.movement, KeyD: C.movement,
  ShiftLeft: C.movement, ControlLeft: C.movement, Space: C.movement,
  KeyF: C.ability1, KeyR: C.ability1,
  KeyG: C.ability3, KeyT: C.ability2, KeyX: C.ability2,
  Tab: C.ui, Escape: C.ui,
};

const ED_SRV_KEY_COLORS = {
  KeyW: C.movement, KeyS: C.movement, KeyA: C.movement, KeyD: C.movement,
  Space: C.movement, ShiftLeft: C.movement,
  KeyQ: C.ability1, KeyE: C.ability1,
  KeyR: C.ability2, KeyG: C.ability3, KeyL: C.ability2,
  KeyF: C.ability2, KeyU: C.targeting,
  Tab: C.ui, Escape: C.ui,
};

// ── Combined label map (used by resolveAction) ────────────────────────────────

export const GAME_ACTION_LABELS = {
  ...Object.fromEntries(Object.entries(WOW_LABELS).map(([k, v])   => [`__wow:${k}`,   v])),
  ...Object.fromEntries(Object.entries(FFXIV_LABELS).map(([k, v]) => [`__ffxiv:${k}`, v])),
  ...Object.fromEntries(Object.entries(GW2_LABELS).map(([k, v])   => [`__gw2:${k}`,   v])),
  ...Object.fromEntries(Object.entries(ESO_LABELS).map(([k, v])   => [`__eso:${k}`,   v])),
  ...Object.fromEntries(Object.entries(ARMA_LABELS).map(([k, v])  => [`__arma:${k}`,  v])),
};

// ── Preset registry ───────────────────────────────────────────────────────────

export const GAME_PRESETS = [
  {
    id: 'wow',
    label: 'World of Warcraft',
    layoutName: 'World of Warcraft Default Layout',
    formats: [{ name: '__t:formatDefault', bindings: WOW_BINDINGS, keyColors: computeKeyColors(WOW_BINDINGS, WOW_ACTION_COLORS), mouseBindings: WOW_MOUSE_BINDINGS }],
  },
  {
    id: 'ffxiv',
    label: 'Final Fantasy XIV',
    layoutName: 'Final Fantasy XIV Default Layout',
    formats: [
      { name: '__t:formatDefault', bindings: [...FFXIV_CONTROLS_BINDINGS, ...FFXIV_HOTBAR_BINDINGS], keyColors: computeKeyColors([...FFXIV_CONTROLS_BINDINGS, ...FFXIV_HOTBAR_BINDINGS], FFXIV_ACTION_COLORS), mouseBindings: FFXIV_MOUSE_BINDINGS },
    ],
  },
  {
    id: 'eso',
    label: 'Elder Scrolls Online',
    layoutName: 'Elder Scrolls Online Default Layout',
    formats: [{ name: '__t:formatDefault', bindings: ESO_BINDINGS, keyColors: computeKeyColors(ESO_BINDINGS, ESO_ACTION_COLORS), mouseBindings: ESO_MOUSE_BINDINGS }],
  },
  {
    id: 'arma3',
    label: 'Arma 3',
    layoutName: 'Arma 3 Default Layout',
    formats: [
      { name: '__t:formatOnFoot',  bindings: ARMA_FOOT_BINDINGS,    keyColors: computeKeyColors(ARMA_FOOT_BINDINGS,    ARMA_ACTION_COLORS), mouseBindings: ARMA_FOOT_MOUSE_BINDINGS    },
      { name: '__t:formatVehicle', bindings: ARMA_VEHICLE_BINDINGS, keyColors: computeKeyColors(ARMA_VEHICLE_BINDINGS, ARMA_ACTION_COLORS), mouseBindings: ARMA_VEHICLE_MOUSE_BINDINGS },
      { name: '__t:formatAircraft',bindings: ARMA_AIRCRAFT_BINDINGS,keyColors: computeKeyColors(ARMA_AIRCRAFT_BINDINGS,ARMA_ACTION_COLORS), mouseBindings: ARMA_AIRCRAFT_MOUSE_BINDINGS},
    ],
  },
  {
    id: 'gw2',
    label: 'Guild Wars 2',
    layoutName: 'Guild Wars 2 Default Layout',
    formats: [{ name: '__t:formatDefault', bindings: GW2_BINDINGS, keyColors: computeKeyColors(GW2_BINDINGS, GW2_ACTION_COLORS), mouseBindings: GW2_MOUSE_BINDINGS }],
  },
  {
    id: 'elite-dangerous',
    label: 'Elite Dangerous',
    layoutName: 'Elite Dangerous Default Layout',
    formats: [
      {
        name: '__t:formatShip',
        bindings: ED_SHIP_BINDINGS,
        keyColors: ED_SHIP_KEY_COLORS,
        mouseBindings: [],
        hotasBindings: ED_SHIP_HOTAS,
      },
      {
        name: '__t:formatOnFoot',
        bindings: ED_FOOT_BINDINGS,
        keyColors: ED_FOOT_KEY_COLORS,
        mouseBindings: ED_FOOT_MOUSE,
        hotasBindings: [],
      },
      {
        name: '__t:formatSRV',
        bindings: ED_SRV_BINDINGS,
        keyColors: ED_SRV_KEY_COLORS,
        mouseBindings: [],
        hotasBindings: ED_SRV_HOTAS,
      },
    ],
  },
];
