
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
.attr('id', 'headContainer')
.style('display', 'flex')
.style('justify-content', 'stretch')

const columns = columnContainer
.selectAll('div')
.data(tableNames)
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
.attr('class', 'cellContainer')
.style('display', 'flex')
.style('flex-direction', 'column');


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
const countriesData = data
.map(d=> d["country"])
const uniqCountries = countriesData
.filter(function(elem, pos) {
  return countriesData.indexOf(elem) == pos;
});

const colorRange = [
  "#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c", "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1", "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe", "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853", "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d", "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"
]

const countryColor = d3.scaleOrdinal()
.domain(uniqCountries)
.range(colorRange);

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
    enter => enterBar(enter, t, dataSel, maxDeaths),
    update => updateBar(update, t, dataSel, maxDeaths),
    exit => exit
    .remove()
  );



});

function enterBar(enter, t, data, max, width = 100, offset = 10) {

  let color = barColor(data);

  enter
    .append("div")
    .attr('class', 'bar')
    .text(d => d.deaths_mil)
    .style('min-width', 'max-content')
    .style('background', d => `rgba(0,0,0,0)
    linear-gradient(90deg, transparent 0%, ${color(d.country)} 0%)
    no-repeat scroll left center / 100% 70%`)
    .call(text => text
      .transition(t)
      .style('width', d => `${(d.deaths_mil / max) * (width - offset)}%`))
}

function updateBar(update, t, data, max, width = 100, offset = 10) {

  let color = barColor(data);

update
.style('background', d =>`rgba(0,0,0,0)
linear-gradient(90deg, transparent 0%, ${color(d.country)} 0%)
no-repeat scroll left center / 100% 70%`)
.transition(t)
.text(d => d.deaths_mil)
.style('width', d => `${(d.deaths_mil / max) * (width - offset)}%`)

}

function barColor(data) {

  let countriesData = data
    .map(d => d["country"])
  let uniqCountries = countriesData
    .filter(function(elem, pos) {
      return countriesData.indexOf(elem) == pos;
    });

  const colorRange = [
    "#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c", "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1", "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe", "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853", "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d", "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"
  ]

  let countryColor = d3.scaleOrdinal()
    .domain(uniqCountries)
    .range(colorRange);

  return countryColor
}
