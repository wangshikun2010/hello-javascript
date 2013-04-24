var isSoundEnabled, // 播放状态
	currentCell, 	// 获取当前点击元素
	isStartGame;	// 是否开始游戏

// 计时
var timeElapsed = 0,
	timer,
	newTime;

// 元素节点名称
var ndSudoku,
	ndSudokuPanel,
	ndSudokuTable,
	ndSudokuTime,
	ndAudio,
	ndSound,
	ndLabelSound,
	ndNumberTable;
var	ndButtonStart,
	ndButtonPause,
	ndButtonClear,
	ndButtonHelp,
	ndButtonRule;
var ndSudokuRule,
	ndSudokuPause,
	ndSudokuSeccess;
var ndSudokuKnow,
	ndSudokuContinue,
	ndSudokuOk;
var ndGameTime;

var currentState = [], 	// 记录当前矩阵情况
	userInput = [], 	// 记录那些单元格是要用户输入的
	initialState = []; 	// 程序生成的矩阵的初始状态
var gameDifficult; 		//矩阵中已经填的单元格的比例

window.onload = function() {
	isSoundEnabled = true;
	isDialogOpen = false;
	isStartGame = false;

	getNodes();
	addEventHandler(ndSound, 'click', changeSoundMode);
	// playSound('./sound/a.ogg');
	
	ndButtonRule.onclick = function() {
		if (isStartGame == false) {
			ndSudokuRule.style.display = 'block';
			ndSudokuKnow.onclick = function() {
				ndSudokuRule.style.display = 'none';
			}
		}
	}

	ndButtonStart.onclick = function() {
		if (isStartGame == true) {
			var newGame = confirm('你确定要重新开始游戏吗？');
			if (newGame) {
				ndSudokuPause.style.display = 'none';
				startTimer(true);
			} else {
				return;
			}
		} else {
			isStartGame = true;
			ndSudokuRule.style.display = 'none';
			startTimer(false);
		}

		getGameDiffculty();
		createSudokuTable(ndSudokuTable);
		addSudokuStyle();
		startSudoku();
		addNumberButtonEvents();
		bindNumberPadEvents();
		setClickButton();

		document.onclick = function() {
			var clickTag = event.srcElement;
			if (clickTag.tagName.toLowerCase() != "td") {
				ndNumberTable.style.display = 'none';
			}
			for (var i = 1; i <= 9; i++) {
				for (var j = 1; j <= 9; j++) {
					var cell = document.querySelector('#cell' + i + j);
					if (userInput[i][j] == false) {
						addEventHandler(cell, 'click', function() {
							ndNumberTable.style.display = 'none';
						});
					}
				}
			}
		}
	}
}

/**
 * 获取节点
 */
function getNodes() {
	ndSudoku = document.getElementById('j-sudoku');
	ndSudokuPanel = document.getElementById('j-sudoku-panel');
	ndSudokuTable = document.getElementById('j-sudoku-table');
	ndSudokuTime = document.getElementById('j-sudoku-time');
	ndAudio = document.getElementById('j-audio');
	ndSound = document.getElementById('j-sound');
	ndLabelSound = document.getElementById('j-label-sound');
	ndNumberTable = document.getElementById('j-number-table');

	ndButtonStart = document.getElementById('j-btn-start');
	ndButtonPause = document.getElementById('j-btn-pause');
	ndButtonClear = document.getElementById('j-btn-clear');
	ndButtonHelp = document.getElementById('j-btn-help');
	ndButtonRule = document.getElementById('j-btn-rule');

	ndSudokuRule = document.getElementById('j-sudoku-rule');
	ndSudokuPause = document.getElementById('j-sudoku-pause');
	ndSudokuSeccess = document.getElementById('j-sudoku-seccess');

	ndSudokuKnow = document.getElementById('j-know');
	ndSudokuContinue = document.getElementById('j-continue');
	ndSudokuOk = document.getElementById('j-ok');

	ndGameTime = document.getElementById('j-game-time');
}

