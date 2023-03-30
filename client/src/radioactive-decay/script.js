const socket = new WebSocket('ws://localhost:8080');

const form = document.getElementById('form');
const a = document.getElementById('a');
const u0 = document.getElementById('u0');
const T = document.getElementById('T');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const aValue = a.value;
  const u0Value = u0.value;
  const tValue = T.value;

  const digitOnlyRegex = /^[\d.]+$/;

  if (
    !(digitOnlyRegex.test(aValue) && digitOnlyRegex.test(u0Value) && digitOnlyRegex.test(tValue))
  ) {
    alert('Invalid input');
    return;
  }

  const payload = JSON.stringify({
    type: 'radioactive_decay',
    value: { a: aValue, u0: u0Value, T: tValue },
  });

  socket.send(payload);
});

socket.onmessage = function (event) {
  const response = JSON.parse(event.data);

  if (response.error) {
    alert('Invalid input');
    return;
  }

  const solution = response.value;

  setup(solution);
};

const setup = (solution) => {
  createCanvas(400, 400);
  // Create a new plot and set its position on the screen
  points = [];

  for (i = 0; i < solution[1].length; i++) {
    points[i] = new GPoint(solution[1][i], solution[0][i]);
  }
  const mytable = document.getElementById("table");
  mytable.style.display = 'table';
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = '';
  points.forEach(todo => {
    let newRow = document.createElement("tr");
    Object.values(todo).forEach((value) => {
      let cell = document.createElement("td");
      cell.innerText = value;
      newRow.appendChild(cell);
    })
    tableBody.appendChild(newRow);
  });

  plot = new GPlot(this);
  plot.setPos(0, 0);
  plot.setOuterDim(width, height);

  plot.setPoints(points);

  plot.setTitleText('Numerical solution');
  plot.getXAxis().setAxisLabelText('t');
  plot.getYAxis().setAxisLabelText('u');

  plot.defaultDraw();
};

function draw() {}
