"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Plane, Program, Mesh } from "ogl";
import { gsap } from "gsap";

export default function BuilderBar() {
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

        let alive = true;

        const setSize = () => {
            if (!alive || !el.isConnected) return;
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

        // --- Shaders ---
        const vert = `
      attribute vec2 uv; attribute vec3 position;
      uniform mat4 modelViewMatrix, projectionMatrix;
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `;
        const fragSolid = `
      precision mediump float;
      uniform vec3 uColor;
      void main(){ gl_FragColor = vec4(uColor, 1.0); }
    `;
        const fragCircleStroke = `
      precision mediump float;
      varying vec2 vUv;
      uniform vec3 uFill, uStroke;
      uniform float uStrokeWidth; // 0..1 of radius
      void main(){
        vec2 p = (vUv - 0.5) * 2.0;
        float r = length(p);
        if (r > 1.0) discard;
        float edge = 1.0 - uStrokeWidth;
        vec3 color = mix(uStroke, uFill, step(r, edge));
        gl_FragColor = vec4(color, 1.0);
      }
    `;

        // --- Helpers ---
        const makeRect = (w:number, h:number, color:[number,number,number]) => {
            const geo = new Plane(gl, { width: w, height: h });
            const program = new Program(gl, { vertex: vert, fragment: fragSolid, uniforms: { uColor: { value: color } } });
            return new Mesh(gl, { geometry: geo, program });
        };
        const makeCircleStroke = (d:number, fill:[number,number,number], stroke:[number,number,number], strokeWidth=0.2) => {
            const geo = new Plane(gl, { width: d, height: d });
            const program = new Program(gl, { vertex: vert, fragment: fragCircleStroke, uniforms: {
                    uFill: { value: fill }, uStroke: { value: stroke }, uStrokeWidth: { value: strokeWidth }
                }});
            return new Mesh(gl, { geometry: geo, program });
        };

        // --- Palette (neutral) ---
        const white:[number,number,number] = [1,1,1];
        const black:[number,number,number] = [0.07,0.07,0.08];
        const gray2:[number,number,number] = [0.2,0.2,0.22];
        const gray4:[number,number,number] = [0.4,0.4,0.45];
        const gray7:[number,number,number] = [0.7,0.7,0.72];
        const gray9:[number,number,number] = [0.9,0.9,0.92];

        // --- Scene: Scaffolding bay + hoisted sign ---
        // Scaffolding uprights + crossbars
        const scaffold = new Transform(); scaffold.setParent(scene);
        const bar = (x:number, y:number, w:number, h:number) => {
            const m = makeRect(w, h, gray4); m.position.set(x, y, 0); m.setParent(scaffold); return m;
        };
        // Uprights
        bar(-140, 0, 6, 48); bar(140, 0, 6, 48);
        // Base and top rails
        bar(0, -24, 280, 4); bar(0, 24, 280, 4);
        // Cross braces
        bar(-70, 0, 4, 48).rotation.z = 0.6;
        bar(70, 0, 4, 48).rotation.z = -0.6;

        // Hoisted sign (panel + bolts + ropes)
        const sign = new Transform(); sign.setParent(scene);
        const signPanel = makeRect(160, 30, gray9); signPanel.setParent(sign);
        // Subtle stripe to fake depth
        const signStripe = makeRect(160, 3, gray7); signStripe.position.y = 8; signStripe.setParent(sign);

        // Ropes
        const ropeL = makeRect(2, 26, gray4); ropeL.position.set(-70, 20, 0); ropeL.setParent(scene);
        const ropeR = makeRect(2, 26, gray4); ropeR.position.set( 70, 20, 0); ropeR.setParent(scene);

        // Bolts at two top corners (things we "hammer")
        const boltL = makeRect(4, 4, gray2); boltL.position.set(-72, 9, 0); boltL.setParent(sign);
        const boltR = makeRect(4, 4, gray2); boltR.position.set( 72, 9, 0); boltR.setParent(sign);

        // Ground plank (just to anchor feet visually)
        const ground = makeRect(300, 2, gray2); ground.position.set(0, -22, 0); ground.setParent(scene);

        // Start sign offscreen above and drop it in
        sign.position.set(0, 60, 0);
        ropeL.scale.y = 0.1; ropeR.scale.y = 0.1;

        // --- Stick figures (white & skinny, black head w/ white stroke) ---
        const makeFigure = (x:number, facing:1|-1) => {
            const g = new Transform(); g.position.x = x; g.scale.x = facing;
            const limb=2.2, fore=2.0, leg=2.4, torso=3, headD=18;

            const head = makeCircleStroke(headD, black, white, 0.22); head.position.y = 22; head.setParent(g);
            const body = makeRect(torso, 24, white); body.position.y = 6; body.setParent(g);

            const shoulder = new Transform(); shoulder.position.set(0, 14, 0); shoulder.setParent(g);
            const uL = makeRect(limb, 14, white); uL.position.set(-7, -7, 0); uL.setParent(shoulder);
            const eL = new Transform(); eL.position.set(-7, -14, 0); eL.setParent(shoulder);
            const fL = makeRect(fore, 14, white); fL.position.set(0, -7, 0); fL.setParent(eL);

            const uR = makeRect(limb, 14, white); uR.position.set( 7, -7, 0); uR.setParent(shoulder);
            const eR = new Transform(); eR.position.set( 7, -14, 0); eR.setParent(shoulder);
            const fR = makeRect(fore, 14, white); fR.position.set(0, -7, 0); fR.setParent(eR);

            const hip = new Transform(); hip.position.set(0, -4, 0); hip.setParent(g);
            const lL = makeRect(leg, 20, white); lL.position.set(-4, -10, 0); lL.setParent(hip);
            const lR = makeRect(leg, 20, white); lR.position.set( 4, -10, 0); lR.setParent(hip);

            // Hammer on right forearm
            const hammer = new Transform(); hammer.position.set(0, -14, 0); hammer.setParent(eR);
            const handle = makeRect(2, 14, gray7); handle.position.set(0, -7, 0); handle.setParent(hammer);
            const headHammer = makeRect(8, 4, gray7); headHammer.position.set(2.5, 0, 0); headHammer.setParent(hammer);

            return { group:g, legL:lL, legR:lR, elbowR:eR };
        };

        const widthPx = () => renderer.gl.drawingBufferWidth / dpr;
        const spawnL = -widthPx()/2 - 40;
        const spawnR =  widthPx()/2 + 40;

        const stopL = -60; // they’ll stand slightly out from center under each rope
        const stopR =  60;

        const left = makeFigure(spawnL, 1);  left.group.setParent(scene);
        const right = makeFigure(spawnR, -1); right.group.setParent(scene);

        // --- Tiny particle spark (on hit) ---
        const makeSpark = (x:number, y:number) => {
            const s = makeRect(2, 2, white);
            s.position.set(x, y, 0); s.scale.set(0.001, 0.001, 1); s.setParent(scene);
            gsap.timeline()
                .to(s.scale, { x: 1, y: 1, duration: 0.05, ease: "power2.out" })
                .to(s.position, { x: x + (Math.random()*6-3), y: y + 6, duration: 0.18 }, "<")
                .to(s.scale, { x: 0.001, y: 0.001, duration: 0.12, ease: "sine.in" }, "-=0.06")
                .add(() => { s.setParent(null as any); }, "+=0.01");
        };

        // --- Walk-in wiggle ---
        const walk = (legA:Transform, legB:Transform) => {
            const t = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } });
            return t.to(legA.rotation, { z: 0.32, duration: 0.22 })
                .to(legB.rotation, { z: -0.32, duration: 0.22 }, "<");
        };
        const wl = walk(left.legL, left.legR);
        const wr = walk(right.legL, right.legR);

        // --- Master timeline ---
        const tl = gsap.timeline();

        // 1) Walk in
        tl.to(left.group.position,  { x: stopL,  duration: 1.4, ease: "sine.inOut" }, 0);
        tl.to(right.group.position, { x: stopR,  duration: 1.4, ease: "sine.inOut" }, 0);
        tl.add(() => { wl.kill(); wr.kill(); });

        // 2) Hoist sign down on ropes
        tl.to(sign.position, { y: 6, duration: 0.7, ease: "back.out(1.6)" }, "<0.1");
        tl.to([ropeL.scale, ropeR.scale], { y: 1, duration: 0.7, ease: "sine.out" }, "<");

        // 3) Set hammer pose
        tl.set([left.elbowR.rotation, right.elbowR.rotation], { z: -0.4 }, ">");

        // 4) Hammer loop: alternate bolts + pulse bolts + spark
        const hit = (elbow:Transform, bolt:Mesh, sparkPos:[number,number]) =>
            gsap.timeline()
                .to(elbow.rotation, { z: -1.4, duration: 0.24, ease: "sine.in" })
                .add(() => {
                    // bolt pulse
                    gsap.fromTo(bolt.scale, { x: 1, y: 1 }, { x: 1.35, y: 1.35, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.out" });
                    makeSpark(sparkPos[0], sparkPos[1]);
                }, "<")
                .to(elbow.rotation, { z: -0.25, duration: 0.2, ease: "sine.out" });

        const loop = gsap.timeline({ repeat: -1 });
        loop.add(hit(left.elbowR, boltL, [-72, 15]))
            .add(hit(right.elbowR, boltR, [ 72, 15]));

        tl.add(loop, ">");

        // --- Render ---
        const render = () => { if (alive) renderer.render({ scene, camera }); };
        gsap.ticker.add(render);

        return () => {
            alive = false;
            gsap.ticker.remove(render);
            tl.kill();
            loop.kill();
            ro.disconnect();
        };
    }, []);

    return (
        <div
            ref={wrap}
            className="relative w-full h-16 bg-muted/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-t border-border"
            role="region"
            aria-label="Under construction animation"
        >
            <canvas ref={canvas} className="absolute inset-0 w-full h-full" />
            {/* Caption bottom-right, out of the way */}
            <div className="pointer-events-none absolute bottom-1 right-2 text-[10px] sm:text-xs text-muted-foreground/70">
                Under construction
            </div>
        </div>
    );
}
