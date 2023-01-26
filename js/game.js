let images = ["./images/bird1.gif", "./images/bird2.gif", "./images/bird3.gif"];
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const urlParams = window.location.search;
let levelval = getSecondPart(urlParams);
let userName = urlParams.split('=')[1].split('&')[0]
let speed = levelval == "level1" ? 7000 : 4000;
let birdsArray = [];
var GameMusic;
var killSound;
var bombFire;
let killCount = 0;
let birdsKilled = 0;
let myInterval; 
let currentScore = parseInt($("span.playerScore").text());



class Bird {
    constructor(top, src) {
        let birdImg = document.createElement("img");
        birdImg.setAttribute("draggable", "false")
        this.bird = birdImg;
        this.bird.src = src;
        this.bird.classList.add("bird");
        this.bird.style.top = top + "px";
        this.bird.style.right = 0;               //right
        this.bird.style.left = "100%";           //left
        this.myInterval;
    }
    addtoParent = function () {
        var body = document.querySelector("body");
        body.appendChild(this.bird);
    }
    moveLeft = function () {
        $(this.bird).animate({
            left: "-10%"                        //left
        }, speed, function () {
            this.remove();
        })
    }
}




class sound {
    constructor(src, loopFlag) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.loop = loopFlag;
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }
    play = function () {
        this.sound.play();
    }
    stop = function () {
        this.sound.pause();
    }
}



function getSecondPart(str) {
    return str.split('levels=')[1];
}




$(function () {
    
    let parsing = JSON.parse(localStorage.getItem(userName));
    $("h1 span:first").text(userName);
    $("#greetings").text(userName);
    $("h1 span:last").text(levelval);
    if (parsing.name == userName) {
        $(".score h2:nth-child(2) span").text(parsing.score)
    }

});









function Timer() {

    
    let counter = 60;
    let interval = setInterval(function() {
        counter--;
        // Display 'counter' wherever you want to display it.
        if (counter <= 0) {
                 clearInterval(interval);
              $('#Time').text(counter);  
            return;
        }else{
            $('#Time').text(counter);
        //   console.log("Timer --> " + counter);
        }
    }, 1000);
    }






let startBtn = $("#welcome button")

GameMusic = new sound("../sounds/Emerald.mp3", true);
GameMusic.play();


startBtn.on("click", startgame);

function startgame() {

    Timer();
    $("span.playerScore").text("00");
    $("#welcome").addClass("out");


    let BombTimer = setInterval(function () {

        DrobTheBomb();
    }, 6000)






    setTimeout(() => {
        clearInterval(myInterval);
        clearInterval(BombTimer);
        if (currentScore > 50  &&  killCount > 25) {
            Swal.fire({
                title: 'success!',  
                 text: 'Congratulations, you Won ! Wanna play again ? ' ,               
                icon: 'success',
                confirmButtonText: 'lets play again',
                showCancelButton: true,
                allowOutsideClick: false
            }).then(function (result) {
                if (result.value) {
                    currentScore = 0;
                    killCount = 0;
                    counter = 0; 
                    $(".playerScore").text(currentScore);
                    $("#BirdKilled").text(killCount);
                    $("#Time").text(counter);                  
                    startBtn.trigger("click");
                } else if (result.dismiss == 'cancel') {
                    window.location.href = "index.html";
                }
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Sorry you lost , Wanna try again ? ',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'ok !',
                allowOutsideClick: false
            }).then(function (result) {
                if (result.value) {
                    currentScore = 0;
                    killCount = 0;
                    counter = 0;
                    $(".playerScore").text(currentScore);
                    $("#BirdKilled").text(killCount);
                    $("#Time").text(counter);  
                    startBtn.trigger("click");
                } else if (result.dismiss == 'cancel') {
                    window.location.href = "index.html";
                }
            });
        }
    }, 60000);
    




    killSound = new sound("../sounds/kill.mp3", false);

    myInterval = window.setInterval(function () {
        

        let birdsNumber = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i <= birdsNumber; i++) {
            let topp = Math.floor(Math.random() * (windowHeight - 200)) + (0);
            let birdObj = new Bird(topp + Math.floor(Math.random() * 10), images[Math.floor(Math.random() * 3) + 0])
            birdObj.addtoParent();
            birdObj.moveLeft();
            birdsArray.push(birdObj);
        }

        $("img:not(:first).bird").on("click", function () {
            killSound.play();
            gameScore($(this).attr('src'));
            $(this).stop();
            $(this).attr("src", "images/RIP.gif").fadeTo(500);
            $(this).animate({
                top: '450px',
                opacity: '0.8'
            }, 1500).hide(1000);
        });
        $(function () {

            $('*').css('cursor', 'url(images/cursor.png),auto');
        });
      
        function gameScore(score) {
            
        
            switch (score) {
                case './images/bird1.gif':
                    currentScore = currentScore + 5;
                    $("span.playerScore").text(currentScore);
                    
                    killCount++;
                    $("#BirdKilled").text(killCount);
                    

                    break;
                case './images/bird2.gif':
                    if (currentScore >= 10) {
                        currentScore = parseInt(currentScore) - 10;
                        $("span.playerScore").text(currentScore);
                    }
                    else if (currentScore == 5) {
                        $("span.playerScore").text("0");
                    }
                    killCount++;
                    $("#BirdKilled").text(killCount);
                    break;
                case './images/bird3.gif':
                    currentScore = currentScore + 10;
                    $("span.playerScore").text(currentScore);
                    
                    killCount++;
                    $("#BirdKilled").text(killCount);
                    break;
            }
            localStorage.setItem(userName, JSON.stringify({
                name: userName,
                score: currentScore
            }));

        }
    }, 1000);







}



