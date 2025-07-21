module.exports = {
  apps: [
    {
      name: "Employee API",
      script: "index.js",
      exec_mode: "fork", // Restart at 2:00 AM every day
      // Other configurations like instances, exec_mode etc.
      wait_ready: true,
      post_delay: 15000,
    },
  ],
};
