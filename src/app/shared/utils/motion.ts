/**
 * Réglages communs des animations d'apparition.
 *
 * Repères (revue « review-animations », Emil Kowalski) :
 * - apparitions courtes (~500 ms) avec une courbe ease-out forte ;
 * - décalage de 30 à 80 ms entre éléments d'un même groupe ;
 * - n'animer que transform et opacity ;
 * - respecter prefers-reduced-motion : garder le fondu, retirer le déplacement.
 */
export const REVEAL = {
  duration: 0.5,
  ease: 'power4.out',
  stagger: 0.05,
  offsetY: 16,
} as const;

/** Vrai si l'utilisateur a demandé à réduire les animations dans son système. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Décalage vertical d'apparition : nul si le mouvement réduit est demandé. */
export function revealOffset(): number {
  return prefersReducedMotion() ? 0 : REVEAL.offsetY;
}
