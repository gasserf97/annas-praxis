"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ink = useRef(false);
  const drawing = useRef(false);
  const [data, setData] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const paint = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return;
      const ratio = window.devicePixelRatio || 1;
      const snapshot = ink.current ? canvas.toDataURL("image/png") : "";
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(ratio, ratio);
      context.lineWidth = 2.2;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "#24352c";
      if (snapshot) {
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, rect.width, rect.height);
        image.src = snapshot;
      }
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    drawing.current = true;
    ink.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const current = point(event);
    context.beginPath();
    context.moveTo(current.x, current.y);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const current = point(event);
    context.lineTo(current.x, current.y);
    context.stroke();
  }

  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) setData(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    ink.current = false;
    setData("");
  }

  return (
    <div className="grid gap-2">
      <input type="hidden" name="signature" value={data} />
      <div className="h-40 w-full rounded-xl bg-white ring-1 ring-foreground/15">
        <canvas
          ref={canvasRef}
          aria-label="Unterschriftsfeld"
          className="h-full w-full touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Mit dem Finger oder der Maus unterschreiben.</p>
        <Button type="button" variant="ghost" onClick={clear}>
          Zurücksetzen
        </Button>
      </div>
    </div>
  );
}
