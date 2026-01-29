function setup() {
  let c = createCanvas(600, 200);
  c.parent(document.body);
  background(240);
  fill(10);
  textSize(24);
  textAlign(CENTER, CENTER);
  text('Hello — arriscada.com.br', width/2, height/2);
}

function windowResized(){
  resizeCanvas(windowWidth, 200);
}
