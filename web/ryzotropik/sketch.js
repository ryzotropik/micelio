// ==========================================
// MÁQUINA ORGANO-RIZOTRÓPIKA v2.2
// Correção: Scanlines no fundo para não acinzentar as letras
// ==========================================

let estado = "OFF"; // OFF, BOOTING, DIALING, RIZOMA
let timerEstado = 0;

// Dados do Rizoma
let palavras = [
  "RYZOTRÓPIK", "CORPO SEM ÓRGÃOS", "PRODUÇÃO",
  "NOME??", "TRAGÉDIA CULTURAL", "4.0",
  "MÁQUINA", "CONTRADIÇÃO"
];
let nodes = [];

// Mensagem Dial-up
let manifesto = "A ARTE NÃO OBEDECE AO ESQUEMA FORDIANO DE PRODUÇÃO.";
let textoDigitado = "";
let indexCaractere = 0;

// Variáveis da TV
let margemTV = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textAlign(CENTER, CENTER);

  for (let i = 0; i < palavras.length; i++) {
    nodes.push(new Node(palavras[i], width / 2 + random(-80, 80), height / 2 + random(-80, 80)));
  }
}

function draw() {
  push();

  if (estado === "OFF") {
    background(5, 5, 5);
    drawPowerButton();
  }
  else {
    // 1. DESENHA O FUNDO PRIMEIRO
    if (estado === "BOOTING" || estado === "DIALING") {
      background(0);
    } else if (estado === "RIZOMA") {
      background(0, 128, 128); // Fundo Conectiva
    }

    // 2. DESENHA O EFEITO CRT NO FUNDO (Atrás das letras)
    drawCRTOverlay();

    // 3. DESENHA O CONTEÚDO (Letras brilhantes por cima de tudo)
    if (estado === "BOOTING") {
      drawVisualBoot();
    } else if (estado === "DIALING") {
      drawDialingScreen();
    } else if (estado === "RIZOMA") {
      drawRizoma();
    }
  }

  pop();

  // 4. DESENHA A CARCAÇA DE PLÁSTICO DA TV
  drawTVFrame();
}

// ==========================================
// ESTADOS DA INTERFACE
// ==========================================

function drawPowerButton() {
  let bx = width / 2;
  let by = height / 2;
  let r = 40;

  let d = dist(mouseX, mouseY, bx, by);
  if (d < r) {
    stroke(255, 50, 50);
    strokeWeight(6);
    cursor(HAND);
  } else {
    stroke(100, 0, 0);
    strokeWeight(4);
    cursor(ARROW);
  }

  noFill();
  arc(bx, by, r, r, -PI / 2 + 0.5, 3 * PI / 2 - 0.5);
  line(bx, by - r / 2 - 10, bx, by);
}

function drawVisualBoot() {
  let progresso = millis() - timerEstado;

  fill(0, 255, 0); // Verde puro
  textSize(18);
  textAlign(LEFT, TOP);
  let startX = margemTV + 40;
  let startY = margemTV + 40;

  text("RYZOTRÓPIK BIOS v1.0.4", startX, startY);

  let ram = min(64000, floor(map(progresso, 0, 2000, 0, 64000)));
  text(`Memory Test: ${ram} OK`, startX, startY + 30);

  if (progresso > 1000) {
    text("Loading Kernel...", startX, startY + 60);
  }

  if (progresso > 2000) {
    let blocos = floor(map(progresso, 2000, 4000, 0, 20));
    let barra = "[";
    for (let i = 0; i < 20; i++) {
      barra += (i < blocos) ? "█" : " ";
    }
    barra += "]";
    text(`Mounting root fs: ${barra}`, startX, startY + 90);
  }

  if (progresso > 4500) {
    mudarEstado("DIALING");
  }
}

function drawDialingScreen() {
  let progresso = millis() - timerEstado;

  fill(255, 200, 0); // Amarelo puro
  textSize(16);
  textAlign(LEFT, TOP);
  let startX = margemTV + 40;

  text("Executando: /sbin/dial-up.sh", startX, margemTV + 40);
  text("Modem status: CONNECT 56000/ARQ/V90", startX, margemTV + 70);

  if (frameCount % 3 === 0 && indexCaractere < manifesto.length) {
    textoDigitado += manifesto.charAt(indexCaractere);
    indexCaractere++;
  }

  fill(255); // Branco puro
  textSize(22);
  let larguraSegura = width - (margemTV * 2 + 80);
  text(textoDigitado + (frameCount % 15 < 7 ? "█" : ""), startX, margemTV + 130, larguraSegura, height);

  if (progresso > 5500) {
    mudarEstado("RIZOMA");
    textAlign(CENTER, CENTER);
  }
}

