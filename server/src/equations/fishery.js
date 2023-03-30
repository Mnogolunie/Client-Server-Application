function forwardEuler(f, x0, dt, t0, tf, E, callback) {
  const n = Math.floor((tf - t0) / dt);
  const x = new Array(n);
  const t = new Array(n);

  x[0] = x0;
  t[0] = t0;

  for (let i = 1; i < n + 1; i++) {
    t[i] = t[i - 1] + dt;
    x[i] = x[i - 1] + dt * f(x[i - 1], t[i - 1], E);

    callback([x, t]);
  }
}

export const solveFishery = (x0, q, callback) => {
  function D(x, t, E) {
    return (x * (1 - x / 100)) / 10 - q * x * E;
  }

  const soln = [
    [
      [[], []],
      [[], []],
    ],
    [
      [[], []],
      [[], []],
    ],
  ];

  let index = 1;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      forwardEuler(D, x0, 0.1, 0, 10, 0.05 * Math.pow(10, 2 * i + j), (value) => {
        soln[i][j] = value;
        callback(soln, index++);
      });
    }
  }
};
