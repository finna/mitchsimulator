let player;
let staircases = [];
let cashStacks = [];
let score = 0;
let restartButton;

function setup() {
  createCanvas(800, 600);
  resetGame(); // Initialize the game state
}

function draw() {
  background(220, 240, 255); // Light blue sky background
  
  player.update();
  player.display();
  
  for (let i = staircases.length - 1; i >= 0; i--) {
    staircases[i].update();
    staircases[i].display();
    
    if (player.collidesWith(staircases[i])) {
      gameOver();
      return;
    }
  }
  
  for (let i = cashStacks.length - 1; i >= 0; i--) {
    cashStacks[i].update();
    cashStacks[i].display();
    
    if (player.collidesWith(cashStacks[i])) {
      score += 10;
      cashStacks.splice(i, 1);
      cashStacks.push(new CashStack(random(width), random(height)));
    }
  }
  
  displayScore();
  
  if (frameCount % 120 === 0) {
    staircases.push(new Staircase(random(width), 0));
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 80;
    this.speed = 5;
  }
  
  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;
    
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    fill(240, 200, 180); // Light skin tone
    rect(-this.size / 2, -this.size / 2, this.size, this.size * 1.3, 10);
    fill(230, 180, 160, 150); // Shadow for jowls
    ellipse(-this.size / 2 + 10, this.size / 2, 20, 30);
    ellipse(this.size / 2 - 10, this.size / 2, 20, 30);
    
    fill(255); // White of eyes
    beginShape();
    vertex(-25, -10); vertex(-15, -15); vertex(-5, -10); vertex(-15, -5);
    endShape(CLOSE);
    beginShape();
    vertex(25, -10); vertex(15, -15); vertex(5, -10); vertex(15, -5);
    endShape(CLOSE);
    fill(100, 50, 0); // Brown pupils
    ellipse(-15, -10, 6, 6);
    ellipse(15, -10, 6, 6);
    fill(0, 0, 0, 50); // Subtle eye bags
    ellipse(-15, -5, 15, 10);
    ellipse(15, -5, 15, 10);
    
    noFill();
    stroke(150, 150, 150);
    strokeWeight(1);
    arc(-15, -20, 20, 10, PI, TWO_PI - QUARTER_PI);
    arc(15, -20, 20, 10, PI + QUARTER_PI, TWO_PI);
    noStroke();
    
    stroke(200, 100, 100);
    strokeWeight(1.5);
    line(-15, 25, 15, 25);
    line(-15, 25, -17, 27);
    line(15, 25, 17, 27);
    noStroke();
    
    fill(150, 150, 150);
    for (let i = -20; i <= 20; i += 8) {
      triangle(i, -40, i + 4, -40, i + random(-2, 2), -50);
    }
    
    fill(240, 200, 180);
    rect(-this.size / 2 + 10, this.size / 2, this.size - 20, 20, 5);
    fill(230, 180, 160, 150);
    ellipse(0, this.size / 2 + 10, this.size - 10, 10);
    
    pop();
  }
  
  collidesWith(obj) {
    let d = dist(this.x, this.y, obj.x, obj.y);
    return d < (this.size / 2 + obj.size / 2);
  }
}

class Staircase {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 60;
    this.speedX = random(-1, 1);
    this.speedY = random(1, 3);
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.y > height + this.size) this.y = -this.size;
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    fill(139, 69, 19); // Brown wood
    for (let i = 0; i < 5; i++) {
      rect(-this.size / 2, i * 10 - 20, this.size, 8);
      fill(110, 50, 10, 100); // Shadow
      rect(-this.size / 2 + 2, i * 10 - 20 + 2, this.size - 4, 6);
    }
    fill(100, 50, 0); // Side rail
    rect(-this.size / 2 - 5, -20, 5, 50);
    rect(this.size / 2, -20, 5, 50);
    
    pop();
  }
}

class CashStack {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(0.5, 2);
    this.angle = 0;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.angle += 0.05;
    
    if (this.y > height + this.size) this.y = -this.size;
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    
    fill(34, 139, 34); // Green money color
    rect(-this.size / 2, -this.size / 2, this.size, this.size, 5);
    fill(255, 255, 255, 100); // Dollar sign
    textSize(20);
    textAlign(CENTER, CENTER);
    text("$", 0, 0);
    fill(50, 100, 50, 150); // Shading
    rect(-this.size / 2 + 2, -this.size / 2 + 2, this.size - 4, this.size - 4, 5);
    
    pop();
  }
}

function displayScore() {
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 10, 10);
}

function gameOver() {
    background(255, 100, 100); // Red flash
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2 - 40);
    textSize(24);
    text(`Final Score: ${score}`, width / 2, height / 2);
    
    // Create and position restart button
    if (!restartButton) {
      restartButton = createButton("Restart");
      restartButton.id('restart-btn'); // Assign ID for CSS targeting
      restartButton.mousePressed(resetGame);
    }
    // Position button relative to canvas center, with slight delay to ensure rendering
    setTimeout(() => {
      let canvasX = (windowWidth - width) / 2; // Canvas left offset
      let canvasY = (windowHeight - height) / 2; // Canvas top offset
      let btnX = canvasX + width / 2 - restartButton.width / 2;
      let btnY = canvasY + height / 2 + 40;
      restartButton.position(btnX, btnY);
    }, 50); // 50ms delay to ensure button width is available
    restartButton.show();
    noLoop();
  }
  
  function resetGame() {
    player = new Player(width / 2, height / 2);
    staircases = [];
    cashStacks = [];
    score = 0;
    
    for (let i = 0; i < 5; i++) {
      staircases.push(new Staircase(random(width), random(height)));
      cashStacks.push(new CashStack(random(width), random(height)));
    }
    
    if (restartButton) restartButton.hide();
    loop();
  }