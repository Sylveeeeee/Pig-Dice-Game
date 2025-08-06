"use client";

import React, { useEffect, useRef } from "react";
import "../styles/dice3d.css";

type Dice3DProps = {
    number: number | null;
    rolling: boolean;
};

export default function Dice3D({ number, rolling }: Dice3DProps) {
    const cubeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cubeRef.current || number == null) return;
        const cube = cubeRef.current;

        if (rolling) {
            const randomX = Math.floor(Math.random() * 4 + 1) * 360;
            const randomY = Math.floor(Math.random() * 4 + 1) * 360;
            const currentNumber = number; 
            cube.style.transform = `translateZ(-50px) rotateX(${randomX}deg) rotateY(${randomY}deg)`;

            setTimeout(() => {
                cube.style.transform = cubeFaceTransform(currentNumber);
            }, 800);
        } else {
            cube.style.transform = cubeFaceTransform(number);
        }
    }, [number, rolling]);


    const cubeFaceTransform = (n: number) => {
        switch (n) {
            case 1: return "translateZ(-50px) rotateY(0deg)";
            case 2: return "translateZ(-50px) rotateY(-90deg)";
            case 3: return "translateZ(-50px) rotateY(180deg)";
            case 4: return "translateZ(-50px) rotateY(90deg)";
            case 5: return "translateZ(-50px) rotateX(-90deg)";
            case 6: return "translateZ(-50px) rotateX(90deg)";
            default: return "";
        }
    };

    return (
        <div className="scene">
            <div className="cube" ref={cubeRef}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className={`face face-${num}`}>
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
}
