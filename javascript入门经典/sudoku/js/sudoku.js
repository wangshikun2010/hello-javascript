var isPlaySoundInputed; //播放状态
var isClick; //点击
var isAClick; //点击确定
var isCreateTable;
var isGetnumber;
var that;

//元素节点名称
var ndSudoku;
var ndSudokuTable;
var ndSudokuTime;
var ndSudokuStart;
var ndSudokuPause;
var ndSudokuClear;
var ndSudokuHelp;
var ndSudokuRuler;
var ndAudio;
var ndSound;
var ndLabelSound;
var ndNumberTable;

var CurrentState = []; //记录当前矩阵情况
var UserInput = []; //记录那些单元格是要用户输入的
var InitialState = [];  //程序生成的矩阵的初始状态

/**
 * 获取节点
 */
function getNode() {
	ndSudoku = document.getElementById('j-sudoku');
	ndSudokuTable = document.getElementById('j-sudoku-table');
	ndSudokuTime = document.getElementById('j-sudoku-time');
	ndSudokuStart = document.getElementById('j-sudoku-start');
	ndSudokuPause = document.getElementById('j-sudoku-pause');
	ndSudokuClear = document.getElementById('j-sudoku-clear');
	ndSudokuHelp = document.getElementById('j-sudoku-help');
	ndSudokuRuler = document.getElementById('j-sudoku-ruler');
	ndAudio = document.getElementById('j-audio');
	ndSound = document.getElementById('j-sound');
	ndLabelSound = document.getElementById('j-label-sound');
	ndNumberTable = document.getElementById('j-number-table');	
}

window.onload = function() {
	isPlaySoundInputed = true;
	isClick = false;
	isAClick = false;
	isCreateTable = false;
	isGetnumber = false;

	for (var i = 0; i < 9; i++) {
		CurrentState[i] = [];
		UserInput[i] = [];
		InitialState[i] = [];

		for (var j = 0; j < 9; j++) {
			CurrentState[i][j] = 0;
			UserInput[i][j] = false;
			InitialState[i][j] = 0;
		}
	}

	getNode();
	addSudokuStyle();
	ndSound.addEventListener('click',function() {changeSoundMode();},false);

	ndSudokuRuler.onclick = function() {
		if ((isClick == true && isAClick == true) || isClick == false) {
			var string1 = "用1至9之间的数字填满空格，一个格子只能填入一个数字,即每个数字在每一行、每一列和每一区只能出现一次";
			var string2 = "我知道了";
			displaySudokuRuler(string1, string2);
		} else if (isClick == true || isAClick == false) {
			return;
		}
	}

	ndSudokuStart.onclick = function() {
		startTiming();
	}

	ndSudokuPause.onclick = function() {
		if ((isClick == true && isAClick == true) || isClick == false) {
			var string1 = '暂停';
			var string2 = '继续';
			stopTime();
			displaySudokuRuler(string1, string2);
		} else if (isClick == true || isAClick == false) {
			return;
		}
	}

	// playSound('./sound/a.mp3');
	setNumberButton();
	// start();
	// partitionBlock();
}

/**
 * 显示数独规则
 */
function displaySudokuRuler(string1, string2) {
	//create a div
	var newDiv = document.createElement("div");
	newDiv.setAttribute('id', 'new-div');
	newDiv.setAttribute('class', 'block');
	newDiv.innerText = string1;
	ndSudoku.appendChild(newDiv);

	//craete a link
	var newA = document.createElement("a");
	newA.href = "#";
	newA.setAttribute('id', 'new-a');
	newA.setAttribute('class', 'block');
	newA.innerText = string2;
	newDiv.appendChild(newA);

	isClick = true;
	isAClick = false;
	newA.onclick = function() {
		isAClick = true;
		if (newA.innerText == '继续') {
			startTiming();
		}
		ndSudoku.removeChild(newDiv);
		return false;
	}
}

/**
 * 将秒数转换为时分秒格式
 */
function timeTransform(number) {
	var hours;
	var minutes;
	var seconds;

	//传入的时间为空或小于0
	if(number == null || number < 0) {
		return;
	}

	//得到小时
	hours = parseInt(number / 3600);
	number = parseInt(number) - hours * 3600;
	if (parseInt(hours) < 10) {
		hours = "0" + hours;
	}

	//得到分
	minutes = parseInt(number / 60);
	if (parseInt(minutes) < 10) {
		minutes = "0" + minutes;
	}

	//得到秒
	seconds = parseInt(number) - minutes * 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	return hours + ":" + minutes + ":" + seconds;
}

