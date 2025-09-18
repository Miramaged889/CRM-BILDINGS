import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';

const StaffMaintenance = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('nav.maintenance')} (Staff View)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Staff maintenance view - Coming soon!
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default StaffMaintenance;