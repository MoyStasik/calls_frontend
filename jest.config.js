// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Укажите путь к Next.js приложению
  dir: './',
});

// Добавьте любую пользовательскую конфигурацию Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Обработка алиасов путей, если используете
    '^@/(.*)$': '<rootDir>/$1',
    // Обработка CSS модулей
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Обработка статических файлов
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
  ],
};

// createJestConfig экспортируется так, чтобы next/jest мог загрузить конфигурацию Next.js
module.exports = createJestConfig(customJestConfig);