/**
 * 开始计时
 */
var c = 0;
var time;
function startTiming() {
	ndSudokuTime.innerText = timeTransform(c);
	c = c + 1;
	time = setTimeout('startTiming()',1000);
}

function stopTime() {
	clearTimeout(time);
}

/**
 * 生成9个小数独
 */

//搜索生成矩阵初始状态
function start() {
	var row = ndSudokuTable.rows;
	for (var i = 0; i < row.length; i++) {
		for (var j = 0; j < row[i].cells.length; j++) {
			var randomNumber = parseInt( Math.random() * 9 + 1 ); //产生1到9间的随机数
			row[i].cells[j].innerHTML = randomNumber;
		}
	}
}

function partitionBlock() {
	for (var i = 0; i < 9; i++) {
		InitialState[i] = [];
	}
	var row = ndSudokuTable.rows;
	for (var i = 0; i < row.length; i++) {
		for (var j = 0; j < row[i].cells.length; j++) {
			if (i < 3) {
				if (j < 3) {
					InitialState[0].push(row[i].cells[j]);
				} else if (j >= 3 && j < 6) {
					InitialState[1].push(row[i].cells[j]);
				} else {
					InitialState[2].push(row[i].cells[j]);
				}
			} else if (i >= 3 && i < 6) {
				if (j < 3) {
					InitialState[3].push(row[i].cells[j]);
				} else if (j >= 3 && j < 6) {
					InitialState[4].push(row[i].cells[j]);
				} else {
					InitialState[5].push(row[i].cells[j]);
				}
			} else {
				if (j < 3) {
					InitialState[6].push(row[i].cells[j]);
				} else if (j >= 3 && j < 6) {
					InitialState[7].push(row[i].cells[j]);
				} else {
					InitialState[8].push(row[i].cells[j]);
				}
			}
		}
	}

	for (var i = 0; i < 9; i++) {
		console.log(InitialState[i]);
	}


}

/**
 * 给td元素添加事件
 */
function setNumberButton() {
	var row = ndSudokuTable.rows;
	for (var i = 0; i < row.length; i++) {
		for (var j = 0; j < row[i].cells.length; j++) {
			var cell = row[i].cells[j];
			cell.id = 'td' + i + j;
			cell.addEventListener('click', function() {
				ndNumberTable.style.display = 'block';
				ndNumberTable.style.left = getElementLeft(this) + 'px';
				ndNumberTable.style.top = getElementTop(this) + 'px';

				var text = getTdNumber();
				if (text != undefined) {
					this.innerText = text;
				}
			},false);
		}
	}
}

function getElementLeft(element){
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;

	while (current !== null){
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}

	return actualLeft;
}

function getElementTop(element){
	var actualTop = element.offsetTop;
	var current = element.offsetParent;

	while (current !== null){
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}

	return actualTop;
}

function getTdNumber() {
	var tdText;
	console.log(document.getElementById('j-number-table'));
	var row = document.getElementById('j-number-table').rows;
	for (var i = 0; i < row.length; i++) {
		for (var j = 0; j < row[i].cells.length; j++) {
			var cell = row[i].cells[j];
			cell.addEventListener('click', function() {
				console.log(this.innerText);
				tdText = this.innerText;
				ndNumberTable.style.display = 'none';
				return tdText;
			},false);
		}
	}
}

/**
 * 生成数独
 */
function createSudoku() {
}

/**
 * 添加样式
 */
function addSudokuStyle() {
	var row = ndSudokuTable.rows;
	for (var i=0; i<row.length; i++) {
		for (var j = 0; j < row[i].cells.length; j++) {
			if (j == 2 || j == 5) {
				row[i].cells[j].style.borderRight = 3 + 'px';
				row[i].cells[j].style.borderStyle = 'solid';
				row[i].cells[j].style.borderColor = '#87C7EC';
			}
		}
	}
}

/**
 * 播放声音
 */
function  playSound(source) {
	if (isPlaySoundInputed == true) {
		ndAudio.setAttribute('src', source);
	}
}

/**
 * 改变声音播放状态
 */
function changeSoundMode() {
	if (ndSound.checked) {
		ndAudio.volume = 0;
	} else {
		ndAudio.volume = 1;
	}
}