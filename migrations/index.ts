import * as migration_20260419_142006 from './20260419_142006';

export const migrations = [
  {
    up: migration_20260419_142006.up,
    down: migration_20260419_142006.down,
    name: '20260419_142006'
  },
];