const DrobTheBomb=function(){

    let RealBomb=document.createElement("img");
    RealBomb.src=`./images/bomba.gif`;
    RealBomb.draggable=false;
    RealBomb.style.position="absolute";
    RealBomb.style.width="80px";
    RealBomb.style.left=Math.round(Math.random()*(window.innerWidth-parseInt(RealBomb.style.width)))+"px";
    RealBomb.style.top=-1*parseInt(RealBomb.height)+"px";

    document.querySelector("body").append(RealBomb);

    let distance=-1*parseInt(RealBomb.height);
    let timerId=setInterval(function(){
        if(distance>window.innerHeight){         
            RealBomb.remove();
            clearInterval(timerId);
        }else{                                                 
            distance+=5;
            RealBomb.style.top=distance+"px";
        }
    },25);

    RealBomb.onclick=function(){
        RealBomb.src = "./images/Explosion.gif";
        RealBomb.style.transform = "scale(5)";
        let bombSound = new sound ("../sounds/bomb.mp3");   
        bombSound.play();


        

        
        let BirdsFound=document.querySelectorAll(".bird");
        let range = 500;
        let bombHorizontal = parseInt(RealBomb.style.left)+parseInt(RealBomb.width);
        let bombVertical = parseInt(RealBomb.style.top)+parseInt(RealBomb.height);
        BirdsFound.forEach(bird => {



            

            let birdLeft = parseFloat(bird.style.left)/(100)*window.innerWidth;
            let birdHorizontal = parseInt(birdLeft)+parseInt(bird.width);
            let birdVertical = parseInt(bird.style.top)+parseInt(bird.height);
            let distance = Math.sqrt(Math.pow((bombHorizontal-birdHorizontal),2)+Math.pow((bombVertical-birdVertical),2));

            if(distance<range){


                let score = bird.src.split("images/")[1];
                switch (score) {
                    case 'bird1.gif':
                        currentScore = currentScore + 5;
                        $("span.playerScore").text(currentScore);
                        
                        killCount++;
                        $("#BirdKilled").text(killCount);
                        
    
                        break;
                    case 'bird2.gif':
                        if (currentScore >= 10) {
                            currentScore = parseInt(currentScore) - 10;
                            $("span.playerScore").text(currentScore);
                        }
                        else if (currentScore == 5) {
                            $("span.playerScore").text("0");
                        }
                        killCount++;
                        $("#BirdKilled").text(killCount);
                        break;
                    case 'bird3.gif':
                        currentScore = currentScore + 10;
                        $("span.playerScore").text(currentScore);
                        
                        killCount++;
                        $("#BirdKilled").text(killCount);
                        break;
                }
                bird.remove();
                
            }
        });
        setTimeout(function() {

        RealBomb.remove();
    }, 500);
    }

};
