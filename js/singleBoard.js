'use strict';

let boardsArr = JSON.parse(localStorage.getItem('boards'));
let index = localStorage.getItem('clickedBoard');
document.title = 'React App | ' + boardsArr[index].name; 

document.querySelector('div.title-containter').children[0].innerHTML = boardsArr[index].name;

if(boardsArr[index].lists != null)
    for(let i of boardsArr[index].lists){
        renderList(i.name, i.acts);
    }

if(localStorage.getItem('openedList') == null){
    localStorage.setItem('openedList', 0);
}

if(localStorage.getItem('openedList') == 1){
    addAListCreate();
}

if (localStorage.getItem('openedList') != 1) document.querySelector('div.add-a-list').onclick = function(){
    addAListCreate();
    localStorage.setItem('openedList', 1);
}

function addAListCreate(){
    let addAListCreator = document.createElement('div');
    addAListCreator.classList = 'add-a-list-clicked';
    addAListCreator.innerHTML = `
        <input placeholder="add a list">
        <p> give me a name! </p>
        <div class="close">
            <i class="fas fa-times"> </i>
        </div>
    `;
    document.querySelector('div.main-container').append(addAListCreator);
    
    document.querySelector('div.add-a-list').remove();
    
    addAListClickables();
}

function addAListClickables(){
    document.querySelector('div.add-a-list-clicked').children[0].onclick = function(){
        if(document.querySelector('div.add-a-list-clicked').children[0].value == '') document.querySelector('div.add-a-list-clicked').children[1].style.opacity = 1;
    }
    
    document.querySelector('div.add-a-list-clicked').children[0].onkeyup = function(){
        if(document.querySelector('div.add-a-list-clicked').children[0].value != ''){
            document.querySelector('div.add-a-list-clicked').children[1].style.opacity = 0;
        }
        else{
            document.querySelector('div.add-a-list-clicked').children[1].style.opacity = 1;
        }
    }
    
    document.querySelector('div.add-a-list-clicked').children[0].onkeypress = function(e){
        if(e.keyCode == 13 && document.querySelector('div.add-a-list-clicked').children[0].value != ''){
            let name = document.querySelector('div.add-a-list-clicked').children[0].value;
            let newlist = {
                name: name,
                acts: [],
            }
            if(boardsArr[index].lists == null){
                boardsArr[index].lists = [];
                boardsArr[index].lists.push(newlist);
            }
            else{
                boardsArr[index].lists.push(newlist);
            }
            localStorage.setItem('boards', JSON.stringify(boardsArr));
            
            document.querySelector('div.close').onclick();
            renderList(name);
            deleteList();
            changeNameOfList();
            addAct();
            actsActivity();
            addAListCreate();
            localStorage.setItem('openedList', 1);
            document.querySelector('div.add-a-list-clicked').children[0].focus();
        }
    }
    
    document.querySelector('div.close').onclick = function(){
        let addlist = document.createElement('div');
        addlist.classList = 'add-a-list';
        document.querySelector('div.main-container').append(addlist);
        let h4 = document.createElement('h4');
        h4.innerHTML = 'Add a list...';
        h4.classList = 'add-a-list-text';
        addlist.append(h4);
        addlist.onclick = function(){
            addAListCreate();
        }
        
        localStorage.setItem('openedList', 0);
        this.parentElement.remove();
    }
}


function renderList(name, acts = []){
    let mainDiv = document.createElement('div');
    mainDiv.classList = 'list-main-container';
    mainDiv.setAttribute('ondrop', 'drop(event)'); mainDiv.setAttribute('ondragover', 'allowDrop(event)');
    if(localStorage.getItem('openedList') == 1){
        document.querySelector('div.main-container').insertBefore(mainDiv, document.querySelector('div.add-a-list-clicked'));
    }
    else{
        document.querySelector('div.main-container').insertBefore(mainDiv, document.querySelector('div.add-a-list'));
    }
    
    let closeicon = document.createElement('div');
    closeicon.classList = 'delete-list';
    closeicon.style.opacity = 0;
    mainDiv.append(closeicon);
    let closeiconi = document.createElement('i');
    closeiconi.classList = 'fas fa-times';
    closeicon.append(closeiconi);
    let h4 = document.createElement('h4');
    h4.innerHTML = name;
    mainDiv.append(h4);
    let hr = document.createElement('hr');
    mainDiv.append(hr);
    let input = document.createElement('input');
    mainDiv.append(input);
    if(acts.length != 0){
        for(let j of acts){
            renderAct(mainDiv, j.name, j.activity);
        }
    }
}

