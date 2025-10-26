# Deploy en Vercel - Guía Completa

Este proyecto está preparado para desplegarse como dos aplicaciones separadas en Vercel.

## 📋 Pre-requisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub/GitLab/Bitbucket
- Base de datos MySQL accesible desde internet (ej: PlanetScale, Railway, etc.)

## 🚀 Pasos para el Deploy

### 1. Deploy del Backend (NestJS)

1. **Ir a Vercel**
   - Ve a https://vercel.com/new
   - Conecta tu cuenta de Git
   - Selecciona el repositorio `trimly-vercel`

2. **Configurar el proyecto Backend**
   - **Project Name**: `trimly-backend` (o el nombre que prefieras)
   - **Framework Preset**: Other
   - **Root Directory**: Selecciona `backend` ⚠️ IMPORTANTE
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Variables de Entorno del Backend**
   
   Agregar en: Settings → Environment Variables
   
   ```
   CORS_ORIGIN=https://tu-frontend.vercel.app
   DATABASE_URL=mysql://usuario:password@host:port/database
   DB_HOST=tu_host
   DB_PORT=3306
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_password
   DB_DATABASE=tu_base_datos
   JWT_SECRET=tu_secreto_super_seguro_aqui
   NODE_ENV=production
   ```
   
   ⚠️ Nota: Configura `CORS_ORIGIN` después de desplegar el frontend

4. **Deploy**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - **COPIA LA URL** (ej: `https://trimly-backend.vercel.app`)

---

### 2. Deploy del Frontend (React + Vite)

1. **Agregar nuevo proyecto en Vercel**
   - Ve a tu dashboard → "Add New Project"
   - Selecciona el **MISMO repositorio** `trimly-vercel`

2. **Configurar el proyecto Frontend**
   - **Project Name**: `trimly-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: Selecciona `frontend` ⚠️ IMPORTANTE
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Variables de Entorno del Frontend**
   
   Agregar en: Settings → Environment Variables
   
   ```
   VITE_API_URL=https://trimly-backend.vercel.app
   ```
   
   ⚠️ Usa la URL del backend que copiaste en el paso 1.4

4. **Deploy**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - **COPIA LA URL** (ej: `https://trimly-frontend.vercel.app`)

---

### 3. Actualizar CORS del Backend

1. Ve al proyecto Backend en Vercel
2. Settings → Environment Variables
3. Edita `CORS_ORIGIN` con la URL del frontend: `https://trimly-frontend.vercel.app`
4. Ve a Deployments → Click en el último deployment → "..." → "Redeploy"

---

## ✅ Verificación

### Backend
- Abre: `https://trimly-backend.vercel.app/usuarios` (o cualquier endpoint)
- Debe responder con datos JSON

### Frontend
- Abre: `https://trimly-frontend.vercel.app`
- Abre la consola del navegador (F12)
- No debe haber errores CORS
- Las llamadas a la API deben funcionar

---

## 🔧 Configuración Adicional (Opcional)

### Optimizar Builds - Ignored Build Step

Para que Vercel solo reconstruya cuando cambien archivos de esa carpeta:

**Backend** - Settings → Git → Ignored Build Step:
```bash
git diff --quiet HEAD^ HEAD -- backend/
```

**Frontend** - Settings → Git → Ignored Build Step:
```bash
git diff --quiet HEAD^ HEAD -- frontend/
```

### Dominios Personalizados

Si tienes un dominio propio:
1. Settings → Domains en cada proyecto
2. Agrega tu dominio:
   - Backend: `api.tudominio.com`
   - Frontend: `tudominio.com`
3. Actualiza las variables de entorno con los nuevos dominios

---

## 📝 Estructura del Proyecto

```
trimly-vercel/
├── backend/                # API NestJS
│   ├── src/
│   │   ├── serverless.ts  # Handler para Vercel
│   │   └── ...
│   ├── vercel.json        # Configuración de Vercel
│   └── package.json
│
├── frontend/              # App React + Vite
│   ├── src/
│   │   ├── config/
│   │   │   └── api.ts     # Configuración de API URL
│   │   └── ...
│   ├── .env.example       # Plantilla de variables de entorno
│   ├── .env.local         # Variables locales (no se sube a Git)
│   └── package.json
│
└── VERCEL_DEPLOY.md       # Este archivo
```

---

## 🐛 Troubleshooting

### Error CORS
- Verifica que `CORS_ORIGIN` en el backend tenga la URL correcta del frontend
- Redeploya el backend después de cambiar variables de entorno

### Error 404 en el backend
- Verifica que `vercel.json` esté en la carpeta `backend`
- Verifica que el Root Directory esté configurado correctamente

### Frontend no conecta al backend
- Verifica que `VITE_API_URL` esté configurada correctamente
- Abre la consola del navegador para ver errores
- Verifica que el backend esté funcionando

### Build Error
- Revisa los logs en Vercel
- Verifica que las dependencias estén instaladas correctamente
- Prueba el build localmente: `npm run build`

---

## 📚 URLs Útiles

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentación Vercel**: https://vercel.com/docs
- **NestJS Deployment**: https://docs.nestjs.com/faq/serverless

---

## 🔄 Redeploy Automático

Cada vez que hagas push a tu repositorio:
- Si cambiaron archivos en `backend/` → se redeploya el backend
- Si cambiaron archivos en `frontend/` → se redeploya el frontend
- Si configuraste Ignored Build Step, solo se redeploya lo necesario

---

## 📧 Soporte

Si tienes problemas, revisa:
1. Los logs en Vercel (Deployments → Click en deployment → View Function Logs)
2. La consola del navegador (F12)
3. Las variables de entorno (Settings → Environment Variables)

¡Buena suerte con tu deploy! 🚀
