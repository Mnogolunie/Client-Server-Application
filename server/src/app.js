import { WebSocketServer } from 'ws';
import { solvePredatorPrey } from './equations/predator-prey.js';
import { solveRadioactiveDecay } from './equations/radioactive-decay.js';
import { solveFishery } from './equations/fishery.js';

const wss = new WebSocketServer({ port: 8080 });

const digitOnlyRegex = /^[\d.]+$/;

const sendError = (ws) => {
  ws.send(JSON.stringify({ error: 'Invalid input' }));
};

const sendSuccess = (ws, value, index) => {
  const copy = JSON.parse(JSON.stringify(value));

  setTimeout(() => {
    ws.send(JSON.stringify({ value: copy }));
  }, 100 * index);
};

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    const { type, value } = JSON.parse(data);

    switch (type) {
      case 'predator_prey': {
        /**
         * r = 1
         * m = 1
         * a = 0.3
         * b = 0.2
         */
        const { r, m, a, b } = value;

        if (
          !(
            digitOnlyRegex.test(r) &&
            digitOnlyRegex.test(m) &&
            digitOnlyRegex.test(a) &&
            digitOnlyRegex.test(b)
          )
        ) {
          return sendError();
        }

        solvePredatorPrey(+r, +m, +a, +b, (value, index) => sendSuccess(ws, value, index));

        break;
      }

      case 'radioactive_decay': {
        /**
         * a = Math.log(2) / 5600
         * u0 = 1
         * T = 20000
         */
        const { a, u0, T } = value;

        if (!(digitOnlyRegex.test(a) && digitOnlyRegex.test(u0) && digitOnlyRegex.test(T))) {
          return sendError();
        }

        solveRadioactiveDecay(+a, +u0, +T, (value, index) => sendSuccess(ws, value, index));

        break;
      }

      case 'fishery': {
        /**
         * x0 = 500
         * q = 0.1
         */
        const { x0, q } = value;

        if (!(digitOnlyRegex.test(x0) && digitOnlyRegex.test(q))) {
          return sendError();
        }

        solveFishery(+x0, +q, (value, index) => sendSuccess(ws, value, index));

        break;
      }
    }
  });
});
