import { describe, it, expect } from 'vitest';
import {
  getHotasLabel,
  buildHotasGroups,
  getHotasModInfo,
  DEFAULT_JOYSTICK_BUTTONS,
  DEFAULT_THROTTLE_BUTTONS,
  DEFAULT_PEDALS_BUTTONS,
} from '../hotasConstants';

describe('getHotasLabel', () => {
  it('formats joystick button IDs', () => {
    expect(getHotasLabel('Joystick_Button1')).toBe('Joystick Btn 1');
    expect(getHotasLabel('Joystick_Button32')).toBe('Joystick Btn 32');
    expect(getHotasLabel('Throttle_Button5')).toBe('Throttle Btn 5');
    expect(getHotasLabel('Pedals_Button2')).toBe('Pedals Btn 2');
  });

  it('formats hat/POV IDs', () => {
    expect(getHotasLabel('Joystick_Hat1_Up')).toBe('Joystick Hat1 Up');
    expect(getHotasLabel('Joystick_Hat1_DownLeft')).toBe('Joystick Hat1 DownLeft');
    expect(getHotasLabel('Throttle_POV1_Right')).toBe('Throttle POV1 Right');
  });

  it('formats switch and rotary IDs', () => {
    expect(getHotasLabel('Throttle_Switch1_On')).toBe('Throttle Switch1 On');
    expect(getHotasLabel('Throttle_Rotary1_CW')).toBe('Throttle Rotary1 CW');
  });

  it('returns the ID unchanged for unrecognised patterns', () => {
    expect(getHotasLabel('Unknown_Thing')).toBe('Unknown_Thing');
  });

  it('returns the input unchanged when passed null/empty', () => {
    expect(getHotasLabel('')).toBe('');
    expect(getHotasLabel(null)).toBe(null);
  });
});

describe('buildHotasGroups', () => {
  it('returns three groups with the default counts', () => {
    const groups = buildHotasGroups();
    expect(groups).toHaveLength(3);
    expect(groups.map(g => g.label)).toEqual(['Joystick', 'Throttle', 'Pedals']);
  });

  it('joystick group starts with the correct number of buttons', () => {
    const groups = buildHotasGroups(8, 8, 2);
    const joystick = groups[0];
    const buttons = joystick.inputs.filter(id => id.includes('Button'));
    expect(buttons).toHaveLength(8);
    expect(buttons[0]).toBe('Joystick_Button1');
    expect(buttons[7]).toBe('Joystick_Button8');
  });

  it('includes hat and POV inputs for the joystick', () => {
    const groups = buildHotasGroups(4, 4, 2);
    const { inputs } = groups[0];
    expect(inputs).toContain('Joystick_Hat1_Up');
    expect(inputs).toContain('Joystick_Hat1_DownLeft');
    expect(inputs).toContain('Joystick_POV1_Right');
  });

  it('includes switch and rotary inputs for the throttle', () => {
    const groups = buildHotasGroups(4, 4, 2);
    const { inputs } = groups[1];
    expect(inputs).toContain('Throttle_Switch1_On');
    expect(inputs).toContain('Throttle_Rotary1_CW');
  });

  it('pedals group contains only buttons', () => {
    const groups = buildHotasGroups(4, 4, 4);
    const pedals = groups[2];
    expect(pedals.inputs.every(id => id.startsWith('Pedals_Button'))).toBe(true);
    expect(pedals.inputs).toHaveLength(4);
  });

  it('honours custom button counts', () => {
    const groups = buildHotasGroups(16, 24, 2);
    const joystickButtons = groups[0].inputs.filter(id => id.includes('Button'));
    const throttleButtons = groups[1].inputs.filter(id => id.includes('Button'));
    const pedalsButtons   = groups[2].inputs.filter(id => id.includes('Button'));
    expect(joystickButtons).toHaveLength(16);
    expect(throttleButtons).toHaveLength(24);
    expect(pedalsButtons).toHaveLength(2);
  });
});

describe('getHotasModInfo', () => {
  const bindings = [
    { input: 'Joystick_Button1', isHotasMod: true,  action: '' },
    { input: 'Joystick_Button2', isHotasMod: false, action: 'Fire' },
    { input: 'Joystick_Button3', isHotasMod: true,  action: '' },
  ];

  it('returns the 1-based index and a color for a modifier button', () => {
    const info = getHotasModInfo('Joystick_Button1', bindings);
    expect(info).not.toBeNull();
    expect(info.index).toBe(1);
    expect(typeof info.color).toBe('string');
  });

  it('returns the correct index for the second modifier', () => {
    const info = getHotasModInfo('Joystick_Button3', bindings);
    expect(info.index).toBe(2);
  });

  it('returns null for a non-modifier binding', () => {
    expect(getHotasModInfo('Joystick_Button2', bindings)).toBeNull();
  });

  it('returns null for an input not in the list', () => {
    expect(getHotasModInfo('Joystick_Button99', bindings)).toBeNull();
  });

  it('returns null when bindings are empty', () => {
    expect(getHotasModInfo('Joystick_Button1', [])).toBeNull();
  });
});
