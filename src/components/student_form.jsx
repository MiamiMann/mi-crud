import { useState, useEffect } from 'react';

/**
 * Componente formulario para agregar o editar estudiantes
 * @param {Function} addOrUpdateStudent - Función para agregar o actualizar estudiante
 * @param {Object|null} studentToEdit - Estudiante a editar (null si es nuevo)
 * @param {Function} cancelEdit - Función para cancelar la edición
 */
function StudentForm({ addOrUpdateStudent, studentToEdit, cancelEdit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    asignatura: '',
    promedio: ''
  });
  const [errors, setErrors] = useState({});

  // Llenar el formulario cuando se va a editar un estudiante
  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        nombre: studentToEdit.nombre,
        asignatura: studentToEdit.asignatura,
        promedio: studentToEdit.promedio
      });
      setErrors({});
    } else {
      setFormData({ nombre: '', asignatura: '', promedio: '' });
      setErrors({});
    }
  }, [studentToEdit]);

  /**
   * Maneja los cambios en los inputs del formulario
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Valida los datos del formulario
   * @returns {boolean} - true si es válido, false si no
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.asignatura.trim()) {
      newErrors.asignatura = 'La asignatura es obligatoria';
    } else if (formData.asignatura.trim().length < 2) {
      newErrors.asignatura = 'La asignatura debe tener al menos 2 caracteres';
    }

    if (!formData.promedio.trim()) {
      newErrors.promedio = 'El promedio es obligatorio';
    } else {
      const promedioNum = parseFloat(formData.promedio);
      if (isNaN(promedioNum)) {
        newErrors.promedio = 'El promedio debe ser un número válido';
      } else if (promedioNum < 1.0 || promedioNum > 7.0) {
        newErrors.promedio = 'El promedio debe estar entre 1.0 y 7.0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addOrUpdateStudent({
        nombre: formData.nombre.trim(),
        asignatura: formData.asignatura.trim(),
        promedio: parseFloat(formData.promedio).toFixed(1)
      });
      
      // Limpiar formulario después de enviar
      setFormData({ nombre: '', asignatura: '', promedio: '' });
      setErrors({});
    }
  };

  /**
   * Maneja la cancelación de edición
   */
  const handleCancel = () => {
    cancelEdit();
    setFormData({ nombre: '', asignatura: '', promedio: '' });
    setErrors({});
  };

  return (
    <div className="student-form-container">
      <h2>{studentToEdit ? '✏️ Editar Estudiante' : '➕ Agregar Nuevo Estudiante'}</h2>
      
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Estudiante:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa el nombre completo"
            className={errors.nombre ? 'error' : ''}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="asignatura">Asignatura:</label>
          <input
            type="text"
            id="asignatura"
            name="asignatura"
            value={formData.asignatura}
            onChange={handleChange}
            placeholder="Ej: Matemáticas, Historia, etc."
            className={errors.asignatura ? 'error' : ''}
          />
          {errors.asignatura && <span className="error-message">{errors.asignatura}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="promedio">Promedio (1.0 - 7.0):</label>
          <input
            type="number"
            id="promedio"
            name="promedio"
            value={formData.promedio}
            onChange={handleChange}
            placeholder="Ej: 6.5"
            min="1.0"
            max="7.0"
            step="0.1"
            className={errors.promedio ? 'error' : ''}
          />
          {errors.promedio && <span className="error-message">{errors.promedio}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {studentToEdit ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
          </button>
          
          {studentToEdit && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="scale-info">
        <h3>📊 Escala de Apreciación:</h3>
        <ul>
          <li><strong>1.0 - 3.9:</strong> Deficiente</li>
          <li><strong>4.0 - 5.5:</strong> Con mejora</li>
          <li><strong>5.6 - 6.4:</strong> Buen trabajo</li>
          <li><strong>6.5 - 7.0:</strong> Destacado</li>
        </ul>
      </div>
    </div>
  );
}

export default StudentForm;