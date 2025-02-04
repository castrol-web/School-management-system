import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { URL } from '../App';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { css } from '@emotion/react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

function Analytics() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [mse, setMse] = useState(null);
  const [improvementTrend, setImprovementTrend] = useState(null);
  const [classAnalytics, setClassAnalytics] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Ensure the user is logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetching students data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true)
        const response = await axios.get(`${URL}/api/teacher/students-analytics`, {
          headers: {
            'content-Type': 'application/json',
            'x-access-token': token,
          },
        });
        if (response.status === 201) {
          setStudentData(response.data);
          console.log('Response Data:', response.data); // Debugging response data
        }
      } catch (error) {
        console.error('Error fetching students data:', error);
        setError('Error fetching student data. Please try again later.');
      } finally {
        setFetching(false)
      }
    };
    fetchData();
  }, [token]);

  const handlePredict = async () => {
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:5000/predict', studentData);
      console.log('Prediction Response:', response.data); // Debugging prediction response
      setPredictions(response.data.predictions || []);
      setMse(response.data.mse);
      setImprovementTrend(response.data.improvement_trend);
      setClassAnalytics(response.data.subject_analytics || []); // Safeguard for undefined data
      setStudentProgress(response.data.student_progress || []); // Safeguard for undefined data
    } catch (error) {
      console.error('Error predicting marks:', error);
      setError('Error predicting marks. Please try again later.');
    } finally {
      setLoading(false)
    }
  };

  // Data for Bar chart (subject-wise performance analysis)
  const chartDataBar = {
    labels: classAnalytics.length > 0 ? classAnalytics.map((subject) => subject.subject_name) : [],
    datasets: [
      {
        label: 'Average Marks by Subject',
        data: classAnalytics.length > 0 ? classAnalytics.map((subject) => subject.avg_marks) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for Line chart (student performance trend over time)
  const chartDataLine = {
    labels: studentProgress.length > 0 && studentProgress[0].exam_dates ? studentProgress[0].exam_dates : [], // Ensure we have exam_dates
    datasets: studentProgress.length > 0
      ? studentProgress.map((student, index) => ({
        label: `Student ${index + 1}`,
        data: student.marks || [], // Ensure marks are available
        fill: true,
        borderColor: `hsl(${(index * 60) % 360}, 100%, 50%)`,
        tension: 0.1,
      }))
      : [],
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Student Performance Analytics</h1>
        <p className="text-lg text-gray-600">Analyze student performance, identify trends, and take proactive actions for improvement.</p>
      </header>

      <div className="space-y-10">
        {/* Predict Button */}
        {fetching ? <div className="flex justify-center py-5">
          <FadeLoader
            color={'#36d7b7'}
            css={override}
            size={100}
          />
        </div> : <div className="text-center">
          <button
            disabled={loading && fetching}
            onClick={handlePredict}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            {loading ? 'Predicting...' : "Predict Marks & Analyze"}
          </button>
        </div>}

        {/* Error Handling */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg shadow-md">
            <p>{error}</p>
          </div>
        )}

        {/* Predictions and MSE */}
        {predictions.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Predictions and Results</h2>
            <div className="space-y-4">
              {predictions.map((pred, index) => (
                <div key={index} className="flex justify-between text-lg">
                  <span>Predicted Marks for Student {index + 1}:</span>
                  <span className="font-semibold">{pred}</span>
                </div>
              ))}
            </div>
            <h3 className="text-xl mt-6 font-semibold">Mean Squared Error (MSE): {mse}</h3>
            {improvementTrend !== null && (
              <h3 className="text-xl mt-4 font-semibold">
                Improvement Trend: {improvementTrend >= 0 ? 'Improving' : 'Declining'}
              </h3>
            )}
          </div>
        )}

        {/* Subject-wise Analytics (Bar Chart) */}
        {classAnalytics.length > 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Class Performance by Subject</h2>
            <div className="max-w-full sm:max-w-4xl mx-auto">
              <Bar data={chartDataBar} options={{ responsive: true }} />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">No subject performance data available.</div>
        )}

        {/* Student Progress Trend (Line Chart) */}
        {studentProgress.length > 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Progress Over Time</h2>
            <div className="max-w-full sm:max-w-4xl mx-auto">
              <Line data={chartDataLine} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">No student progress data available.</div>
        )}
      </div>
    </div>
  );
}

// CSS override for the loading spinner
const override = css`
  display: block;
  margin: 0 auto;
`;

export default Analytics;
