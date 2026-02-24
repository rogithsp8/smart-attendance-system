import React, { useState } from 'react';

const AttendanceTable = ({ students, onAttendanceChange }) => {
  const [attendance, setAttendance] = useState({});

  const handleCheckboxChange = (studentId) => {
    const newAttendance = {
      ...attendance,
      [studentId]: !attendance[studentId]
    };
    setAttendance(newAttendance);
    onAttendanceChange(Object.keys(newAttendance).filter(id => newAttendance[id]));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>📋 Mark Attendance</h3>
        <p>Select students present today</p>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>ID</th>
              <th>Email</th>
              <th>Present</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="student-info">
                    <div className="student-avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="student-name">
                      {student.name}
                    </div>
                  </div>
                </td>
                <td>{student.id}</td>
                <td>{student.email}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={attendance[student.id] || false}
                    onChange={() => handleCheckboxChange(student.id)}
                    className="checkbox"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
