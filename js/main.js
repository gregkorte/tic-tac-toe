;(function() {
	'use strict';

	var $board = $('.board');
	var $cellState = $('span.cell');
	var playerTurn = 1;
	var turnCounter = 1;
	
	$(function(){
	  for(var i = 0; i < 3; i++) {
	    var $row = $('<div></div>').addClass('row');
	    for(var j = 0; j < 3; j++) {
	      var $cell = $('<span></span>').addClass('cell unoccupied');
	      $row.append($cell); 
	    }
	    $board.append($row);
	  }
	});

	$(document).on('click', 'span.cell', function(){
		if ($(this).hasClass('unoccupied') && playerTurn === 1){
			$(this).removeClass('unoccupied');
			$(this).addClass('X occupied');
			console.log('I am player 1');
			console.log(playerTurn);
			console.log(turnCounter);
		} else if ($(this).hasClass('unoccupied') && playerTurn === 2){
				$(this).removeClass('unoccupied');
				$(this).addClass('O occupied');
				console.log('I am player 2');
				console.log(playerTurn);
				console.log(turnCounter);
		}
	});

	$('button.sendMove').click(function(){
  	turnCounter++;
 	});

 	$(function(){
		if (turnCounter%2 === 1){
  		playerTurn = 1;
  	} else playerTurn = 2;
	});

}())