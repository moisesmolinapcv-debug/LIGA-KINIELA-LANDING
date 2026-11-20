# Formulario de contacto: guía de puesta en marcha

> Para quién: el responsable del proyecto (sin conocimientos técnicos previos).
> Tiempo estimado: 30 a 45 minutos de tu parte, más lo que tarde el equipo de Sistemas con el DNS.
> El código ya está hecho. Lo que falta son **2 cuentas con sus llaves** y **cargarlas en Vercel**.
> Servicio de envío: **SMTP2GO** (sustituye a Mailgun, que suspendió la cuenta al activarla; decisión Q23).

---

## 0. La idea en 1 minuto

Cuando alguien llena el formulario de la web pasa esto:

```
Usuario llena el formulario
      │
      ▼
Cloudflare Turnstile  ── ¿es una persona? (casi siempre invisible)
      │ sí
      ▼
Nuestro servidor (/api/contacto) ── revisa todo otra vez
      │
      ▼
SMTP2GO ── envía el correo
      │
      ▼
contacto@ligakiniela.com.ve  (al darle "Responder", le contestas directo al usuario)
```

- **SMTP2GO** es el "cartero": un servicio que envía correos desde un programa. El plan gratis da 1.000 correos al mes (máximo 200 al día).
- **Turnstile** es el "portero": el captcha de Cloudflare. Es gratis y sin límite. Evita que los bots gasten esos correos.
- **Vercel** es donde vive la web. Ahí se guardan las llaves de forma secreta.
- **DNS** es la "guía telefónica" del dominio. SMTP2GO pide anotar ahí unos datos para demostrar que tenemos permiso de enviar en nombre de `ligakiniela.com.ve`. Esto lo hace **Sistemas** (ver el mensaje en `docs/CONTACTO-mensaje-sistemas.md`).

---

## 1. Turnstile (captcha), unos 10 minutos

1. Entra a <https://dash.cloudflare.com/sign-up> y crea una cuenta gratis. Si ya tienen una, usa esa.
   No hace falta mover el dominio a Cloudflare.
2. En el menú de la izquierda busca **Turnstile** y pulsa **Add widget** (Añadir widget).
3. Llena así:
   - **Widget name:** `Liga Kiniela - Contacto`
   - **Hostnames** (dominios donde funcionará): agrega `ligakiniela.com` y `www.ligakiniela.com`.
     Si quieren probarlo también en la dirección de pruebas de Vercel (`algo.vercel.app`), agrégala también.
   - **Widget Mode:** `Managed` (recomendado).
   - **Pre-clearance:** `No`.
