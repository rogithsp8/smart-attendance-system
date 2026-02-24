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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6">
        <h3 className="text-xl font-bold mb-2">📋 Mark Attendance</h3>
        <p className="text-indigo-100">Select students present today</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Present</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students?.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-medium text-gray-800">
                      {student.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{student.id}</td>
                <td className="px-6 py-4 text-gray-600">{student.email}</td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={attendance[student.id] || false}
                    onChange={() => handleCheckboxChange(student.id)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
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
