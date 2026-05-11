const js = require("@eslint/js");
const globals = require("globals");
const prettierConfig = require("eslint-config-prettier");
const importPlugin = require("eslint-plugin-import"); // 👈 أضفنا هذا

module.exports = [
  js.configs.recommended,
  prettierConfig,
  {
    plugins: {
      import: importPlugin, // 👈 تعريف الـ plugin
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^next$" }],
      "no-console": "off",
      "no-undef": "error",
     
      // 👇 قوانين التحقق من المسارات (هذه ما تحتاجه بالضبط)
      "import/no-unresolved": "error", // يضع خطاً أحمر لو المسار خطأ
      "import/named": "error", // يتأكد أنك تستدعي شيئاً موجوداً فعلياً داخل الملف
      "import/no-self-import": "error", // يمنع الملف من استدعاء نفسه
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".json"],
        },
      },
    },
  },
  {
    ignores: ["node_modules/", ".env", "*.log"],
  },
];
