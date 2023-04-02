export default (() => {
  if (env) {
    // fill process.env.xxx to env
    Object.entries(process.env).forEach(([k, v]) => {
      (env[k] == "" || env[k] == null || env[k] == void 0) && (env[k] = v);
    });
  }
})();
