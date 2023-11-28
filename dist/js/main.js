
const date = document.querySelector(".date");
let now = new Date();
let day = now.getUTCDate() < 10 ? `0${now.getUTCDate()}` : `${now.getUTCDate()}`;
let month = now.getUTCMonth()+1 < 10 ? `0${now.getUTCMonth()+1}` : `${now.getUTCMonth()+1}`;
date.innerHTML = `${day}-${month}-${now.getFullYear()}`;

const mainUrl = "https://disease.sh/v3/covid-19";

const infected = document.querySelector(".all-infected .number");
const tInfected = document.querySelector(".today-infected .number");
const deaths = document.querySelector(".all-deaths .number");
const tDeaths = document.querySelector(".today-deaths .number");
const recovered = document.querySelector(".all-recovered .number");
const active = document.querySelector(".today-active .number");


async function getData(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}


// Chart function
let main = (res) => {
    let chart = new CanvasJS.Chart("myChart", {
        animationEnabled: true,
        backgroundColor: "#FAFAFA",
        legend: {
            horizontalAlign: "center", // left, center ,right 
            verticalAlign: "top",  // top, center, bottom
            itemWidth: 200
        },
        axisY: {
            labelAutoFit: true
        },
        data : [{
                type : "line",
                showInLegend: true, 
                legendText: "Infected",
                dataPoints : res[0]
            },{
                type : "line",
                showInLegend: true, 
                legendText: "Deaths",
                dataPoints : res[1]
            },{
                type : "line",
                showInLegend: true, 
                legendText: "Recovered",
                dataPoints : res[2]
            },      
        ]
    });
    chart.render();
}

// To clear time series
function clear(dataset){
    dataset.sort(function(a, b) {
        let x = new Date(a.label);
        let y = new Date(b.label);
        return y>x ? -1 : y<x ? 1 : 0;
    });
        
    for(let i=0;i < dataset.length - 1; i++){
        if(dataset[i].label == dataset[i+1].label){
            dataset[i+1].y += dataset[i].y;
            dataset.splice(i, 1);
            i--;
        }
    }
}

// To get world data
getWorldHistorical = async() => {
    const hist = await getData(`${mainUrl}/historical`);
    let casesData = [];
    let deathsData = [];
    let recoveredData = [];
    hist.forEach(i => {
        Object.entries(i.timeline.cases).forEach(j => casesData.push({label: j[0], y: j[1]}));
        Object.entries(i.timeline.deaths).forEach(j => deathsData.push({label: j[0], y: j[1]}));
        Object.entries(i.timeline.recovered).forEach(j => recoveredData.push({label: j[0], y: j[1]}));
    });
    
    clear(casesData);
    clear(deathsData);
    clear(recoveredData);

    return [casesData, deathsData, recoveredData];
}

const country = document.querySelector("#country");
// To save data
if(localStorage['country']){
    let a = localStorage['country'];
    let b = country.options[a].setAttribute("selected", "");
}

// To get historical data
getHistorical = async (c) => {
    const hist = await getData(`${mainUrl}/historical`);
    let cArr = [];
    let casesData = [];
    let deathsData = [];
    let recoveredData = [];
    hist.forEach(i => {
        if(i.country == c){
            cArr.push(i);
        }
    });

    cArr.forEach(i => {
        Object.entries(i.timeline.cases).forEach(j => casesData.push({label: j[0], y: j[1]}));
        Object.entries(i.timeline.deaths).forEach(j => deathsData.push({label: j[0], y: j[1]}));
        Object.entries(i.timeline.recovered).forEach(j => recoveredData.push({label: j[0], y: j[1]}));
    })

    if(cArr.length > 1){
        clear(casesData);
        clear(deathsData);
        clear(recoveredData);
    }
    
    return [casesData, deathsData, recoveredData];
}

// To start cycle
let first = country.onchange = async () => {
    let data;
    localStorage['country'] = country.options[country.selectedIndex].index;
    let c = country.options[country.selectedIndex].value;

    if(c == "Global"){
        data = await getData(`${mainUrl}/all`);
        getWorldHistorical().then(res => main(res));
        
    }else{
        data = await getData(`${mainUrl}/countries/${c}`);
        getHistorical(c).then(res => main(res));
    }

    infected.innerHTML = data.cases;
    tInfected.innerHTML = data.todayCases;
    deaths.innerHTML = data.deaths;
    tDeaths.innerHTML = data.todayDeaths;
    recovered.innerHTML = data.recovered;
    active.innerHTML = data.active;
};

first();


