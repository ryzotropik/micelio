// ==========================================
// MÁQUINA ORGANO-RIZOTRÓPIKA v2.0
// Estética: TV de Tubo, Conectiva Linux, Dial-up
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

// Variáveis da TV (Moldura)
let margemTV = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textAlign(CENTER, CENTER);

  // Inicializa os nós centralizados para a explosão inicial
  for (let i = 0; i < palavras.length; i++) {
    nodes.push(new Node(palavras[i], width / 2 + random(-10, 10), height / 2 + random(-10, 10)));
  }
}

function draw() {
  // Limita o desenho à área da tela da TV
  push();

  if (estado === "OFF") {
    background(5, 5, 5); // Tela apagada
    drawPowerButton();
  }
  else if (estado === "BOOTING") {
    background(0);
    drawVisualBoot();
  }
  else if (estado === "DIALING") {
    background(0);
    drawDialingScreen();
  }
  else if (estado === "RIZOMA") {
    // Fundo Clássico Conectiva Linux / Win95 (Azul-petróleo)
    background(0, 128, 128);
    drawRizoma();
  }

  // O filtro CRT e a Moldura da TV são desenhados por cima
  drawCRTOverlay();
  pop();

  drawTVFrame(); // A carcaça de plástico do monitor
}

// ==========================================
// ESTADOS DA INTERFACE
// ==========================================

function drawPowerButton() {
  let bx = width / 2;
  let by = height / 2;
  let r = 40;

  // Efeito de brilho se o mouse estiver em cima
  let d = dist(mouseX, mouseY, bx, by);
  if (d < r) {
    stroke(255, 50, 50);
    strokeWeight(6);
    cursor(HAND);
  } else {
    stroke(150, 0, 0);
    strokeWeight(4);
    cursor(ARROW);
  }

  noFill();
  // Símbolo clássico de Power
  arc(bx, by, r, r, -PI / 2 + 0.5, 3 * PI / 2 - 0.5);
  line(bx, by - r / 2 - 10, bx, by);
}

function drawVisualBoot() {
  let progresso = millis() - timerEstado;

  fill(200);
  textSize(18);
  textAlign(LEFT, TOP);
  let startX = margemTV + 30;
  let startY = margemTV + 30;

  text("RYZOTRÓPIK BIOS v1.0.4", startX, startY);

  // Simula checagem de RAM
  let ram = min(64000, floor(map(progresso, 0, 2000, 0, 64000)));
  text(`Memory Test: ${ram} OK`, startX, startY + 30);

  if (progresso > 1000) {
    text("Loading Kernel...", startX, startY + 60);
  }

  if (progresso > 2000) {
    // Barra de progresso visual
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

  fill(255, 200, 0); // Amarelo terminal
  textSize(16);
  textAlign(LEFT, TOP);
  let startX = margemTV + 30;

  text("Executando: /sbin/dial-up.sh", startX, margemTV + 30);
  text("Modem status: CONNECT 56000/ARQ/V90", startX, margemTV + 60);

  // Manifesto digitado
  if (frameCount % 3 === 0 && indexCaractere < manifesto.length) {
    textoDigitado += manifesto.charAt(indexCaractere);
    indexCaractere++;
  }

  fill(255); // Branco puro para a mensagem principal
  textSize(22);
  text(textoDigitado + (frameCount % 15 < 7 ? "█" : ""), startX, margemTV + 120, width - (margemTV * 2 + 60), height);

  if (progresso > 5500) {
    mudarEstado("RIZOMA");
    textAlign(CENTER, CENTER);
  }
}

function drawRizoma() {
  // Limites da tela para as partículas não entrarem na moldura
  let minX = margemTV + 50;
  let maxX = width - margemTV - 50;
  let minY = margemTV + 50;
  let maxY = height - margemTV - 50;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);

      // Choque e Repulsão entre os nós
      if (d > 0 && d < 250) {
        let forcaRepulsao = 400 / (d * d);
        let direcao = p5.Vector.sub(nodes[i].pos, nodes[j].pos).normalize();
        nodes[i].acc.add(p5.Vector.mult(direcao, forcaRepulsao));
        nodes[j].acc.sub(p5.Vector.mult(direcao, forcaRepulsao));
      }

      // Conexões (Alta Voltagem)
      stroke(255, 255, 0, map(d, 0, 350, 150, 0)); // Linhas amarelas/elétricas
      strokeWeight(map(d, 0, 350, 3, 0.5));
      line(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);
    }

    // Mola pro centro
    let atracaoCentro = p5.Vector.sub(createVector(width / 2, height / 2), nodes[i].pos);
    atracaoCentro.mult(0.001);
    nodes[i].acc.add(atracaoCentro);

    // INTERAÇÃO COM O MOUSE (Corrigida para usabilidade)
    let distMouse = dist(nodes[i].pos.x, nodes[i].pos.y, mouseX, mouseY);
    if (distMouse < 80) {
      // O mouse agora é um "campo magnético de glitch" que SEGURA a palavra
      nodes[i].vel.mult(0.4); // Freio forte (atrito) para facilitar o clique
      nodes[i].glitch = true;
      cursor(HAND);
    } else {
      nodes[i].glitch = false;
    }

    // Rebater nas paredes virtuais da TV
    if (nodes[i].pos.x < minX) { nodes[i].pos.x = minX; nodes[i].vel.x *= -1; }
    if (nodes[i].pos.x > maxX) { nodes[i].pos.x = maxX; nodes[i].vel.x *= -1; }
    if (nodes[i].pos.y < minY) { nodes[i].pos.y = minY; nodes[i].vel.y *= -1; }
    if (nodes[i].pos.y > maxY) { nodes[i].pos.y = maxY; nodes[i].vel.y *= -1; }
  }

  // Verifica se o mouse saiu de cima de todos
  let hovered = nodes.some(n => dist(n.pos.x, n.pos.y, mouseX, mouseY) < 80);
  if (!hovered && estado === "RIZOMA") cursor(ARROW);

  // Atualiza e Desenha os Nós
  for (let n of nodes) {
    n.update();
    n.display();
  }
}

