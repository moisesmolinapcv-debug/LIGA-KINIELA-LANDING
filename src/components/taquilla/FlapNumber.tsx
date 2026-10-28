'use client';

import React, { useEffect, useState } from 'react';
import { SplitFlap } from './SplitFlap';
import { formatMiles } from './hooks';

interface FlapNumberProps {
  value: number;
  /** Sufijo accesible, p. ej. "Bs". */
  unit?: string;
  className?: string;
}

/** Cifra con separadores de miles. Al montarse, los dígitos voltean desde 0 hasta el valor. */
export function FlapNumber({ value, unit = '', className = '' }: FlapNumberProps) {
  const target = formatMiles(value);
  const [shown, setShown] = useState(() => target.replace(/\d/g, '0'));
  useEffect(() => {
    const id = window.setTimeout(() => setShown(target), 120);
    return () => window.clearTimeout(id);
  }, [target]);
  return (
    <SplitFlap
      value={shown}
      label={unit ? `${target} ${unit}` : target}
      stagger={45}
      className={className}
    />
  );
}
