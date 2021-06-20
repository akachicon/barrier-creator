import throttle from 'lodash.throttle';
import { getFieldSide, minMax } from './utils';
import { ActiveCell } from './active-cell';
import { Cell } from './cell';
import {
  Direction,
  BARRIER_THICKNESS as DEFAULT_BARRIER_THICKNESS,
  CELLS_BY_SIDE,
} from './constants';

const BARRIER_THICKNESS = DEFAULT_BARRIER_THICKNESS * 2;

const INTERACTION_THROTTLE = 100;

export class Field {
  constructor({ canvas, canvasOverlay, getBarrierType }) {
    this.canvas = canvas;
    this.canvasOverlay = canvasOverlay;
    this.ctx = canvas.getContext('2d');
    this.getBarrierType = getBarrierType;
    this.fieldSide = getFieldSide(canvas);
    this.cells = Array.from({ length: CELLS_BY_SIDE }).map(() => []);
    this.activeCell = null;
    this.activeCellElement = null;

    for (let i = 0; i < CELLS_BY_SIDE; i++) {
      for (let j = 0; j < CELLS_BY_SIDE; j++) {
        this.cells[i][j] = new Cell({
          render: (barriers) => {
            this.renderCell(j, i, barriers);
          },
        });
      }
    }

    const onMouseMove = throttle(
      this.handleMouseMove.bind(this),
      INTERACTION_THROTTLE
    );
    const onMouseLeave = () => {
      onMouseMove.cancel();
      this.setActiveCell(null);
    };
    const onClick = () => {
      this.onClick();
    };

    this.canvas.addEventListener('mousemove', onMouseMove);
    this.canvas.addEventListener('mouseleave', onMouseLeave);
    this.canvas.addEventListener('click', onClick);
  }

  onClick() {
    const activeCell = this.activeCell;
    const direction = this.activeCellElement.selectedDirection;
    const type = this.getBarrierType();

    if (!activeCell) return;

    const cell = this.cells[activeCell.y][activeCell.x];
    cell.toggleBarrier(type, direction);
    cell.render();
  }

  setActiveCell(coords) {
    if (coords === null) {
      this.activeCell = null;
      this.activeCellElement?.destroy();
      this.activeCellElement = null;
      return;
    }

    if (this.activeCell === null) {
      this.mountSelectionElement(coords);
      this.activeCell = {
        x: coords.x,
        y: coords.y,
      };
      return;
    }

    if (this.activeCell.x === coords.x && this.activeCell.y === coords.y) {
      return;
    }

    this.activeCellElement.destroy();
    this.mountSelectionElement(coords);
    this.activeCell = {
      x: coords.x,
      y: coords.y,
    };
  }

  setActiveCellDirection(direction) {
    if (this.activeCellElement) {
      this.activeCellElement.setDirection(direction);
    }
  }

  mountSelectionElement(coords) {
    this.activeCellElement = new ActiveCell({
      x: coords.x,
      y: coords.y,
      size: this.fieldSide / CELLS_BY_SIDE,
      mountElement: this.canvasOverlay,
    });
  }

  renderCell(x, y, barriersMap) {
    const sizeFloat = this.fieldSide / CELLS_BY_SIDE;
    const size = Math.floor(sizeFloat);
    const offsetX = Math.floor(sizeFloat * x);
    const offsetY = Math.floor(sizeFloat * y);

    const barriers = Object.entries(barriersMap).sort((a) =>
      a[1] === null ? -1 : 1
    );

    barriers.forEach(([direction, data]) => {
      this.ctx.fillStyle = data?.color ?? 'transparent';
      const drawRect =
        data === null
          ? (...args) => this.ctx.clearRect(...args)
          : (...args) => this.ctx.fillRect(...args);

      switch (Number(direction)) {
        case Direction.Top:
          drawRect(offsetX, offsetY, size, BARRIER_THICKNESS);
          break;
        case Direction.Right:
          drawRect(offsetX + size, offsetY, -BARRIER_THICKNESS, size);
          break;
        case Direction.Bottom:
          drawRect(offsetX, offsetY + size, size, -BARRIER_THICKNESS);
          break;
        case Direction.Left:
          drawRect(offsetX, offsetY, BARRIER_THICKNESS, size);
      }
    });
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const offsetX = e.pageX - rect.left;
    const offsetY = e.pageY - rect.top;
    const cellX = this.getCellCoordinate(offsetX);
    const cellY = this.getCellCoordinate(offsetY);
    const cellSide = this.fieldSide / CELLS_BY_SIDE;
    const cellOffsetX = offsetX - cellSide * cellX;
    const cellOffsetY = offsetY - cellSide * cellY;
    const direction = this.getCellDirection(cellOffsetX, cellOffsetY, cellSide);

    this.setActiveCell({ x: cellX, y: cellY });
    this.setActiveCellDirection(direction);
  }

  getCellCoordinate(offset) {
    return minMax(
      Math.floor((offset / this.fieldSide) * CELLS_BY_SIDE),
      0,
      CELLS_BY_SIDE - 1
    );
  }

  getCellDirection(offsetX, offsetY, sideLength) {
    const halfSide = sideLength / 2;
    const diffX = Math.abs(halfSide - offsetX);
    const diffY = Math.abs(halfSide - offsetY);

    if (offsetX <= halfSide && offsetY <= halfSide) {
      return diffX > diffY ? Direction.Left : Direction.Top;
    }
    if (offsetX > halfSide && offsetY <= halfSide) {
      return diffX > diffY ? Direction.Right : Direction.Top;
    }
    if (offsetX > halfSide && offsetY > halfSide) {
      return diffX > diffY ? Direction.Right : Direction.Bottom;
    }
    if (offsetX <= halfSide && offsetY > halfSide) {
      return diffX > diffY ? Direction.Left : Direction.Bottom;
    }
    throw new Error('Field.getCellDirection(): Failed to detect direction');
  }

  reset() {
    for (let i = 0; i < CELLS_BY_SIDE; i++) {
      for (let j = 0; j < CELLS_BY_SIDE; j++) {
        this.cells[i][j].resetBarriers();
      }
    }
    this.ctx.clearRect(0, 0, this.fieldSide, this.fieldSide);
    this.activeCell = null;
    this.activeCellElement = null;
  }

  getBarriers() {
    const barriers = [];

    for (let i = 0; i < CELLS_BY_SIDE; i++) {
      for (let j = 0; j < CELLS_BY_SIDE; j++) {
        const cellBarriers = this.cells[i][j].barriers;
        const cellBarriersList = Object.entries(cellBarriers)
          .filter(([_, data]) => data !== null)
          .map(([direction, data]) => ({
            direction: Number(direction),
            position: { x: j, y: i },
            type: data.type,
          }));
        barriers.push(...cellBarriersList);
      }
    }
    return barriers;
  }
}
