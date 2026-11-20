# Mensaje para el equipo de Sistemas

> Copia y pega el texto de abajo (desde "Asunto"). Los valores ya son los reales de nuestra cuenta SMTP2GO
> (tomados de la pantalla "DNS configuration" del 20-nov-2026). Si quieres, adjunta también esa captura.

---

**Asunto:** Registros DNS para el formulario de contacto de la web (ligakiniela.com.ve)

Hola, equipo. ¿Cómo están?

Estamos activando un **formulario de contacto** en la web de Liga Kiniela. Los mensajes llegarán al buzón **contacto@ligakiniela.com.ve** y saldrán con el remitente **no-reply@ligakiniela.com.ve**, a través del servicio **SMTP2GO**. Para que esos correos no caigan en spam, necesitamos que nos ayuden a crear unos registros DNS.

**Lo importante primero:** son **3 registros nuevos de tipo CNAME**. **No se modifica nada del correo actual** de `ligakiniela.com.ve`: los registros MX, el SPF y los demás quedan intactos.

### Registros a crear en la zona `ligakiniela.com.ve`

| # | Tipo | Nombre / Host | Apunta a (Value / Target) | TTL | ¿Obligatorio? |
|---|---|---|---|---|---|
| 1 | CNAME | `em1248324` | `return.smtp2go.net` | 3600 | **Sí** |
| 2 | CNAME | `s1248324._domainkey` | `dkim.smtp2go.net` | 14400 | **Sí** |
| 3 | CNAME | `link` | `track.smtp2go.net` | 3600 | Opcional (recomendado) |

Nombres completos, por si su panel los pide así:

- `em1248324.ligakiniela.com.ve` → `return.smtp2go.net`
- `s1248324._domainkey.ligakiniela.com.ve` → `dkim.smtp2go.net`
- `link.ligakiniela.com.ve` → `track.smtp2go.net`

**Para qué sirve cada uno:**

1. **em1248324**: dirección de rebotes. Con ella el SPF queda alineado con nuestro dominio, sin tocar el SPF actual.
2. **s1248324._domainkey**: DKIM, la "firma digital" que demuestra que el correo es legítimo y de nuestro dominio.
3. **link**: dominio de seguimiento de enlaces. Nosotros lo tendremos apagado, pero SMTP2GO lo sugiere. Si prefieren no crearlo, no pasa nada; con los dos primeros es suficiente.

**Tres detalles para evitar errores:**

- **El nombre:** si su panel agrega el dominio de forma automática, escriban solo la parte izquierda (`em1248324`). Así evitan que quede `em1248324.ligakiniela.com.ve.ligakiniela.com.ve`.
- **Sin espacios ni punto final de más** en los valores: `return.smtp2go.net`, `dkim.smtp2go.net`, `track.smtp2go.net`. Algunos paneles aceptan o agregan el punto final (`return.smtp2go.net.`), y eso está bien.
- **Proxy apagado:** si el DNS está en Cloudflare, dejen estos CNAME en **"DNS only"** (nube gris, no naranja).

### Recomendado (opcional, mejora la entrega)

1. **DMARC**, si `ligakiniela.com.ve` aún no tiene uno:
   `TXT  _dmarc  →  v=DMARC1; p=none; rua=mailto:contacto@ligakiniela.com.ve`
   Si ya existe una política DMARC, no hace falta tocarla.
2. **Lista blanca en el buzón:** marcar `no-reply@ligakiniela.com.ve` como remitente confiable en `contacto@ligakiniela.com.ve`, para que los mensajes del formulario no vayan a spam.

### Cómo confirmar

Cuando estén cargados, por favor avísennos y nosotros pulsamos "Verify" en SMTP2GO. Normalmente se refleja en minutos, aunque puede tardar hasta unas horas. Si quieren comprobarlo ustedes:

```
nslookup -type=CNAME em1248324.ligakiniela.com.ve
nslookup -type=CNAME s1248324._domainkey.ligakiniela.com.ve
nslookup -type=CNAME link.ligakiniela.com.ve
```

Cada uno debe responder con su destino (`return.smtp2go.net`, `dkim.smtp2go.net` y `track.smtp2go.net`).

¡Muchas gracias por el apoyo! Cualquier duda, con gusto la revisamos.

Saludos,
Equipo Liga Kiniela
