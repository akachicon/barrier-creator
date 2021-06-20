import { BarrierColorMap, Direction } from './constants';

function getDefaultConfig() {
  return {
    render: () => {},
  };
}

function getDefaultBarriers() {
  return {
    [Direction.Top]: null,
    [Direction.Right]: null,
    [Direction.Bottom]: null,
    [Direction.Left]: null,
  };
}

export class Cell {
  constructor(config) {
    this.barriers = getDefaultBarriers();
    this.config = getDefaultConfig();
    this.updateConfig(config);
  }

  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  toggleBarrier(type, direction) {
    if (
      this.barriers[direction] !== null &&
      String(this.barriers[direction].type) === String(type)
    ) {
      this.barriers[direction] = null;
      return;
    }
    this.barriers[direction] = {
      type,
      color: BarrierColorMap[type],
    };
  }

  resetBarriers() {
    this.barriers = getDefaultBarriers();
  }

  render() {
    this.config.render(this.barriers);
  }
}