function renderAct(list, act, activity = 1){
    let main = document.createElement('div');
    main.setAttribute('draggable', 'true');
    main.setAttribute('ondragstart', 'drag(event)');
    main.setAttribute('ondragend', 'dragEnd(event)');
    main.classList = 'SwFh03';
    list.append(main);
    let underMain = document.createElement('div');
    underMain.classList = 'list-act';
    if(activity == 0){
        underMain.style.opacity = '0.35';
        underMain.style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 6px 6px, rgba(0, 0, 0, 0.23) 0px 6px 6px';
        underMain.style.textDecoration = 'line-through';
        underMain.style.backgroundColor = 'rgb(222, 202, 255)';
    }
    main.append(underMain);
    let h3 = document.createElement('h3');
    h3.innerHTML = act;
    underMain.append(h3);
    let checkMark = document.createElement('div');
    checkMark.classList = 'check-mark';
    checkMark.innerHTML = '✓';
    underMain.append(checkMark);
    actsActivity();
}

deleteList();
function deleteList(){
    let listsArr = document.querySelectorAll('div.list-main-container');
    let listsClose = document.querySelectorAll('div.delete-list');
    
    for(let i = 0; i < listsClose.length; i++){
        listsArr[i].onmouseover = function(){
            listsClose[i].style.opacity = 1;
        }
        listsArr[i].onmouseout = function(){
            listsClose[i].style.opacity = 0;
        }
        
        listsClose[i].onclick = function(){
            boardsArr[index].lists.splice(i, 1);
            localStorage.setItem('boards', JSON.stringify(boardsArr));
            listsArr[i].remove();
            deleteList();
            changeNameOfList();
            addAct();
            deleteInactiveCheck();
            actsActivity();
        }
    }
}

addAct();

function addAct(){
    let listsArr = document.querySelectorAll('div.list-main-container');
    
    for(let i = 0; i < listsArr.length; i++){
        listsArr[i].children[3].onkeypress = function(e){
            if(e.keyCode == 13 && listsArr[i].children[3].value != ''){
                let newAct = {
                    name: listsArr[i].children[3].value,
                    activity: 1,
                }
                boardsArr[index].lists[i].acts.push(newAct);
                localStorage.setItem('boards', JSON.stringify(boardsArr));
                
                renderAct(listsArr[i], listsArr[i].children[3].value);
                listsArr[i].children[3].value = '';
            }
        }
    }
    actsActivity();
}

actsActivity();