/**
 * 获取游戏难度
 */
function getGameDiffculty() {
	var radios = document.getElementsByName('radio');
	for (var i=0; i<radios.length; i++) {
		if (radios[i].checked) {
			gameDifficult = radios[i].value;
		}
	}
}

/**
 * 创建数独table
 */
function createSudokuTable(parent) {
	removeChildren(parent);
	for (var i=1; i<=9; i++) {
		var tr = document.createElement('tr');
		for (var j=1; j<=9; j++) {
			var cell = document.createElement('td');
			cell.id = 'cell' + i + j;
			tr.appendChild(cell);
		}
		parent.appendChild(tr);
	}
}

/**
* 删除父节点下的所有子节点
*/
function removeChildren(parentnode) {
	var childs = parentnode.childNodes;
	// 此处循环必须这样写,不然会报错
	for (var i=childs.length-1; i>=0; i--) {
		parentnode.removeChild(childs[i]);
	}
}

/**
 * 添加样式
 */
function addSudokuStyle() {
	var row = ndSudokuTable.rows;
	for (var i=0; i<row.length; i++) {
		if (i == 2 || i == 5) {
			row[i].setAttribute('class', 'rowborder');
		}

		for (var j = 0; j < row[i].cells.length; j++) {
			if (j == 2 || j == 5) {
				row[i].cells[j].setAttribute('class', 'cellborder');
			}
		}
	}
}

/**
 * 播放声音
 */
function  playSound(source) {
	if (isSoundEnabled == true) {
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

/**
 * 获取点击对象
 */
function setClickButton() {
	var dialogs = {
		pause: ndSudokuPause,
		rule: ndSudokuRule
	};

	var dialogButtons = document.querySelectorAll('#j-btn-pause, #j-btn-rule');
	for (var i=0, length=dialogButtons.length; i<length; i++) {
		addEventHandler(dialogButtons[i], 'click', function (event) {
			var dialog = this.getAttribute('data-dialog');
			
			for (var key in dialogs) {
				if (key === dialog) {
					if (dialog == 'pause') {
						stopTimer();
						ndSudokuPause.style.display = 'block';
						ndSudokuContinue.onclick = function() {
							startTimer(false);
							ndSudokuPause.style.display = 'none';
						}
					}
				}
			}

		});
	}
}

/**
 * 将秒数转换为时分秒格式
 */
function formatTime(number) {
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
function startTimer(isReset) {
	if (isReset) {
		newTime = true;
		stopTimer();
	}
	ndSudokuTime.innerText = formatTime(timeElapsed);
	timeElapsed = timeElapsed + 1;
	timer = setTimeout('startTimer()',1000);
}

/**
 * 停止计时
 */
function stopTimer() {
	if (newTime) {
		timeElapsed = 0;
	}
	clearTimeout(timer);
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

		// isConflict变量用于记录数字k能否放在(i,j)处
		var isConflict = false;

		for (var m = 1; m < i; m++) {
			// 检查同一列是否出现过数字k
			if (initialState[m][j] == k) {
				isConflict = true;
				break;
			}
		}

		if (isConflict === false) {
			for (var n = 1; n < j; n++) {
				//检查同一行是否出现过数字k
				if (initialState[i][n] == k) {
					isConflict = true;
					break;
				}
			}
		}
		
		// 检查在3×3的小方格中是否出现过数字k
		if (isConflict === false) {
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
					if (initialState[p][q] == k) {
						isConflict = true;
						break;
					}
				}
				if (isConflict == true) { 
					break;
				}
			}
		}

		if (isConflict === false) {
			initialState[i][j] = k;
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
			initialState[i][j] = 0; // 关键这一步：找不到解就要回复原状 
		}
	}
	return false;
}

/**
 * 生成矩阵初始状态
 */
