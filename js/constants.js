export const CELLS_BY_SIDE = 8;
export const BARRIER_THICKNESS = 6;

export const Direction = {
  Top: 0,
  Right: 1,
  Bottom: 2,
  Left: 3,
};

export const BarrierType = {
  Wooden: 0,
  Magic: 1,
  Metallic1: 2,
  Metallic2: 3,
};

export const BarrierColorMap = {
  [BarrierType.Wooden]: '#c46225',
  [BarrierType.Magic]: '#fd50e4',
  [BarrierType.Metallic1]: '#07aaf6',
  [BarrierType.Metallic2]: '#00e339',
};

export const BarrierNameMap = {
  [BarrierType.Wooden]: 'Деревянный',
  [BarrierType.Magic]: 'Магический',
  [BarrierType.Metallic1]: 'Металлический 1',
  [BarrierType.Metallic2]: 'Металлический 2',
};
