import { useState, useEffect } from 'react';

export const useClock = () => {
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    const temporizador = setInterval(() => {
      setHoraActual(new Date());
    }, 60000); // Actualizar cada 60 segundos

    return () => clearInterval(temporizador);
  }, []);

  const formatearHora = () => {
    return horaActual.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatearFecha = () => {
    return horaActual.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return { formatearHora, formatearFecha };
};
