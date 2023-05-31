'use strict';

if(localStorage.getItem('opened') == null){
    localStorage.setItem('opened', 0);
}

if(localStorage.getItem('opened') == 1){
    creatingBoardFunc();
}

if(localStorage.getItem('opened') != 1) document.querySelector('div.create-board').onclick = function(){
    creatingBoardFunc();
    localStorage.setItem('opened', 1);
}
if(localStorage.getItem('boards') != null) 
   for(let f of JSON.parse(localStorage.getItem('boards'))){
       renderBoard(f.name);
   }

function creatingBoardFunc(){
    let creatingBoard = document.createElement('div');
    creatingBoard.classList = 'creating-board';
    document.querySelector('div.main-container').insertBefore(creatingBoard, document.querySelector('div.create-board'));
    let topText = document.createElement('h3');
    topText.classList = 'creating-board-text';
    topText.innerHTML = 'Creating a board';
    creatingBoard.append(topText);
    let hr = document.createElement('hr');
    hr.style.backgroundColor = '#f2f2f2';
    creatingBoard.append(hr);
    
    let close = document.createElement('div');
    let closei = document.createElement('i');
    close.classList = 'creating-board-close-icon';
    closei.classList = 'fas fa-times';
    creatingBoard.append(close);
    close.append(closei);
    creatingBoard.onmouseover = function(){
        close.style.opacity = '1';
    }
    creatingBoard.onmouseout = function(){
        close.style.opacity = '0';;
    }
    
    let secText = document.createElement('h5');
    secText.innerHTML = 'What shall we call the board?';
    creatingBoard.append(secText);
    
    let input = document.createElement('input');
    creatingBoard.append(input);
    input.focus();
    
    let btns = document.createElement('div');
    btns.classList = 'creating-board-btns';
    creatingBoard.append(btns);
    
    let cancel = document.createElement('button');
    let create = document.createElement('button');
    cancel.innerHTML = 'CANCEL';
    create.innerHTML = 'CREATE';
    cancel.classList = 'creating-board-cancel-btn';
    create.classList = 'creating-board-create-btn';
    btns.append(cancel);
    btns.append(create);
    
    close.onclick = function(){
        let createBoard = document.createElement('div');
        let h3 = document.createElement('h3');
        createBoard.classList = 'create-board';
        h3.classList = 'create-board-text';
        h3.innerHTML = 'Create a new board...';
        document.querySelector('div.main-container').insertBefore(createBoard, document.querySelector('div.main-container').firstChild);
        createBoard.append(h3);
        createBoard.onclick = function(){
            creatingBoardFunc();
        }
        
        localStorage.setItem('opened', 0);
        creatingBoard.remove();
    }
    cancel.onclick = function(){
        close.onclick();
    }
    
    create.onclick = function(){
        if(input.value != ''){
            let arr = [];
            if(localStorage.getItem('boards') != null){
                arr = JSON.parse(localStorage.getItem('boards'));
            }
            localStorage.setItem('opened', 0);
            
            let newBoard = {
                name: input.value,
            }
            arr.push(newBoard);
            localStorage.setItem('boards', JSON.stringify(arr))
            
            document.querySelector('div.main-container').innerHTML = '';
            
            let createBoard = document.createElement('div');
            let h3 = document.createElement('h3');
            createBoard.classList = 'create-board';
            h3.classList = 'create-board-text';
            h3.innerHTML = 'Create a new board...';
            document.querySelector('div.main-container').insertBefore(createBoard, document.querySelector('div.main-container').firstChild);
            createBoard.append(h3);
            createBoard.onclick = function(){
                creatingBoardFunc();
            }
            
            for(let i of arr){
                renderBoard(i.name);
            }
            deletingBoards();
            openBoard();
        }
        else{
            if(creatingBoard.children.length != 7){
                let oopsText = document.createElement('p');
                oopsText.classList = 'error';
                oopsText.innerHTML = 'Oops! Looks like you forgot the name!';
                creatingBoard.insertBefore(oopsText, btns);
            }
        }
    }
    input.onkeypress = function(e){
        if(e.keyCode == 13){
            create.onclick();
        }
    }
    
    document.querySelector('div.create-board').remove();
}

function renderBoard(name){
    let a = document.createElement('a');
    a.setAttribute('href', 'board.html');
    a.style.textDecoration = 'none';
    let createdBoard = document.createElement('div');
    let createdBoardText = document.createElement('h3');
    let deleteBoard = document.createElement('div');
    let deleteBoardi = document.createElement('i');
    deleteBoard.classList = 'delete-board';
    deleteBoardi.classList = 'fas fa-times';
    
    createdBoard.classList = 'created-board';
    createdBoardText.classList = 'created-board-text';
    createdBoardText.innerHTML = name;
    
    document.querySelector('div.main-container').append(a);
    a.append(createdBoard);
    createdBoard.append(createdBoardText);
    createdBoard.append(deleteBoard);
    deleteBoard.append(deleteBoardi);
}


deletingBoards();

function deletingBoards(){
    let boardsFromPage = document.querySelectorAll('div.created-board');
    let boardsX = document.querySelectorAll('div.delete-board');
    for(let i = 0; i < boardsX.length; i++){
        boardsFromPage[i].onmouseover = function(){
            boardsX[i].style.opacity = 1;
        }
        boardsFromPage[i].onmouseout = function(){
            boardsX[i].style.opacity = 0;
        }
        boardsX[i].onclick = function(){
            boardsX[i].parentElement.parentElement.setAttribute('href', '#');
            let barr = JSON.parse(localStorage.getItem('boards'));
            barr.splice(i, 1);
            localStorage.setItem('boards', JSON.stringify(barr));
            boardsFromPage[i].remove();
            deletingBoards();
            openBoard();
        }
    }
}
openBoard();
function openBoard(){
    let boardsFromPage = document.querySelectorAll('div.created-board');
    
    for(let i = 0; i < boardsFromPage.length; i++){
        boardsFromPage[i].onclick = function(){
            localStorage.setItem('clickedBoard', i);
        }
    }
}



