export const QR_MODULES = 25;
export const QR_CELL = 8;

/** Cells of a simulated (non-scannable) QR code, seeded so each order gets its own pattern. */
export function qrCells(seed: number) {
  const N = QR_MODULES;
  let s = (seed % 2147483646) + 1;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const finder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);

  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let on: boolean;
      if (finder(x, y)) {
        const fx = x < 8 ? x : x - (N - 7);
        const fy = y < 8 ? y : y - (N - 7);
        const d = Math.max(Math.abs(fx - 3), Math.abs(fy - 3));
        on = fx >= 0 && fx <= 6 && fy >= 0 && fy <= 6 && d !== 2;
      } else {
        on = rnd() > 0.5;
      }
      if (on) cells.push({ x, y });
    }
  }
  return cells;
}
