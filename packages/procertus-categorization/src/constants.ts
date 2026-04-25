import type { CertificationLabelKey } from './types';

export const CERTIFICATION_LABEL_ORDER: readonly CertificationLabelKey[] = [
  'ce',
  'benor',
  'atg',
  'ssd',
] as const;

export const CERTIFICATION_LABEL_META: Readonly<
  Record<CertificationLabelKey, { short: string; description: string }>
> = {
  ce: { short: 'CE', description: 'CE marking' },
  benor: { short: 'BENOR', description: 'BENOR' },
  atg: { short: 'ATG', description: 'ATG (attest)' },
  ssd: { short: 'SSD', description: 'Innovation attest (SSD)' },
} as const;
