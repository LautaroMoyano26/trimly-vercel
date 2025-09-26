import jsPDF from 'jspdf';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
}

interface ItemFactura {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  stockDisponible: number;
}

interface DatosFactura {
  numeroFactura?: string;
  fecha: Date;
  cliente: Cliente;
  items: ItemFactura[];
  metodoPago: string;
  total: number;
}

export const generarFacturaPDF = (datos: DatosFactura) => {
  console.log('=== DENTRO DE generarFacturaPDF ===');
  console.log('Datos recibidos:', datos);
  
  // Verificar tipos de datos
  console.log('Tipo de total:', typeof datos.total, 'Valor:', datos.total);
  datos.items.forEach((item, index) => {
    console.log(`Item ${index}:`, {
      nombre: item.nombre,
      cantidad: item.cantidad,
      tipocantidad: typeof item.cantidad,
      precioUnitario: item.precioUnitario,
      tipoPrecio: typeof item.precioUnitario
    });
  });
  
  try {
    console.log('Creando instancia jsPDF...');
    const doc = new jsPDF();
    console.log('jsPDF creado exitosamente');
  
  // Configuración de colores
  const colorPrimario: [number, number, number] = [74, 144, 226]; // Azul (solo para el header principal)
  const colorTexto: [number, number, number] = [44, 62, 80]; // Gris medio (para info del cliente)
  
  // Header de la empresa
  doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
  doc.rect(0, 0, 220, 40, 'F');
  
  // Logo y nombre de la empresa
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TRIMLY', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión Integral', 20, 32);
  
  // Información de la factura (lado derecho del header)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', 150, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const numeroFactura = datos.numeroFactura || `F-${Date.now().toString().slice(-6)}`;
  doc.text(`Nº: ${numeroFactura}`, 150, 28);
  doc.text(`Fecha: ${datos.fecha.toLocaleDateString('es-AR')}`, 150, 34);
  
  // Información del cliente
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE', 20, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Cliente: ${datos.cliente.nombre} ${datos.cliente.apellido}`, 20, 65);
  doc.text(`DNI: ${datos.cliente.dni}`, 20, 72);
  doc.text(`Teléfono: ${datos.cliente.telefono}`, 20, 79);
  doc.text(`Email: ${datos.cliente.email}`, 20, 86);
  
  // Línea separadora (en negro)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(20, 95, 190, 95);
  
  // Tabla de productos/servicios (manual)
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLE DE LA FACTURA', 20, 110);
  
  // Headers de la tabla (en blanco y negro)
  doc.setFillColor(0, 0, 0); // Fondo negro para el header
  doc.rect(20, 120, 170, 10, 'F');
  
  doc.setTextColor(255, 255, 255); // Texto blanco
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Producto/Servicio', 25, 127);
  doc.text('Cant.', 120, 127);
  doc.text('Precio', 140, 127);
  doc.text('Subtotal', 165, 127);
  
  // Filas de datos
  let yPosition = 135;
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFont('helvetica', 'normal');
  
  datos.items.forEach((item, index) => {
    // Alternar color de fondo para las filas (gris muy claro para mantener legibilidad)
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240); // Gris muy claro que se imprime bien
      doc.rect(20, yPosition - 7, 170, 10, 'F');
    }
    
    // Convertir valores a números para evitar errores
    const cantidad = Number(item.cantidad) || 0;
    const precioUnitario = Number(item.precioUnitario) || 0;
    const subtotal = cantidad * precioUnitario;
    
    // Truncar nombre si es muy largo
    const nombreTruncado = item.nombre.length > 35 ? 
      item.nombre.substring(0, 32) + '...' : item.nombre;
    
    // Texto en negro para buena legibilidad al imprimir
    doc.setTextColor(0, 0, 0);
    doc.text(nombreTruncado, 25, yPosition);
    doc.text(cantidad.toString(), 125, yPosition);
    doc.text(`$${precioUnitario.toFixed(2)}`, 145, yPosition);
    doc.text(`$${subtotal.toFixed(2)}`, 170, yPosition);
    
    yPosition += 12;
  });
  
  // Línea inferior de la tabla (en negro)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(20, yPosition - 5, 190, yPosition - 5);
  
  // Bordes de la tabla para mejor definición al imprimir
  doc.setLineWidth(0.5);
  // Línea superior del header
  doc.line(20, 120, 190, 120);
  // Líneas laterales
  doc.line(20, 120, 20, yPosition - 5);
  doc.line(190, 120, 190, yPosition - 5);
  // Líneas verticales internas de la tabla
  doc.line(115, 120, 115, yPosition - 5); // Después de Producto/Servicio
  doc.line(135, 120, 135, yPosition - 5); // Después de Cantidad
  doc.line(160, 120, 160, yPosition - 5); // Después de Precio
  
  const finalY = yPosition + 10;
  
  // Método de pago (en negro)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Método de Pago:', 20, finalY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.metodoPago, 60, finalY + 15);
  
  // Total (con borde negro para impresión)
  doc.setFillColor(255, 255, 255); // Fondo blanco
  doc.rect(120, finalY + 20, 70, 15, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(120, finalY + 20, 70, 15, 'S'); // Solo el borde
  
  // Asegurar que el total sea un número
  const totalSeguro = Number(datos.total) || 0;
  
  doc.setTextColor(0, 0, 0); // Texto en negro
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL: $' + totalSeguro.toFixed(2), 125, finalY + 30);
  
  // Footer
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Gracias por su preferencia - TRIMLY', 20, 280);
  doc.text(`Generado el ${new Date().toLocaleString('es-AR')}`, 20, 285);
  
    // Descargar el PDF
    console.log('Guardando PDF...');
    const nombreArchivo = `Factura_${numeroFactura}_${datos.cliente.nombre}_${datos.cliente.apellido}.pdf`;
    doc.save(nombreArchivo);
    
    console.log('PDF guardado exitosamente:', nombreArchivo);
    return numeroFactura;
  } catch (error) {
    console.error('Error en generarFacturaPDF:', error);
    throw error;
  }
};

