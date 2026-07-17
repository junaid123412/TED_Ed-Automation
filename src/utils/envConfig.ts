import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.BASE_URL || 'https://teded-integration.herokuapp.com/';
const headless = process.env.HEADLESS?.toLowerCase() !== 'false';
const isCI = process.env.CI === 'true' || process.env.CI === '1';
const retries = isCI ? 1 : 0;
const basicAuthUsername = process.env.HTTP_AUTH_USERNAME || 'teduser';
const basicAuthPassword = process.env.HTTP_AUTH_PASSWORD || 'tUeygHu@4q';
const tedLoginEmail = process.env.TED_LOGIN_EMAIL || 'junaid.hussain+1@kualitatem.com';
const tedLoginPassword = process.env.TED_LOGIN_PASSWORD || 'test@112233';

export const envConfig = {
  baseUrl,
  headless,
  isCI,
  retries,
  basicAuthUsername,
  basicAuthPassword,
  tedLoginEmail,
  tedLoginPassword,
};
