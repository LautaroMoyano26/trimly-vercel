import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaUserShield } from "react-icons/fa";
import "./NuevoUsuarioModal.css";

interface NuevoUsuarioFormData {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  rol: "admin" | "empleado" | "";
}

interface Props {
  show: boolean;
  onClose: () => void;
  onUsuarioCreado: () => Promise<void>;
}

interface FormErrors {
  nombre?: string;
  username?: string;
  password?: string;
  rol?: string;
  generic?: string;
}

export default function NuevoUsuarioModal({
  show,
  onClose,
  onUsuarioCreado,
}: Props) {
  const [form, setForm] = useState<NuevoUsuarioFormData>({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    password: "",
    rol: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      setForm({
        nombre: "",
        apellido: "",
        username: "",
        email: "",
        password: "",
        rol: "",
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.username.trim())
      newErrors.username = "El username es obligatorio.";
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 7) {
      newErrors.password = "Mínimo 7 caracteres.";
    } else if (!/\d/.test(form.password)) {
      newErrors.password = "Debe incluir al menos un número.";
    }
    if (!form.rol) newErrors.rol = "El rol es obligatorio.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/usuarios/check-username/${form.username}`
      );
      const data = await res.json();
      if (data.exists) {
        newErrors.username = "Este username ya está en uso.";
        setErrors(newErrors);
        return false;
      }
    } catch (error) {
      newErrors.generic = "Error al verificar el username.";
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const isValid = await validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el usuario.");
      }

      await onUsuarioCreado();
      onClose();
    } catch (error: any) {
      setErrors({
        generic: error.message || "No se pudo conectar con el servidor.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-bg">
      <div className="nuevo-usuario-modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Crear Nuevo Usuario</h2>
        <p className="modal-subtitle">
          Completa los datos para registrar un nuevo usuario en el sistema.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="nuevo-input-group">
              <label>Nombre</label>
              <input
                name="nombre"
                placeholder="Ej: Juan"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              {errors.nombre && (
                <span className="error-message">{errors.nombre}</span>
              )}
            </div>
            <div className="nuevo-input-group">
              <label>Apellido</label>
              <input
                name="apellido"
                placeholder="Ej: Pérez (Opcional)"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="nuevo-input-group">
            <label>Username</label>
            <div className="input-icon-row">
              <FaUser className="input-icon" />
              <input
                name="username"
                placeholder="Ej: juan.perez"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>
          <div className="nuevo-input-group">
            <label>Email</label>
            <div className="input-icon-row">
              <FaEnvelope className="input-icon" />
              <input
                name="email"
                type="email"
                placeholder="ejemplo@correo.com (Opcional)"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="nuevo-input-group">
              <label>Contraseña</label>
              <div className="input-icon-row">
                <FaLock className="input-icon" />
                <input
                  name="password"
                  type="password"
                  placeholder="Mínimo 7 caracteres, 1 número"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
            <div className="nuevo-input-group">
              <label>Rol</label>
              <div className="input-icon-row">
                <FaUserShield className="input-icon" />
                <select
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: "40px" }}
                >
                  <option value="" disabled>
                    Selecciona un rol
                  </option>
                  <option value="admin">Administrador</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>
              {errors.rol && (
                <span className="error-message">{errors.rol}</span>
              )}
            </div>
          </div>
          {errors.generic && (
            <span
              className="error-message"
              style={{ textAlign: "center", marginTop: "10px" }}
            >
              {errors.generic}
            </span>
          )}
          <div className="form-row buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="create-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
