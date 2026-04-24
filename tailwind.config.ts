/**
 * Tailwind CSS v4
 *
 * All theme customisation (colours, fonts, keyframes, animations) now lives
 * in the @theme block inside styles/globals.css.
 *
 * This file only needs to exist so tooling (e.g. the VS Code IntelliSense
 * extension) can discover the project. No "extend" object is required.
 */
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;
