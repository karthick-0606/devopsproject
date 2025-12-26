// partical.js - money-image particles (bills & coins) that follow the mouse
export function startParticles() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const particles = [];
    const maxParticles = Math.floor((w * h) / 90000) + 40;
    let rafId;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    // create small image representations for a bill and a coin using offscreen canvases
    function makeBillImage(width = 40, height = 22, hue = 130) {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      const g = c.getContext('2d');
      const grad = g.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `hsl(${hue - 8}, 55%, 34%)`);
      grad.addColorStop(0.5, `hsl(${hue}, 62%, 50%)`);
      grad.addColorStop(1, `hsl(${hue + 8}, 55%, 36%)`);
      // rounded rect
      const r = Math.min(6, height / 4);
      g.fillStyle = grad;
      roundRect(g, 0.5, 0.5, width - 1, height - 1, r, true, false);
      // inner emblem
      g.fillStyle = 'rgba(10,10,10,0.9)';
      g.font = Math.round(height * 0.7) + 'px serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('$', width / 2, height / 2 + 1);
      const img = new Image();
      img.src = c.toDataURL();
      return img;
    }

    function makeCoinImage(radius = 8, hue = 38) {
      const size = radius * 2 + 4;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const g = c.getContext('2d');
      const cx = size / 2;
      const cy = size / 2;
      const grad = g.createRadialGradient(cx - radius/3, cy - radius/3, radius*0.2, cx, cy, radius);
      grad.addColorStop(0, 'rgba(255,250,210,1)');
      grad.addColorStop(0.6, `hsl(${hue}, 85%, 55%)`);
      grad.addColorStop(1, `hsl(${hue}, 75%, 40%)`);
      g.fillStyle = grad;
      g.beginPath();
      g.arc(cx, cy, radius, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = 'rgba(40,30,20,0.95)';
      g.font = Math.round(radius * 1.2) + 'px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('$', cx, cy + 1);
      const img = new Image();
      img.src = c.toDataURL();
      return img;
    }

    // helper: rounded rectangle
    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      if (typeof radius === 'number') radius = { tl: radius, tr: radius, br: radius, bl: radius };
      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    const billImg = makeBillImage(40, 24, 130);
    const coinImg = makeCoinImage(7, 45);

    function createParticle(opts = {}) {
      const isBill = Math.random() < 0.65;
      return Object.assign(
        {
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.3, 0.3),
          vy: rand(-0.3, 0.3),
          rotation: rand(-0.8, 0.8),
          vr: rand(-0.02, 0.02),
          type: isBill ? 'bill' : 'coin',
          life: Math.floor(rand(80, 220)),
          alpha: rand(0.7, 1),
        },
        opts
      );
    }

    for (let i = 0; i < maxParticles; i++) particles.push(createParticle());

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }

    const mouse = { x: w / 2, y: h / 2 };
    let lastMouse = { x: mouse.x, y: mouse.y };

    function onMove(e) {
      const ev = e.touches ? e.touches[0] : e;
      const mx = ev.clientX; const my = ev.clientY;
      const dx = mx - lastMouse.x; const dy = my - lastMouse.y;
      lastMouse.x = mx; lastMouse.y = my; mouse.x = mx; mouse.y = my;
      const emit = Math.min(10, Math.max(2, Math.floor((Math.abs(dx) + Math.abs(dy)) / 6)));
      for (let i = 0; i < emit; i++) {
        if (particles.length > maxParticles * 2) break;
        const isBill = Math.random() < 0.65;
        particles.push(
          createParticle({
            x: mx + rand(-8, 8),
            y: my + rand(-8, 8),
            vx: dx * (0.15 + Math.random() * 0.2) + rand(-1.2, 1.2),
            vy: dy * (0.15 + Math.random() * 0.2) + rand(-1.2, 1.2),
            rotation: rand(-1.2, 1.2),
            vr: rand(-0.06, 0.06),
            type: isBill ? 'bill' : 'coin',
            life: Math.floor(rand(60, 180)),
          })
        );
      }
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.985; p.vy *= 0.985;
        p.vx += (mouse.x - p.x) * 0.0008; p.vy += (mouse.y - p.y) * 0.0008;
        p.x += p.vx; p.y += p.vy;
        p.rotation += p.vr;
        if (p.life !== undefined) {
          p.life -= 1; p.alpha = Math.max(0, p.alpha - 0.004);
          if (p.life <= 0) { particles.splice(i, 1); continue; }
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        if (p.type === 'bill') {
          const bw = 40; const bh = 22;
          ctx.drawImage(billImg, -bw / 2, -bh / 2, bw, bh);
        } else {
          const cr = 8;
          ctx.drawImage(coinImg, -cr - 2, -cr - 2, (cr + 2) * 2, (cr + 2) * 2);
        }
        ctx.restore();
      }
      rafId = requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    // start
    step();

    return function stopParticles() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }

  export default startParticles;

