const pattern = require('./patterns/glider.js'); // Change the pattern here

const SPEED = 250; // milliseconds

const ALIVE = 'alive';
const DEAD = 'dead';
const HEIGHT = pattern.length;
const WIDTH = findMaxWidth(pattern);

function findMaxWidth(pattern) {
  var max = 0;
  for (var r = 0; r < pattern.length; r++) {
    max = pattern[r].length > max ? pattern[r].length : max;
  }
  return max;
}

function simulateLife() {
  var nextFrame = $('#board').clone();

  function getNextCell(row, col) {
    return $(nextFrame).find('#r' + row + '>#c' + col);
  }

  function getCell(row, col) {
    return $('#r' + row + '>#c' + col);
  }

  function kill(cell) {
    cell.removeClass(ALIVE);
    cell.addClass(DEAD);
  }

  function birth(cell) {
    cell.removeClass(DEAD);
    cell.addClass(ALIVE);
  }

  function isLivingCell(cell) {
    return cell.hasClass(ALIVE);
  }

  function coord(value, size) {
    return value < 0 ? size + value : value % size;
  }

  function x(value) {
    return coord(value, WIDTH);
  }

  function y(value) {
    return coord(value, HEIGHT);
  }

  function countLivingNeighbors(row, col) {
    return isLivingCell(getCell(y(row + 1), x(col + 1))) +
      isLivingCell(getCell(y(row + 1), x(col))) +
      isLivingCell(getCell(y(row), x(col + 1))) +
      isLivingCell(getCell(y(row), x(col - 1))) +
      isLivingCell(getCell(y(row - 1), x(col))) +
      isLivingCell(getCell(y(row - 1), x(col - 1))) +
      isLivingCell(getCell(y(row + 1), x(col - 1))) +
      isLivingCell(getCell(y(row - 1), x(col + 1)));
  }

  function analyzeCell(row, col) {
    const cell = getCell(row, col);
    const numLivingNeighbors = countLivingNeighbors(row, col);
    const isAlive = isLivingCell(cell);

    if (isAlive && (numLivingNeighbors < 2 || numLivingNeighbors > 3)) {
      kill(getNextCell(row, col));
    } else if (!isAlive && numLivingNeighbors === 3) {
      birth(getNextCell(row, col));
    }
  }

  function analyzeCells() {
    for (var r = 0; r < HEIGHT; r++) {
      for (var c = 0; c < WIDTH; c++) {
        analyzeCell(r, c);
      }
    }
  }

  analyzeCells();
  $('#board').html($(nextFrame).html());
}

function populateInitialState(pattern) {
  $('body').append('\n<table id="board">\n</table>');
  for (var r = 0; r < HEIGHT; r++) {
    $('#board').append('\n<tr id="r' + r + '">\n');
    for (var c = 0; c < WIDTH; c++) {
      $('#r' + r).append('<td id="c' + c + '" class="' + (pattern[r][c] ? ALIVE : DEAD) + '"></td>\n');
    }
    $('#board').append('</tr>');
  }
}

populateInitialState(pattern);
setInterval(simulateLife, SPEED);
