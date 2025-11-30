import React from 'react';

// Simulación de datos de reservas (reemplaza esto con tu estado/llamada a API real)
const reservas = [
    { ID: 1, Paciente: "Juan Pérez", Médico: "Dra. Flores", Fecha: "2025-12-05", Estado: "Confirmada" },
    { ID: 2, Paciente: "Ana Díaz", Médico: "Dr. Álvarez", Fecha: "2025-12-06", Estado: "Pendiente" },
    { ID: 3, Paciente: "Carlos Soto", Médico: "Dra. Flores", Fecha: "2025-12-06", Estado: "Cancelada" },
];

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

function ReservasTable() {
    
    // Función para exportar, importando las dependencias de forma asíncrona para la compilación.
    const exportToExcel = async () => {
        try {
            // Importación local para resolver el problema de 'xlsx' en la compilación
            // Es crucial que 'npm install xlsx file-saver' se haya ejecutado con éxito
            const XLSX = (await import('xlsx')).default;
            const saveAs = (await import('file-saver')).saveAs;
            
            // 1. Convertir los datos a hoja de cálculo
            const worksheet = XLSX.utils.json_to_sheet(reservas);
            
            // 2. Crear el libro de trabajo
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Reservas");
            
            // 3. Escribir el buffer
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            
            // 4. Crear el Blob y guardar
            const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
            const fileName = `Reporte_Reservas_${new Date().toISOString().slice(0, 10)}`;
            saveAs(data, fileName + EXCEL_EXTENSION);

            document.getElementById('export-message').textContent = `Reporte ${fileName} generado con éxito.`;

        } catch (error) {
            document.getElementById('export-message').textContent = 'Error al generar el archivo. Revisa la consola para más detalles.';
            console.error("Error al exportar a Excel:", error);
        }
    };

    return(
        // Añadimos el ID 'reserva' que el Navbar está buscando, y un padding superior
        // para compensar la barra de navegación fija (fixed-top)
        <section id="reserva" className='section p-4 pt-24'> 
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Tabla de Reservas</h2>
                <div id="export-message" className="text-sm text-green-600 mb-2"></div> 
                <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reservas.map((row) => (
                        <tr key={row.ID} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.ID}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.Paciente}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.Médico}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.Fecha}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.Estado}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <button 
                    className='mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-150' 
                    onClick={exportToExcel}
                >
                    Exportar Reservas a Excel
                </button>
            </div>
        </section>
    );
}

export default ReservasTable;