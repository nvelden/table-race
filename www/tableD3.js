
//Run once at start of script

//Constants
const tableNames = d3.keys(data[0]).slice(0,-1);
const colums = options.selColumns;
const colNames = options.colNames;
const colType = options.colType;
const numFormat = d3.format(".3~s");
const columnArray = colums.map((x, i) =>
({ column: x, name: colNames[i], type: colType[i]}));
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
.attr('id', 'headContainer')
.style('display', 'flex')
.style('justify-content', 'stretch')

const columns = columnContainer
.selectAll('div')
.data(columnArray)
.enter()
.append('div')
.attr('id', (d) => `column-${d.column}`)
.attr('class', (d) => `column column-${d.type}`);

const head = columns
.append('div')
.text(d => d.name)
.attr('id', d => `head-${d.column}`)
.attr('class', 'head');

const cellContainer = columns
.append('div')
.attr('id', d => `cellCont-${d.column}`)
.attr('class', 'cellContainer')
.style('display', 'flex')
.style('flex-direction', 'column');

//On input Change
r2d3.onRender(function(data, div, width, height, options) {
//constants
const dataSel = data
 .filter( d => d.date == options.dateInput);
const maxDeaths = d3.max(data, d => d.deaths);
const t = d3.transition().duration(20).ease(d3.easeLinear);
const countriesData = data
.map(d=> d["country"])
const uniqCountries = countriesData
.filter(function(elem, pos) {
  return countriesData.indexOf(elem) == pos;
});
//Colunns
rank = textColumn(dataSel, "rank", "rank", t);
country = textColumn(dataSel, "country", "country", t);
flag = textColumn(dataSel, "iso_alpha_2", "iso_alpha_2", t);
population = numericColumn(dataSel, "population", "population", t);

deaths = barColumn(data, dataSel, "deaths", "rank", "country", t);
confirmed = barColumn(data, dataSel, "confirmed", "rank", "country", t);
confirmedNew = barColumn(data, dataSel, "confirmed_new_07da", "rank", "country", t);
deathNew = barColumn(data, dataSel, "deaths_new_07da", "rank", "country", t);
tests = barColumn(data, dataSel, "tests", "rank", "country", t);
tests = barColumn(data, dataSel, "tests_new_07da", "rank", "country", t);

});

function enterBar(enter, t, data, text, colorKey, max, width = 100, offset = 2) {

  let color = barColor(colorKey);

  enter
    .append("div")
    .attr('class', 'bar')
    .text(d => numFormat(d[text]))
    .transition(t)
    .style('background', d => `rgba(0,0,0,0)
      linear-gradient(90deg, transparent 0%, ${color(d[colorKey])} 0%)
      no-repeat scroll left center / ${(d[text] / max) * (width - offset)}% 70%`)
    .style('width', `${width}%`)
}

function updateBar(update, t, data, text, colorKey, max, width = 100, offset = 2) {

  let colorfunc = barColor(colorKey);

update
.style('background', d =>`rgba(0,0,0,0)
linear-gradient(90deg, transparent 0%, ${colorfunc(d[colorKey])} 0%)
no-repeat scroll left center / ${(d[text] / max) * (width - offset)}% 70%`)
.transition(t)
.text(d => numFormat(d[text]))
.style('width', `${width}%`)
}

function barColor(colorkey) {

  let keyData = data
    .map(d => d[colorkey])
  let uniqKey = keyData
    .filter(function(elem, pos) {
      return keyData.indexOf(elem) == pos;
    });

  const colorRange = [
    "#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c", "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1", "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe", "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853", "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d", "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"
  ]

  let keyColor = d3.scaleOrdinal()
    .domain(uniqKey)
    .range(colorRange);

  return keyColor
}

function textColumn(data, text, order, t){

div.select(`#cellCont-${text}`)
  .selectAll('div')
  .data(data, d => d[order])
  .join(
    enter => enter
  .append("div")
  .html(d => d[text])
  .style('opacity', 0)
  .call(text => text
      .transition(t)
      .style('opacity', 1)
   ),
   update => update
  .transition(t)
  .style('opacity', 1),
    exit => exit
  .remove()
  )
  .attr('class', 'cell')

}

function numericColumn(data, num, order, t){

div.select(`#cellCont-${num}`)
  .selectAll('div')
  .data(data, d => d[order])
  .join(
    enter => enter
  .append("div")
  .html(d => numFormat(d[num]))
  .style('opacity', 0)
  .call(text => text
      .transition(t)
      .style('opacity', 1)
   ),
   update => update
  .transition(t)
  .style('opacity', 1),
    exit => exit
  .remove()
  )
  .attr('class', 'cell')

}

function barColumn(data, dataSel, num, numOrder, colorOrder, t){

const max = d3.max(data, d => d[num]);

death = div.select(`#cellCont-${num}`)
  .selectAll('div')
  .data(dataSel, d => d[numOrder])
  .join(
    enter => enterBar(enter, t, dataSel, num, colorOrder,  max),
    update => updateBar(update, t, dataSel, num, colorOrder, max),
    exit => exit
    .remove()
  )
}
