function getEnv() {
  return {
    JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
    JWT_DOWNLOAD_SECRET: process.env.JWT_DOWNLOAD_SECRET || process.env.JWT_SECRET || 'dev_secret',
    FRONTEND_PUBLIC_URL: process.env.FRONTEND_PUBLIC_URL || 'http://localhost:5173',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || '587',
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads'
  };
}

module.exports = { getEnv };