// Función para exportar reporte general (placeholder por ahora)
export const exportarReporteGeneral = async () => {
  const doc = new jsPDF();
  
  // Configuración de colores
  const colorPrimario: [number, number, number] = [74, 144, 226]; // Azul
  const colorTexto: [number, number, number] = [44, 62, 80]; // Gris medio
  
  // Header de la empresa
  doc.setFillColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
  doc.rect(0, 0, 220, 40, 'F');
  
  // Logo y nombre de la empresa
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TRIMLY', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte General del Sistema', 20, 32);
  
  // Información del reporte (lado derecho del header)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE GENERAL', 150, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const fecha = new Date().toLocaleDateString('es-AR');
  doc.text(`Fecha: ${fecha}`, 150, 28);
  doc.text(`Hora: ${new Date().toLocaleTimeString('es-AR')}`, 150, 34);
  
  // Contenido del reporte
  doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DEL SISTEMA', 20, 60);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Este es un reporte general del sistema TRIMLY.', 20, 75);
  doc.text('Para generar reportes específicos, utilice las funciones', 20, 85);
  doc.text('correspondientes en cada módulo del sistema.', 20, 95);
  
  // Nota sobre futuras funcionalidades
  doc.setFontSize(8);
  doc.text('Funcionalidades de reporte avanzado próximamente...', 20, 120);
  
  // Footer
  doc.setFontSize(8);
  doc.text('Generado por TRIMLY - Sistema de Gestión Integral', 20, 280);
  doc.text(`${new Date().toLocaleString('es-AR')}`, 20, 285);
  
  // Descargar el PDF
  const nombreArchivo = `Reporte_General_${Date.now()}.pdf`;
  doc.save(nombreArchivo);
};