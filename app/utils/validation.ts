export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface FormData {
  nickname: string;
  login: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  nickname?: string;
  login?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateNickname = (nickname: string): ValidationResult => {
  if (!nickname.trim()) {
    return { isValid: false, message: 'Никнейм обязателен' };
  }

  if (nickname.length < 3) {
    return { isValid: false, message: 'Ник должен содержать минимум 3 символа' };
  }

  if (nickname.length > 20) {
    return { isValid: false, message: 'Ник должен содержать максимум 20 символов' };
  }

  if (!/^[а-яА-Яa-zA-Z0-9]+$/.test(nickname)) {
    return { isValid: false, message: 'Ник может содержать только буквы и цифры' };
  }

  return { isValid: true, message: '' };
};

export const validateLogin = (login: string): ValidationResult => {
  if (!login.trim()) {
    return { isValid: false, message: 'Email обязателен' };
  }

  if (login.length < 3) {
    return { isValid: false, message: 'Email должен содержать минимум 3 символа' };
  }

  if (login.length > 50) {
    return { isValid: false, message: 'Email должен содержать максимум 50 символов' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(login)) {
    return { isValid: false, message: 'Введите корректный email' };
  }

  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Пароль обязателен' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Пароль должен содержать минимум 8 символов' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы одну заглавную букву' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы одну цифру' };
  }

  return { isValid: true, message: '' };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Подтверждение пароля обязательно' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Пароли не совпадают' };
  }

  return { isValid: true, message: '' };
};

export const checkPasswordRequirements = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password)
  };
};

export const validateForm = (formData: FormData): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  const nicknameValidation = validateNickname(formData.nickname);
  if (!nicknameValidation.isValid) {
    errors.nickname = nicknameValidation.message;
  }

  const loginValidation = validateLogin(formData.login);
  if (!loginValidation.isValid) {
    errors.login = loginValidation.message;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};


export interface LoginFormData {
  login: string;
  password: string;
}

export interface LoginFormErrors {
  login?: string;
  password?: string;
}

export const validatePasswordForLogin = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Пароль обязателен' };
  }
  return { isValid: true, message: '' };
};

export const validateLoginForm = (formData: LoginFormData): { isValid: boolean; errors: LoginFormErrors } => {
  const errors: LoginFormErrors = {};

  const loginValidation = validateLogin(formData.login);
  if (!loginValidation.isValid) {
    errors.login = loginValidation.message;
  }

  const passwordValidation = validatePasswordForLogin(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
