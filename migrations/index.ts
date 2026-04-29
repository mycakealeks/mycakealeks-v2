import * as migration_20260419_142006 from './20260419_142006';
import * as migration_20260420_161126 from './20260420_161126';
import * as migration_20260420_164301 from './20260420_164301';
import * as migration_20260423_115142 from './20260423_115142';
import * as migration_20260423_120815 from './20260423_120815';
import * as migration_20260429_163100 from './20260429_163100';

export const migrations = [
  {
    up: migration_20260419_142006.up,
    down: migration_20260419_142006.down,
    name: '20260419_142006',
  },
  {
    up: migration_20260420_161126.up,
    down: migration_20260420_161126.down,
    name: '20260420_161126',
  },
  {
    up: migration_20260420_164301.up,
    down: migration_20260420_164301.down,
    name: '20260420_164301',
  },
  {
    up: migration_20260423_115142.up,
    down: migration_20260423_115142.down,
    name: '20260423_115142',
  },
  {
    up: migration_20260423_120815.up,
    down: migration_20260423_120815.down,
    name: '20260423_120815',
  },
  {
    up: migration_20260429_163100.up,
    down: migration_20260429_163100.down,
    name: '20260429_163100',
  },
];
