//8148
let curY = 6;
    let curX = 3;
    let map = [
       [0,0,1,1,1,1,0,0],
       [0,0,1,4,4,1,0,0],
       [0,1,1,2,4,1,1,0],
       [0,1,2,2,3,4,1,0],
       [1,1,2,3,2,2,1,1],
       [1,2,2,1,3,3,2,1],
       [1,2,2,2,2,2,2,1],
       [1,1,1,1,1,1,1,1]
    ];
    let classList = ["NONE","BLOCK","ROAD","CHEESE","HOUSE","FULL"];
    let sizeY = map.length;
    let sizeX = map[0].length;
    let $data = [];
    let $table = document.querySelector(`#pushpush`);
    let $tbody = document.createElement(`t.body`);
    let HouseList = [];
    function init(){   
    $push = document.querySelector(`#pushpush`); 
    $tbody = document.createElement(`t.body`);
    $table = document.createElement(`table`);
    $table.style.borderCollapse = "collapse";
    for(let i = 0; i < sizeY; i ++){
        $tr = document.createElement(`tr`);
        let $temp = [];
        for(let j = 0; j < sizeX; j++){
            $td = document.createElement(`td`);
            $td.setAttribute("class", classList[map[i][j]]);
            $temp.push($td)
            $tr.append($td);
        }
        $data.push($temp);
        $table.append($tr);
    }
    $tbody.append($table);
    $push.append($tbody);
    $data[curY][curX].setAttribute(`class`, 'PLAYER');
    // 집 좌표 저장
    for(let i = 0; i < sizeY; i++){
        for(let j = 0; j < sizeX; j++){
            if($data[i][j].className == `HOUSE` || $data[i][j].className == `FULL`){
                let temphouse = [i, j];
                HouseList.push(temphouse);
            }
        }
    }
    }
    
//이동가능 확인
function movable(InputY, InputX){ //inputY => curY + nextY
    if($data[InputY][InputX].className == `ROAD`) return `ROAD`;
    else if($data[InputY][InputX].className == `CHEESE`) return 'CHEESE';
    else if($data[InputY][InputX].className == `HOUSE`) return `HOUSE`;
    else if($data[InputY][InputX].className == `FULL`) return `FULL`;
    else return false;
}
//console.log(movable(curY , curX - 2));
//키입력 이벤트
window.addEventListener(`keydown`, (a)=>{
    let key = a.code;
    if(key == `ArrowUp`) UP();
   else if(key == `ArrowLeft`) LEFT();
  else if(key == `ArrowRight`) RIGHT();
  else if(key == `ArrowDown`) DOWN();
});

function RIGHT(){
    moving(0, 1);
}
function UP(){
    moving(-1, 0);
}
function LEFT(){
    moving(0 , -1);
}
function DOWN(){
    moving(1, 0);
}
function moving(a, b){
    // 1. 움직이려는 곳이 그냥 도로인 경우
    if(movable(curY + a , curX + b) == "ROAD"){
        $data[curY][curX].setAttribute(`class`, "ROAD");
        curY += a;
        curX += b;
        $data[curY][curX].setAttribute(`class`, "PLAYER");
    }
    // 2. 움직일곳에 치즈가 있을경우
    else if(movable(curY + a, curX + b) == "CHEESE"){
        let tempY = curY + a;
        let tempX = curX + b;
            // 2 - 1 치즈가 굴러갈 곳이 도로인경우
            if(movable(tempY + a, tempX + b) == "ROAD"){
                $data[curY][curX].setAttribute(`class`, "ROAD");
                curY += a;
                curX += b;
                $data[tempY][tempX].setAttribute(`class`, `PLAYER`);
                $data[tempY + a][tempX + b].setAttribute(`class`, `CHEESE`);
            } // 2 - 2 치즈가 굴러갈 곳이 집인 경우
            else if(movable(tempY + a, tempX + b) == "HOUSE"){
                $data[curY][curX].setAttribute(`class`, `ROAD`);
                curY += a;
                curX += b;
                $data[tempY][tempX].setAttribute(`class`, `PLAYER`);
                $data[tempY + a][tempX + b].setAttribute(`class`, `FULL`);
            }
    // 3. 움직일곳이 집인경우
    } else if(movable(curY + a, curX + b) == `HOUSE`){
        $data[curY][curX].setAttribute(`class`, `ROAD`);
        curY += a;
        curX += b;
        $data[curY][curX].setAttribute(`class`, `PLAYER`);
    } 
    // 4. 움직일곳이 치즈가 든 집일경우
    else if(movable(curY + a, curX + b) == `FULL`){
        let tempY = curY + a;
        let tempX = curX + b;
        //집에 있는 치즈를 다른 집으로 밀 수 있는경우
        if(movable(tempY + a, tempX + b) == `HOUSE`){
            $data[curY][curX].setAttribute('class', 'ROAD');
            curY+= a;
            curX+= b;
            $data[tempY][tempX].setAttribute(`class`, `PLAYER`);
            $data[tempY + a][tempX + b].setAttribute(`class`, `FULL`);
        }
        //집에 있는 치즈를 집 밖으로 미는 경우
        else if(movable(tempY + a, tempX + b) == `ROAD`){
            $data[curY][curX].setAttribute('class', 'ROAD');
            curY+= a;
            curX+= b;
            $data[tempY][tempX].setAttribute(`class`, `PLAYER`);
            $data[tempY + a][tempX + b].setAttribute(`class`, `CHEESE`);
        }
    }
    Print();
}

function Print(){
    $push = document.querySelector(`#pushpush`);
    $push.children[0].remove();
    $tbody = document.createElement(`t.body`);
    $table = document.createElement(`table`);
    $table.style.borderCollapse = "collapse";
    //캐릭터의 이동으로 인해 집이 사라지는것을 방지
    for(let i = 0; i < HouseList.length; i++){
    if($data[HouseList[i][0]][HouseList[i][1]].className == "ROAD") 
    $data[HouseList[i][0]][HouseList[i][1]].setAttribute(`class`, `HOUSE`);
    }
    for(let i = 0; i < sizeY; i ++){
        $tr = document.createElement(`tr`);
        for(let j = 0; j < sizeX; j++){
            $td = document.createElement(`td`);
            $td = $data[i][j];
            $tr.append($td);
        }
        $table.append($tr);
    }
    $tbody.append($table);
    $push.append($tbody);
    clearCheck()
}

function clearCheck(){
    let count = 0;
    for(let i = 0; i < sizeY; i++){
        for(let j = 0; j < sizeX; j++){
            if($data[i][j].className == "FULL") count++;
        }
    }
    if(count == HouseList.length) setTimeout(gameClear, 100);
}
function gameClear(){
    let conf = confirm(`스테이지를 넘어가시려면 확인을, 다시 플레이 하시려면 취소를 눌러주세요.`) 
    if(conf == true) location.href = "../stage/stage13.html";
    else location.href = `../stage/stage12.html`;
}
init();
console.log($data)