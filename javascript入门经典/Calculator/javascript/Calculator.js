var isOperatorInputed; //操作状态
var operator; //操作符
var num1; //第一个数
var num2; //第二个数
var buttons = [];
var storage; //储存数据标志变量
var old_operator;

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
		switch(buttons[i].innerText) {
			case '1':
				buttons[i].addEventListener('click',function() {addNumber('1');},false);
				break;
			case '2':
				buttons[i].addEventListener('click',function() {addNumber('2');},false);
				break;
			case '3':
				buttons[i].addEventListener('click',function() {addNumber('3');},false);
				break;
			case '4':
				buttons[i].addEventListener('click',function() {addNumber('4');},false);
				break;
			case '5':
				buttons[i].addEventListener('click',function() {addNumber('5');},false);
				break;
			case '6':
				buttons[i].addEventListener('click',function() {addNumber('6');},false);
				break;
			case '7':
				buttons[i].addEventListener('click',function() {addNumber('7');},false);
				break;
			case '8':
				buttons[i].addEventListener('click',function() {addNumber('8');},false);
				break;
			case '9':
				buttons[i].addEventListener('click',function() {addNumber('9');},false);
				break;
			case '0':
				buttons[i].addEventListener('click',function() {addNumber('0');},false);
				break;
			case '＋':
				buttons[i].addEventListener('click',function() {setOperator('＋');},false);
				break;
			case '－':
				buttons[i].addEventListener('click',function() {setOperator('－');},false);
				break;
			case '×':
				buttons[i].addEventListener('click',function() {setOperator('×');},false);
				break;
			case '÷':
				buttons[i].addEventListener('click',function() {setOperator('÷');},false);
				break;
			case '.':
				buttons[i].addEventListener('click',function() {addPoint();},false);
				break;
			case '=':
				buttons[i].addEventListener('click',function() {getResult();},false);
				break;
			case 'AC':
				buttons[i].addEventListener('click',function() {clearResult();},false);
				break;
			case 'DEL':
				buttons[i].addEventListener('click',function() {deleteNumber();},false);
				break;
			case '+/-':
				buttons[i].addEventListener('click',function() {changeNumber();},false);
				break;
			case 'sin':
				buttons[i].addEventListener('click',function() {mathFun('sin');},false);
				break;
			case 'cos':
				buttons[i].addEventListener('click',function() {mathFun('cos');},false);
				break;
			case 'tan':
				buttons[i].addEventListener('click',function() {mathFun('tan');},false);
				break;
		}
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
	calc_inner_number.innerText += ".";
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
			calc_inner_number.innerText = Math.sin(calc_inner_number.innerText);
			break;
		case 'cos':
			calc_inner_number.innerText = Math.cos(calc_inner_number.innerText);
			break;
		case 'tan':
			calc_inner_number.innerText = Math.tan(calc_inner_number.innerText);
			break;
	}
	storage = true;
}