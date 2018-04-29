'use strict';

let board = $('.board');
let cells;
let playerTurn = 0;
let turnCounter = 0;

let buildBoard = () => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < 3; i++) {
      let row = $('<div></div>').addClass('row');
      for (let j = 0; j < 3; j++) {
        let cell = $('<span></span>').addClass('cell unoccupied');
        row.append(cell);
      }
      resolve(board.append(row));
    }
    cells = $('.cell');
  });
}

let newGame = () => {
  board.html('');
  removeEvents()
  .then(() => {
    buildBoard()
    .then(() => {
      playerTurn = 1;
      turnCounter = 1;
      activateEvents();
    });
  });
}

let clearLastClick = (turn) => {
  for(let i = 0; i < 9; i++){
    if ($(cells[i]).hasClass('current')){
      $(cells[i]).removeClass(`${turn} current`);
      $(cells[i]).addClass('unoccupied');
    }
  }
}

let checkWinState = () => {
  let re = /(X{3})|(O{3})/g;
  let matrix = mapBoard().map((o, i) => {
    return o[i] === null ? "f" : o[i];
  });

  let winCombos = [
    matrix.slice(0, 3),
    matrix.slice(3, 6),
    matrix.slice(5, 8),
    [matrix[0], matrix[3], matrix[6]],
    [matrix[1], matrix[4], matrix[7]],
    [matrix[2], matrix[5], matrix[8]],
    [matrix[0], matrix[4], matrix[8]],
    [matrix[2], matrix[4], matrix[6]]
  ]

  winCombos.forEach((combo) => {
    let str = combo.join('');
    if (str.match(re)){
      let winner = turnCounter % 2 === 0 ? 1 : 2;
      alert(`Player ${winner} wins!!!`)
      playerTurn = 0;
    }
  })
}

let mapBoard = () => {
  let matrix = cells.map((i, e) => {
    let className = $(e).attr('class');
    let re = /[XO]/g;
    let move = className.match(re);
    return move === null ? {[i]: null} : {[i]: move[0]};
  }).get()
  return matrix;
}

let removeEvents = () => {
  return new Promise((resolve, reject) => {
    $('.move').off('click');
    resolve();
  })
}

let activateEvents = () => {
  $('.cell').click((e) => {
    let sq = e.target;
    if($(sq).hasClass('unoccupied') && playerTurn === 1){
      clearLastClick('X');
      $(sq).removeClass('unoccupied').addClass('X current');
    } else if($(sq).hasClass('unoccupied') && playerTurn === 2){
      clearLastClick('O');
      $(sq).removeClass('unoccupied').addClass('O current');
    } else {
      console.log("GAME OVER");
    }
  });

  $('.move').click(() => {
    console.log("I'm clicking...")
    console.log(playerTurn, turnCounter, ' on click')
    turnCounter++;
    if(turnCounter % 2 === 0){
      playerTurn = 2;
    } else {
      playerTurn = 1;
    }

    $(() => {
      $('span.cell').removeClass('current');
      $(this).addClass('set');
      checkWinState();
    });

  })

}

$('.new').click(() => newGame())
newGame();