$(document).ready(function(){

	
//Variables	declaration

	
	var boardArrayRand =  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
	var turns = 0;
	var boardArray;
	var buttonIdArray1 = [40,39,37,38];
	var buttonIdArray2 = [87,65,68,83];
	$('table').attr('id', 'timerStart');
	var seed;
	var timerWork;
	var timerWorking = false;
	var guide=0;
	
	
//Function declarations
	
	
	function Solve() {
		for (var i=0; i<15; i++) {
			$("td:eq("+i+")").html(i+1).removeClass("hidden");
			boardArray[i]=i+1;
		}
		$("td:eq(15)").html(0).addClass("hidden");
		boardArray[15]=0;
	}

	function RandomizeBoard() {
		var board = [99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99];
		for (var n = 0; n < 16; n++) {
			var a = Math.floor(Math.random()*16);
			if (board[a]==99) {
				board[a]=boardArrayRand[n]
				$("td:eq("+a+")").removeClass("hidden");}
			else n--;
			if (board[a]==0) {$("td:eq("+a+")").addClass("hidden");}
		}
		return board;
	}
	
	function WinCondition() {
		TimerStart();
		var tswitch = true;
		for (var d = 0; d < 16; d++) {
			if (boardArrayRand[d] != boardArray[d]) {
				tswitch = false;
			}
		}
		if (tswitch) {
			swal({   
				title: "You won!",   
				text: "Your score is : "+$("#number").html()+" in "+$("#time").html()+" seconds.",   
				imageUrl: "thumbs-up.jpg" 
			});
			$('table').attr('id', 'table1');
			TimerFinish();
		}
	}
	
	function display() {
		for (var i = 0; i < 16; i++) {
			$("td:eq("+i+")").html(boardArray[i]);
			if (boardArray[i]==0) $("td:eq("+i+")").html("");
		}
	}
	
	function moveTileX() {
		for (var i = 0; i < 16; i++) {
			if (boardArray[i]==0) return ((i-i%4)/4+1);
		}
	}
	
	function moveTileY() {
		for (var i = 0; i < 16; i++) {
			if (boardArray[i]==0) return (i%4+1);
		}
	}

	function currentlyMovable() {
		var moveX = moveTileX();
		var moveY = moveTileY();
		var place1 = 99,place2 = 99,place3 = 99,place4 = 99;
		if(((moveX-1)*4+moveY-1 -4)>=0) place1 = (moveX-1)*4+moveY-1 -4;
		if(((moveX-1)*4+moveY-1 -1)>=0) place2 = (moveX-1)*4+moveY-1 -1;
		if(((moveX-1)*4+moveY-1 +1)<=15) place3 = (moveX-1)*4+moveY-1 +1;
		if(((moveX-1)*4+moveY-1 +4)<=15) place4 = (moveX-1)*4+moveY-1 +4;
		return [place1,place2,place3,place4];
	}
	
	function hiddenTile(blankTile,target) {
		var bt1 = blankTile;
		var t1 = target;
		$("td:eq("+bt1+")").removeClass("hidden");
		$("td:eq("+t1+")").addClass("hidden");
	}
	
	function swap(a1,a2) {
		var temp = boardArray[a1];
		boardArray[a1] = boardArray[a2];
		boardArray[a2] = temp;
	}
	
	function RandomSeedGenerator () {
		t=undefined;
		Math.seedrandom(t);
		var currentSeed = 0;
		for(var i = 0; i< 4; i++) {
			currentSeed += Math.floor(Math.random()*10) * Math.pow(10,i);
		}
	return currentSeed;
	}
	
	function SeedSet(t) {
		Math.seedrandom(t);
	}

	function TimerStart(){
		if (!timerWorking) {
			timerWorking = true;
			var time = 0;
			var seconds = 0;
			var minutes = 0;
			timerWork = setInterval(function(){ 
				time++;
				if (time>59) {
					minutes = (time-time%60)/60;
					seconds = time%60;
				}
				else {
					seconds = time;
					minutes = 0;
				}
				if (seconds < 10) seconds = "0"+seconds;
				if (minutes < 10) minutes = "0"+minutes;
				$("#time").html(minutes+":"+seconds) }, 1000);
		}
	}
	
	function TimerFinish(){
		clearTimeout(timerWork);
		timerWorking = false;
	}
	
	function ClearTimer(){
		time = 0;
		seconds = 0;
		minutes = 0;
		if (seconds < 10) seconds = "0"+seconds;
		if (minutes < 10) minutes = "0"+minutes;
		$("#time").html(minutes+":"+seconds);
	}
	
	function setHeight() {
    windowHeight = $(window).innerHeight();
		$('body').css('min-height', windowHeight);
	};

	
//Pre-game stuff

	
	seed = RandomSeedGenerator().toString();
	SeedSet(seed);
	$('#seed').html(seed);
	$("#seedInput").addClass("hidden");
	$("#saveSeed").addClass("hidden");
	$("#colorInput").addClass("hidden");
	$("#saveColor").addClass("hidden");
	$("#backInput").addClass("hidden");
	$("#saveBack").addClass("hidden");
	boardArray = RandomizeBoard();
	display();
	setHeight();



//Game


	
	$(window).resize(function() {
		setHeight();

	});
	
	//Mouse click tile move
	for (var q = 0; q < 16; q++) {
		$("td:eq("+q+")").mousedown(function(event){
			var target = $(event.target).attr('id') - 1;
			var blankTile = (moveTileX()-1)*4+moveTileY()-1;
			var all = currentlyMovable();
			var p1 = all[0];
			var p2 = all[1];
			var p3 = all[2];
			var p4 = all[3];
			if (((target==p1)||(target==p2)||(target==p3)||(target==p4))&&(Math.abs(target%4-blankTile%4)<=1)) {
				swap(target,blankTile);
				display();
				hiddenTile(blankTile,target);
				turns++;
				$("#number").html(turns);
				WinCondition();
			}
		});
	}
	
	//Key press to move
	$(document).keydown(function(event){
		var code = event.keyCode || event.which;
		var blankTile = (moveTileX()-1)*4+moveTileY()-1;
		var all = currentlyMovable();
		for (var b = 0; b < buttonIdArray1.length + buttonIdArray2.length; b++) {
			if ((code == buttonIdArray1[b])||(code == buttonIdArray2[b-4])) {
				var temp = b;
				if (code == buttonIdArray2[b-4]) {temp = b - 4}
				var all = currentlyMovable();
				var c = all[temp];
				if ((all[temp] != 99)&&(Math.abs(c%4-blankTile%4)<=1)) {
					swap(c,blankTile);
					display();
					hiddenTile(blankTile,c);
					turns++;
					$("#number").html(turns);
					WinCondition();
				}
			}
		}
	});

});