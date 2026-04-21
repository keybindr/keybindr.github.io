import { getAllHotasInputs, DEFAULT_JOYSTICK_BUTTONS, DEFAULT_THROTTLE_BUTTONS, DEFAULT_PEDALS_BUTTONS } from './hotasConstants';

export const HOTAS_PROFILES = [
  { id: 'custom',            label: 'Custom HOTAS',                    joystickButtons: null, throttleButtons: null, pedalsButtons: null },
  { id: 'tm-warthog',        label: 'Thrustmaster HOTAS Warthog',      joystickButtons: 19,   throttleButtons: 32,   pedalsButtons: null },
  { id: 'logitech-x56',      label: 'Logitech G X56 HOTAS',            joystickButtons: 14,   throttleButtons: 29,   pedalsButtons: null },
  { id: 'tm-t16000m-fcs',    label: 'Thrustmaster T16000M FCS HOTAS',  joystickButtons: 16,   throttleButtons: 14,   pedalsButtons: null },
  { id: 'tm-tflight-one',    label: 'Thrustmaster T.Flight HOTAS One', joystickButtons: 12,   throttleButtons: 4,    pedalsButtons: null },
  { id: 'tm-tflight-4',      label: 'Thrustmaster T.Flight HOTAS 4',   joystickButtons: 12,   throttleButtons: 4,    pedalsButtons: null },
  { id: 'tb-velocityone',    label: 'Turtle Beach VelocityOne',        joystickButtons: 16,   throttleButtons: 26,   pedalsButtons: null },
  { id: 'tm-solr',           label: 'Thrustmaster Sol-R HOTAS',        joystickButtons: 20,   throttleButtons: 24,   pedalsButtons: null },
  { id: 'winwing-orion2',    label: 'Winwing Orion 2 HOTAS',           joystickButtons: 24,   throttleButtons: 32,   pedalsButtons: null },
  { id: 'vkb-gladiator-nxt', label: 'VKB Gladiator NXT EVO',           joystickButtons: 15,   throttleButtons: null, pedalsButtons: null },
  { id: 'virpil-vpc',        label: 'Virpil VPC HOTAS',                joystickButtons: 19,   throttleButtons: 24,   pedalsButtons: null },
];

export function getHotasProfile(id) {
  return HOTAS_PROFILES.find(p => p.id === id) ?? HOTAS_PROFILES[0];
}

/** Effective button counts — uses profile values for named profiles, settings values for custom. */
export function getEffectiveHotasCounts(settings) {
  if (settings.hotasModel && settings.hotasModel !== 'custom') {
    const profile = getHotasProfile(settings.hotasModel);
    if (profile) {
      return {
        joystick: profile.joystickButtons,
        throttle: profile.throttleButtons,
        pedals:   profile.pedalsButtons,
      };
    }
  }
  return {
    joystick: settings.joystickButtonCount ?? DEFAULT_JOYSTICK_BUTTONS,
    throttle: settings.throttleButtonCount ?? DEFAULT_THROTTLE_BUTTONS,
    pedals:   settings.pedalsButtonCount   ?? DEFAULT_PEDALS_BUTTONS,
  };
}

/**
 * Returns a Set of all valid input IDs for the given profile,
 * or null if the profile is custom (all inputs are valid).
 */
export function getHotasProfileInputSet(profile) {
  if (!profile || profile.id === 'custom') return null;
  return new Set(getAllHotasInputs(
    profile.joystickButtons,
    profile.throttleButtons,
    profile.pedalsButtons,
  ));
}
