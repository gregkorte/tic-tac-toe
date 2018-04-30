'use strict';

let board = $('.board');
let cells;
let playerTurn = 0;
let turnCounter = 0;
const stats = {
  totalGames: 0,
  lastwin: 0,
  p1wins: 0,
  p2wins: 0,
  p1winPct: 0,
  p2winPct: 0,
  p1winTurnShort: 0,
  p2winTurnShort: 0,
  p1winTurnLong: 0,
  p2winTurnLong: 0,
  p1curWinStreak: 0,
  p2curWinStreak: 0,
  p1winStreakLong: 0,
  p2winStreakLong: 0,
  p1lossStreakLong: 0,
  p2lossStreakLong: 0,
  p1loss: 0,
  p2loss: 0,
  p1win0: 0,
  p1win1: 0,
  p1win2: 0,
  p1win3: 0,
  p1win4: 0,
  p1win5: 0,
  p1win6: 0,
  p1win7: 0,
  p2win0: 0,
  p2win1: 0,
  p2win2: 0,
  p2win3: 0,
  p2win4: 0,
  p2win5: 0,
  p2win6: 0,
  p2win7: 0,
  win0: "Across Top",
  win1: "Across Middle",
  win2: "Across Bottom",
  win3: "Down Left",
  win4: "Down Middle",
  win5: "Down Right",
  win6: "Cross Down",
  win7: "Cross Up",
  lastWinType: '',
  p1LastWinType: '',
  p2LastWinType: '',
  p1BestWinType: '',
  p2BestWinType: ''
};

const statBoard = Object.create(stats);


let calculateStats = (p, i) => {
  statBoard.lastWin = p;
  statBoard.lastWinType = statBoard[`win${i}`];
  statBoard.totalGames++;
  switch(p){
    case 1:
        statBoard.p1wins++;
        statBoard[`p1win${i}`]++;
        statBoard.p1LastWinType = statBoard[`win${i}`];
        statBoard.p1curWinStreak++;
        statBoard.p2curWinStreak = 0;
        statBoard.p2loss++;
        break;

    case 2:
        statBoard.p2wins++;
        statBoard[`p2win${i}`]++;
        statBoard.p2LastWinType = statBoard[`win${i}`];
        statBoard.p2curWinStreak++;
        statBoard.p1curWinStreak = 0;
        statBoard.p1loss++;
        break;
  }
  statBoard.p1winPct = (statBoard.p1wins / statBoard.totalGames).toFixed(2)*100;
  statBoard.p2winPct = (statBoard.p2wins / statBoard.totalGames).toFixed(2)*100;
}

let showStats = () => {
  let calcs = `
  <table class='player'>
    <tr><td><h3>Game Stats</h3></td></tr>
    <tr>
      <td>Games Played:</td>
      <td class=''>${statBoard.totalGames}</td>
    </tr>
    <tr>
      <td>Last Winning Player:</td>
      <td>Player ${statBoard.lastWin}</td>
    </tr>
    <tr>
      <td>Last Winning Combo:</td>
      <td>${statBoard.lastWinType}</td>
    </tr>
  </table>
  <table class='player'>
    <tr><td><h3>Player 1 Stats</h3></td></tr>
    <tr>
      <td>Wins:</td>
      <td>${statBoard.p1wins}</td>
    </tr>
    <tr>
      <td>Win Percentage:</td>
      <td>${statBoard.p1winPct}%</td>
    </tr>
    <tr>
      <td>Current Win Streak:</td>
      <td>${statBoard.p1curWinStreak}</td>
    </tr>
    <tr>
      <td>Last Win Type:</td>
      <td>${statBoard.p1LastWinType}</td>
    </tr>
    <tr>
      <td>Losses:</td>
      <td>${statBoard.p1loss}</td>
    </tr>
  </table>
  <table class='player'>
    <tr><td><h3>Player 2 Stats</h3></td></tr>
    <tr>
      <td>Wins:</td>
      <td>${statBoard.p2wins}</td>
    </tr>
    <tr>
      <td>Win Percentage:</td>
      <td>${statBoard.p2winPct}%</td>
    </tr>
    <tr>
      <td>Current Win Streak:</td>
      <td>${statBoard.p2curWinStreak}</td>
    </tr>
    <tr>
      <td>Last Win Type:</td>
      <td>${statBoard.p2LastWinType}</td>
    </tr>
    <tr>
      <td>Losses:</td>
      <td>${statBoard.p2loss}</td>
    </tr>
  </table>
  `
  $('.stats-board').html(calcs);
}

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
    matrix.slice(6, 9),
    [matrix[0], matrix[3], matrix[6]],
    [matrix[1], matrix[4], matrix[7]],
    [matrix[2], matrix[5], matrix[8]],
    [matrix[0], matrix[4], matrix[8]],
    [matrix[2], matrix[4], matrix[6]]
  ]

  winCombos.forEach((combo, i) => {
    let str = combo.join('');
    if (str.match(re)){
      let winner = turnCounter % 2 === 0 ? 1 : 2;
      if(winner === 1){
        calculateStats(1, i);
      } else {
        calculateStats(2, i);
      }
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

$('.stats').click(() => {
  showStats();
  $('.stats-board').toggleClass('hidden');
  $('.stats').text() === 'Show Stats!' ?
  $('.stats').text('Hide Stats!') :
  $('.stats').text('Show Stats!');
})

$('.new').click(() => newGame())
newGame();