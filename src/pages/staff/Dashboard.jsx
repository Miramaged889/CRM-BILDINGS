import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';

const StaffDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'My Assigned Units',
      value: '42',
      change: 'Under my management',
      changeType: 'neutral',
      icon: 'Building',
      color: 'primary'
    },
    {
      title: 'Pending Tasks',
      value: '8',
      change: '3 due today',
      changeType: 'negative',
      icon: 'Clock',
      color: 'yellow'
    },
    {
      title: 'Payments Collected',
      value: '$28,400',
      change: 'This month',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'green'
    },
    {
      title: 'Maintenance Requests',
      value: '5',
      change: '2 completed today',
      changeType: 'positive',
      icon: 'Wrench',
      color: 'blue'
    }
  ];

  const chartData = [
    { day: 'Mon', collections: 2400 },
    { day: 'Tue', collections: 3200 },
    { day: 'Wed', collections: 1800 },
    { day: 'Thu', collections: 4100 },
    { day: 'Fri', collections: 3600 },
    { day: 'Sat', collections: 2800 },
    { day: 'Sun', collections: 1500 },
  ];

  const recentTasks = [
    { id: 1, task: 'Collect rent from Unit A-205', priority: 'high', due: 'Today' },
    { id: 2, task: 'Schedule maintenance for Unit B-101', priority: 'medium', due: 'Tomorrow' },
    { id: 3, task: 'Follow up payment with John Smith', priority: 'high', due: 'Today' },
    { id: 4, task: 'Prepare monthly report', priority: 'low', due: 'This week' },
    { id: 5, task: 'Unit inspection - C-302', priority: 'medium', due: 'Tomorrow' },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('dashboard.welcome')}, {user?.name}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            {t('dashboard.recordPayment')}
          </Button>
          <Button size="sm">
            View Calendar
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Collections
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="collections" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="sm">
              Record Payment
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Schedule Visit
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Report Issue
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              View Calendar
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Tasks
        </h3>
        <div className="space-y-4">
          {recentTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.task}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Due: {task.due}
                </p>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <Button size="sm" variant="outline">
                  Complete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StaffDashboard;