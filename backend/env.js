/**
 * env.js — Must be the FIRST import in server.js
 * Loads environment variables from .env before any other module
 * reads from process.env.
 *
 * Why a separate file?
 * In ES modules, all static `import` statements are hoisted and evaluated
 * before any top-level code runs. This means if we write:
 *
 *   dotenv.config();          ← This runs AFTER...
 *   import './config/passport.js';  ← ...this is already evaluated
 *
 * By putting dotenv.config() in its own module that is imported FIRST,
 * Node evaluates it before evaluating any other imported module.
 */

import dotenv from 'dotenv';
dotenv.config();
