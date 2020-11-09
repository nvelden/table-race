
//Run once at start of script

//Table names to construct headers
const tableNames = d3.keys(data[0]).slice(0,-1);

//Date values to cycle through data
const tableDates = data
.map(d=> d["date"])
const uniqDates = tableDates
.filter(function(elem, pos) {
  return tableDates.indexOf(elem) == pos;
});

const table = div.append('div')
.attr('id', 'divTable')
.style('display', 'flex')
.style('flex-direction', 'column')
.style('justify-content', 'space-between');

const columnContainer = table.append('div')
.attr('id', 'head')
.style('display', 'flex');

const columns = columnContainer
.selectAll('div')
.data(options.colNames)
.enter()
.append('div')
.attr('id', d => `column-${d}`)
.attr('class', 'column');

const head = columns
.append('div')
.text(d => d)
.attr('id', d => `head-${d}`)
.attr('class', 'head');

const cellContainer = columns
.append('div')
.attr('id', d => `cellCont-${d}`)
.attr('class', 'cellContainer');


// var body = divTable.append('div')
// .style('display', 'flex')
// .attr('id', 'body')
// .attr('class', 'bodyColumns');
//
// var bodyColumns = body
// .selectAll('div')
// .data(tableNames)
// .enter()
// .append('div')
// .attr('id', d => `Body-${d}`)
// .attr('class', 'headColumns');

r2d3.onRender(function(data, div, width, height, options) {
//constants
const dataSel = data
 .filter( d => d.date == options.dateInput);
// const namesData = data
//  .map(d=> d["name"]);
const maxDeaths = d3.max(data, d => d.deaths_mil);
const barWidth = 300
const barOffset = 30
const t = d3.transition().duration(20).ease(d3.easeLinear);

country = div.select('#cellCont-country')
  .selectAll('div')
  .data(dataSel, d => d.country)
  .join(
    enter => enter
  .append("div")
  .text(d => d.country)
  .style('opacity', 0)
  .call(text => text
      .transition(t)
      .style('opacity', 1)
   ),
   update => update
  .transition(t)
  .style('color', 'green')
  .style('opacity', 1),
    exit => exit
  .remove()
  )
  .attr('class', 'cell');

death = div.select('#cellCont-deaths')
  .selectAll('div')
  .data(dataSel, d => d.rank)
  .join(
    enter => enterBar(enter, t, dataSel),
    update => update
  .transition(t)
  .text(d => d.deaths_mil)
  .style('width', d => `${(d.deaths_mil / maxDeaths) * (barWidth - barOffset)}px`),
    exit => exit
    .remove()
  );



});

function enterBar(enter, t, data, width = 300, offset = 10){
  const max = d3.max(data, d => d.deaths_mil);
  const countriesData = data
  .map(d=> d["country"])
  const uniqCountries = countriesData
  .filter(function(elem, pos) {
    return countriesData.indexOf(elem) == pos;
  });
  const countryColor = d3.scaleOrdinal()
  .domain(uniqCountries)
  .range(d3.schemeSet1);


  enter
    .append("div")
    .attr('class', 'bar')
    .text(d => d.deaths_mil)
    .style('min-width', 'max-content')
    .style('background', d =>`${countryColor(d.country)}`)
     .call(text => text
     .transition(t)
     .style('width', d => `${(d.deaths_mil / max) * (width - offset)}px`))
  }

  function updateBar(update){

  }