// ==========================================
// EFEITOS E MOLDURA DA TV
// ==========================================

function drawCRTOverlay() {
  // Scanlines que afetam as cores (RGB)
  strokeWeight(2);
  for (let i = margemTV; i < height - margemTV; i += 4) {
    stroke(0, 0, 0, 40);
    line(margemTV, i, width - margemTV, i);
  }

  // Ruído RGB esporádico (estática)
  if (estado === "RIZOMA" && random(1) < 0.05) {
    noStroke();
    fill(255, 255, 255, 15);
    rect(margemTV, margemTV, width - margemTV * 2, height - margemTV * 2);
  }
}

function drawTVFrame() {
  noFill();

  // Sombra interna (profundidade da tela)
  stroke(0, 100);
  strokeWeight(15);
  rect(margemTV, margemTV, width - margemTV * 2, height - margemTV * 2, 20);

  // A carcaça de plástico cinza da TV (Bezel)
  stroke(30); // Cinza bem escuro
  strokeWeight(margemTV * 2); // Espessura borda
  rect(0, 0, width, height, 40); // Canto arredondado da TV
}

// ==========================================
// CLASSE DOS NÓS
// ==========================================

class Node {
  constructor(txt, x, y) {
    this.txt = txt;
    this.pos = createVector(x, y);
    this.vel = createVector(random(-5, 5), random(-5, 5)); // Explosão inicial
    this.acc = createVector(0, 0);
    this.glitch = false;
    this.clicado = 0; // Timer visual para o clique
    // Cores vibrantes tipo Linux antigo / Anos 90
    this.cores = [color(255, 255, 0), color(0, 255, 0), color(255, 100, 100), color(255)];
    this.cor = random(this.cores);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(0.92); // Atrito geral
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

    // Efeito de choque ao passar o mouse
    if (this.glitch) {
      fill(255, 0, 0); // Aberração vermelha
      text(this.txt, renderX - 3, renderY);
      fill(0, 0, 255); // Aberração azul
      text(this.txt, renderX + 3, renderY);
      fill(255); // Branco puro
      renderX += random(-2, 2);
      renderY += random(-2, 2);
    } else {
      // Fundo preto para destaque (estilo botões ou terminal)
      fill(0, 180);
      rectMode(CENTER);
      rect(renderX, renderY, bbox + 16, 28);
      fill(this.cor);
    }

    // Efeito de Flash ao clicar
    if (this.clicado > 0) {
      fill(255); // Pisca branco
      rect(renderX, renderY, bbox + 16, 28);
      fill(0); // Texto preto
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
    // Checar se clicou em uma palavra
    for (let i = 0; i < nodes.length; i++) {
      let d = dist(nodes[i].pos.x, nodes[i].pos.y, mouseX, mouseY);
      if (d < 80) { // Hitbox amigável
        nodes[i].clicado = 15; // Ativa o flash visual por 15 frames

        // >>> AQUI ENTRARÁ A LÓGICA DE ABRIR A LETRA DA MÚSICA <<<
        console.log("Palavra acessada: " + nodes[i].txt);
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