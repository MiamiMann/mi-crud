import { useState, useEffect } from 'react'
import StudentForm from './components/student_form'
import StudentList from './components/Lista_Estudiantes'
import './App.css'

/**
 * Componente principal de la aplicación de evaluación de alumnos
 * Maneja el estado global y la persistencia de datos
 */
function App() {
  const [students, setStudents] = useState([]);
  const [studentToEdit, setStudentToEdit] = useState(null);

  // Cargar estudiantes desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(storedStudents);
  }, []);

  // Guardar estudiantes en localStorage cada vez que cambie el estado
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  /**
   * Calcula la escala de apreciación basada en el promedio
   * @param {number} promedio - Promedio del estudiante
   * @returns {string} - Escala de apreciación correspondiente
   */
  const calculateScale = (promedio) => {
    const grade = parseFloat(promedio);
    if (grade >= 1.0 && grade <= 3.9) return 'Deficiente';
    if (grade >= 4.0 && grade <= 5.5) return 'Con mejora';
    if (grade >= 5.6 && grade <= 6.4) return 'Buen trabajo';
    if (grade >= 6.5 && grade <= 7.0) return 'Destacado';
    return 'Fuera de rango';
  };

  /**
   * Agrega un nuevo estudiante o actualiza uno existente
   * @param {Object} studentData - Datos del estudiante
   */
  const addOrUpdateStudent = (studentData) => {
    const escala = calculateScale(studentData.promedio);
    
    if (studentToEdit) {
      // Actualizar estudiante existente
      setStudents(students.map(student => 
        student.id === studentToEdit.id 
          ? { ...student, ...studentData, escala }
          : student
      ));
      setStudentToEdit(null);
    } else {
      // Agregar nuevo estudiante
      const newStudent = {
        id: Date.now(),
        ...studentData,
        escala,
        fechaCreacion: new Date().toLocaleDateString()
      };
      setStudents([...students, newStudent]);
    }
  };

  /**
   * Elimina un estudiante de la lista
   * @param {number} id - ID del estudiante a eliminar
   */
  const deleteStudent = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  /**
   * Prepara un estudiante para edición
   * @param {Object} student - Estudiante a editar
   */
  const editStudent = (student) => {
    setStudentToEdit(student);
  };

  /**
   * Cancela la edición actual
   */
  const cancelEdit = () => {
    setStudentToEdit(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Aplicación de Evaluación de Alumnos</h1>
        <p>Sistema de gestión de estudiantes con cálculo automático de escala de apreciación</p>
      </header>

      <main className="app-main">
        <StudentForm
          addOrUpdateStudent={addOrUpdateStudent}
          studentToEdit={studentToEdit}
          cancelEdit={cancelEdit}
        />
        
        <StudentList 
          students={students} 
          deleteStudent={deleteStudent} 
          editStudent={editStudent} 
        />

        {students.length === 0 && (
          <div className="empty-state">
            <p>No hay estudiantes registrados aún.</p>
            <p>¡Agrega el primer estudiante usando el formulario de arriba!</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Total de estudiantes: {students.length}</p>
      </footer>
    </div>
  );
}

export default App;