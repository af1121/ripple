import { useEffect, useRef } from "react";

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Ripple animation
    let time = 0;
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw multiple ripples with higher opacity
      for (let i = 0; i < 5; i++) {
        const size = (time + i * 0.5) % 3;
        const alpha = Math.max(0, 1 - size / 3);
        
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          size * 200,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.05})`; // Increased from 0.1 to 0.2
        ctx.lineWidth = 30;
        ctx.stroke();
      }

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
      style={{ opacity: 0.7 }} // Increased from 0.5 to 0.7
    />
  );
} 