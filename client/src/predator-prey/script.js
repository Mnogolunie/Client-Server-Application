const socket = new WebSocket('ws://localhost:8080');

const form = document.getElementById('form');
const r = document.getElementById('r');
const m = document.getElementById('m');
const a = document.getElementById('a');
const b = document.getElementById('b');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const rValue = r.value;
  const mValue = m.value;
  const aValue = a.value;
  const bValue = b.value;

  const digitOnlyRegex = /^[\d.]+$/;

  if (
    !(
      digitOnlyRegex.test(rValue) &&
      digitOnlyRegex.test(mValue) &&
      digitOnlyRegex.test(aValue) &&
      digitOnlyRegex.test(bValue)
    )
  ) {
    alert('Invalid input');
    return;
  }

  const payload = JSON.stringify({
    type: 'predator_prey',
    value: { r: rValue, m: mValue, a: aValue, b: bValue },
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
  createCanvas(800, 400);
  pointsx = [];
  pointsy = [];

  for (i = 0; i < solution[1].length; i++) {
    pointsx[i] = new GPoint(solution[1][i], solution[0][i][0]);
    pointsy[i] = new GPoint(solution[1][i], solution[0][i][1]);
  }
  const mytable = document.getElementById("table");
  mytable.style.display = 'table';
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = '';
  pointsx.forEach(todo => {
    let newRow = document.createElement("tr");
    Object.values(todo).forEach((value) => {
      let cell = document.createElement("td");
      cell.innerText = value;
      newRow.appendChild(cell);
    })
    tableBody.appendChild(newRow);
  });

  plotx = new GPlot(this);
  plotx.setPos(0, 0);
  plotx.setOuterDim(width / 2, height);

  plotx.setPoints(pointsx);

  plotx.setTitleText('Prey population dynamics');
  plotx.getXAxis().setAxisLabelText('t');
  plotx.getYAxis().setAxisLabelText('x(t)');

  plotx.defaultDraw();

  ploty = new GPlot(this);
  ploty.setPos(400, 0);
  ploty.setOuterDim(width / 2, height);

  ploty.setPoints(pointsy);

  ploty.setTitleText('Predator population dynamics');
  ploty.getXAxis().setAxisLabelText('t');
  ploty.getYAxis().setAxisLabelText('y(t)');

  ploty.defaultDraw();
};

function draw() {}
