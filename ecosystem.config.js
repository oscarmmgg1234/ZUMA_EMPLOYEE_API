module.exports = {
  apps: [
    {
      name: "Employee API",
      script: "index.js",
      cron_restart: "0 2 * * *", // Restart at 2:00 AM every day
      // Other configurations like instances, exec_mode etc.
    },
  ],
};