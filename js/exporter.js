import { BarrierType, Direction } from './constants';

const ExportDirectionMap = {
  [Direction.Top]: 0,
  [Direction.Right]: 3,
  [Direction.Bottom]: 1,
  [Direction.Left]: 2,
};

const ExportBarrierTypeMap = {
  [BarrierType.Iron]: 1,
  [BarrierType.Magic]: 3,
  [BarrierType.Mechanical1]: 2,
  [BarrierType.Mechanical2]: 2,
  [BarrierType.Wooden]: 0,
};

const ExportMechanicalBarrierType = {
  [BarrierType.Mechanical1]: 0,
  [BarrierType.Mechanical2]: 1,
};

export class Exporter {
  constructor(field) {
    this.field = field;
  }

  getExportString() {
    const barriers = this.field.getBarriers();
    const barriersString = barriers.map(({ direction, position, type }) => {
      const positionLine = `- position {x: ${position.x}, y: ${position.y}}\n`;
      const directionLine = `direction: ${ExportDirectionMap[direction]}\n`;
      const barrierTypeLine = `barrierType: ${ExportBarrierTypeMap[type]}\n`;
      const mechanicalBarrierTypeLine = `mechanicalBarrierType: ${
        ExportMechanicalBarrierType[type] ?? 0
      }\n`;

      return (
        positionLine.padStart(positionLine.length + 2) +
        directionLine.padStart(directionLine.length + 4) +
        barrierTypeLine.padStart(barrierTypeLine.length + 4) +
        mechanicalBarrierTypeLine.padStart(mechanicalBarrierTypeLine.length + 4)
      );
    });
    const startLine = 'barrierMap:\n';
    return startLine.padStart(startLine.length + 2) + barriersString.join('');
  }
}
