import { useEffect, useRef } from "react";

type WinnerBannerProps = {
  winnerName: string;
};
export default function WinnerBanner({ winnerName }: WinnerBannerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/win-sound.mp3");
    audioRef.current.play();
  }, []);

  return (
    <p className="font-semibold text-2xl text-green-600 animate-pulse">
      🎉 {winnerName} wins the game!
    </p>
  );
}
