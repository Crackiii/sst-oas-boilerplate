// eslint.config.js  (Flat-config style)
import js from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import * as tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', '.next', 'out', 'eslint.config.js', '.sst']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd()
      },
      sourceType: 'module'
    },
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      '@typescript-eslint': tseslint.plugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          quoteProps: 'as-needed',
          trailingComma: 'none',
          bracketSpacing: true,
          semi: false,
          useTabs: false,
          proseWrap: 'never'
        }
      ],

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Padding between statements
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var']
        },
        { blankLine: 'always', prev: '*', next: 'return' }
      ],

      // TypeScript-specific
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }
      ]
    }
  }
]
