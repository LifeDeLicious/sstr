export default function formatLapTime(seconds) {
  if (!seconds) return "N/A";

  //const totalSeconds = milliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  //const seconds = Math.floor(totalSeconds % 60);
  const remainingSeconds = seconds % 60;
  const secondsInt = Math.floor(remainingSeconds);
  const milliseconds = Math.floor((remainingSeconds - secondsInt) * 1000);
  //const ms = Math.floor((milliseconds % 1000) / 10);

  return `${minutes}:${secondsInt.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}
