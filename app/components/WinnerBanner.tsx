import React from "react";

type WinnerBannerProps = {
  winnerName: string;
};

export default function WinnerBanner({ winnerName }: WinnerBannerProps) {
  return (
    <p className="font-semibold text-2xl text-green-600 animate-pulse">
      🎉 {winnerName} wins the game!
    </p>
  );
}
