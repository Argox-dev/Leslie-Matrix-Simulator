class LeslieSimulation {
    constructor(tableID, maxTime) {
        this.tableID = tableID;
        this.maxTime = maxTime;
    }

    update(p_maxTime) {
        p_maxTime = p_maxTime || this.maxTime;
        this.maxTime = p_maxTime;

        let lArray = Array.from({ length: p_maxTime }, (_, index) => Array.from({ length: p_maxTime }, (_, index) => 0));
        let nArray = Array.from({ length: p_maxTime }, (_, index) => 0);


        const table = document.getElementById(this.tableID);

        for (var i = 0; i < p_maxTime; i++) {
            const rowStr = "leslie-table-row-" + i;

            const year = Number(document.getElementById(rowStr + "-year").value);
            const numberFem = Number(document.getElementById(rowStr + "-numberfem").value);

            let survival = 0;
            if (i + 1 < p_maxTime) survival = Number(document.getElementById(rowStr + "-survival").value);

            const firtility = Number(document.getElementById(rowStr + "-firtility").value);

            nArray[i] = numberFem;

            lArray[0][i] = firtility;

            if (i < p_maxTime - 1) {
                lArray[i + 1][i] = survival;
            }

        }

        this.lMatrix = math.matrix(lArray);
        this.nVector = math.matrix(nArray);
    }

    getTotalPopulationAt(p_time) {
        
        let popVec = this.nVector;
        if (p_time != 0) math.multiply(math.pow(this.lMatrix, p_time-1), this.nVector).toArray();
        let population = 0;
        for (var i = 0; i < this.maxTime; i++) {
            population += popVec[i] * 2;
        }

        return population
    }
    renderGraph(p_length) {
        p_length = p_length || this.maxTime;

        let xValues = Array.from({ length: p_length + 1 }, (_, index) => index);
        let yValues = Array.from({ length: p_length + 1 }, (_, index) => simulation.getTotalPopulationAt(index));;


        new Chart("population-graph", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                    fill: false,
                    backgroundColor: "rgba(0,0,255,1.0)",
                    borderColor: "rgba(0,0,255,0.1)",
                    data: yValues
                }]
            },
            options: {
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: 0, max: yValues.max } }],
                },
                responsive: true
            }
        });
    }

}
class LeslieTable {

    constructor(length) {
        this.length = length
    }

    update(length) {
        let labelRowContent = document.getElementById("leslie-table-lable-row").innerHTML;

        const table = document.getElementById("leslie-table");
        table.innerHTML = "";

        const labelRow = document.createElement("tr");
        labelRow.id = "leslie-table-lable-row";
        labelRow.innerHTML = labelRowContent;
        table.appendChild(labelRow)

        for (var i = 0; i < length; i++) {
            const row = document.createElement("tr");
            row.id = "leslie-table-row-" + i;

            const yearColum = document.createElement("td");
            yearColum.id = "leslie-table-row-" + i + "-year";
            yearColum.innerHTML = i;
            row.appendChild(yearColum);

            const popColum = document.createElement("td");
            const popInput = document.createElement("input");
            popInput.type = "number";
            popInput.id = "leslie-table-row-" + i + "-numberfem";
            popInput.onchange = () => { update() };
            popColum.appendChild(popInput);
            row.appendChild(popColum);

            const survColum = document.createElement("td");
            const survInput = document.createElement("input");
            survInput.type = "number";
            survInput.id = "leslie-table-row-" + i + "-survival";
            survInput.onchange = () => { update() };
            survColum.appendChild(survInput);
            row.appendChild(survColum);
            if (!(i + 1 < length)) survColum.innerHTML = 0;

            const fertColum = document.createElement("td");
            const fertInput = document.createElement("input");
            fertInput.type = "number";
            fertInput.id = "leslie-table-row-" + i + "-firtility";
            fertInput.onchange = () => { update() };
            fertColum.appendChild(fertInput);
            row.appendChild(fertColum);

            table.appendChild(row);
        }


        let inputs = [];

        for (var i = 0; i < length; i++) {
            const rowStr = "leslie-table-row-" + i;

            const numberFem = document.getElementById(rowStr + "-numberfem");
            const survival = document.getElementById(rowStr + "-survival");
            const firtility = document.getElementById(rowStr + "-firtility");

            inputs.push(numberFem);
            inputs.push(survival);
            inputs.push(firtility);
        }

        this.inputs = inputs;
        this.length = length;

    }
}


const table = new LeslieTable(3);
const simulation = new LeslieSimulation("leslie-table", 3);



const scaleInput = document.getElementById("timescale-slider");
const tableLengthInput = document.getElementById("table-length-picker");
let currentTableLength = 3;
function update() {
    simulation.update(currentTableLength);
    simulation.renderGraph(Number(scaleInput.value));
}
function updateLength() {
    currentTableLength = tableLengthInput.value;
    table.update(currentTableLength);
    simulation.update(tableLengthInput.value);
};

scaleInput.addEventListener("input", update);
tableLengthInput.addEventListener("input", updateLength);

updateLength();
update();
