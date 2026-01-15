'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.scss';
import '../../globals.scss';
import Link from 'next/link';
import {
  validateLogin,
  validatePasswordForLogin,
  validateLoginForm,
  LoginFormData,
  LoginFormErrors
} from '../../utils/validation';
import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Состояние формы
  const [formData, setFormData] = useState<LoginFormData>({
    login: '',
    password: ''
  });

  // Ошибки валидации
  const [errors, setErrors] = useState<LoginFormErrors>({});

  // Флаг показа пароля
  const [showPassword, setShowPassword] = useState(false);

  // Состояние отправки
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Троттлинг для отправки
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Валидация при потере фокуса
  const [touched, setTouched] = useState<Record<string, boolean>>({
    login: false,
    password: false
  });

  // Обработчик изменения полей
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Сбросить ошибку при изменении поля
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Обработчик потери фокуса
  const handleBlur = (field: keyof LoginFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let validationResult;

    switch (field) {
      case 'login':
        validationResult = validateLogin(formData.login);
        break;
      case 'password':
        validationResult = validatePasswordForLogin(formData.password);
        break;
    }

    if (!validationResult!.isValid) {
      setErrors(prev => ({ ...prev, [field]: validationResult!.message }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Получение класса для поля ввода
  const getInputClassName = (field: keyof LoginFormErrors) => {
    if (errors[field]) {
      return styles.error;
    }
    if (touched[field] && !errors[field] && formData[field]) {
      return styles.success;
    }
    return '';
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Проверка троттлинга (минимум 1 секунда между отправками)
    const now = Date.now();
    if (now - lastSubmitTime < 1000) {
      return;
    }
    setLastSubmitTime(now);

    // Валидация всей формы
    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Пометка всех полей как touched для показа ошибок
      setTouched({
        login: true,
        password: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.login, formData.password);

      // Сброс формы
      setFormData({
        login: '',
        password: ''
      });
      setErrors({});
      setTouched({
        login: false,
        password: false
      });

    } catch (error: any) {
      // Показываем ошибку в соответствующем поле или общую ошибку
      if (error.message.includes('пароль')) {
        setErrors(prev => ({ ...prev, password: error.message }));
      } else if (error.message.includes('email') || error.message.includes('логин')) {
        setErrors(prev => ({ ...prev, login: error.message }));
      } else {
        alert(error.message || 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <h1>Вход в аккаунт</h1>
          <p>Войдите, чтобы продолжить пользоваться сервисом</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="login" className={styles.required}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="login"
                name="login"
                type="email"
                value={formData.login}
                onChange={handleChange}
                onBlur={() => handleBlur('login')}
                className={getInputClassName('login')}
                placeholder="your@email.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
            {errors.login && (
              <div className={styles.errorMessage}>
                {errors.login}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordHeader}>
              <label htmlFor="password" className={styles.required}>
                Пароль
              </label>
            </div>

            <div className={styles.inputWrapper}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={getInputClassName('password')}
                placeholder="Введите ваш пароль"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {errors.password && (
              <div className={styles.errorMessage}>
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.submitButtonLoading}>
                <div className={styles.spinner}></div>
                Вход...
              </span>
            ) : (
              'Войти'
            )}
          </button>

          <div className={styles.registerLink}>
            Нет аккаунта?{' '}
            <Link href="/auth/signup">
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
