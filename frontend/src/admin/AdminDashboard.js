import React, { useEffect, useState } from 'react'
import axios from "axios";
import StatsCard from '../components/StatsCard';
import { URL } from '../App';
import { FaUsers } from 'react-icons/fa';
import { BsQuestionDiamond } from "react-icons/bs";
import { GiTeacher, GiChart } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import ClassDistributionChart from "../admin/ClassDistributionChart.js";
import AgeDistribution from './AgeDistribution.js';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    trendDirection: 'neutral',
    trendPercentage: 0,
  })
  const [teacherStats, setTeacherStats] = useState({
    totalTeachers: 0,
    trendDirection: 'neutral',
    trendPercentage: 0,
  })
  const [users, setUsers] = useState({
    totalUsers: 0,
    trendDirection: "neutral",
    trendPercentage: 0,
  })
  const [classDistribution, setClassDistribution] = useState([]);
  const token = localStorage.getItem('token')
  console.log(token)
  if (!token) {
    navigate('/login')
  }
  //fetch students stats when component mounts
  useEffect(() => {
    const studentStats = async () => {
      try {
        const response = await axios.get(`${URL}/api/admin/student-stats`, {
          method: 'GET',
          headers: {
            'Content-Type': "application/json",
            'x-access-token': token
          }
        });
        if (response.status === 201) {
          setStats(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch student stats:', error);
      }
    }
    const teacherStats = async () => {
      try {
        const response = await axios.get(`${URL}/api/admin/teacher-stats`, {
          method: 'GET',
          headers: {
            'Content-Type': "application/json",
            'x-access-token': token
          }
        });
        if (response.status === 201) {
          setTeacherStats(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch student stats:', error);
      }
    }

    //fetching classdistribution
    const fetchDistribution = async () => {
      try {
        const response = await axios.get(`${URL}/api/admin/class-distribution`, {
          method: 'GET',
          headers: {
            'Content-Type': "application/json",
            'x-access-token': token
          }
        });
        if (response.status === 200) {
          setClassDistribution(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch student stats:', error);
      }
    }
    //fetching user stats
    const UserStats = async () => {
      try {
        const response = await axios.get(`${URL}/api/admin/total-users`, {
          method: 'GET',
          headers: {
            'Content-Type': "application/json",
            'x-access-token': token
          }
        });
        if (response.status === 201) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch student stats:', error);
      }
    }
    fetchDistribution()
    UserStats()
    studentStats()
    teacherStats()
  }, [token])
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='text-slate-200 flex gap-7'>
          <p className='font-semi-bold text-2xl'>Welcome admin</p> <span className='text-4xl'><GiChart /></span>
        </div>
        <div className='text-slate-200 flex items-center text-center gap-1'>Overview <BsQuestionDiamond /></div>
      </div>
      <div className="p-6 grid grid-cols-3 gap-6 mx-auto items-center justify-center">
        {/* Stats Cards */}
        <StatsCard title="Total Teachers" value={teacherStats.totalTeachers} icon={GiTeacher} trend={`${teacherStats.trendPercentage}%`} trendDirection={teacherStats.trendDirection} />
        <StatsCard title="Total Students" value={stats.totalStudents} icon={PiStudent} trend={`${stats.trendPercentage}%`} trendDirection={stats.trendDirection} />
        <StatsCard title="Total Users" value={users.totalUsers} icon={FaUsers} trend={`${users.trendPercentage}`} trendDirection={users.trendDirection} />
      </div>
      <div>
        {classDistribution.length > 0 ? (
          <div className='lg:flex'>
            <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto mb-8">
              <ClassDistributionChart classData={classDistribution} />
            </div>
            <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto">
              <AgeDistribution classData={classDistribution} />
            </div>
          </div>
        ) : (
          <p>Loading class distribution data...</p>
        )}

      </div>

    </div>
  )
}

export default AdminDashboard