const forwardEuler = (f, u0, dt, t0, tf, callback) => {
  const n = Math.floor((tf - t0) / dt);
  const u = new Array(n);
  const t = new Array(n);

  u[0] = u0;
  t[0] = t0;

  let index = 1;

  for (let i = 1; i < n + 1; i++) {
    t[i] = t[i - 1] + dt;
    u[i] = u[i - 1] + dt * f(u[i - 1], t[i - 1]);

    callback([u, t], index++);
  }
};

/**
 * @see https://math24.net/radioactive-decay.html
 */
export const solveRadioactiveDecay = (a, u0, T, callback) => {
  function D(u, t) {
    return -a * u;
  }

  forwardEuler(D, u0, 500, 0, T, callback);
};