function startSudoku() {
	for (var i = 1; i <= 9; i++) {
		currentState[i] = [];
		userInput[i] = [];
		initialState[i] = [];
		for(var j = 1; j <= 9; j++) {
			currentState[i][j] = 0;
			userInput[i][j] = false;
			initialState[i][j] = 0;
		}
	}

	//顺序给出第一排数字
	for (var i = 1; i <= 9; i++) { 
		initialState[1][i] = i;
	} 

	/* 第一行数字打乱顺序 */
	for (var i = 1; i <= 9; i++) {

		//产生1到9间的随机数
		var randomNumber = parseInt(Math.random() * 8 + 1);

		var temp = initialState[1][i];

		//交换第i个数字与第randomNumber个数字
		initialState[1][i] = initialState[1][randomNumber];
		initialState[1][randomNumber] = temp;
	}

	getInitial(2,1);
	
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			var cell = document.querySelector('#cell' + i + j);

			// 按照比例向表格中填入数字
			if (Math.random() < gameDifficult) {
				// 已填充的单元格
				cell.innerText = initialState[i][j];
				currentState[i][j] = initialState[i][j];
				cell.style.backgroundColor = '#FFFFFF';
				cell.style.color = '#000000';
			} else {
				// 未填充的单元格
				cell.innerText = "";
				userInput[i][j] = true;
				cell.style.backgroundColor = '#F3FDFF';
				cell.style.color = 'red';
			}
		}
	}
}

/**
 * 给td元素添加事件
 */
