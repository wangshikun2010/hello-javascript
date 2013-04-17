var isPlaySoundInputed; //播放状态
var isClick; //点击
var isAClick; //点击确定
var isGetnumber;
var that;
var isClickTd;

//元素节点名称
var ndSudoku;
var ndSudokuPanel;
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

var Current_State = []; //记录当前矩阵情况
var User_Input = []; //记录那些单元格是要用户输入的
var Initial_State = [];  //程序生成的矩阵的初始状态

for (var i = 1; i <= 9; i++) {
	Current_State[i] = [];
	User_Input[i] = [];
	Initial_State[i] = [];
	for(var j = 1; j <= 9; j++) {
		Current_State[i][j] = 0;
		User_Input[i][j] = false;
		Initial_State[i][j] = 0;
	}
}
var Proportion_Filled = 0.9; //矩阵中已经填的单元格的比例

/**
 * 获取节点
 */
function getNode() {
	ndSudoku = document.getElementById('j-sudoku');
	ndSudokuPanel = document.getElementById('j-sudoku-panel');
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
	isGetnumber = false;
	isClickTd = false;

	getNode();
	ndSound.addEventListener('click',function() {changeSoundMode();},false);
	ndSudoku.onclick = function() {
		var clickTag = event.srcElement;
		if (clickTag.tagName.toLowerCase() != "td") {
			ndNumberTable.style.display = 'none';
		}
	}

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
 * 搜索第(i,j)位置处可以存储的数字
 */
function getInitial(i,j) {
	// 处理超出范围的情况
	if (i > 9 || j > 9) {
		return true;
	}

	// k表示数字的范围
	for (var k = 1; k <= 9; k++) {
		// can变量用于记录数字k能否放在(i,j)处
		var can = true;
		for (var m = 1; m < i; m++) {
			// 检查同一列是否出现过数字k
			if (Initial_State[m][j] == k) {
				can = false;
				break;
			}
		}

		if (can == true) {
			for (var n = 1; n < j; n++) {
				//检查同一行是否出现过数字k
				if (Initial_State[i][n] == k) {
					can = false;
					break;
				}
			}
		}
		
		// 检查在3×3的小方格中是否出现过数字k
		if (can == true) {
			var up_i = parseInt( i/3 ) * 3 + 3; //小方格在i坐标的上限
			var up_j = parseInt( j/3 ) * 3 + 3; //小方格在j坐标的上限
			
			//这是针对特殊情况的处理
			if (i % 3 == 0) {
				up_i = i;
			}
				 
			if (j % 3 == 0) {
				up_j = j;
			}
	
			for (var p = up_i-2; p <= up_i; p++) {
				for (var q = up_j-2; q <= up_j; q++) {
					if (Initial_State[p][q] == k) {
						can = false;
						break;
					}
				}
				if (can == false) { 
					break;
				}
			}
		}

		if (can) {
			Initial_State[i][j] = k;
			if (j < 9) {
				// 到同一行的下一位置开始搜索
				if (getInitial(i,j+1)) {  
					return true;
				}
			} else {
				if (i < 9) {
					// 到下一行开始搜索
					if (getInitial(i+1,1)) {    
						return true;
					}
				} else {
					return true; //i>=9 && j>=9,搜索结束
				}
			}
			Initial_State[i][j] = 0; // 关键这一步：找不到解就要回复原状 
		}
	}
	return false;
}

/**
 * 生成矩阵初始状态
 */
function startSudoku() {

	//将所有的数字为0
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			Initial_State[i][j] = 0;
		}
	}

	//顺序给出第一排数字
	for (var i = 1; i <= 9; i++) { 
		Initial_State[1][i] = i;
	} 

	/* 第一行随机排列产生 */
	for (var i = 1; i <= 9; i++) {

		//产生1到9间的随机数
		var randomNumber = parseInt(Math.random() * 8 + 1);

		var temp = Initial_State[1][i];

		//交换第i个数字与第randomNumber个数字
		Initial_State[1][i] = Initial_State[1][randomNumber];
		Initial_State[1][randomNumber] = temp;
	}

	getInitial(2,1);
	
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			var cell_i_j = eval( "document.getElementsByTagName(\"*\").cell" + i + j );
			// 向表格中填入数字
			if (Math.random() < Proportion_Filled) {
				cell_i_j.innerText = Initial_State[i][j]; // 0.8的概率设为已填数字
				Current_State[i][j] = Initial_State[i][j];
			} else {
				cell_i_j.innerText = ""; // 0.2的概率设为空白
				User_Input[i][j] = true;
				cell_i_j.style.backgroundColor = '#CCCCCC'; // 空单元格背景颜色
			}
		}
	}
}

//检测输入
function checkFinish() {
	var solve = true;
	var array1 = [];

	// console.log(ndSudokuTable);
	var row = ndSudokuTable.rows;
	for (var i=0; i<row.length; i++) {
		console.log(row[0]);
		for (var j=0; j<row[i].cells.length; j++) {
			console.log(row[0].cells[j].innerText);
			array1.push(row[0].cells[j].innerText);
		}
		break;
	}
	console.log(array1);
}

/**
 * 给td元素添加事件
 */
function setNumberButton() {
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			var cell_i_j = eval( "document.getElementsByTagName(\"*\").cell" + i + j );
			// 向表格中填入数字
			if (User_Input[i][j] == true) {
				cell_i_j.addEventListener('click', function() {
					ndNumberTable.style.display = 'block';
					ndNumberTable.style.left = (getElementLeft(this) - 12) + 'px';
					ndNumberTable.style.top = (getElementTop(this) - 12) + 'px';
					
					that = this;
					getTdNumber();
				},false);
			}
		}
	}
}

/**
 * 获取元素距页面左距离
 */
function getElementLeft(element){
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;

	while (current !== null){
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}

	return actualLeft;
}

/**
 * 获取元素距页面顶距离
 */
function getElementTop(element){
	var actualTop = element.offsetTop;
	var current = element.offsetParent;

	while (current !== null){
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}

	return actualTop;
}

/**
 * 获取Td元素的值
 */
function getTdNumber() {
	var divs = document.getElementById('j-number-table').querySelectorAll('div');
	for (var i = 0; i < divs.length; i++) {
		divs[i].onclick = function() {
			that.innerText = this.innerText;
			ndNumberTable.style.display = 'none';
			var thatId = that.id;
			var string1 = thatId.substring(4,5);
			var string2 = thatId.substring(5);
			Current_State[string1][string2] = this.innerText;
			checkFinish();
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