function drawRizoma() {
  let minX = margemTV + 60;
  let maxX = width - margemTV - 60;
  let minY = margemTV + 60;
  let maxY = height - margemTV - 60;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);

      if (d > 0 && d < 350) {
        let forcaRepulsao = 800 / (d * d);
        let direcao = p5.Vector.sub(nodes[i].pos, nodes[j].pos).normalize();
        nodes[i].acc.add(p5.Vector.mult(direcao, forcaRepulsao));
        nodes[j].acc.sub(p5.Vector.mult(direcao, forcaRepulsao));
      }

      stroke(255, 255, 0, map(d, 0, 450, 150, 0));
      strokeWeight(map(d, 0, 450, 3, 0.5));
      line(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);
    }

    let atracaoCentro = p5.Vector.sub(createVector(width / 2, height / 2), nodes[i].pos);
    atracaoCentro.mult(0.0003);
    nodes[i].acc.add(atracaoCentro);

    let distMouse = dist(nodes[i].pos.x, nodes[i].pos.y, mouseX, mouseY);
    if (distMouse < 80) {
      nodes[i].vel.mult(0.3);
      nodes[i].glitch = true;
      cursor(HAND);
    } else {
      nodes[i].glitch = false;
    }

    if (nodes[i].pos.x < minX) { nodes[i].pos.x = minX; nodes[i].vel.x *= -1; }
    if (nodes[i].pos.x > maxX) { nodes[i].pos.x = maxX; nodes[i].vel.x *= -1; }
    if (nodes[i].pos.y < minY) { nodes[i].pos.y = minY; nodes[i].vel.y *= -1; }
    if (nodes[i].pos.y > maxY) { nodes[i].pos.y = maxY; nodes[i].vel.y *= -1; }
  }

  let hovered = nodes.some(n => dist(n.pos.x, n.pos.y, mouseX, mouseY) < 80);
  if (!hovered && estado === "RIZOMA") cursor(ARROW);

  for (let n of nodes) {
    n.update();
    n.display(); // As letras agora são desenhadas por último, sem filtro em cima
  }
}

// ==========================================
// EFEITOS E MOLDURA DA TV
// ==========================================

function drawCRTOverlay() {
  // As linhas agora ficam no fundo, dando textura sem apagar as letras
  strokeWeight(2);
  stroke(0, 0, 0, 25);
  for (let i = margemTV; i < height - margemTV; i += 4) {
    line(margemTV, i, width - margemTV, i);
  }
}

function drawTVFrame() {
  noFill();

  // Sombra interna
  stroke(0, 150);
  strokeWeight(15);
  rect(margemTV, margemTV, width - margemTV * 2, height - margemTV * 2, 20);

  // Carcaça de plástico
  stroke(20);
  strokeWeight(margemTV * 2);
  rect(0, 0, width, height, 40);
}

// ==========================================
// CLASSE DOS NÓS
// ==========================================

class Node {
  constructor(txt, x, y) {
    this.txt = txt;
    this.pos = createVector(x, y);
    this.vel = createVector(random(-6, 6), random(-6, 6));
    this.acc = createVector(0, 0);
    this.glitch = false;
    this.clicado = 0;
    this.cores = [color(255, 255, 0), color(0, 255, 0), color(255, 100, 100), color(255)];
    this.cor = random(this.cores);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(0.92);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if (this.clicado > 0) this.clicado--;
  }

  display() {
    noStroke();
    textSize(20);

    let renderX = this.pos.x;
    let renderY = this.pos.y;
    let bbox = textWidth(this.txt);

    if (this.glitch) {
      fill(255, 0, 0);
      text(this.txt, renderX - 3, renderY);
      fill(0, 0, 255);
      text(this.txt, renderX + 3, renderY);
      fill(255);
      renderX += random(-2, 2);
      renderY += random(-2, 2);
    } else {
      fill(0, 180);
      rectMode(CENTER);
      rect(renderX, renderY, bbox + 16, 28);
      fill(this.cor); // A cor pura do texto
    }

    if (this.clicado > 0) {
      fill(255);
      rect(renderX, renderY, bbox + 16, 28);
      fill(0);
    }

    text(this.txt, renderX, renderY);
  }
}

// ==========================================
// EVENTOS DE MOUSE
// ==========================================

function mousePressed() {
  if (estado === "OFF") {
    let d = dist(mouseX, mouseY, width / 2, height / 2);
    if (d < 40) {
      mudarEstado("BOOTING");
    }
  }
  else if (estado === "RIZOMA") {
    for (let i = 0; i < nodes.length; i++) {
      let d = dist(nodes[i].pos.x, nodes[i].pos.y, mouseX, mouseY);
      if (d < 80) {
        nodes[i].clicado = 15;
        console.log("Comando recebido: Abrir letra de " + nodes[i].txt);
      }
    }
  }
}

function mudarEstado(novoEstado) {
  estado = novoEstado;
  timerEstado = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}