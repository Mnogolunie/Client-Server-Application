const forwardEuler = (f, T0, dt, t0, tf, callback) => {
  const n = Math.floor((tf - t0) / dt);
  const T = new Array(n).fill(null).map(() => []);
  const t = new Array(n).fill(null).map(() => []);

  T[0] = T0;
  t[0] = t0;

  let index = 1;

  for (let i = 1; i < n + 1; i++) {
    t[i] = t[i - 1] + dt;
    T[i] = [];

    for (let j = 0; j < T0.length; j++) {
      T[i][j] = T[i - 1][j] + dt * f(T[i - 1], t[i - 1])[j];

      callback([T, t], index++);
    }
  }
};

export const solvePredatorPrey = (r, m, a, b, callback) => {
  function D(sys, t) {
    const x = sys[0];
    const y = sys[1];

    return [r * x - a * x * y, -m * y + b * x * y];
  }

  forwardEuler(D, [1, 1], 0.1, 0, 20, callback);
};
