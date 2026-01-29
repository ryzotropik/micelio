function setup() {
  let c = createCanvas(600, 200);
  c.parent(document.body);
  background(30);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text('Hello — ryzotropik.art.br', width/2, height/2);
}

function windowResized(){
  resizeCanvas(windowWidth, 200);
}
