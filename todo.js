const toDoForm = document.querySelector(".js-toDoForm"),
    toDoInput = toDoForm.querySelector("input"),
    toDoList = document.querySelector(".js-toDoList"),
    finishList = document.querySelector(".js-finishList"),
    progressBar = document.querySelector(".js-progress");

const TODOS_LS = 'PENDING',
    FINISH_LS = 'FINISHED'
    FINISH = 'finished',
    ALL_TODO = 'allTodo';

let toDos = [],
    finishedItems = [];

function rewind(event){
    const btn = event.target;
    const li = btn.parentNode;
    const text = li.querySelector("span").innerText;
    finishDelete(event);
    paintToDo(text);
    saveProgress();
}

function finishDelete(event){
    const btn = event.target;
    const li = btn.parentNode;
    finishList.removeChild(li);
    const cleanFinish = finishedItems.filter(function (finish){
        return finish.id !== parseInt(li.id);
    });
    finishedItems = cleanFinish;
    saveToDos();
    saveProgress();
}

function paintFinish(text){
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.addEventListener("click",finishDelete);
    const rewindBtn = document.createElement("button");
    rewindBtn.innerText = "⏪";
    rewindBtn.addEventListener("click",rewind);
    const span = document.createElement("span");
    let newID = 1;
    if(finishedItems.length !== 0 ){
        newID = finishedItems[finishedItems.length-1].id + 1;
    }
    li.id = newID;
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(rewindBtn);
    finishList.appendChild(li);
    const finishObj = {
        text: text,
        id: newID
    };
    finishedItems.push(finishObj);
    saveToDos();
}

function finishTodo(event){
    const btn = event.target;
    const li = btn.parentNode;
    const text = li.querySelector("span").innerText;
    deleteToDo(event);
    paintFinish(text);
    saveProgress();
}

function deleteToDo(event){
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);
    const cleanToDos = toDos.filter(function(toDo){
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
    saveProgress();
}

function saveToDos(){
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
    localStorage.setItem(FINISH_LS, JSON.stringify(finishedItems));
}

function saveProgress(){
    localStorage.setItem(FINISH,finishedItems.length);
    localStorage.setItem(ALL_TODO,finishedItems.length+toDos.length);
    const finishNum = localStorage.getItem(FINISH);
    const allNum = localStorage.getItem(ALL_TODO);
    progressBar.innerHTML = `Progress: ${finishNum}/${allNum} finished`;
    
}

function paintToDo(text){
    const li = document.createElement("li");
    const delBtn = document. createElement("button");
    const span = document.createElement("span");
    let newId = 1;
    if(toDos.length !== 0){
        newId = toDos[toDos.length-1].id + 1;
    }
    const checkBtn = document.createElement("button");
    checkBtn.innerText = "✅";
    delBtn.innerText = "❌";
    span.innerText = text;
    delBtn.addEventListener("click",deleteToDo);
    checkBtn.addEventListener("click",finishTodo);
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(checkBtn);
    li.id=newId;
    toDoList.appendChild(li);
    const toDoObj = {
        text : text,
        id: newId
    }; 
    toDos.push(toDoObj);
    saveToDos();
}

function handleSubmit(event){
    event.preventDefault();
    saveProgress();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
    toDoInput.value = "";
}

function loadToDos(){
    const loadedToDos = localStorage.getItem(TODOS_LS);
    const loadedFinish = localStorage.getItem(FINISH_LS);
    if(loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(toDo){
            paintToDo(toDo.text);
        });
    }
    if(loadedFinish !== null){
        const parsedFinish = JSON.parse(loadedFinish);
        parsedFinish.forEach(function (finish){
            paintFinish(finish.text);
        });
    }
}

function init(){
    loadToDos();
    toDoForm.addEventListener("submit",handleSubmit);
    saveProgress();
}

init();