function addNumberButtonEvents() {
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			var cell = document.querySelector('#cell' + i + j);
			// 向表格中填入数字
			if (userInput[i][j] == true) {
				addEventHandler(cell, 'click', function() {
					ndNumberTable.style.display = 'block';
					ndNumberTable.style.left = (getElementLeft(this) - 12) + 'px';
					ndNumberTable.style.top = (getElementTop(this) - 12) + 'px';
					currentCell = this;
				});
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
function bindNumberPadEvents() {
	var divs = document.getElementById('j-number-table').querySelectorAll('div');
	for (var i = 0; i < divs.length; i++) {
		divs[i].onclick = function() {
			if (!currentCell) {
				return;
			}
			currentCell.innerText = this.innerText;
			ndNumberTable.style.display = 'none';
			var row = currentCell.id.substring(4,5);
			var col = currentCell.id.substring(5);
			currentState[row][col] = this.innerText;
			console.log(row,col);
			console.log(currentState[row][col]);
			checkFinish(row,col);
		}
	}
}

/**
 * 检测输入
 */
function checkFinish(x,y) {
	var rowRepeat;
	var colRepeat;
	var blockRepeat;
	
	// 验证重复元素，有重复返回true；否则返回false
	function isRepeat(arr) {
		var hash = {};
		for (var i in arr) {
			if (hash[arr[i]]) {
				return true;
			}
			// 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
			hash[arr[i]] = true;
		}
		return false;
	}

	var row = ndSudokuTable.rows[x - 1];
	var rowArray = [];
	for (var i=0; i<row.cells.length; i++) {
		if (row.cells[i].innerText != '') {
			rowArray.push(row.cells[i].innerText);			
		}
	}
	console.log(rowArray);
	rowRepeat = isRepeat(rowArray);
	console.log(rowRepeat);

	for (var i=0; i<row.cells.length; i++) {
		if (rowRepeat == true && row.cells[i].innerText != '') {
			row.cells[i].style.background = '#EEEEEE';
		} else {
			row.cells[i].style.background = '';
		}
	}

	var rows = ndSudokuTable.rows;
	var colArray = [];
	for (var i=0; i<rows.length; i++) {
		for (var j=0; j<rows[i].cells.length; j++) {
			if (j == y-1 && rows[i].cells[j].innerText != '') {
				colArray.push(rows[i].cells[j].innerText);
			}
		}
	}
	console.log(colArray);
	colRepeat = isRepeat(colArray);

	for (var i=0; i<rows.length; i++) {
		for (var j=0; j<rows[i].cells.length; j++) {
			if ((j == y-1) && (rows[i].cells[j].innerText != '') && (i != x - 1)) {
				if (colRepeat == true) {
					rows[i].cells[j].style.background = '#EEEEEE';
				} else {
					rows[i].cells[j].style.background = '';
				}
			}
		}
	}

	var group = [];
	for (var i = 0; i < 9; i++) {
		group[i] = [];
	}
	for (var i = 0; i < rows.length; i++) {
		for (var j = 0; j < rows[i].cells.length; j++) {
			if (i < 3) {
				if (j < 3) {
					group[0].push(rows[i].cells[j]);
				} else if (j >= 3 && j < 6) {
					group[1].push(rows[i].cells[j]);
				} else {
					group[2].push(rows[i].cells[j]);
				}
			} else if (i >= 3 && i < 6) {
				if (j < 3) {
					group[3].push(rows[i].cells[j]);
				} else if (j >= 3 && j < 6) {
					group[4].push(rows[i].cells[j]);
				} else {
					group[5].push(rows[i].cells[j]);
				}
			} else {
				if (j < 3) {
					group[6].push(rows[i].cells[j]);
				} else if (j >= 3 && j < 6) {
					group[7].push(rows[i].cells[j]);
				} else {
					group[8].push(rows[i].cells[j]);
				}
			}
		}
	}

	var isConflict;
	var blockArray = [];
	var solve;
	for (var i = 0; i < 9; i++) {
		for (var j=0; j<group[i].length; j++) {
			if (group[i][j].id == 'cell'+ x + y) {
				console.log(group[i]);
				for (var k=0; k<group[i].length; k++) {
					blockArray.push(group[i][k].innerText);
				}
				console.log(blockArray);
				blockRepeat = isRepeat(blockArray);
				// for (var k=0; k<group[i].length; k++) {
				// 	if ((blockRepeat == true) && group[i][k].innerText != '' && group[i][k].id != 'cell'+ x + y) {
				// 		group[i][k].style.background = '#EEEEEE';
				// 	} else {
				// 		group[i][k].style.background = '';
				// 	}
				// }
				isConflict = true;
			}
			if (isConflict == true) {
				break;
			}
		}
	}

	var sudokuArray = [];
	for (var i=0; i<rows.length; i++) {
		for (var j=0; j<rows[i].cells.length; j++) {
			if (rows[i].cells[j].innerText != '') {
				sudokuArray.push(rows[i].cells[j].innerText);
			}
		}
	}
	if (sudokuArray.length == 81 && rowRepeat == false && colRepeat == false && blockRepeat == false) {
		// 游戏成功时停止计时并显示时间
		stopTimer();
		var gameTime = formatTime(timeElapsed);
		ndGameTime.innerText = gameTime;

		// 单元格设置为不可编辑状态
		deleteNumberButtonEvents();
		ndSudokuSeccess.style.display = 'block';
		ndSudokuOk.onclick = function() {
			ndSudokuSeccess.style.display = 'none';
			isStartGame = false;
		}
	}
}

/**
 * 删除td元素事件
 */
function deleteNumberButtonEvents() {
	for (var i = 1; i <= 9; i++) {
		for (var j = 1; j <= 9; j++) {
			var cell = document.querySelector('#cell' + i + j);
			if (userInput[i][j] == true) {
				addEventHandler(cell, 'click', function() {
					ndNumberTable.style.display = 'none';
				});
			}
		}
	}
}

/**
 * 添加事件监听
 */
function addEventHandler(oTarget, sEventType, fnHandler){
	if (oTarget.addEventListener) {//非IE
		oTarget.addEventListener(sEventType, fnHandler, false);
	} else if (oTarget.attachEvent) {//IE
		oTarget.attachEvent('on' + sEventType, fnHandler);
	} else {
		oTarget['on' + sEventType] = fnHandler;
	}
}