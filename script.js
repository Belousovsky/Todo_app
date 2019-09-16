$(function() {
    let $taskInput = $("#taskInput");
    let $taskCounter = $("#taskCounter");
    let $pagination = $("#pagination");
    let todos = [];
    let key ='';
    
    //RENDER
    let render = function(key){ 
        const PAGINATION = 5; 
        let tasksString = "";
        let currentPage = Number($(".page.my-page-style").attr("id"));
        if(!currentPage) currentPage = 1;
        let currentTab = $(".style-state.my-state-style").attr("id");
        let filterArray = checkTabs(currentTab);
        let pages =  Math.floor((filterArray.length -1) / PAGINATION) + 1;
        if (key === "tabs"){
            currentPage = 1;
        } else if(key === "add"){
            currentPage = pages;
        }  
        if(currentPage > pages) currentPage = pages;
        let start =  (currentPage - 1) * PAGINATION;
        let end = currentPage * PAGINATION;
        let fiveElementsView = filterArray.slice(start , end);
        
       
        fiveElementsView.forEach( (item , index) => {
            tasksString += `<li id=${item.id} class='task ${item.check} ${Math.trunc(index/5) + 1}-page list-group-item row d-flex
            justify-content-between align-items-center
            '>
            <input
            type='checkbox'
            class='check-todo'
            ${item.check===true?"checked":""}
            />
            <span
            class='task-text col-8 col-lg-8 col-xl-8
            col-md-8'>${item.text}</span>
            <button
            class='delete col-2 col-lg-2 col-xl-2 col-md-2
            delete btn btn-link'
            >
            &#10006
            </button>
            </li>` 
        }); 
            renderPagination(pages , currentPage);
        $(`#taskList`).html(tasksString);    
    };

    //ENTER ADD TASK
    $("#header").keypress(function (e) { 
        if (e.which ==  13) {
                document.getElementById("taskAdd").click();
        }
    });

    //ADD TASK
    $("#taskAdd").on("click" , function() { 

        let a = $taskInput.val().trim();
         a = xss(a)
    if(a) {
        let newTodo = {
            text: a,
            check: false,
            id: Math.random(),
        }       
        key = "add";
        todos.push(newTodo);
        $taskInput.val("");
        areCheckedAll()
        countTask()
        render(key)
    }
    else{
        alert("Введите что-нибудь!")
        return false
    }
    })

    //PAGINATION
    function renderPagination(pages , currentPage) {
        let pageString = "";
        for (let i = 0; i < pages; i++){
            if(Number(currentPage) === i + 1){
                pageString += `<button class="page btn btn-primary my-page-style" 
                id="${i + 1}">${i + 1}</button>`;
            } else {
                pageString += `<button class="page btn btn-primary"  
                id="${i + 1}">${i + 1}</button>`;
            }
        }
        $pagination.html(pageString); 
    } 

    //PAGE
    $(document).on("click", ".page" , function() {  
        $(".page.my-page-style").removeClass("my-page-style");
        $(this).addClass("my-page-style");
        render();
    });

    //CHECK
    $("#taskList").on("change",".check-todo", function(){
        let id = $(this).parent().attr('id')
        todos.forEach(function(item){
            if (+id === +item.id) {
                item.check = !item.check
            }
        })
        areCheckedAll()
        countTask()
        render();     
    })

    //CHECK ALL
    $("#header").on("click", ".check-all", function(){ 
        if(todos.every((item) => item.check)) {
            todos.forEach(function(item) {
            item.check = false
            })
            }else{
            todos.forEach(function(item) {
                if(!item.check) item.check = true;
            })
        }
        countTask()
        render();
    })

    //DELETE
    $("#taskList").on("click",".delete", function(){ 
        let id = $(this).parent().attr('id')
        todos.forEach(function(item , index){
            if (+id === +item.id) {
                todos.splice(index, 1)
            }
        })
        areCheckedAll()
        countTask()
        render();
    });

    //DELETE COMPLETED
    $("#header").on("click", "#dltall" , function(){ 
            let index;
            todos.forEach(function(item , index){
                if (item.check) todos.splice(index , 1 , false)
            })
            while ((index = todos.findIndex((item) => !item)) !== -1){
                todos.splice(index, 1)
            }   
            areCheckedAll()
            countTask()
            render();
    })

    //TABS
    $(".style-state").on("click" , function(){ 
        $(".style-state.my-state-style").removeClass("my-state-style");
        $(this).addClass("my-state-style");
        key = "tabs";
        render(key);
    })

    //EDIT
    $('#taskList').on("dblclick" , ".task-text" , function(){ 
        let container = $(this).text()
        $(this).replaceWith(`<input class="editing form-control col-9"  autofocus type='text' value='${container}'/> `)
        $('.editing').trigger('focus');
    })

    //SAVE EDIT ENTER
    $(document).on(`keydown`, `.editing`, el => { 
        if (el.which === 13) {
            let value = $(`.editing`).val().trim();
            if (value){
            xss(value)
            let vle = xss(value)
            let id = $(`.editing`).parent().attr('id')
            todos.forEach(function(item){
                if (+id === +item.id) {
                    item.text = vle;
                }   
            })
            }
            render();
        }
    })

    //SAVE EDIT BLUR
    $(document).on(`blur`, `.editing` , function() {
            let value = $(`.editing`).val().trim();
            if (value){
            xss(value)
            let vle = xss(value)
            let id = $(`.editing`).parent().attr('id')
            todos.forEach(function(item){
                if (+id === +item.id) {
                    item.text = vle;
                }   
            })
            } else {
                alert("Введите что-нибудь!")
            }
        render();
    })

    //CHECK ALL IF ALL CHECKED
    function areCheckedAll(){  
        if(todos.length===0){$("#checkall").prop("checked",false)
    }else{
        let autoCheck = true;
        for(let item of todos){
            if(item.check === false){
                autoCheck = false;
            }
        }
        if(autoCheck === true){
            $("#checkall").prop("checked",true)
        } else {
            $("#checkall").prop("checked",false)
            }
        }
    }

    //TABS
    function checkTabs(currentTab) { 
        if (currentTab === "all") {
            return todos;
        } else {
            const checked = (currentTab === "completed") ? true : false;
            return todos.filter(item => item.check==checked)
        }
    }

    // COUNTER
    function countTask() { 
        let completed = ( todos.filter( (item) => item.check ) ).length;
        let uncompleted = todos.length - completed;
        renderCount(completed, uncompleted);
    }
    function renderCount(completed, uncompleted) {
        let counterString = `<p class="h5">Complete: ${completed} Active: ${uncompleted}</p>`;
        $taskCounter.html(counterString);
    }
    
    // XSS
    function xss (a) { 
        a = a.replace(/\&/g, '&amp;')
        a = a.replace(/\</g, '&lt;')
        a = a.replace(/\>/g, '&gt;')
        a = a.replace(/\"/g, '&quot;')
        a = a.replace(/\'/g, '&#x27;')
        a = a.replace(/\//g, '&#x2F;');
         return a
    }

})