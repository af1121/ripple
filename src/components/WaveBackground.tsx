import { useEffect, useRef } from "react";

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;
    const waves = [
      { 
        amplitude: 50, 
        frequency: 0.01, 
        speed: 0.02, 
        color: "rgba(45, 212, 191, 0.12)",
        offset: 0 
      },
      { 
        amplitude: 40, 
        frequency: 0.02, 
        speed: 0.03, 
        color: "rgba(45, 212, 191, 0.08)",
        offset: 2 
      },
      { 
        amplitude: 30, 
        frequency: 0.03, 
        speed: 0.015, 
        color: "rgba(45, 212, 191, 0.06)",
        offset: 4 
      }
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.6);

        for (let x = 0; x <= canvas.width; x += 1) {
          const y = Math.sin(x * wave.frequency + time * wave.speed + wave.offset) * 
                    wave.amplitude * Math.sin(time * 0.5);
          ctx.lineTo(x, canvas.height * 0.6 + y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
} 