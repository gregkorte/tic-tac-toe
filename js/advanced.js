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
    for (let i = 0; i < 4; i++) {
      let row = $('<div></div>').addClass('row');
      for (let j = 0; j < 4; j++) {
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
  for(let i = 0; i < 64; i++){
    if ($(cells[i]).hasClass('current')){
      $(cells[i]).removeClass(`${turn} current`);
      $(cells[i]).addClass('unoccupied');
    }
  }
}

let checkWinState = () => {
  let re = /(X{4})|(O{4})/g;
  let matrix = mapBoard().map((o, i) => {
    return o[i] === null ? "f" : o[i];
  });

  let winCombos = [
    // 4X
    matrix.slice(0, 4),
    matrix.slice(4, 8),
    matrix.slice(8, 12),
    matrix.slice(12, 16),

    matrix.slice(16, 20),
    matrix.slice(20, 24),
    matrix.slice(24, 28),
    matrix.slice(28, 32),

    matrix.slice(32, 36),
    matrix.slice(36, 40),
    matrix.slice(40, 44),
    matrix.slice(44, 48),

    matrix.slice(48, 52),
    matrix.slice(52, 56),
    matrix.slice(56, 60),
    matrix.slice(60, 64),
    // 4X
    [matrix[0], matrix[4], matrix[8], matrix[12]],
    [matrix[1], matrix[5], matrix[9], matrix[13]],
    [matrix[2], matrix[6], matrix[10], matrix[14]],
    [matrix[2], matrix[7], matrix[11], matrix[15]],
    // 5X
    [matrix[0], matrix[5], matrix[10], matrix[15]],
    // 3X
    [matrix[3], matrix[6], matrix[9], matrix[12]],
    // 4X
    [matrix[16], matrix[20], matrix[24], matrix[28]],
    [matrix[17], matrix[21], matrix[25], matrix[29]],
    [matrix[18], matrix[22], matrix[26], matrix[30]],
    [matrix[19], matrix[23], matrix[27], matrix[31]],
    // 5X
    [matrix[16], matrix[21], matrix[26], matrix[31]],
    // 3X
    [matrix[19], matrix[22], matrix[25], matrix[28]],
    // 4X
    [matrix[32], matrix[36], matrix[40], matrix[44]],
    [matrix[33], matrix[37], matrix[41], matrix[42]],
    [matrix[34], matrix[38], matrix[42], matrix[46]],
    [matrix[35], matrix[39], matrix[43], matrix[47]],
    // 5X
    [matrix[32], matrix[37], matrix[42], matrix[47]],
    // 3X
    [matrix[35], matrix[38], matrix[41], matrix[44]],
    // 4X
    [matrix[48], matrix[52], matrix[56], matrix[60]],
    [matrix[49], matrix[53], matrix[57], matrix[61]],
    [matrix[50], matrix[54], matrix[58], matrix[62]],
    [matrix[51], matrix[55], matrix[59], matrix[63]],
    // 5X
    [matrix[48], matrix[53], matrix[58], matrix[63]],
    // 3X
    [matrix[51], matrix[54], matrix[57], matrix[60]],
    // 16X
    [matrix[0], matrix[16], matrix[32], matrix[48]],
    [matrix[1], matrix[17], matrix[33], matrix[49]],
    [matrix[2], matrix[18], matrix[34], matrix[50]],
    [matrix[3], matrix[19], matrix[35], matrix[51]],

    [matrix[4], matrix[20], matrix[36], matrix[52]],
    [matrix[5], matrix[21], matrix[37], matrix[53]],
    [matrix[6], matrix[22], matrix[38], matrix[54]],
    [matrix[7], matrix[23], matrix[39], matrix[55]],

    [matrix[8], matrix[24], matrix[40], matrix[56]],
    [matrix[9], matrix[25], matrix[41], matrix[57]],
    [matrix[10], matrix[26], matrix[42], matrix[58]],
    [matrix[11], matrix[27], matrix[43], matrix[59]],

    [matrix[12], matrix[28], matrix[44], matrix[60]],
    [matrix[13], matrix[29], matrix[45], matrix[61]],
    [matrix[14], matrix[30], matrix[46], matrix[62]],
    [matrix[15], matrix[31], matrix[47], matrix[63]],
    // 17X
    [matrix[0], matrix[17], matrix[34], matrix[51]],
    [matrix[4], matrix[21], matrix[38], matrix[55]],
    [matrix[8], matrix[25], matrix[42], matrix[59]],
    [matrix[12], matrix[29], matrix[46], matrix[63]],
    // 15X
    [matrix[3], matrix[18], matrix[33], matrix[48]],
    [matrix[7], matrix[22], matrix[37], matrix[52]],
    [matrix[11], matrix[26], matrix[41], matrix[56]],
    [matrix[15], matrix[30], matrix[45], matrix[60]],
    // 20X
    [matrix[0], matrix[20], matrix[40], matrix[60]],
    [matrix[1], matrix[21], matrix[41], matrix[61]],
    [matrix[2], matrix[22], matrix[42], matrix[62]],
    [matrix[3], matrix[23], matrix[43], matrix[63]],
    // 12X
    [matrix[12], matrix[24], matrix[36], matrix[48]],
    [matrix[13], matrix[25], matrix[37], matrix[49]],
    [matrix[14], matrix[26], matrix[38], matrix[50]],
    [matrix[15], matrix[27], matrix[39], matrix[51]],
    // 21X
    [matrix[0], matrix[21], matrix[42], matrix[63]],
    // 18X
    [matrix[3], matrix[22], matrix[41], matrix[60]],
    // 13X
    [matrix[12], matrix[25], matrix[38], matrix[51]],
    // 11X
    [matrix[15], matrix[26], matrix[37], matrix[48]]
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
    }
  });

  $('.move').click(() => {
    if($('span.cell').hasClass('current')){
      turnCounter++;
      turnCounter % 2 === 0 ? playerTurn = 2 : playerTurn = 1;
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

$('.new').click(() => newGame());

newGame();