function actsActivity(){
    let listsArr = document.querySelectorAll('div.list-main-container');
    
    for(let i = 0; i < listsArr.length; i++){
        let actsArr = listsArr[i].querySelectorAll('div.SwFh03');
        for(let j = 0; j < actsArr.length; j++){
            actsArr[j].children[0].children[1].onclick = function(){
                if(boardsArr[index].lists[i].acts[j].activity == '1'){
                    actsArr[j].children[0].style.opacity = '0.35';
                    actsArr[j].children[0].style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 6px 6px, rgba(0, 0, 0, 0.23) 0px 6px 6px';
                    actsArr[j].children[0].style.textDecoration = 'line-through';
                    actsArr[j].children[0].style.backgroundColor = 'rgb(222, 202, 255)';
                    
                    boardsArr[index].lists[i].acts[j].activity = 0;
                    localStorage.setItem('boards', JSON.stringify(boardsArr));
                }
                else{
                    actsArr[j].children[0].style.opacity = '1';
                    actsArr[j].children[0].style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 6px 6px, rgba(0, 0, 0, 0.23) 0px 6px 6px';
                    actsArr[j].children[0].style.textDecoration = 'none';
                    actsArr[j].children[0].style.backgroundColor = 'rgb(202, 255, 222)';
                    
                    boardsArr[index].lists[i].acts[j].activity = 1;
                    localStorage.setItem('boards', JSON.stringify(boardsArr));
                }
                
                deleteInactiveCheck();
            }
        }
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.target.setAttribute('id', 'draggingNow');
}

function dragEnd(ev){
    draggingNow.removeAttribute('id');
}
  
function drop(ev) {
    ev.preventDefault();
    
    let listIndex = Array.prototype.slice.call(document.querySelector('div.main-container').children).indexOf(draggingNow.parentElement);
    let actIndex = Array.prototype.slice.call(draggingNow.parentElement.querySelectorAll('div.SwFh03')).indexOf(draggingNow);
    let activity = boardsArr[index].lists[listIndex].acts[actIndex].activity;
    boardsArr[index].lists[listIndex].acts.splice(actIndex, 1);
    
    ev.currentTarget.appendChild(draggingNow);
    listIndex = Array.prototype.slice.call(document.querySelector('div.main-container').children).indexOf(ev.currentTarget);
    
    let newAct = {
        name: draggingNow.children[0].children[0].innerHTML,
        activity: activity,
    }
    boardsArr[index].lists[listIndex].acts.push(newAct);
    localStorage.setItem('boards', JSON.stringify(boardsArr));
    actsActivity();
}

deleteInactiveCheck();

function deleteInactiveCheck(){
    let listsArr = document.querySelectorAll('div.list-main-container');
    let counter = 0;
    for(let i = 0; i < listsArr.length; i++){
        let actsArr = listsArr[i].querySelectorAll('div.SwFh03');
        
        for(let j = 0; j < actsArr.length; j++){
            if(boardsArr[index].lists[i].acts[j].activity == 0){
                counter++;
            }
        }
    }
    if(counter != 0){
        document.querySelector('button.delete-inactive-btn').style.opacity = 1;
        document.querySelector('button.delete-inactive-btn').disabled = false;
        document.querySelector('button.delete-inactive-btn').style.cursor = 'pointer';
        
        deleteInactive();
    }
    else{
        document.querySelector('button.delete-inactive-btn').style.opacity = 0;
        document.querySelector('button.delete-inactive-btn').disabled = true;
        document.querySelector('button.delete-inactive-btn').style.cursor = 'default';
    }
}

deleteInactive();

function deleteInactive(){
    let dib = document.querySelector('button.delete-inactive-btn');
    
    dib.onclick = function(){
        let listsArr = document.querySelectorAll('div.list-main-container');
        
        for(let i = 0; i < listsArr.length; i++){
            let actsArr = listsArr[i].querySelectorAll('div.SwFh03');
            
            for(let j = 0; j < actsArr.length; j++){
                if(boardsArr[index].lists[i].acts[j].activity == 0){
                    boardsArr[index].lists[i].acts.splice(j, 1);
                    actsArr[j].remove();
                    
                    dib.onclick();
                    break;
                }
            }
        }
        localStorage.setItem('boards', JSON.stringify(boardsArr));
        deleteInactiveCheck();
    }
}

changeNameOfList();

function changeNameOfList(){
    let listNames = [];
    
    for(let i of document.querySelectorAll('div.list-main-container')){
        listNames.push(i.children[1]);
    }
    
    for(let i = 0; i < listNames.length; i++){
        listNames[i].onclick = function(){
            changeName(listNames[i].parentElement, listNames[i].innerHTML);
        }
    }
}

function changeName(parentEl, prevName){
    let input = document.createElement('input');
    input.classList = 'change-name-input';
    input.value = prevName;
    parentEl.prepend(input);
    
    input.onkeypress = function(e){
        if(e.keyCode == 13 && input.value != ''){
            parentEl.children[2].innerHTML = input.value;
            
            let listIndex = Array.prototype.slice.call(document.querySelector('div.main-container').children).indexOf(parentEl);
            boardsArr[index].lists[listIndex].name = input.value;
            localStorage.setItem('boards', JSON.stringify(boardsArr));
            
            input.remove();
        }
    }
}





