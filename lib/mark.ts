/**
 * The brand mark as a standalone SVG, for the places React cannot reach: the
 * apple-touch icon and the share card, both of which are rasterised at build
 * time by satori and so cannot mount `SiteMark` or inherit `currentColor`.
 *
 * The geometry is the same true isometric cube `components/site-mark.tsx`
 * generates — one edge length, three faces, three tonal steps of one colour —
 * written out here because a data URI has no stylesheet behind it.
 */

const EDGE = 20;
/** Three decimals is under a thousandth of the mark's width — below any raster. */
const round = (n: number) => Math.round(n * 1000) / 1000;
const HALF_W = round((EDGE * Math.sqrt(3)) / 2);
const HALF_H = EDGE / 2;

/** Face opacities, brightest first: top, left, right. */
const FACES: readonly [string, number][] = [
  [`0,0 ${HALF_W},${HALF_H} 0,${EDGE} ${-HALF_W},${HALF_H}`, 1],
  [
    `${-HALF_W},${HALF_H} 0,${EDGE} 0,${EDGE * 2} ${-HALF_W},${HALF_H + EDGE}`,
    0.55,
  ],
  [
    `0,${EDGE} ${HALF_W},${HALF_H} ${HALF_W},${HALF_H + EDGE} 0,${EDGE * 2}`,
    0.3,
  ],
];

/** The mark, drawn in one flat colour, on a transparent square. */
export function cubeSvg(color: string): string {
  const faces = FACES.map(
    ([points, opacity]) =>
      `<polygon points="${points}" fill="${color}" fill-opacity="${opacity}"/>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-21 -1 42 42">${faces}</svg>`;
}

/** The same, as something an `<img>` can take — satori accepts no other form. */
export function cubeDataUri(color: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(cubeSvg(color))}`;
}
