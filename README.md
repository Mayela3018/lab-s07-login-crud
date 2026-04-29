# 🛒 LAB-S07 · Sistema CRUD de Productos con Balanceo de Carga en AWS

> Aplicación web full-stack para gestión de inventario, desplegada en una arquitectura cloud de alta disponibilidad con balanceo de carga, multi-AZ y monitoreo continuo.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20ALB-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![PM2](https://img.shields.io/badge/PM2-Daemon-2B037A?logo=pm2&logoColor=white)](https://pm2.keymetrics.io/)

---

## 📑 Índice

- [🚀 Descripción](#-descripción)
- [✨ Características](#-características)
- [🏗️ Arquitectura](#️-arquitectura)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [⚙️ Variables de Entorno](#️-variables-de-entorno)
- [📦 Instalación Local](#-instalación-local)
- [☁️ Despliegue en AWS](#️-despliegue-en-aws)
- [🔁 Recrear el Balanceador (ALB)](#-recrear-el-balanceador-alb)
- [🔍 Salud & Monitoreo](#-salud--monitoreo)
- [📸 Capturas del Proyecto](#-capturas-del-proyecto)
- [🧠 Lecciones Aprendidas & Troubleshooting](#-lecciones-aprendidas--troubleshooting)
- [👩‍💻 Autor](#-autor)

---

## 🚀 Descripción

Este proyecto implementa un **sistema CRUD completo** para gestión de productos con autenticación segura mediante **JWT**. Fue desarrollado y probado localmente, y posteriormente desplegado en **AWS** utilizando una arquitectura escalable y tolerante a fallos, validando conceptos fundamentales de cloud computing, balanceo de carga y alta disponibilidad.

El objetivo principal fue demostrar cómo una aplicación Node.js puede:

- Escalarse **horizontalmente** entre múltiples instancias EC2.
- Mantenerse saludable mediante **health checks** automáticos.
- Distribuir tráfico de manera eficiente entre **múltiples zonas de disponibilidad**.

---

## ✨ Características

| | Característica | Descripción |
|---|---|---|
| 🔐 | **Autenticación JWT** | Tokens seguros para acceso a rutas protegidas |
| 📦 | **CRUD Completo** | Crear, leer, actualizar y eliminar productos |
| ⚖️ | **Balanceo de Carga** | Application Load Balancer (ALB) con Round-Robin |
| 🌍 | **Multi-AZ** | Instancias en `us-east-1a` y `us-east-1b` |
| ❤️ | **Health Checks** | Endpoint `/health` monitoreado cada 30 segundos |
| 🔄 | **Gestión de Procesos** | PM2 para daemonización, auto-restart y logs |
| 📱 | **UI Responsive** | Interfaz limpia, moderna y adaptable a móviles |
| 🛡️ | **Seguridad** | Security Groups restrictivos, secretos en `.env`, IP filtering en Atlas |

---

## 🏗️ Arquitectura

```
                       ┌──────────────────┐
                       │   Cliente Web    │
                       └────────┬─────────┘
                                │ HTTP :80
                                ▼
              ┌─────────────────────────────────────┐
              │  Application Load Balancer (ALB)    │
              │         alb-lab-s07                 │
              └────────────────┬────────────────────┘
                               │ Round-Robin
                               ▼
              ┌─────────────────────────────────────┐
              │   Target Group: tg-lab-s07-web      │
              │   Health Check: /health  :5000      │
              └──────────────┬──────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │    EC2-1     │          │    EC2-2     │
        │ web-server-1 │          │ web-server-2 │
        │ us-east-1a   │          │ us-east-1b   │
        └──────┬───────┘          └──────┬───────┘
               │                         │
               └────────────┬────────────┘
                            ▼
               ┌──────────────────────────┐
               │  MongoDB Atlas Cluster   │
               │     lab_s07_db           │
               └──────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla), Fetch API |
| **Backend** | Node.js 20.x, Express.js, dotenv, bcryptjs, jsonwebtoken |
| **Base de Datos** | MongoDB Atlas (M0 Sandbox), Mongoose ODM |
| **Procesos** | PM2 (Daemon, Auto-restart, Log management) |
| **Cloud (AWS)** | EC2 `t3.micro`, ALB, Target Groups, VPC, Security Groups, Elastic IP |
| **DevOps** | Git, GitHub, SSH |

---

## ⚙️ Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/lab_s07_db?retryWrites=true&w=majority
JWT_SECRET=<clave_secreta_segura>
NODE_ENV=production
HOSTNAME=web-server-1
```

> ⚠️ **Importante:** nunca subas el archivo `.env` al repositorio. Usa `.env.example` como plantilla y agrega `.env` a tu `.gitignore`.

---

## 📦 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Mayela3018/lab-s07-login-crud.git
cd lab-s07-login-crud

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales locales

# 4. Iniciar servidor en modo desarrollo
npm run dev

# o en producción
npm start
```

La aplicación estará disponible en: **`http://localhost:5000`**

---

## ☁️ Despliegue en AWS

### 1️⃣ Configuración de Instancias EC2

| Parámetro | Valor |
|-----------|-------|
| Tipo | `t3.micro` |
| AMI | Amazon Linux 2023 |
| Instancias | 2 |
| Zona A | `us-east-1a` → `web-server-1` |
| Zona B | `us-east-1b` → `web-server-2` |
| Security Group | Puertos `22` (SSH), `80` (HTTP), `5000` (App) |

### 2️⃣ Instalación de Dependencias en cada EC2

```bash
sudo dnf update -y
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs git
sudo npm install -g pm2
```

### 3️⃣ Despliegue de la Aplicación

```bash
cd ~
git clone https://github.com/Mayela3018/lab-s07-login-crud.git
cd lab-s07-login-crud
npm install --production

# Crear .env de producción
cat > .env << 'EOF'
PORT=5000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/lab_s07_db
JWT_SECRET=tu_clave_secreta
NODE_ENV=production
HOSTNAME=web-server-1
EOF

# Iniciar con PM2
pm2 start src/app.js --name "lab-s07"
pm2 save
pm2 startup   # configurar arranque automático
```

### 4️⃣ Configuración de Red & Balanceo

| Recurso | Configuración |
|---------|--------------|
| **VPC** | Subredes públicas en 2 AZs |
| **Target Group** | `tg-lab-s07-web` · HTTP `:5000` · Health Check `/health` |
| **ALB** | `alb-lab-s07` · Internet-facing · Listener HTTP `:80` |
| **DNS Público** | `alb-lab-s07-xxxxxxxxxx.us-east-1.elb.amazonaws.com` |

---

## 🔁 Recrear el Balanceador (ALB)

Si necesitas volver a desplegar el balanceador (mantenimiento, pruebas o recuperación), sigue estos pasos en la **Consola de AWS**.

### 1️⃣ Verificar Instancias y Security Groups

- Confirma que `web-server-1` y `web-server-2` estén en estado **running**.
- Verifica que el Security Group permita tráfico entrante en:
  - Puerto `22` (SSH)
  - Puerto `80` (HTTP)
  - Puerto `5000` (App Node.js)

### 2️⃣ Crear Target Group

`EC2 → Grupos de destino → Crear grupo de destino`

| Campo | Valor |
|-------|-------|
| Tipo de destino | **Instances** |
| Nombre | `tg-lab-s07-web` |
| Protocolo / Puerto | `HTTP : 5000` |
| VPC | (tu VPC) |
| Health check path | `/health` |
| Intervalo / Umbral | `30s` / `3 healthy` / `3 unhealthy` |

Registra manualmente ambas instancias (`web-server-1` y `web-server-2`).

### 3️⃣ Crear Application Load Balancer

`EC2 → Balanceadores de carga → Crear balanceador → Application Load Balancer`

| Campo | Valor |
|-------|-------|
| Nombre | `alb-lab-s07` |
| Esquema | **Internet-facing** |
| Tipo de IP | IPv4 |
| Mapeo de red | 2 subredes públicas en distintas AZs (`us-east-1a` y `us-east-1b`) |
| Security Group | El que permite el puerto `80` |

### 4️⃣ Configurar Listener

| Campo | Valor |
|-------|-------|
| Protocolo / Puerto | `HTTP : 80` |
| Acción predeterminada | **Forward to** → `tg-lab-s07-web` |

Haz clic en **Crear balanceador de carga**.

### 5️⃣ Verificar y Probar

1. Espera entre **2 y 5 minutos** hasta que el estado del ALB pase a **active**.
2. Ve a la pestaña **Destinos** del Target Group y confirma que ambas instancias muestren **Healthy**.
3. Copia el **DNS del ALB** y ábrelo en el navegador. Refresca varias veces para validar el balanceo Round-Robin entre ambos servidores.

```bash
# Validar balanceo desde terminal
for i in {1..10}; do
  curl -s http://alb-lab-s07-xxxxxxxxxx.us-east-1.elb.amazonaws.com/health
done
```

> 💡 **Tip:** Si las instancias aparecen **Unhealthy**, verifica que:
> - La app esté corriendo en el puerto `5000` → `curl http://localhost:5000/health`
> - El Security Group permita tráfico desde el ALB hacia el puerto `5000`
> - MongoDB Atlas permita la IP de las instancias (o `0.0.0.0/0` temporalmente)

---

## 🔍 Salud & Monitoreo

### Endpoint de salud

```http
GET /health
```

**Respuesta:**

```json
{
  "status": "OK",
  "server": "web-server-1",
  "timestamp": "2026-04-28T15:30:00.000Z"
}
```

### Configuración del Health Check

| Parámetro | Valor |
|-----------|-------|
| Protocolo | HTTP |
| Path | `/health` |
| Puerto | `5000` |
| Intervalo | 30 segundos |
| Timeout | 5 segundos |
| Umbral healthy / unhealthy | 3 / 3 |

### Comandos útiles de PM2

```bash
pm2 list                    # ver procesos
pm2 logs lab-s07            # ver logs en tiempo real
pm2 monit                   # dashboard interactivo
pm2 restart lab-s07         # reiniciar app
pm2 reload lab-s07          # zero-downtime restart
```

### Ubicación de logs

```
~/.pm2/logs/lab-s07-out.log     # stdout
~/.pm2/logs/lab-s07-error.log   # stderr
```

---

## 📸 Capturas del Proyecto

> _Agrega aquí :_

- [ ] Pantalla de Login
- [ ] CRUD de Productos
- [ ] Consola AWS — Instancias EC2 corriendo
- [ ] Target Group con ambas instancias **Healthy**
- [ ] ALB en estado **active** + DNS público
- [ ] Prueba de balanceo (refrescar varias veces mostrando el cambio de `web-server-1` a `web-server-2`)
- [ ] Logs de PM2 con tráfico real

---

## 🧠 Lecciones Aprendidas & Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| `bad auth: authentication failed` | Contraseña incorrecta en `.env` | Verificar credenciales en MongoDB Atlas y actualizar `.env` |
| App en bucle de reinicios (↺ 3500) | Caché de variables en PM2 | `pm2 kill` → `rm -rf ~/.pm2` → reinicio limpio |
| Target Group **Unhealthy** | Health check fallando o puerto bloqueado | Validar SG, probar `curl localhost:5000/health`, esperar propagación de Atlas |
| Elastic IP cobrando sin uso | EC2 detenida pero IP asociada | Liberar EIP o mantener la instancia detenida solo si es estrictamente necesario |
| ALB devuelve 502 Bad Gateway | App no responde en el puerto del Target Group | Verificar que PM2 esté corriendo (`pm2 list`) y revisar logs (`pm2 logs`) |
| MongoDB Atlas no acepta conexiones | IP de la EC2 no autorizada | Agregar la IP pública de la instancia en **Network Access** de Atlas |

### ✅ Conclusiones clave

1. **El despliegue exitoso depende tanto de la configuración de red y secretos como del código funcional.** Una app perfecta puede fallar por un Security Group mal configurado.
2. **Los health checks son esenciales para alta disponibilidad.** Sin ellos, el ALB no puede saber qué instancias están realmente operativas y podría enviar tráfico a un servidor caído.
3. **La gestión adecuada de procesos (PM2) garantiza la continuidad del servicio** ante fallos del proceso Node.js, reinicios del sistema y picos de carga.

---

## 👩‍💻 Autor

**Mayela**

- 🔗 Repositorio: [github.com/Mayela3018/lab-s07-login-crud](https://github.com/Mayela3018/lab-s07-login-crud)
- 📚 Proyecto académico — **Laboratorio S07: Arquitecturas Cloud & Balanceo de Carga**
- 🎓 Curso: Desarrollo de Soluciones en la Nube — Tecsup

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

</div>
