var oper_states; //操作状态
var operator; //操作符
var num1; //第一个数
var num2; //第二个数
var scores = [];
var storage; //储存数据标志变量
var old_operator;

//设置开始状态
window.onload = function setStartState() {
	oper_states = false;
	operator = "isempty";
	num1 = 0;
	storage = false;
	var calc_inner_number = document.getElementById('calc_inner_number');
	var calc_inner_operator = document.getElementById('calc_inner_operator');
	calc_inner_number.innerText = '0';
	scores = document.getElementsByTagName('li');
	add_li_event();
}

//添加数字
function add(number) {
	if (storage == true) {
		calc_inner_number.innerText = number;
		storage = false;
	} else {
		if (oper_states == true) {
			calc_inner_number.innerText = number;
			oper_states = false;
		} else {
			if (calc_inner_number.innerText == "0") {
				calc_inner_number.innerText = number;
			} else {
				calc_inner_number.innerText += number;
			}
		}
	}
}

function add_li_event() {
	for (var i=0; i<scores.length; i++) {
		switch(scores[i].innerText) {
			case '1':
				scores[i].addEventListener('click',function() {add('1');},false);
				break;
			case '2':
				scores[i].addEventListener('click',function() {add('2');},false);
				break;
			case '3':
				scores[i].addEventListener('click',function() {add('3');},false);
				break;
			case '4':
				scores[i].addEventListener('click',function() {add('4');},false);
				break;
			case '5':
				scores[i].addEventListener('click',function() {add('5');},false);
				break;
			case '6':
				scores[i].addEventListener('click',function() {add('6');},false);
				break;
			case '7':
				scores[i].addEventListener('click',function() {add('7');},false);
				break;
			case '8':
				scores[i].addEventListener('click',function() {add('8');},false);
				break;
			case '9':
				scores[i].addEventListener('click',function() {add('9');},false);
				break;
			case '0':
				scores[i].addEventListener('click',function() {add('0');},false);
				break;
			case '＋':
				scores[i].addEventListener('click',function() {setOper('＋');},false);
				break;
			case '－':
				scores[i].addEventListener('click',function() {setOper('－');},false);
				break;
			case '×':
				scores[i].addEventListener('click',function() {setOper('×');},false);
				break;
			case '÷':
				scores[i].addEventListener('click',function() {setOper('÷');},false);
				break;
			case '.':
				scores[i].addEventListener('click',function() {addPoint();},false);
				break;
			case '=':
				scores[i].addEventListener('click',function() {count();},false);
				break;
			case 'AC':
				scores[i].addEventListener('click',function() {clearText();},false);
				break;
		}
	}
}

//添加小数点
function addPoint() {
	calc_inner_number.innerText += ".";
}

//操作符
function setOper(oper) {
	oper_states = true;
	if (operator == "isempty") {
		num1 = 0 + calc_inner_number.innerText;
		operator = oper;
		calc_inner_operator.innerText = oper;
	} else {
		oper = oper.charAt(oper.length - 1);
		operator = oper;
		count();
	}
}

//计算结果
function count() {
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

//清空数据
function clearText() {
	calc_inner_number.innerText = "0";
	operator = "isempty";
}
