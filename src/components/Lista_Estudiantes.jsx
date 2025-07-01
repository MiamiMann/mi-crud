import StudentCard from './Student_Card';

/**
 * Componente que muestra la lista de estudiantes
 * @param {Array} students - Array de estudiantes
 * @param {Function} deleteStudent - Función para eliminar estudiante
 * @param {Function} editStudent - Función para editar estudiante
 */
function StudentList({ students, deleteStudent, editStudent }) {
  /**
   * Obtiene la clase CSS basada en la escala de apreciación
   * @param {string} escala - Escala de apreciación
   * @returns {string} - Clase CSS correspondiente
   */
  const getScaleClass = (escala) => {
    switch (escala) {
      case 'Deficiente': return 'scale-deficiente';
      case 'Con mejora': return 'scale-mejora';
      case 'Buen trabajo': return 'scale-bueno';
      case 'Destacado': return 'scale-destacado';
      default: return 'scale-default';
    }
  };

  /**
   * Calcula estadísticas de la clase
   */
  const getClassStats = () => {
    if (students.length === 0) return null;

    const promedios = students.map(s => parseFloat(s.promedio));
    const promedioGeneral = (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(1);
    
    const escalas = students.reduce((acc, student) => {
      acc[student.escala] = (acc[student.escala] || 0) + 1;
      return acc;
    }, {});

    return {
      total: students.length,
      promedioGeneral,
      escalas
    };
  };

  const stats = getClassStats();

  if (students.length === 0) {
    return (
      <div className="student-list-container">
        <h2>📋 Lista de Estudiantes</h2>
        <div className="empty-list">
          <p>No hay estudiantes registrados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="list-header">
        <h2>📋 Lista de Estudiantes ({students.length})</h2>
        
        {stats && (
          <div className="class-stats">
            <h3>📈 Estadísticas de la Clase</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Promedio General:</span>
                <span className="stat-value">{stats.promedioGeneral}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Estudiantes:</span>
                <span className="stat-value">{stats.total}</span>
              </div>
            </div>
            
            <div className="scale-distribution">
              <h4>Distribución por Escala:</h4>
              <div className="scale-stats">
                {Object.entries(stats.escalas).map(([escala, count]) => (
                  <div key={escala} className={`scale-stat ${getScaleClass(escala)}`}>
                    <span className="scale-name">{escala}:</span>
                    <span className="scale-count">{count} estudiante{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="students-grid">
        {students.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={() => editStudent(student)}
            onDelete={() => deleteStudent(student.id)}
            scaleClass={getScaleClass(student.escala)}
          />
        ))}
      </div>

      <div className="list-actions">
        <button 
          onClick={() => {
            const csvContent = generateCSV(students);
            downloadCSV(csvContent, 'estudiantes.csv');
          }}
          className="btn-export"
        >
          📥 Exportar a CSV
        </button>
      </div>
    </div>
  );
}

/**
 * Genera contenido CSV de los estudiantes
 * @param {Array} students - Array de estudiantes
 * @returns {string} - Contenido CSV
 */
function generateCSV(students) {
  const headers = ['Nombre', 'Asignatura', 'Promedio', 'Escala de Apreciación', 'Fecha de Registro'];
  const rows = students.map(student => [
    student.nombre,
    student.asignatura,
    student.promedio,
    student.escala,
    student.fechaCreacion || 'No especificada'
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}

/**
 * Descarga un archivo CSV
 * @param {string} content - Contenido del CSV
 * @param {string} filename - Nombre del archivo
 */
function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default StudentList;