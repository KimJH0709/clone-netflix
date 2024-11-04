module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  plugins: [
    'vue',
  ],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'], // 세미콜론을 항상 추가
    'comma-dangle': ['error', 'always-multiline'], // 여러 줄에서 쉼표 필요
    'no-console': 'off', // console 사용 허용
    'no-alert': 'off', // alert 사용 허용
    'vue/multi-word-component-names': 'off', // 다단어 컴포넌트 이름 규칙 사용 안 함
  },
};
