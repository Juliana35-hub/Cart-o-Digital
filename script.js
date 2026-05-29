document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // CINEMATIC MOTION REVEAL TIMELINE (BOUNCING DOTS TO MAGIC PEN)
  // ==========================================================================
  const motionDotsLoader = document.getElementById("motionDotsLoader");
  const motionNameContainer = document.getElementById("motionNameContainer");
  const writtenName = document.getElementById("writtenName");
  const writingSpark = document.getElementById("writingSpark");
  const motionSubWrap = document.getElementById("motionSubWrap");
  const enterBtn = document.getElementById("enterBtn");

  // Fase 2: Dissipação das Bolinhas de Carregamento (1.5s)
  if (motionDotsLoader) {
    setTimeout(() => {
      motionDotsLoader.classList.add("fade-out");
    }, 1500);
  }

  // Fase 3: O Início da Escrita Mágica pela Centelha (1.6s)
  setTimeout(() => {
    if (motionDotsLoader) motionDotsLoader.classList.add("hide");
    if (motionNameContainer) {
      motionNameContainer.classList.remove("hide");
      motionNameContainer.classList.add("visible");
      
      // Forçar reflow para garantir que o navegador registre o estado inicial clip-path: inset(0 100% 0 0)
      if (writtenName) {
        void writtenName.offsetHeight;
      }
      
      // Adicionar classes de animação no próximo frame para iniciar a transição perfeitamente
      requestAnimationFrame(() => {
        if (writtenName) writtenName.classList.add("write-active");
        if (writingSpark) writingSpark.classList.add("writing");
      });
    }
  }, 1600);

  // Fase 4: Entrada Suave da Tagline e do Botão de Entrada (3.4s)
  if (motionSubWrap && enterBtn) {
    setTimeout(() => {
      motionSubWrap.classList.add("visible");
      enterBtn.classList.remove("hide");
    }, 3400);
  }

  // ==========================================================================
  // DOM ELEMENTS
  // ==========================================================================
  const introScreen = document.getElementById('introScreen');
  const mainContent = document.getElementById('mainContent');
  
  const digitalCard = document.getElementById('digitalCard');
  const customSwitch = document.getElementById('customSwitch');
  const labelFront = document.getElementById('labelFront');
  const labelBack = document.getElementById('labelBack');
  const shimmers = document.querySelectorAll('.card-shimmer');
  
  const bgCanvas = document.getElementById('bgCanvas');
  const ctx = bgCanvas.getContext('2d');

  // ==========================================================================
  // INTRO SCREEN MANAGER (TRANSITION TO CARD)
  // ==========================================================================
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      // Adiciona classe de transição de saída
      introScreen.classList.add('fade-out');
      
      // Aguarda a transição de fade-out do painel (800ms)
      setTimeout(() => {
        introScreen.classList.add('hide');
        mainContent.classList.remove('hide');
        
        // Pequeno timeout para engajar a animação de entrada do container principal
        setTimeout(() => {
          // Aciona o resize do canvas para alinhar com o novo layout se necessário
          resizeCanvas();
        }, 50);
      }, 800);
    });
  }

  // ==========================================================================
  // FLIP CARD LOGIC (UNIMED DYNAMICS)
  // ==========================================================================
  let isFlipped = false;

  function flipCard(shouldFlip) {
    if (isFlipped === shouldFlip) return;
    
    isFlipped = shouldFlip;
    
    // Atualiza o ângulo de rotação da carta via CSS Variables
    digitalCard.style.setProperty('--rotateY', isFlipped ? '180deg' : '0deg');
    
    // Sincroniza o Switch Toggle estilo Unimed
    if (isFlipped) {
      customSwitch.classList.add('active');
      labelBack.classList.add('active');
      labelFront.classList.remove('active');
    } else {
      customSwitch.classList.remove('active');
      labelBack.classList.remove('active');
      labelFront.classList.add('active');
    }

    // Reseta temporariamente o efeito de tilt durante a rotação para evitar solavancos
    digitalCard.style.setProperty('--tiltX', '0deg');
    digitalCard.style.setProperty('--tiltY', '0deg');
    digitalCard.style.setProperty('--card-scale', '0.98');
    
    setTimeout(() => {
      digitalCard.style.setProperty('--card-scale', '1');
    }, 300);
  }

  // Evento 1: Clique na carta propriamente dita (Frente ou Verso)
  digitalCard.addEventListener('click', (e) => {
    // IMPORTANTE: Não deve virar a carta se clicar em ícones sociais, links ou QR Code!
    const isInteractiveElement = e.target.closest('.social-btn') || 
                                 e.target.closest('.qrcode-wrapper') || 
                                 e.target.closest('.cta-link');
                                 
    if (!isInteractiveElement) {
      flipCard(!isFlipped);
    }
  });

  // Evento 2: Clique no Interruptor Deslizante (Switch Toggle)
  customSwitch.addEventListener('click', () => {
    flipCard(!isFlipped);
  });

  // Evento 4: Clique diretamente nas etiquetas de texto "Frente" ou "Verso"
  labelFront.addEventListener('click', () => flipCard(false));
  labelBack.addEventListener('click', () => flipCard(true));

  // ==========================================================================
  // 3D CARD PARALLAX (MOUSE/TOUCH TILT & SHIMMER EFFECT)
  // ==========================================================================
  const maxTilt = 15; // Ângulo máximo de inclinação em graus

  function handleCardMove(clientX, clientY) {
    const cardRect = digitalCard.getBoundingClientRect();
    
    // Coordenadas relativas ao cartão
    const cardX = clientX - cardRect.left;
    const cardY = clientY - cardRect.top;
    
    // Coordenadas normalizadas (de -1 a 1)
    const normX = (cardX / cardRect.width) * 2 - 1;
    const normY = (cardY / cardRect.height) * 2 - 1;
    
    // Calcula rotação com base no centro do cartão
    const tiltX = -(normY * maxTilt).toFixed(2);
    // Se estiver virado (Back), invertemos a rotação Y do mouse para manter o sentido natural físico
    let tiltY = (normX * maxTilt).toFixed(2);
    if (isFlipped) {
      tiltY = -tiltY;
    }
    
    // Aplica transformações via variáveis de CSS
    digitalCard.style.setProperty('--tiltX', `${tiltX}deg`);
    digitalCard.style.setProperty('--tiltY', `${tiltY}deg`);
    digitalCard.style.setProperty('--card-scale', '1.02');
    
    // Move o efeito holográfico do Shimmer reflexivo
    const shimmerX = (cardX / cardRect.width) * 60 - 30; // Deslocamento de -30% a 30%
    const shimmerY = (cardY / cardRect.height) * 60 - 30;
    
    shimmers.forEach(shimmer => {
      shimmer.style.transform = `translate3d(${shimmerX}%, ${shimmerY}%, 0) rotate(45deg)`;
      shimmer.style.opacity = '1';
    });
  }

  function resetCardTransform() {
    digitalCard.style.setProperty('--tiltX', '0deg');
    digitalCard.style.setProperty('--tiltY', '0deg');
    digitalCard.style.setProperty('--card-scale', '1');
    
    shimmers.forEach(shimmer => {
      shimmer.style.transform = 'translateY(-100%) rotate(45deg)';
      shimmer.style.opacity = '0';
    });
  }

  // Eventos de Mouse Desktop
  digitalCard.addEventListener('mousemove', (e) => {
    handleCardMove(e.clientX, e.clientY);
  });

  digitalCard.addEventListener('mouseleave', () => {
    resetCardTransform();
  });

  // Eventos de Toque Mobile (Suporte a Parallax em Smartphones)
  digitalCard.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      // Evita o scroll nativo da página ao interagir com a carta 3D
      e.preventDefault();
      handleCardMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  digitalCard.addEventListener('touchend', () => {
    resetCardTransform();
  });

  // ==========================================================================
  // ENGINE DE PARTÍCULAS LEVES (CANVAS BACKGROUND)
  // ==========================================================================
  let particlesArray = [];
  const numberOfParticles = window.innerWidth < 480 ? 14 : 30; // Quantidade reduzida — subtis no fundo grafite

  function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });
  
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * bgCanvas.width;
      this.y = Math.random() * bgCanvas.height + bgCanvas.height; // Começa abaixo da tela
      this.radius = Math.random() * 2.5 + 0.5; // Tamanhos sutis
      this.speedY = Math.random() * 0.4 + 0.1; // Velocidade de subida lenta
      this.speedX = Math.random() * 0.3 - 0.15; // Deslocamento horizontal leve
      this.alpha = Math.random() * 0.22 + 0.05; // Opacidade bem baixa — efeito sutil
      this.baseAlpha = this.alpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseDirection = 1;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      // Efeito de pulso de opacidade para cintilar
      this.alpha += this.pulseSpeed * this.pulseDirection;
      if (this.alpha > this.baseAlpha * 1.5 || this.alpha < this.baseAlpha * 0.5) {
        this.pulseDirection *= -1;
      }

      // Se a partícula sair do topo da tela, reseta ela na base
      if (this.y < -10) {
        this.y = bgCanvas.height + 10;
        this.x = Math.random() * bgCanvas.width;
        this.alpha = Math.random() * 0.22 + 0.05;
        this.baseAlpha = this.alpha;
      }

      // Evita valores inválidos de opacidade
      this.alpha = Math.max(0, Math.min(1, this.alpha));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    // Distribui as partículas inicialmente por toda a altura da tela
    for (let i = 0; i < numberOfParticles; i++) {
      let p = new Particle();
      p.y = Math.random() * bgCanvas.height; // Inicializa espalhado
      particlesArray.push(p);
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    
    // Desenha e atualiza cada partícula
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
});
