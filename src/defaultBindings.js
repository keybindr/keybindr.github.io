export const DEFAULT_BINDINGS = [
  { key: 'KeyW',  modifiers: [],       action: '__t:actionMoveForward' },
  { key: 'KeyA',  modifiers: [],       action: '__t:actionMoveLeft' },
  { key: 'KeyS',  modifiers: [],       action: '__t:actionMoveBackward' },
  { key: 'KeyD',  modifiers: [],       action: '__t:actionMoveRight' },
  { key: 'Space', modifiers: [],       action: '__t:actionJump' },
  { key: 'KeyR',  modifiers: [],       action: '__t:actionReload' },
  { key: 'KeyR',  modifiers: ['Ctrl'], action: '__t:actionQuickReload' },
  { key: 'KeyE',  modifiers: [],       action: '__t:actionInteract' },
  { key: 'KeyF',  modifiers: [],       action: '__t:actionFlashlight' },
  { key: 'Tab',   modifiers: [],       action: '__t:actionScoreboard' },
];

export const DEFAULT_VEHICLE_BINDINGS = [
  { key: 'KeyW',  modifiers: [], action: '__t:actionAccelerate' },
  { key: 'KeyA',  modifiers: [], action: '__t:actionSteerLeft' },
  { key: 'KeyS',  modifiers: [], action: '__t:actionBrakeReverse' },
  { key: 'KeyD',  modifiers: [], action: '__t:actionSteerRight' },
  { key: 'Space', modifiers: [], action: '__t:actionHandbrake' },
  { key: 'KeyF',  modifiers: [], action: '__t:actionExitVehicle' },
  { key: 'KeyE',  modifiers: [], action: '__t:actionHorn' },
  { key: 'KeyH',  modifiers: [], action: '__t:actionHeadlights' },
  { key: 'KeyC',  modifiers: [], action: '__t:actionChangeCamera' },
  { key: 'KeyX',  modifiers: [], action: '__t:actionLookBehind' },
  { key: 'KeyR',  modifiers: [], action: '__t:actionRespawnVehicle' },
  { key: 'Tab',   modifiers: [], action: '__t:actionMap' },
];
