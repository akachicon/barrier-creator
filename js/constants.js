export const CELLS_BY_SIDE = 8;
export const BARRIER_THICKNESS = 6;

export const Direction = {
  Top: 0,
  Right: 1,
  Bottom: 2,
  Left: 3,
};

export const BarrierType = {
  Iron: 0,
  Magic: 1,
  Mechanical1: 2,
  Mechanical2: 3,
  Wooden: 4,
};

export const BarrierColorMap = {
  [BarrierType.Iron]: '#fde650',
  [BarrierType.Magic]: '#fd50e4',
  [BarrierType.Mechanical1]: '#07aaf6',
  [BarrierType.Mechanical2]: '#00e339',
  [BarrierType.Wooden]: '#c46225',
};

export const BarrierNameMap = {
  [BarrierType.Iron]: 'Металлический',
  [BarrierType.Magic]: 'Магический',
  [BarrierType.Mechanical1]: 'Мехнический 1',
  [BarrierType.Mechanical2]: 'Мехнический 2',
  [BarrierType.Wooden]: 'Деревянный',
};
