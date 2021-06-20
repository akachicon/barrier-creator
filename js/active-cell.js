import { Direction } from './constants';

const directionClassMap = {
  [Direction.Top]: 'active-cell__selection_top',
  [Direction.Right]: 'active-cell__selection_right',
  [Direction.Bottom]: 'active-cell__selection_bottom',
  [Direction.Left]: 'active-cell__selection_left',
};

const VISIBLE_SELECTION_CLASS = 'active-cell__selection_visible';

export class ActiveCell {
  constructor({ x, y, size, mountElement }) {
    const root = ActiveCell.InitializeRoot({ x, y, size });
    const { selectionElements, selectedDirection } =
      ActiveCell.InitializeSelectionElements(root);
    mountElement.append(root);

    this.rootElement = root;
    this.selectionElements = selectionElements;
    this.selectedDirection = selectedDirection;
  }

  setDirection(direction) {
    if (this.selectedDirection === direction) return;

    this.selectionElements[this.selectedDirection].classList.remove(
      VISIBLE_SELECTION_CLASS
    );
    this.selectionElements[direction].classList.add(VISIBLE_SELECTION_CLASS);
    this.selectedDirection = direction;
  }

  destroy() {
    this.rootElement.remove();
  }

  static InitializeRoot({ x, y, size }) {
    const root = document.createElement('div');
    root.classList.add('active-cell');
    root.style.setProperty('width', size + 'px');
    root.style.setProperty('height', size + 'px');
    root.style.setProperty('top', size * y + 'px');
    root.style.setProperty('left', size * x + 'px');

    return root;
  }

  static InitializeSelectionElements(root) {
    const selectionElements = {};
    const selectionElBase = document.createElement('div');
    selectionElBase.classList.add('active-cell__selection');

    [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left].forEach(
      (direction) => {
        const selectionEl = selectionElBase.cloneNode();
        selectionEl.classList.add(directionClassMap[direction]);
        root.append(selectionEl);
        selectionElements[direction] = selectionEl;
      }
    );
    selectionElements[Direction.Top].classList.add(VISIBLE_SELECTION_CLASS);

    return {
      selectionElements,
      selectedDirection: Direction.Top,
    };
  }
}
