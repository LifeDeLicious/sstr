export default function formatLapTime(seconds) {
  if (!seconds) return "N/A";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const secondsInt = Math.floor(remainingSeconds);
  const milliseconds = Math.floor((remainingSeconds - secondsInt) * 1000);

  return `${minutes}:${secondsInt.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}
