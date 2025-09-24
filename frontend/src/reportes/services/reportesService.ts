import type { DatosReporte } from '../types/reportes.types';

const API_URL = 'http://localhost:3000/api/reportes';

const getReportes = async (periodo: string): Promise<DatosReporte> => {
  try {
    const response = await fetch(`${API_URL}?periodo=${periodo}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener los datos de reportes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getReportes:', error);
    throw error;
  }
};

// Exportamos un objeto que contiene la función
export const reportesService = {
  getReportes,
};