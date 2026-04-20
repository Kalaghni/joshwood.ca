"use client";

import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Plane, Program, Mesh } from "ogl";

export default function BuilderBarProbe() {
    const wrap = useRef<HTMLDivElement | null>(null);
    const canvas = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const el = wrap.current, cv = canvas.current;
        if (!el || !cv) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const renderer = new Renderer({ canvas: cv, alpha: true, antialias: true, dpr });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);

        const scene = new Transform();
        const camera = new Camera(gl);

        const setSize = () => {
            if (!el.isConnected) return;
            const r = el.getBoundingClientRect();
            const w = Math.max(1, Math.floor(r.width));
            const h = Math.max(1, Math.floor(el.clientHeight || r.height || 56));
            renderer.setSize(w, h);
            camera.left = -w / 2; camera.right = w / 2; camera.top = h / 2; camera.bottom = -h / 2;
            camera.near = -1000; camera.far = 1000;
            camera.orthographic({ left: camera.left, right: camera.right, top: camera.top, bottom: camera.bottom, near: camera.near, far: camera.far });
            camera.position.z = 1;
        };

        const ro = new ResizeObserver(setSize);
        ro.observe(el);
        requestAnimationFrame(setSize);

        // one white slab so we *see something*
        const vert = `attribute vec2 uv;attribute vec3 position;uniform mat4 modelViewMatrix,projectionMatrix;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
        const frag = `precision mediump float;void main(){gl_FragColor=vec4(1.0,1.0,1.0,1.0);} `;
        const geo = new Plane(gl, { width: 200, height: 6 });
        const program = new Program(gl, { vertex: vert, fragment: frag });
        const mesh = new Mesh(gl, { geometry: geo, program });
        mesh.position.y = -10;
        mesh.setParent(scene);

        const render = () => renderer.render({ scene, camera });
        const raf = requestAnimationFrame(render);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, []);

    return (
        <div ref={wrap} className="relative w-full h-16 bg-muted/30 border-t border-border">
            <canvas ref={canvas} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10px] text-muted-foreground/70">probe</div>
        </div>
    );
}
