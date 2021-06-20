import { Field } from './field';
import { minMax, getFieldSide } from './utils';
import {
  BARRIER_THICKNESS,
  CELLS_BY_SIDE,
  BarrierType,
  BarrierColorMap,
  BarrierNameMap,
} from './constants';

const CONTROLS_GROUP_NAME = 'color';

const CONTROL_CLASSNAME = 'controls__item';
const CONTROL_LABEL_CLASSNAME = 'controls__item-label';
const CONTROL_COLOR_CLASSNAME = 'controls__item-color';
const CONTROL_INPUT_CLASSNAME = 'controls__item-input';

function setupField(canvas) {
  const fieldSide = getFieldSide(canvas);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(196,223,230)';
  ctx.fillRect(0, 0, fieldSide, fieldSide);

  ctx.fillStyle = 'rgb(7,87,91)';
  for (let i = 0; i < CELLS_BY_SIDE + 1; i++) {
    const separatorThickness = BARRIER_THICKNESS * 2;
    const indent = i * (fieldSide / CELLS_BY_SIDE) - separatorThickness / 2;

    const indentStart = minMax(indent, 0, fieldSide);
    const indentEnd = minMax(indent + separatorThickness, 0, fieldSide);
    const indentThickness = indentEnd - indentStart;

    ctx.fillRect(indentStart, 0, indentThickness, fieldSide);
    ctx.fillRect(0, indentStart, fieldSide, indentThickness);
  }
}

const fieldCanvas = document.getElementById('field');
const barriersCanvas = document.getElementById('barriers');
const selectionPane = document.getElementById('selection-pane');

setupField(fieldCanvas);

const controlsList = document.getElementById('controls-list');
const defaultBarrierType = BarrierType.Wooden;

Object.values(BarrierType).forEach((type) => {
  const root = document.createElement('li');
  const label = document.createElement('label');
  const color = document.createElement('span');
  const input = document.createElement('input');
  const text = document.createElement('span');

  root.classList.add(CONTROL_CLASSNAME);
  label.classList.add(CONTROL_LABEL_CLASSNAME);
  color.classList.add(CONTROL_COLOR_CLASSNAME);
  color.style.setProperty('background-color', BarrierColorMap[type]);
  input.classList.add(CONTROL_INPUT_CLASSNAME);
  input.type = 'radio';
  input.name = CONTROLS_GROUP_NAME;
  input.value = type;
  text.textContent = BarrierNameMap[type];

  if (type === defaultBarrierType) {
    input.checked = true;
  }

  label.append(input, text, color);
  root.append(label);
  controlsList.append(root);
});

let currentBarrierType = defaultBarrierType;

controlsList.addEventListener('change', (e) => {
  const input = e.target
    .closest('.' + CONTROL_CLASSNAME)
    .querySelectorAll('.' + CONTROL_INPUT_CLASSNAME)
    .item(0);
  currentBarrierType = input.value;
});

function getBarrierType() {
  return currentBarrierType;
}

const field = new Field({
  canvas: barriersCanvas,
  canvasOverlay: selectionPane,
  getBarrierType,
});

const refreshButton = document.getElementById('refresh-button');
refreshButton.addEventListener('click', () => {
  field.reset();
});
