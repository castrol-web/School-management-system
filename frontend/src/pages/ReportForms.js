import React, { useEffect, useRef, useState } from 'react';
import schoologo from '../images/schoologo.png';
import castroll from '../images/castroll.jpeg';
import { IoMdPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import { useLocation } from 'react-router-dom';



function ReportForms() {
  const [subjects, setSubjects] = useState([]);
  let date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const printRef = useRef();
  const location = useLocation();
  //accessing report data from the previous page
  const { reportData } = location.state;
  //printing function
  const printDocument = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${reportData.details.firstName}_report`,
  });
  //setting subjects in useEffect to prevent renders(infine loop)
  useEffect(() => {
    if (reportData && reportData.subjects) {
      setSubjects(reportData.subjects);
    }
  },[reportData])
  return (
    <>
      <div ref={printRef} className="w-full max-w-5xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        {/* Header Section */}
        <section className="flex justify-between items-center border-b pb-4 mb-4">
          <img alt="school_logo" src={schoologo} className="h-28 w-28" />
          <div className="text-center">
            <h1 className="text-3xl font-extrabold">RICHKIDS PRIMARY SCHOOL</h1>
            <h2 className="text-xl font-medium">Premier Academy Ltd</h2>
            <p className="text-sm">Saddler Way, Naguru, P.O. Box 3673, Kampala Uganda</p>
            <p className="text-sm">Tel: (+254) 790 792533 | Email: info@kampalaparents.com</p>
            <p className="text-sm">Web: www.kampalaparents.com</p>
          </div>
        </section>

        {/* Report Title */}
        <h2 className="text-3xl font-semibold text-center mb-4">TERM III PROGRESSIVE REPORT</h2>

        {/* Student Details Section */}
        <section className="border p-4 mb-4 rounded-lg">
          <div className="flex justify-between">
            <img alt="student-photo" src={castroll} className="h-24 w-24 rounded-md border" />
            <div className="space-y-2">
              <p><strong>NAME:</strong> <span className="underline">{reportData.details.firstName}  {reportData.details.lastName}</span></p>
              <p><strong>AD NO:</strong> <span className="underline">{reportData.details.studentId}</span></p>
              <p><strong>CLASS:</strong> <span className="underline">2</span></p>
              <p><strong>SEX:</strong> <span className="underline">{reportData.details.gender}</span></p>
              <p><strong>AGE:</strong> <span className="underline">{reportData.details.age} years</span></p>
            </div>
            <div className="space-y-2">
              <p><strong>Print Date:</strong> <span className="underline">{day}/{month}/{year}</span></p>
              <p><strong>TERM:</strong> <span className="underline">III</span></p>
              <p><strong>YEAR:</strong> <span className="underline">{year}</span></p>
              <p><strong>Marks:</strong> <span className="border p-1">{reportData.totalMarks}</span></p>
              <p><strong>OUT OF:</strong> <span className="border p-1">54</span></p>
            </div>
          </div>
          <div className='flex gap-10 justify-center mt-5'>
            <p><strong>POSITION:</strong> <span className="border p-1">{reportData.position}</span></p>
            <p><strong>OUT OF:</strong> <span className="border p-1">54</span></p>
          </div>
        </section>

        {/* Subjects Performance Section */}
        <section className="border p-4 mb-4 rounded-lg">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">SUBJECTS</th>
                <th className="p-3">MARKS</th>
                <th className="p-3">GRADE</th>
                <th className="p-3">TEACHER'S REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length > 0 ? subjects.map((item, index) => {
                return <tr className="border-b" key={item.subject + index}>
                  <td className="p-3">{item.subject}</td>
                  <td className="p-3">{item.marks}</td>
                  <td className="p-3">{item.grade}</td>
                  <td className="p-3 text-green-700">{item.remarks}</td>
                </tr>
              }) : <tr className="border-b">
                <td className="p-3">N/A</td>
                <td className="p-3">N/A</td>
                <td className="p-3">N/A</td>
                <td className="p-3">N/A</td>
                <td className="p-3">N/A</td>
              </tr>}
            </tbody>
          </table>
        </section>

        {/* Remarks Section */}
        <section className="border p-4 mb-4 rounded-lg">
          <p><strong>Class Teacher's Remarks:</strong></p>
          <div className="flex justify-between mt-6">
            <p>NAME: <span>..................................</span></p>
            <p>SIGNATURE: <span>..................................</span></p>
          </div>

          <p className="mt-6"><strong>Principal's Remarks:</strong></p>
          <div className="flex justify-between mt-6">
            <p>NAME: <span>..................................</span></p>
            <p>SIGNATURE: <span>..................................</span></p>
          </div>
        </section>

        {/* Footer Section */}
        <section className="text-center">
          <p>Next term begins on: <span>..................................</span></p>
        </section>
      </div>
      <div className='flex items-center justify-center gap-28 mt-5'>
        <button
          onClick={printDocument}
          type="button"
          className="p-2 flex gap-2 items-center bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
        >
          Print ReportForm<IoMdPrint />
        </button>
      </div>
    </>

  );
}

export default ReportForms;