4. Pulsa **Create**. Verás dos llaves. Cópialas a un lugar seguro:
   - **Site Key** (pública): irá en `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
   - **Secret Key** (secreta): irá en `TURNSTILE_SECRET_KEY`. **No la compartas por chat ni por correo.**

---

## 2. SMTP2GO (envío de correos), unos 15 minutos más la espera del DNS

### 2.1 Crear la cuenta
1. Entra a <https://www.smtp2go.com/pricing/> y elige el plan **Free** (no pide tarjeta).
2. Regístrate con un correo de la empresa si es posible. SMTP2GO puede hacerte preguntas sobre el uso o revisar la cuenta antes de activarla.
   Si te preguntan, responde con la verdad: *"formulario de contacto de nuestra web; los mensajes solo llegan a nuestro propio buzón; bajo volumen; sin marketing"*.
3. Si la cuenta queda en revisión o te piden algo que no entiendes, mándame una captura **antes** de responder.

### 2.2 Verificar el dominio (aquí entra Sistemas)
1. En el panel ve a **Sending → Verified Senders** y, en la parte de **Sender Domains**, pulsa **Add Sender Domain**.
2. Escribe: `ligakiniela.com.ve`
3. SMTP2GO mostrará unos registros DNS, normalmente **3 registros de tipo CNAME**, cada uno con **Host** y **Value / Points to**.
   - Estos registros son **nuevos** y **no tocan el correo actual** del dominio, porque no cambian el MX ni nada de lo que ya existe.
4. Para pasárselos a Sistemas, elige lo más cómodo:
   - **Opción fácil:** si ves un botón para enviar los registros por correo (algo como *"Email these records"* o *"Send to a colleague"*), úsalo y pon el correo de Sistemas.
   - **Opción manual:** copia cada Host y cada Value con su icono de copiar (no los selecciones a mano) o haz una **captura completa** de la tabla.
   - En los dos casos, envíales también el mensaje de `docs/CONTACTO-mensaje-sistemas.md`.
5. Cuando Sistemas confirme que los cargó, vuelve a esa pantalla y pulsa **Verify**. Puede tardar desde minutos hasta 24-48 horas.
   Mientras el dominio no esté verificado, SMTP2GO limita los envíos (unos 25 por hora). Para probar alcanza, pero conviene verificarlo.

### 2.3 Crear la llave de API
1. Ve a **Sending → API Keys** y pulsa **Add API Key**.
2. Ponle de nombre `web-contacto`.
3. En los permisos, deja permitido **solo lo necesario**: enviar correos (el permiso o "endpoint" llamado **/email/send**). Si no estás seguro, deja lo que viene por defecto y me mandas una captura.
4. Copia la llave (empieza por `api-`). Irá en `SMTP2GO_API_KEY`. **Es secreta: no la compartas por chat ni por correo.**

### 2.4 (Recomendado) Apagar el seguimiento de clics
En **Settings → Tracking** (o similar), desactiva **Click tracking** y **Open tracking**. No nos sirven en un correo interno y así los enlaces del mensaje llegan tal cual.

---

## 3. Cargar las llaves en Vercel, unos 5 minutos

1. Entra a <https://vercel.com>, abre el proyecto de Liga Kiniela y ve a **Settings → Environment Variables**.
2. Agrega estas 5 variables, una por una (botón **Add**). En "Environments" marca **Production** y también **Preview**:

| Nombre (Key) | Valor (Value) |
|---|---|
| `SMTP2GO_API_KEY` | la llave del paso 2.3 (empieza por `api-`) |
| `CONTACT_FROM_EMAIL` | `no-reply@ligakiniela.com.ve` |
| `CONTACT_TO_EMAIL` | `contacto@ligakiniela.com.ve` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | la Site Key del paso 1 |
| `TURNSTILE_SECRET_KEY` | la Secret Key del paso 1 |

> `no-reply@ligakiniela.com.ve` no necesita existir como buzón: es solo el remitente que se ve en el correo.

3. **Importante:** las variables solo se aplican en un despliegue nuevo. Ve a **Deployments**, abre el último, pulsa los tres puntos y elige **Redeploy**.

---

## 4. Prueba final

1. Abre la web en el celular y en la computadora y ve a la sección **Contacto** (menú → Contacto).
2. Envía un mensaje de prueba con tu correo personal.
3. Revisa `contacto@ligakiniela.com.ve`: debe llegar un correo con el asunto `[Web Liga Kiniela] Consulta general: <nombre>`.
   Si no aparece, **revisa la carpeta de spam** y márcalo como "No es spam".
4. Pulsa **Responder**: la respuesta debe ir a tu correo personal, no a `no-reply@`.
5. En SMTP2GO, en **Reports → Activity**, deberías ver el envío como entregado (*Delivered*).
6. Avísame el resultado y cierro la verificación.

---

## 5. Si algo falla

| Lo que ves en la web | Qué significa | Qué hacer |
|---|---|---|
| "El formulario no está disponible en este momento" | Faltan las llaves de SMTP2GO en Vercel | Revisa el paso 3 y haz **Redeploy** |
| El botón se queda en "Verificando seguridad…" | Turnstile no carga: falta la Site Key o el dominio no está en "Hostnames" | Revisa el paso 1.3 |
| "No pudimos confirmar que eres una persona" | La Secret Key no coincide con la Site Key | Copia las dos del mismo widget |
| "No pudimos enviar tu mensaje" | SMTP2GO rechazó el envío: llave errada, sin permiso para /email/send o remitente de un dominio no verificado | Revisa los pasos 2.2 y 2.3. En SMTP2GO → Reports → Activity se ve el motivo |
| Llega a spam | El buzón aún no confía en el remitente | Ver "Recomendado" en el mensaje a Sistemas |

Los detalles técnicos del error quedan en Vercel → proyecto → **Logs** (busca `[Contacto]`). Ahí no se guardan los datos de los usuarios.

---

## 6. Límites y costos

- **SMTP2GO Free:** 1.000 correos al mes, máximo 200 al día. Cada mensaje del formulario usa 1, porque no enviamos respuesta automática al usuario.
- **Turnstile:** gratis y sin límite.
- **Defensas adicionales ya incluidas:** campo trampa invisible para bots, tiempo mínimo de llenado y un máximo de 5 envíos cada 10 minutos por conexión.
- **Mailgun:** ya no se usa. La cuenta suspendida puede quedarse así; no hace falta hacer nada con ella.
