'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signup.module.scss';
import '../../globals.scss';
import Link from 'next/link';
import {
  FormData,
  FormErrors,
  validateForm,
  validateNickname,
  validateLogin,
  validatePassword,
  validateConfirmPassword,
  checkPasswordRequirements
} from '../../utils/validation';
import { useAuth } from '@/src/contexts/AuthContext';

export default function RegisterPage() {
  const { register, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Состояние формы
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    login: '',
    password: '',
    confirmPassword: ''
  });

  // Ошибки валидации
  const [errors, setErrors] = useState<FormErrors>({});

  // Флаги показа пароля
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Состояние отправки
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Троттлинг для отправки
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Валидация при потере фокуса
  const [touched, setTouched] = useState<Record<string, boolean>>({
    nickname: false,
    login: false,
    password: false,
    confirmPassword: false
  });

  // Обработчик изменения полей
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Сбросить ошибку при изменении поля
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Обработчик потери фокуса
  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let validationResult;

    switch (field) {
      case 'nickname':
        validationResult = validateNickname(formData.nickname);
        break;
      case 'login':
        validationResult = validateLogin(formData.login);
        break;
      case 'password':
        validationResult = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        validationResult = validateConfirmPassword(formData.password, formData.confirmPassword);
        break;
    }

    if (!validationResult!.isValid) {
      setErrors(prev => ({ ...prev, [field]: validationResult!.message }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Проверка требований к паролю
  const passwordRequirements = checkPasswordRequirements(formData.password);

  // Получение класса для поля ввода
  const getInputClassName = (field: keyof FormErrors) => {
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
    const validation = validateForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Пометка всех полей как touched для показа ошибок
      setTouched({
        nickname: true,
        login: true,
        password: true,
        confirmPassword: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);

      // Сброс формы
      setFormData({
        nickname: '',
        login: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      setTouched({
        nickname: false,
        login: false,
        password: false,
        confirmPassword: false
      });

    } catch (error: any) {
      console.error('Ошибка регистрации:', error);

      // Обработка ошибок с сервера
      if (error.message.includes('email') || error.message.includes('логин')) {
        setErrors(prev => ({ ...prev, login: error.message }));
      } else if (error.message.includes('никнейм')) {
        setErrors(prev => ({ ...prev, nickname: error.message }));
      } else if (error.message.includes('пароль')) {
        setErrors(prev => ({ ...prev, password: error.message }));
      } else {
        console.error(error)
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.header}>
          <h1>Создать аккаунт</h1>
          <p>Зарегистрируйтесь, чтобы начать пользоваться сервисом</p>
        </div>

        <form className={styles.registerForm} onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="nickname" className={styles.required}>
              Никнейм
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleChange}
                onBlur={() => handleBlur('nickname')}
                className={getInputClassName('nickname')}
                placeholder="Придумайте никнейм"
                disabled={isSubmitting}
                autoComplete="username"
              />
            </div>
            {errors.nickname && (
              <div className={styles.errorMessage}>
                {errors.nickname}
              </div>
            )}
          </div>

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
            <label htmlFor="password" className={styles.required}>
              Пароль
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={getInputClassName('password')}
                placeholder="Придумайте надежный пароль"
                disabled={isSubmitting}
                autoComplete="new-password"
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

            <div className={styles.passwordRequirements}>
              <h4>Требования к паролю:</h4>
              <ul>
                <li className={passwordRequirements.minLength ? styles.valid : styles.invalid}>
                  Минимум 8 символов
                </li>
                <li className={passwordRequirements.hasUppercase ? styles.valid : styles.invalid}>
                  Хотя бы одна заглавная буква
                </li>
                <li className={passwordRequirements.hasNumber ? styles.valid : styles.invalid}>
                  Хотя бы одна цифра
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.required}>
              Подтверждение пароля
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                className={getInputClassName('confirmPassword')}
                placeholder="Повторите пароль"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {errors.confirmPassword && (
              <div className={styles.errorMessage}>
                {errors.confirmPassword}
              </div>
            )}

            {formData.confirmPassword && !errors.confirmPassword && (
              <div className={`${styles.passwordMatch} ${
                formData.password === formData.confirmPassword ? styles.match : styles.mismatch
              }`}>
                {formData.password === formData.confirmPassword ? "✓ Пароли совпадают" : "✗ Пароли не совпадают"}
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
                Регистрация...
              </span>
            ) : (
              'Зарегистрироваться'
            )}
          </button>

          <div className={styles.loginLink}>
            Уже есть аккаунт?{' '}
            <Link href="/auth/login">
              Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
