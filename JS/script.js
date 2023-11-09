    //getting the canvas that we are drawing on
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    //drawing ball
    const ballRadius = 10;
    let ballColor;
    //define variables for paddle
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    //the starting position of the ball.
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    //define how much the ball moves
    let dx = 2;
    let dy = -2;
    //defining and initializing pressed buttons. It's a boolean value.
    let rightPressed = false;
    let leftPressed = false;
    //brick variables
    let brickRowCount = 3;
    let brickColumnCount = 5;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;
    //2D array for bricks
    let bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    //Keeping score variable
    let score = 0;
    //give our players some lives
    let lives = 3;

    //Listening for our keys, the first will be fired while keys are being pressed, the second after the keys are done being pressed.
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    //listening for mouse movement
    document.addEventListener("mousemove", mouseMoveHandler, false);
    //anchoring the paddle movement to the mouse movement
    function mouseMoveHandler(e){
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
          paddleX = relativeX - paddleWidth / 2;
      }
    }

    //key functions
    function keyDownHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    }
    function keyUpHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    }
    //collision detection function
    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          let b = bricks[c][r];
          if (b.status === 1) {
            //calculations
            if (
              x > b.x &&
              x < b.x + brickWidth && //b.x + brickWidth should be the key to making the blocks disappear
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              score++;
              if (score === brickRowCount * brickColumnCount) {
                  alert("Congratulations! You win!");
                  document.location.reload();
                  
              }
            }
          }
        }
      }
    }
    function drawScore(){
      ctx.font = "16px sans-serif";
      ctx.fillStyle = ballColor;
      ctx.fillText(`Score: ${score}`,8, 20);
    }
    function drawLives(){
      ctx.font = "16px sans-serif";
      ctx.fillStyle = ballColor;
      ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
    }

    //random color for fun!
    function randomColor() {
      return (ballColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16));
    }
    /*define a drawing loop for ball, paddle, bricks*/
    function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();
    }
    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(
        paddleX,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();
    }
    //brick drawing function
    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          //need to check status as to whether we draw it or not based on the collision detection
          //if the status is 0 the bricks will not be painted
          if (bricks[c][r].status === 1) {
            //defining placement for bricks
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = ballColor;
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }
    /*End object drawings*/

    function draw() {
      //clear the canvas before each iteration of the ball is drawn
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPaddle();
      drawScore();
      drawLives();
      collisionDetection();
      
      if (rightPressed) {
        //whatever is smaller of the two expressions will be the x placement of the paddle when the right key is pressed.
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
      } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
      }
      drawBricks();
      //call the drawBall function
      drawBall();

      //increment the movement
      x += dx;
      y += dy;
      //Bouncing off walls Checking to see if we have hit a wall in the canvas and if so, we will reverse the direction of the ball. In order to make sure that the ball does not appear to be going off the screen we subtract the ball's radius
      if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
        randomColor();
      }
      if (y + dy < ballRadius) {
        dy = -dy;
        randomColor();
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
          //else if lives === 0 then game over
        } else {
          lives--;
          if (!lives){
          alert("Game Over");
          document.location.reload();
          
          } else {
              x = canvas.width / 2;
              y = canvas.height - 30;
              dx = 2;
              dy = -2;
              paddleX = (canvas.width - paddleWidth)/ 2;
          }
        }
      }
      requestAnimationFrame(draw);
    }

    //how fast the ball is moving
    //in step 10 we remove in place of having requestAnimationFrame a better way of rendering in the browser
    //var interval = setInterval(draw, 15);
    //after removing the above line, we simply call the draw function
    draw();