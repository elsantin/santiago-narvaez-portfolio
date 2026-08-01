// Filename: generative-footer.js

/**
 * p5.js sketch in instance mode for a subtle generative animation.
 * Creates a flow field effect with particles in a specified container.
 * Colors blend a base pale gold/white with occasional neon blue/magenta sparks.
 * * CORRECTION: Commented out canvas.style() lines for position and z-index 
 * to rely more on CSS for positioning the container.
 */

const generativeSketch = (p) => {

  let particles = [];
  const numParticles = 30; // Keep low for performance
  const noiseScale = 0.01; // Controls the smoothness of the flow field

  // Define colors based on the website's palette
  let colorPaleGold;
  let colorNeonBlue;
  let colorNeonMagenta;
  let colorBaseTrail; // Base color for trails/particles

  p.setup = () => {
    // Find the container div and create canvas inside it
    let container = p.select('#generative-container');
    if (!container) {
      console.error('Generative container not found!');
      return;
    }
    // Create canvas matching container size
    let canvas = p.createCanvas(container.width, container.height);
    canvas.parent(container); // Attach canvas to the container div

    /* * CORRECCIÓN: Comentamos las siguientes líneas. 
     * El posicionamiento del canvas ahora dependerá de cómo esté posicionado 
     * el div #generative-container en el CSS. 
     * Asegúrate de que #generative-container tenga position: relative y tamaño definido en tu CSS.
     */
    // canvas.style('z-index', '-1'); // Comentado - Podría ocultar el canvas detrás del fondo
    // canvas.style('position', 'absolute'); // Comentado - Dejamos que el canvas fluya dentro del div
    // canvas.style('top', '0'); // Comentado
    // canvas.style('left', '0'); // Comentado


    // Initialize colors using HSB mode for easier glow/brightness control
    p.colorMode(p.HSB, 360, 100, 100, 100); 
    colorPaleGold = p.color(45, 30, 95); // Adjust Hue, Saturation, Brightness for desired gold
    colorNeonBlue = p.color(195, 90, 100);
    colorNeonMagenta = p.color(300, 85, 100);
    colorBaseTrail = p.color(45, 5, 100); // Very pale gold/whiteish

    // Create particles
    particles = []; // Clear particles array before repopulating
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(p.random(p.width), p.random(p.height)));
    }
    
    // No es necesario p.background() en setup si usamos p.clear() en draw
  };

  p.draw = () => {
    // Usar clear() para fondo transparente y redibujar cada frame
    p.clear(); 
    
    // O usar fondo semi-transparente para estelas (alternativa a clear())
    // p.noStroke();
    // p.fill(0, 0, 10, 5); // Ajusta alpha (último valor) para longitud/opacidad de estela
    // p.rect(0, 0, p.width, p.height);

    // Update and display particles
    for (let i = particles.length - 1; i >= 0; i--) { // Iterar hacia atrás si se eliminan partículas
        let particle = particles[i];
        particle.update();
        particle.display();
        particle.edges();
        if (particle.isDead()) {
           // Opcional: eliminar partícula si muere, o dejar que se resetee
           // particles.splice(i, 1); 
           particle.reset(); // Más eficiente para flujo continuo
        }
    }
  };
  
  p.windowResized = () => {
     // Manejar redimensionamiento si el tamaño del contenedor cambia dinámicamente
     let container = p.select('#generative-container');
     if (container) {
       // Comprobar si las dimensiones del contenedor realmente cambiaron
       if (p.width !== container.width || p.height !== container.height) {
           p.resizeCanvas(container.width, container.height);
           // Opcional: Resetear posiciones de partículas o limpiar fondo al redimensionar
           // Resetear partículas para evitar acumulación en bordes antiguos
           particles = []; 
           for (let i = 0; i < numParticles; i++) {
               particles.push(new Particle(p.random(p.width), p.random(p.height)));
           }
           // p.clear(); // Limpiar canvas al redimensionar
       }
     }
  };

  // --- Particle Class ---
  class Particle {
    constructor(x, y) {
      this.p = p; // Reference to p5 instance
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-0.2, 0.2), p.random(-0.2, 0.2)); // Start with slight random velocity
      this.acc = p.createVector(0, 0);
      this.maxSpeed = 0.5; // Keep speed low for subtlety
      this.lifespan = p.random(100, 300); // How long it lives
      this.initialLifespan = this.lifespan; // Store initial for alpha mapping
      this.lifeDecrement = p.random(0.5, 1.0); // Slower decrement for longer life
      this.baseColor = colorBaseTrail;
      this.sparkColor = null; // Potential spark color
      this.isSpark = p.random(1) < 0.08; // Slightly increased chance to be a spark initially

      if (this.isSpark) {
        this.sparkColor = p.random(1) < 0.5 ? colorNeonBlue : colorNeonMagenta;
        this.lifespan *= 0.6; // Sparks are shorter lived
        this.initialLifespan = this.lifespan;
        this.lifeDecrement *= 1.8; // Faster decrement for sparks
        this.maxSpeed *= 1.2; // Sparks slightly faster
      }
    }

    applyForce(force) {
      this.acc.add(force);
    }

    update() {
      // Follow Perlin noise flow field
      let angle = p.noise(this.pos.x * noiseScale, this.pos.y * noiseScale, p.frameCount * 0.001) * p.TWO_PI * 4; // Add time dimension to noise
      let force = p5.Vector.fromAngle(angle);
      force.mult(0.05); // Strength of the flow field
      this.applyForce(force);

      // Standard physics update
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0); // Reset acceleration

      // Decrease lifespan
      this.lifespan -= this.lifeDecrement;

      // Check if lifespan ended (used by isDead or reset)
      // if (this.lifespan <= 0) {
      //   this.reset(); // Reset is handled in draw loop based on isDead()
      // }
    }

    display() {
      // Map lifespan to alpha for fade in/out effect
      let alpha;
      if (this.lifespan > this.initialLifespan - 50) { // Fade in
          alpha = p.map(this.lifespan, this.initialLifespan, this.initialLifespan - 50, 0, 80);
      } else { // Fade out
          alpha = p.map(this.lifespan, 0, 50, 0, 80, true); // Fade out over last 50 frames
      }
      
      let particleSize = this.isSpark ? 2.5 : 1.8; // Sparks slightly larger

      if (this.isSpark && this.sparkColor) {
         // Use HSB components to set color with alpha
         p.fill(p.hue(this.sparkColor), p.saturation(this.sparkColor), p.brightness(this.sparkColor), alpha);
      } else {
         // Use HSB components for base color
         p.fill(p.hue(this.baseColor), p.saturation(this.baseColor), p.brightness(this.baseColor), alpha * 0.8); // Base slightly dimmer/more transparent
      }
      p.noStroke();
      p.ellipse(this.pos.x, this.pos.y, particleSize, particleSize);
    }

    // Wrap edges
    edges() {
      if (this.pos.x > p.width + 5) this.pos.x = -5; // Add buffer
      if (this.pos.x < -5) this.pos.x = p.width + 5;
      if (this.pos.y > p.height + 5) this.pos.y = -5;
      if (this.pos.y < -5) this.pos.y = p.height + 5;
    }
    
    isDead() {
        // Method to check if particle should be reset
        return this.lifespan <= 0;
    }
    
    reset() {
        // Reset particle to a random position and state
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
        this.vel = p.createVector(p.random(-0.2, 0.2), p.random(-0.2, 0.2));
        this.acc = p.createVector(0, 0);
        this.lifespan = p.random(100, 300);
        this.initialLifespan = this.lifespan;
        this.lifeDecrement = p.random(0.5, 1.0);
        this.isSpark = p.random(1) < 0.08; // Chance to respawn as a spark
        this.sparkColor = null;
         if (this.isSpark) {
            this.sparkColor = p.random(1) < 0.5 ? colorNeonBlue : colorNeonMagenta;
             this.lifespan *= 0.6; 
             this.initialLifespan = this.lifespan;
             this.lifeDecrement *= 1.8;
             this.maxSpeed *= 1.2;
        } else {
             this.maxSpeed = 0.5; // Reset max speed if not a spark
        }
    }
  }
};

// Create a new p5 instance attached to the generative-container div
// Ensure this runs after the DOM is ready, or place the script tag at the end of the body
let generativeInstance = new p5(generativeSketch, 'generative-container'); 
