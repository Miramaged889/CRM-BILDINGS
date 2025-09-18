import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/authStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import ThemeToggle from "../../components/ui/ThemeToggle";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";
import Icon from "../../components/ui/Icon";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success(t("auth.welcome"));
    } else {
      toast.error(t("auth.invalidCredentials"));
    }
  };

  const fillCredentials = (email, password) => {
    setValue("email", email, { shouldValidate: true, shouldDirty: true });
    setValue("password", password, { shouldValidate: true, shouldDirty: true });
    toast.success("Credentials filled!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4"
            >
              <Icon name="Building" className="h-8 w-8 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
              {t("auth.welcome")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400"
            >
              {t("auth.subtitle")}
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <Input
              label={t("auth.email")}
              type="email"
              {...register("email", { required: true })}
              value={watch("email") || ""}
              error={errors.email && "Email is required"}
              placeholder="manager@realestate.com"
            />

            <Input
              label={t("auth.password")}
              type="password"
              {...register("password", { required: true })}
              value={watch("password") || ""}
              error={errors.password && "Password is required"}
              placeholder="manager123"
            />

            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              {t("auth.loginButton")}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
              Demo Credentials - Click to fill:
            </p>
            <div className="space-y-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  fillCredentials("manager@realestate.com", "manager123")
                }
                className="p-2 bg-white dark:bg-gray-600 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-500 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-200 hover:shadow-sm"
              >
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <strong className="text-primary-600 dark:text-primary-400">
                    Manager:
                  </strong>
                  <span className="ml-1">
                    manager@realestate.com / manager123
                  </span>
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  fillCredentials("staff@realestate.com", "staff123")
                }
                className="p-2 bg-white dark:bg-gray-600 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-500 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-200 hover:shadow-sm"
              >
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <strong className="text-primary-600 dark:text-primary-400">
                    Staff:
                  </strong>
                  <span className="ml-1">staff@realestate.com / staff123</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
