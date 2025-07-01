/**
 * Componente que representa una tarjeta individual de estudiante
 * @param {Object} student - Datos del estudiante
 * @param {Function} onEdit - Función para editar el estudiante
 * @param {Function} onDelete - Función para eliminar el estudiante
 * @param {string} scaleClass - Clase CSS para la escala de apreciación
 */
function StudentCard({ student, onEdit, onDelete, scaleClass }) {
  /**
   * Obtiene el emoji correspondiente a la escala de apreciación
   * @param {string} escala - Escala de apreciación
   * @returns {string} - Emoji correspondiente
   */
  const getScaleEmoji = (escala) => {
    switch (escala) {
      case 'Deficiente': return '❌';
      case 'Con mejora': return '⚠️';
      case 'Buen trabajo': return '✅';
      case 'Destacado': return '🌟';
      default: return '❓';
    }
  };

  /**
   * Obtiene el color de fondo basado en el promedio
   * @param {string} promedio - Promedio del estudiante
   * @returns {string} - Color en formato RGB
   */
  const getGradeColor = (promedio) => {
    const grade = parseFloat(promedio);
    if (grade >= 6.5) return 'rgba(40, 167, 69, 0.1)'; // Verde
    if (grade >= 5.6) return 'rgba(23, 162, 184, 0.1)'; // Azul
    if (grade >= 4.0) return 'rgba(255, 193, 7, 0.1)'; // Amarillo
    return 'rgba(220, 53, 69, 0.1)'; // Rojo
  };

  return (
    <div 
      className={`student-card ${scaleClass}`}
      style={{ backgroundColor: getGradeColor(student.promedio) }}
    >
      <div className="card-header">
        <h3 className="student-name">
          👤 {student.nombre}
        </h3>
        <div className="card-actions">
          <button 
            onClick={onEdit}
            className="btn-edit"
            title="Editar estudiante"
          >
            ✏️
          </button>
          <button 
            onClick={onDelete}
            className="btn-delete"
            title="Eliminar estudiante"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="student-info">
          <div className="info-item">
            <span className="info-label">📚 Asignatura:</span>
            <span className="info-value">{student.asignatura}</span>
          </div>

          <div className="info-item">
            <span className="info-label">📊 Promedio:</span>
            <span className="info-value grade">{student.promedio}</span>
          </div>

          <div className="info-item">
            <span className="info-label">🎯 Evaluación:</span>
            <span className={`info-value scale ${scaleClass}`}>
              {getScaleEmoji(student.escala)} {student.escala}
            </span>
          </div>

          {student.fechaCreacion && (
            <div className="info-item">
              <span className="info-label">📅 Registrado:</span>
              <span className="info-value date">{student.fechaCreacion}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div className="performance-indicator">
          <div className="indicator-bar">
            <div 
              className={`indicator-fill ${scaleClass}`}
              style={{ 
                width: `${(parseFloat(student.promedio) / 7.0) * 100}%` 
              }}
            ></div>
          </div>
          <span className="indicator-text">
            {((parseFloat(student.promedio) / 7.0) * 100).toFixed(0)}% del máximo
          </span>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;