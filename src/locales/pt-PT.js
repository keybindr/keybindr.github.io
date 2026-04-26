import ptBR from './pt-BR.js';

export default {
  ...ptBR,
  importExport:       'Importar / Exportar',
  shareLayout:        'Partilhar layout',
  noBindings:         'Sem atalhos. Clique numa tecla para adicionar.',
  actionPlaceholder:  'ex. Mover para a frente',
  recentlyPicked:     'Usados recentemente',
  returnToDefaults:   'Restaurar predefinições',
  shareTitle:         'Partilhar layout',
  shareBody:          'Este link, que vai parecer bastante louco, codifica todo o seu layout — todos os formatos, atalhos, cores e nome — diretamente no URL. Qualquer pessoa com o link pode abri-lo e ver o seu layout instantaneamente. Não são codificados dados de rastreamento.',
  copyLink:           'Copiar ligação',
  downloadCurrent:    '↓ Transferir layout atual',
  replaceLayout:      'Substituir layout',
  fileABug:           'Reportar um erro',
  mobileWarning:      'Esta é uma aplicação focada no ambiente de trabalho e, dada a sua natureza, provavelmente nunca será totalmente otimizada para dispositivos móveis. - Gestão',
  helpIntro2:         'Mapeie ações para combinações de teclas, personalize cores, dê um nome ao seu layout e partilhe-o com outros.',
  helpIntro3:         'Todos os dados são armazenados localmente no seu navegador, pelo que é recomendado exportar no final de uma sessão para evitar perder trabalho.',
  helpIntro4:         'Não existe rastreio de utilizadores no site.',
  helpSettingsTitle:  'Detalhes das definições',
  helpSplitBody:      'alterna entre teclas modificadoras unificadas (Shift) e teclas esquerda/direita separadas (LShift / RShift).',
  helpPhysBody1:      'alterna entre diferentes fatores de forma de teclado: ANSI 104, ISO 105, TKL, 75%, 65% e 60%.',
  helpLangBody:       'altera as etiquetas das teclas mostradas no teclado para corresponder ao seu locale — cobrindo QWERTY, QWERTZ, AZERTY e mais de 30 variantes regionais.',
  helpMouseHotasLabel: 'Atalhos de Mouse e HOTAS',
  helpMouseHotasBody: 'podem ser ativados ou desativados. A visualização não é atualmente suportada.',
  helpConflictsLabel: 'Avisos de conflito entre formatos',
  helpConflictsBody:  'mostra conflitos entre separadores de formato (ex. «A pé» e «No veículo»). Desativado por predefinição.',
  helpResetLabel:     'Voltar às predefinições',
  helpResetBody:      'apaga todos os atalhos, cores, formatos e o nome do layout.',
  helpCreditBy:       'Criado por Andrew',
  helpCreditNote:     '(Falo inglês e um pouco de francês e alemão, mas temos sempre a tradução automática para facilitar a nossa comunicação se tiver dúvidas, pedidos de funcionalidades ou relatórios de erros.)',
  menu:               'Menu',
  gameDefaults:        'Predefinições do jogo',
  formatDefault:       'Predefinição',
  formatVehicle:       'Veículo',
  formatAircraft:      'Aeronave',
  currentColor:       'Cor actual',
  actionAttack:        'Atacar',
  actionAim:           'Mirar',

  // ── Keys added by fill-missing-locale-keys (pending translation) ──
  'mouseOrphanBodySingular': 'The following binding uses a button not on this mouse and will be removed:',  // TODO: translate
  'mouseOrphanBodyPlural'  : 'The following {count} bindings use buttons not on this mouse and will be removed:',  // TODO: translate
  'hotasOrphanBodySingular': 'The following binding uses an input not on this HOTAS and will be removed:',  // TODO: translate
  'hotasOrphanBodyPlural'  : 'The following {count} bindings use inputs not on this HOTAS and will be removed:',  // TODO: translate
  'additionalButtons'      : 'Additional Buttons',  // TODO: translate
  'mouseModel'             : 'Mouse Model',  // TODO: translate
  'helpUndoLabel'          : 'Undo / Redo',  // TODO: translate
  'helpUndoBody'           : 'Ctrl+Z and Ctrl+Y (or Ctrl+Shift+Z) step through your recent changes.',  // TODO: translate
  'importErrInvalid'       : 'Invalid file — not a keybindr JSON export',  // TODO: translate
  'helpOutro'              : '',  // TODO: translate
  'showHotasBindings'      : 'Add HOTAS Bindings (BETA)',  // TODO: translate
  'hotasBindingsTitle'     : 'HOTAS Bindings',  // TODO: translate
  'hotasColInput'          : 'Input',  // TODO: translate
  'addHotasBinding'        : 'Add HOTAS Binding',  // TODO: translate
  'hotasSection'           : 'HOTAS',  // TODO: translate
  'hotasMarkAsModifier'    : 'Mark as HOTAS modifier button',  // TODO: translate
  'hotasModifierButton'    : 'HOTAS Modifier',  // TODO: translate
  'hotasNoModifiers'       : 'Mark a button as a modifier first',  // TODO: translate
  'joystickButtonCount'    : 'Joystick Buttons',  // TODO: translate
  'throttleButtonCount'    : 'Throttle Buttons',  // TODO: translate
  'pedalsButtonCount'      : 'Pedals Buttons',  // TODO: translate
};
