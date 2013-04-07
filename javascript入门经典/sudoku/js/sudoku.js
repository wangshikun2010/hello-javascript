var startTime = 0;

window.onload = function() {
	setNumberButton();
}

/**
 * 给td元素添加事件
 */
function setNumberButton() {
	var ceiltable = getElementsByClassName('ceiltable');

	for (var i = 0; i <= ceiltable.length; i++) {
		var row = ceiltable[i].rows;
		for (var j=0; j<ceiltable[i].rows.length; j++) {
			for (var k=0; k<row[j].cells.length; k++) {
				var cell = row[j].cells[k];
				// console.log(cell);
				cell.addEventListener('click', function() {
					createNumberutton();
				},false);
			}
		}
	}
}

/**
 * 获取文档中指定类名的数组
 */
function getElementsByClassName(node) {
	var classNameArray = [];
	var allelement = document.getElementsByTagName('*');

	for (var i = allelement.length - 1; i >= 0; i--) {
		if (allelement[i].className == node) {
			classNameArray.push(allelement[i]);
		}
	}

	return classNameArray;
}

/**
 * 创建数字按钮
 */
function createNumberutton() {
	var table = document.createElement('table');
	var tr1 = document.createElement('tr');
	var tr2 = document.createElement('tr');
	var tr3 = document.createElement('tr');

	for (var j=1; j<=9; j++) {
		if (j <= 3) {
			var td = document.createElement('td');
			td.innerHTML = j;
			tr1.appendChild(td);
		} else if (j > 3 && j <= 6) {
			var td = document.createElement('td');
			td.innerHTML = j;
			tr2.appendChild(td);
		} else {
			var td = document.createElement('td');
			td.innerHTML = j;
			tr3.appendChild(td);
		}
	}
	table.appendChild(tr1);
	table.appendChild(tr2);
	table.appendChild(tr3);
	table.setAttribute('class', 'number_ceiltable');
	document.body.appendChild(table);
}