'use client';

import React from 'react';
import { ImageUploadField } from './ImageUploadField';
import { DESKTOP_SPEC, MOBILE_SPEC } from './banner-specs';
import { INPUT, LABEL, HELP } from './ui';
import { Switch } from './Switch';

export interface BannerFormValues {
  title: string;
  image_url: string;
  image_url_mobile: string;
  is_active: boolean;
}

export const EMPTY_BANNER_FORM: BannerFormValues = {
  title: '',
  image_url: '',
  image_url_mobile: '',
  is_active: true,
};

interface BannerFieldsProps {
  values: BannerFormValues;
  onChange: (next: BannerFormValues) => void;
  idPrefix: string;
  /** Errores de validación ya calculados por quien usa el formulario. */
  errors?: { title?: string; image_url?: string };
}

/** Campos comunes de crear y editar un banner. */
export const BannerFields: React.FC<BannerFieldsProps> = ({ values, onChange, idPrefix, errors }) => (
  <div className="space-y-5">
    <div>
      <label htmlFor={`${idPrefix}-title`} className={LABEL}>
        Descripción corta (para accesibilidad)
      </label>
      <input
        id={`${idPrefix}-title`}
        type="text"
        value={values.title}
        maxLength={140}
        onChange={(e) => onChange({ ...values, title: e.target.value })}
        aria-invalid={Boolean(errors?.title)}
        aria-describedby={`${idPrefix}-title-help`}
        placeholder="Ej: Kiniela Champions, gana el máximo de aciertos"
        className={INPUT}
      />
      <p id={`${idPrefix}-title-help`} className={`${HELP} mt-1`}>
        No se muestra en la web. La leen los lectores de pantalla para describir la imagen a personas que no la ven.
        Escribe una frase corta de lo que dice el banner.
      </p>
      {errors?.title && (
        <p role="alert" className="text-xs text-rose-300 mt-1">
          {errors.title}
        </p>
      )}
    </div>

    <div>
      <ImageUploadField
        idPrefix={`${idPrefix}-desktop`}
        spec={DESKTOP_SPEC}
        value={values.image_url}
        onChange={(url) => onChange({ ...values, image_url: url })}
      />
      {errors?.image_url && (
        <p role="alert" className="text-xs text-rose-300 mt-1">
          {errors.image_url}
        </p>
      )}
    </div>

    <ImageUploadField
      idPrefix={`${idPrefix}-mobile`}
      spec={MOBILE_SPEC}
      value={values.image_url_mobile}
      onChange={(url) => onChange({ ...values, image_url_mobile: url })}
      optionalHint="Si no subes la de celular, en los celulares se usará la de escritorio y se verá recortada y con letras muy pequeñas. Se recomienda subir siempre las dos."
    />

    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0c186b]/40 border border-[#1a2785]">
      <div>
        <p className="text-sm font-bold text-white">Mostrar este banner en la web</p>
        <p className="text-xs text-slate-300">Si lo pausas, se guarda pero no aparece en el carrusel.</p>
      </div>
      <Switch
        checked={values.is_active}
        onChange={(v) => onChange({ ...values, is_active: v })}
        label="Mostrar este banner en la web"
        showText
        onText="Activo"
        offText="Pausado"
      />
    </div>
  </div>
);

/** Revisa el formulario. Devuelve mensajes en lenguaje sencillo (vacío = todo bien). */
export function validateBannerForm(v: BannerFormValues): { title?: string; image_url?: string } {
  const errors: { title?: string; image_url?: string } = {};
  if (!v.title.trim()) errors.title = 'Escribe una descripción corta de lo que dice el banner.';
  if (!v.image_url.trim()) errors.image_url = 'Falta la imagen de escritorio y tablet: es obligatoria.';
  return errors;
}
