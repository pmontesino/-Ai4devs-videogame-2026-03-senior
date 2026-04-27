export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const LEVELS = [
  { key: "level1", name: "Oleada urbana", bg: 0x1a2238, enemyCount: 8 },
  { key: "level2", name: "Zona boscosa", bg: 0x20351f, enemyCount: 10 },
  { key: "level3", name: "Nave espacial", bg: 0x0f1022, enemyCount: 12 },
];

export const DIFFICULTY_TIMERS = {
  easy: 600,
  medium: 420,
  hard: 300,
};

export const INPUT_KEYS = {
  left: "LEFT",
  right: "RIGHT",
  up: "UP",
  down: "DOWN",
  shoot: "A",
  swapWeapon: "S",
  pause: "P",
  help: "F1",
};

export const DEFAULT_PLAYER_STATE = {
  lives: 5,
  health: 3,
  weapon: "base",
  hasTemporaryWeapon: false,
};

export const SAVE_COOKIE = "chromescar_save_state";
export const INVULNERABILITY_MS = 5000;
