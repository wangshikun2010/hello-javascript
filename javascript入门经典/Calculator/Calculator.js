var operstates; //操作符
var number1; //第一个数字

//初始状态
function setStartState() {
	operstate = false;
	number1 = 0;
}

//清空数据
function calc_cleartext() {
	document.cal.calc_text.value = '0';
}

//添加数字
function add(num) {
	if (document.cal.calc_text.value == '0') {
		document.cal.calc_text.value = num;
	} else {
		document.cal.calc_text.value += num;
	}
}

