var isPlaySoundInputed; //播放状态
var isClick; //点击
var isAClick;

//元素节点名称
var ndSudoku;
var ndSudoku_table;
var ndSudoku_time;
var ndSudoku_start;
var ndSudoku_pause;
var ndSudoku_clear;
var ndSudoku_help;
var ndSudoku_ruler;
var ndAudio;
var ndSound;
var ndLabel_sound;

window.onload = function() {
	isPlaySoundInputed = true;
	isClick = false;
	isAClick = false;

	ndSudoku = document.getElementById('j-sudoku');
	ndSudoku_table = document.getElementById('j-sudoku-table');
	ndSudoku_time = document.getElementById('j-sudoku-time');
	ndSudoku_start = document.getElementById('j-sudoku-start');
	ndSudoku_pause = document.getElementById('j-sudoku-pause');
	ndSudoku_clear = document.getElementById('j-sudoku-clear');
	ndSudoku_help = document.getElementById('j-sudoku-help');
	ndSudoku_ruler = document.getElementById('j-sudoku-ruler');
	ndAudio = document.getElementById('j-audio');
	ndSound = document.getElementById('j-sound');
	ndLabel_sound = document.getElementById('j-label-sound');

	ndSound.addEventListener('click',function() {changeSoundMode();},false);

	ndSudoku_ruler.onclick = function() {
		if ((isClick == true && isAClick == true) || isClick == false) {
			var string1 = "用1至9之间的数字填满空格，一个格子只能填入一个数字,即每个数字在每一行、每一列和每一区只能出现一次";
			var string2 = "我知道了";
			displaySudokuRuler(string1, string2);
		} else if (isClick == true || isAClick == false) {
			return;
		}
	}

	ndSudoku_start.onclick = function() {
		startTiming();
	}

	ndSudoku_pause.onclick = function() {
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
	ndSudoku_time.innerText = timeTransform(c);
	c = c + 1;
	time = setTimeout('startTiming()',1000);
}

function stopTime() {
	clearTimeout(time);
}

/**
 * 给td元素添加事件
 */
function setNumberButton() {
	var ceiltable = document.querySelectorAll('.ceiltable');

	for (var i = 0; i < ceiltable.length; i++) {
		var row = ceiltable[i].rows;

		for (var j = 0; j < row.length; j++) {
			for (var k = 0; k < row[j].cells.length; k++) {
				var cell = row[j].cells[k];
				cell.addEventListener('click', function() {
					var ndNumber_ceiltable = ndSudoku_table.querySelectorAll('.number-ceiltable');
					console.log(ndNumber_ceiltable.length);

					// for (var t=0; t<ndNumber_ceiltable.length; t++) {
					// 	removeChildren(ndNumber_ceiltable[i]);
					// }

					createNumberutton(this);
				},false);
			}
		}
	}
}

/**
* 删除父节点下的所有子节点
*/
function removeChildren(parentnode) {
	var childs = parentnode.childNodes;
	for (var i=0; i<childs.length; i++) {
		parentnode.removeChild(childs[i]);
	}
}

/**
 * 创建数字按钮table
 */
function createNumberutton(node) { 
	table = document.createElement("table");
	table.setAttribute('class', 'number-ceiltable');
	var k = 1;

	for (var i=1; i<4; i++) {
		var row = document.createElement("tr"); 
		row.id = i;
		for (var j=1; j<4; j++) {
			var cell = document.createElement("td"); 
			cell.id = i + '_' + j;

			cell.appendChild(document.createTextNode(k)); 
			row.appendChild(cell);
			k = k + 1;
		}
		table.appendChild(row);
	}

	node.appendChild(table);
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