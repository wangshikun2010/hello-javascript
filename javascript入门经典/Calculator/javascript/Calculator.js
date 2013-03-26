var isOperatorInputed; //操作状态
var operator; //操作符
var num1; //第一个数
var num2; //第二个数
var buttons = [];
var storage; //储存数据标志变量
var old_operator;
var localvalue;

/**
 * 设置开始状态
 */
window.onload = function setStartState() {
	isOperatorInputed = false;
	operator = "isempty";
	num1 = 0;
	storage = false;
	var calc_inner_number = document.getElementById('calc_inner_number');
	var calc_inner_operator = document.getElementById('calc_inner_operator');
	calc_inner_number.innerText = '0';
	bindButtonHandlers();
}

/**
 * 为按钮绑定事件
 */
function bindButtonHandlers() {
	buttons = document.getElementsByTagName('li');
	for (var i=0; i<buttons.length; i++) {
		var text = buttons[i].innerText;
		var buttonHandler = function () {};
		switch(text) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
				buttonHandler = createNumberButtonHandler(text);
				break;
			case '＋':
			case '－':
			case '×':
			case '÷':
				buttonHandler = createOperatorButtonHandler(text);
				break;
			case '.':
				buttonHandler = addPoint;
				break;
			case '=':
				buttonHandler = getResult;
				break;
			case 'AC':
				buttonHandler = clearResult;
				break;
			case 'DEL':
				buttonHandler = deleteNumber;
				break;
			case '+/-':
				buttonHandler = changeNumber;
				break;
			case 'sin':
			case 'cos':
			case 'tan':
			case 'EXP':
			case 'log':
			case '%':
				buttonHandler = createMathFunctionButtonHandler(text);
				break;
			case 'MS':
			case 'MR':
			case 'M＋':
				buttonHandler = createValueButtonHandler(text);
				break;

		}
		buttons[i].addEventListener('click',buttonHandler,false);
	}
}

/**
* 创建1个数字按钮的回调函数
*/
function createNumberButtonHandler(number) {
	return function() {
		addNumber(number);
	}
}

/**
* 创建1个运算符按钮的回调函数
*/
function createOperatorButtonHandler(operator) {
	return function() {
		setOperator(operator);
	}
}

/**
* 创建1个数学函数按钮的回调函数
*/
function createMathFunctionButtonHandler(mathFunction) {
	return function() {
		mathFun(mathFunction);
	}
}

/**
* 创建1个储存数值按钮的回调函数
*/
function createValueButtonHandler(value) {
	return function() {
		localValue(value);
	}
}

/**
 * 添加数字
 */
function addNumber(number) {
	if (storage == true) {
		calc_inner_number.innerText = number;
		storage = false;
	} else {
		if (isOperatorInputed == true) {
			calc_inner_number.innerText = number;
			isOperatorInputed = false;
		} else {
			if (calc_inner_number.innerText == "0") {
				calc_inner_number.innerText = number;
			} else {
				calc_inner_number.innerText += number;
			}
		}
	}
}

/**
 * 添加小数点
 */
function addPoint() {
	if ((calc_inner_number.innerText).lastIndexOf('.') == -1) {
		console.log('按下了点');
		calc_inner_number.innerText += ".";
	} else {
		console.log('按下点没用');
		return false;
	}
}

/**
 * 设置操作符
 */
function setOperator(oper) {
	isOperatorInputed = true;
	if (operator == "isempty") {
		num1 = calc_inner_number.innerText;
		operator = oper;
		calc_inner_operator.innerText = oper;
	} else {
		oper = oper.charAt(oper.length - 1);
		operator = oper;
		getResult();
	}
}

/**
 * 计算结果
 */
function getResult() {
	if (operator != "isempty") {
		old_operator = operator;
		var number1 = parseFloat(num1);

		if (storage == true) {
			var number2 = num2;
		} else {
			var number2 = parseFloat(calc_inner_number.innerText);
		}
		num2 = number2;

		switch(operator) {
			case "＋":
				result = number1 + number2;
				break;
			case "－":
				result = number1 - number2;
				break;
			case "×":
				result = number1 * number2;
				break;
			case "÷":
				result = number1 / number2;
				break;
		}
		calc_inner_operator.innerText = '';
		num1 = result;
		console.log('' + number1 + operator + number2 + '=' + result);
		calc_inner_number.innerText = result;
		operator = "isempty";
		storage = true;
	} else {
		if (storage == true) {
			switch(old_operator) {
				case "＋":
					result = (num1) + (num2);
					break;
				case "－":
					result = (num1) - (num2);
					break;
				case "×":
					result = (num1) * (num2);
					break;
				case "÷":
					result = (num1) / (num2);
					break;
			}
		}
		console.log('' + num1 + old_operator + num2 + '=' + result);
		calc_inner_number.innerText = result;
		num1 = result;
	}
}

/**
 * 清空结果
 */
function clearResult() {
	calc_inner_number.innerText = "0";
	operator = "isempty";
	storage = false;
	isOperatorInputed = false;
}

/**
 * 删除一位数字
 */
function deleteNumber() {
	if (calc_inner_number.innerText != '0') {
		var str = calc_inner_number.innerText;
		calc_inner_number.innerText = str.substring(0, str.length - 1);
	}
}

/**
 * 改变数字正负
 */
function changeNumber() {
	if (calc_inner_number.innerText != '0' || calc_inner_number.innerText != '') {
		calc_inner_number.innerText = -(calc_inner_number.innerText);
	}
}

/**
 * 数学函数
 */
function mathFun(func) {
	switch (func) {
		case 'sin':
			calc_inner_number.innerText = Math.sin((calc_inner_number.innerText) * Math.PI/180);
			break;
		case 'cos':
			calc_inner_number.innerText = Math.cos((calc_inner_number.innerText) * Math.PI/180);
			break;
		case 'tan':
			calc_inner_number.innerText = Math.tan((calc_inner_number.innerText) * Math.PI/180);
			break;
		case 'EXP':
			calc_inner_number.innerText = Math.exp(calc_inner_number.innerText);
			break;
		case 'log':
			calc_inner_number.innerText = Math.log(calc_inner_number.innerText);
			break;
		case '%':
			calc_inner_number.innerText = parseFloat(calc_inner_number.innerText) / 100;
			break;
	}
	calc_inner_number.innerText = Math.round((calc_inner_number.innerText) * 10000) / 10000;
	storage = true;
}

/**
 * 存储/显示当前值
 */
function localValue(key) {
	switch (key) {
		case 'MS':
			if (calc_inner_number.innerText == '0') {
				console.log('没有存储数据');
			} else {
				localvalue = calc_inner_number.innerText;
				console.log('存储数据成功');
			}
			break;
		case 'MR':
			if (localvalue) {
				calc_inner_number.innerText = localvalue;
				console.log('显示存储数据');
			}
			break;
		case 'M＋':
			if (localvalue) {
				calc_inner_number.innerText = parseFloat(localvalue) + parseFloat(calc_inner_number.innerText);
				console.log('显示存储数据加上当前值的和');
			}
			break;
	}
}

