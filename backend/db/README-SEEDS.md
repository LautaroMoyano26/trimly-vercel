# 🗃️ Instrucciones para Poblar la Base de Datos en Supabase

## 📋 **Pasos a Seguir**

### **1. Esperar a que tu amigo complete el despliegue**

Tu amigo debe:

- ✅ Crear el proyecto en Supabase
- ✅ Desplegar el backend en Vercel
- ✅ Desplegar el frontend en Vercel
- ✅ Configurar las variables de entorno

### **2. Poblar la Base de Datos**

Una vez que el backend esté desplegado en Vercel, las **tablas se crearán automáticamente** en Supabase cuando el backend se inicie por primera vez (gracias a `synchronize: true`).

Después de que las tablas existan:

#### **Opción A: Ejecutar el Script en Supabase** (RECOMENDADO)

1. Ve a **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecciona tu proyecto **"trimly-db"**
3. En el menú lateral, click en **SQL Editor**
4. Click en **+ New Query**
5. Abre el archivo `backend/db/seeds-postgres.sql` de este proyecto
6. **Copia todo el contenido** del archivo
7. **Pégalo** en el editor SQL de Supabase
8. Click en **Run** (esquina inferior derecha)
9. Deberías ver un mensaje de éxito con el conteo de registros insertados

#### **Opción B: Ejecutar desde tu Computadora** (Avanzado)

Si tienes `psql` instalado:

```powershell
# Obtén la Connection String de Supabase
# Formato: postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Ejecutar el script
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres" -f backend/db/seeds-postgres.sql
```

### **3. Verificar los Datos**

Después de ejecutar el script, verifica en Supabase:

1. Ve a **Table Editor** en Supabase
2. Verifica que existan:
   - ✅ 30 clientes
   - ✅ 15 servicios
   - ✅ 5 usuarios
   - ✅ 50 productos

### **4. Credenciales de Acceso**

Para hacer login en la aplicación, usa cualquiera de estos usuarios:

| Username         | Contraseña | Rol      |
| ---------------- | ---------- | -------- |
| admin.trimly     | trimly2025 | admin    |
| maria.peluquera  | trimly2025 | empleado |
| carlos.estilista | trimly2025 | empleado |
| sofia.colorista  | trimly2025 | empleado |
| lucia.manicura   | trimly2025 | empleado |

---

## 🔄 **Si Necesitas Resetear la Base de Datos**

Para limpiar y volver a poblar:

1. Ejecuta nuevamente el script `seeds-postgres.sql` en Supabase
2. El script incluye comandos `TRUNCATE` que limpiarán las tablas primero

---

## ⚠️ **IMPORTANTE**

- **NO ejecutes** el archivo `seeds.sql` (es para MySQL)
- **SÍ ejecuta** el archivo `seeds-postgres.sql` (adaptado para PostgreSQL/Supabase)
- La contraseña hasheada en los usuarios es: `trimly2025`

---

## 📞 **Si Algo Sale Mal**

Si encuentras errores al ejecutar el script:

1. Verifica que las tablas existan (ve a Table Editor en Supabase)
2. Si no existen, asegúrate de que el backend se haya desplegado y ejecutado al menos una vez
3. Copia el mensaje de error y búscalo en Google o contacta con tu amigo

---

## ✅ **Checklist Final**

- [ ] Backend desplegado en Vercel
- [ ] Tablas creadas automáticamente en Supabase
- [ ] Script `seeds-postgres.sql` ejecutado en Supabase SQL Editor
- [ ] Verificado que los datos existen en Supabase Table Editor
- [ ] Login exitoso con `admin.trimly` / `trimly2025`
- [ ] Aplicación funcionando correctamente en producción
