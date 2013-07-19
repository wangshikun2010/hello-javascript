$(function() {

    var todo = new Object();

    // use jquery selector get element node
    todo.ndTodoSync = $('#j-todo-sync');
    todo.ndTodoInputBox = $('#j-todo-input-box');
    todo.ndTodoSelectAll = $('#j-select-all');
    todo.ndTodoList = $('#j-todo-list');
    todo.ndFooter = $('footer');
    todo.ndTodoListLength = $('#j-todo-list-length');
    todo.ndTodoClearComplete = $('#j-todo-clear-complete');
    todo.ndTodoListCompleteLength = $('#j-todo-complete-length');

    todo.todoListLength = 0;
    todo.todoListComplete = 0;
    todo.ndTodoItem = null;

    // todo init
    todo.initTodo = function() {

        $(document).ajaxStart(function() {
            todo.ndTodoSync.show();
        }).ajaxStop(function() {
            todo.ndTodoSync.hide();
        })

        // 获取全部数据并添加到页面
        $.get('/cakephp-2.3.7/todos', null, function (response) {
            for (var i=0; i<response.length; i++) {
                todo.addTodoItem(response[i], null);
            }

            todo.update();
            todo.setFooterDisplay();
            todo.clearAllComplete();
            todo.selectAll();
        });

        $(document.forms[0]).submit(function(event) {
            event.preventDefault();

            var todoInputValue = encodeURIComponent(todo.ndTodoInputBox.val());
            todo.ndTodoInputBox.val('');

            // 添加一个todoItem
            todo.addTodoItem(null, todoInputValue);

            $.post('/cakephp-2.3.7/todos/add', 'data[content]=' + todoInputValue, function(response) {
                if (response.status == true) {
                    console.log(response.data);
                }
            });
        });
    },
    
    todo.addTodoItem = function(todoItem, addTodo) {
        console.log(todoItem, addTodo);

        if (addTodo == null) {
            // 创建一个todoItem
            todo.ndTodoItem = $('<li id=todo' + todoItem.Todo.id + ' class="todo__item"></li>');
            todo.ndTodoItem.html('<div class="todo__item__view"><input type="checkbox" name="todoChecked" class="todo__item__checked">' + '<span class="todo__item__content" id="j-todo-list-value">' + todoItem.Todo.content + '</span>' + '<a class="todo__item__delete"></a></div><input type="text" class="todo__item__edit" maxlength="25">');
            
            // 在加载完毕判断todoItem是否完成
            if (todoItem.Todo.completed) {
                todo.ndTodoItem.find('input[type=checkbox]')
                               .attr('checked', true)
                               .next('span')
                               .attr('class', 'todo__item__complete');
            } else {
                todo.ndTodoItem.find('span')
                               .attr('class', 'todo__item__content');
            }
        } else if (todoItem == null) {
            // 创建一个todoItem
            todo.ndTodoItem = $('<li id=todo' +  + ' class="todo__item"></li>');
            todo.ndTodoItem.html('<div class="todo__item__view"><input type="checkbox" name="todoChecked" class="todo__item__checked">' + '<span class="todo__item__content" id="j-todo-list-value">' + addTodo + '</span>' + '<a class="todo__item__delete"></a></div><input type="text" class="todo__item__edit" maxlength="25">');
        }

        todo.ndTodoItem.prependTo(todo.ndTodoList);

        // 显示footer和项目条数
        todo.update();
        todo.setFooterDisplay();

        // 获取todoItem的复选框和删除按钮
        var $ndTodoCheckbox = todo.ndTodoItem.find('div>input[type=checkbox]');
        var $ndTodoDelete = todo.ndTodoItem.find('a');

        // 编辑todoItem
        todo.ndTodoItem.dblclick(function(event) {
            var $target = $(event.target);

            // console.log($target);
            todo.editTodoItem($target);
        });

        if ($ndTodoCheckbox.length > 0) {
            $ndTodoCheckbox.click(changeStyle);
        }

        if ($ndTodoDelete.length > 0) {
            $ndTodoDelete.click(deleteTodoItem);
        }

        function changeStyle(event) {
            var $target = $(event.target);

            console.log($target);

            var completed = $target.prop('checked') ? 1 : 0;
            var $ndLi = $target.parents('li');

            console.log($ndLi);

            var todoItemId = encodeURIComponent($ndLi.attr('id'));
            $.get('/cakephp-2.3.7/todos/complete/' + todoItemId + '/' + completed, null, function(response) {
                if (response.status == true) {
                    if (completed) {
                        $ndLi.find('span')
                            .attr('class', 'todo__item__complete');
                    } else {
                        $ndLi.find('span')
                            .attr('class', 'todo__item__content');
                    }
                }

                todo.update();
                todo.setClearButtonDisplay();
            });
            
        }

        function deleteTodoItem(event) {
            var $target = $(event.target);
            event.preventDefault();

            var $ndLi = $target.parents('li');

            console.log($ndLi[0]);

            // 在删除todoItem时删除其绑定删除事件和改变样式事件
            // $ndLi.unbind();

            var todoItemId = encodeURIComponent($ndLi.attr('id'));
            todoItemId = todoItemId.replace('todo', '');
            console.log(todoItemId);
            $.get('/cakephp-2.3.7/todos/delete/' + todoItemId, null, function(response) {
                if (response.status == true) {
                    // console.log('remove');
                    $ndLi.remove();
                }

                todo.update();
                todo.setFooterDisplay();
                todo.setClearButtonDisplay();
            });
        }
    },

    todo.editTodoItem = function(element) {

        // console.log(element[0]);
        var $inputElement = element.parent('div').next();

        if (element[0].tagName.toLowerCase() == 'span') {
            console.log(element[0].tagName.toLowerCase());

            var displayValue = element.text();
            
            // 在编辑时将显示元素替换成输入框
            element.parent('div').hide()
                        .next()
                        .val(displayValue)
                        .show()
                        .focus();
        }


        function changeText() {
            // 将编辑输入框的文本显示出来
            // var inputValue = element.parent('div').next().val();

            // console.log(inputValue);

            element.text($inputElement.val())
                    .parent('div').show()
                    .next()
                    .hide();

            var todoItemId = encodeURIComponent(element.parents('li').attr('id'));
            // console.log(todoItemId);
            // console.log($inputElement.val());
            $.post('/cakephp-2.3.7/todos/edit/' + todoItemId, 'data[content]=' + $inputElement.val(), function(response) {});
        }

        $inputElement.blur(function(event) {
            changeText();
        }).keydown(function(event) {
            if (event.keyCode == 13) {
                changeText();
            }
        });
    },

    todo.clearAllComplete = function() {

        // 清空所有已完成项目
        todo.ndTodoClearComplete.click(function(event) {
            var $todoLists = todo.ndTodoList.find('li input:checked').parents('li');

            // console.log($todoLists);
            // console.log($todoLists.length);
            // console.log($todoLists[0].id);
            for (var i=0; i<$todoLists.length; i++) {
                $.get('/cakephp-2.3.7/todos/delete/' + $todoLists[i].id, null, (function(element) {
                        return function(response) {
                            if (response.status == true) {
                                // console.log(element);
                                element.remove();

                                todo.update();
                                todo.setClearButtonDisplay();
                                todo.setFooterDisplay();
                            }
                        };
                    })($todoLists[i])
                );
            }
        });
    },

    todo.selectAll = function() {

        // 给全选按钮添加事件
        todo.ndTodoSelectAll.click(function(event) {
            var $target = $(event.target);

            var $todoLists = todo.ndTodoList.find('li');
            var completed = $target.prop('checked') ? 1 : 0;

            for (var i=0; i<$todoLists.length; i++) {
                $.get('/cakephp-2.3.7/todos/complete/' + $todoLists[i].id + '/' + completed, null, (function(element) {
                    return function(response) {
                        if (response.status == true) {
                            $(element).find('input[type=checkbox]')
                                    .prop('checked', completed)
                                    .next()
                                    .toggleClass('todo__item__complete');
                        }
                        todo.update();
                        todo.setClearButtonDisplay();
                    }
                })($todoLists[i]));
            }
        });
    },

    // 设置footer显示
    todo.setFooterDisplay = function() {
        var $lis = todo.ndTodoList.find('li');
        if ($lis.length == 0) {
            todo.ndFooter.hide();
            todo.ndTodoSelectAll.hide();
        } else {
            todo.ndFooter.show();
            todo.ndTodoSelectAll.show();
        }
    },

    // 设置清空按钮显示
    todo.setClearButtonDisplay = function() {
        var hasCompletedTodo = false;

        var $lis = todo.ndTodoList.find('li');

        for (var i=0; i<$lis.length; i++) {
            if ($($lis[i]).find('input[type=checkbox]').prop('checked')) {
                hasCompletedTodo = true;
                break;
            }
        }

        if (hasCompletedTodo) {
            todo.ndTodoClearComplete.show();
        } else {
            todo.ndTodoClearComplete.hide();
        }
    },

    // 更新数据
    todo.update = function() {
        // 计算选中个数和未选中的个数
        todo.todoListComplete = 0;
        var $lis = todo.ndTodoList.find('li');
        for (var i=0; i<$lis.length; i++) {
            // console.log($lis[i]);
            if ($($lis[i]).find('input[type=checkbox]').prop('checked')) {
                todo.todoListComplete++;
            }
        }
        todo.ndTodoListLength.text($lis.length - todo.todoListComplete);
        todo.ndTodoListCompleteLength.text(todo.todoListComplete);

        // 判断是否全选
        var isAllChecked = true;
        for (var i=0; i<$lis.length; i++) {
            if ($($lis[i]).find('input[type=checkbox]').prop('checked')) {
            } else {
                isAllChecked = false;
                break;
            }
        }

        if (isAllChecked == true) {
            todo.ndTodoSelectAll.find('input[type=checkbox]')
                                .prop('checked', true);
        } else {
            todo.ndTodoSelectAll.find('input[type=checkbox]')
                                .prop('checked', false);
        }
    }

    window['todo'] = todo;
    todo.initTodo();
})
