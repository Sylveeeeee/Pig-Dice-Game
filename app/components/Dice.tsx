import Image from "next/image";
import React from "react";

type DiceProps = {
  number: number | null;
  rolling?: boolean;
};

export default function Dice({ number, rolling = false }: DiceProps) {
  const src = number ? `/dice/dice-${number}.png` : "/dice/dice-1.png";

  return (
    <div className={`w-24 h-24 ${rolling ? "animate-spin-slow" : ""}`}>
      <Image
        src={src}
        alt={`Dice ${number}`}
        width={512}
        height={512}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
