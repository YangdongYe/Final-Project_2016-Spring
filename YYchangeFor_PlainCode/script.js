/*ORIGINAL SCRIPT*/
var w = d3.select('#currencyNative.plot').node().clientWidth,
     h = d3.select('#currencyNative.plot').node().clientHeight,
    margin = {t:50,l:50,b:50,r:50},
    selectID = 0,
    selectColor = 'round';

var listname = ["In Native Currency Origin Year",
    "In USD Equivalent Origin Year",
    "In USD Equivalent 2016"];
for (var i=0;i<listname.length;i++) {
        d3.select('.currency-year')
            .append('option')
            .html(listname[i])
            .attr('value',i);
     }

var queue = d3_queue.queue()
    .defer(d3.csv, "../data/Crunchbase_FundingRounds_Final_V2.csv",parse)
    .defer(d3.csv, "../data/currency_exchange_v2.csv",parseEX)
    .await(dataLoaded);

var globalDispatcher = d3.dispatch('currencyyearchange','lenschange');
//currencyyearchange refers to dropdown menu
//lenschange refers to buttons

function dataLoaded(err,fundingRounds,currencyEx){
    
    d3.select('.currency-year').on('change',function(){
        globalDispatcher.currencyyearchange(this.value);
    });
    
    globalDispatcher.on('currencyyearchange',function(id){

        selectID = id;
        
        d3.select('#svg1').remove();
        
        //scatterplot variables
        var scatterplotModule = d3.scatterplot()
            .gettingID(selectID)
            .gettingColor(selectColor)
            .timeRange(timeRange);;  

        var plot1 = d3.select('.container')
            .select('#currencyNative.plot')
            .datum(fundingRounds)
            .call(scatterplotModule);
    })
    
    d3.selectAll('.lens').on('click',function(){
        globalDispatcher.lenschange(d3.select(this).attr('id'));
    })
    
    globalDispatcher.on('lenschange',function(int){
        
        selectColor = int;

        d3.select('#svg1').remove();
        
        var scatterplotModule = d3.scatterplot()
            .gettingID(selectID)
            .gettingColor(selectColor)
            .timeRange(timeRange);;  

        var plot1 = d3.select('.container')
            .select('#currencyNative.plot')
            .datum(fundingRounds)
            .call(scatterplotModule);
    })
    
//created nested hierarchies for uber control unit

//nested by currency code
    var byCurrencyCode = d3.nest()
                        .key(function(d){return d.currencyCode})
                        .map(fundingRounds,d3.map);
// console.log(byCurrencyCode); 

//nested by rounds
    var byRoundCode = d3.nest()
                        .key(function(d){return d.roundCode})
                        .map(fundingRounds,d3.map);
// console.log(byRoundCode); 


//nested by company
    var byfundingRoundsID = d3.nest()
                         .key(function(d){return d.fundingRoundsID})
                        .map(fundingRounds,d3.map);
//console.log(byfundingRoundsID);

//specifying ranges
    var amountExtent = d3.extent(fundingRounds,function(d){return d.raisedAmount}),
     timeRange = [new Date(1993,0,1),new Date(2013,11,31)];
    
//scatterplot variables
    var scatterplotModule = d3.scatterplot()
            .width(w)
            .height(h)
            //.value(function(d){ return d.raisedAmount; })
            .gettingID(selectID)
            .gettingColor(selectColor)
            .timeRange(timeRange);
    
//draw scatterplot
    var plot1 = d3.select('.container')
            .select('#currencyNative.plot')
            .datum(fundingRounds)
            .call(scatterplotModule);

//
////time series variables
//    var timeSeriesModule = d3.timeseries()
//                        .width(w)
//                        .height(h)
//                        .value(function(d){ return d.raisedAmount; })
//                        .timeRange(timeRange);
//
////draw time series
//    var plot2 = d3.select('.container')
//            .select('#timeSeriesChart.plot')
//            .datum(fundingRounds)
//            .call(timeSeriesModule);
}


/*--PARSE PLOT DATA--*/
function parse(d){
    if(+d.raised_amount<0) return;

    return {
        fundingRoundsID: d.funding_rounds,
        roundCode: d.round_code,
        raisedAmount: +d.raised_amount,
        usdOrgYear: +d.USD_OriginalYear,
        usdThisYear: +d.USD_2016,
        currencyCode: d.raised_currency_code,
        sourceURL: d.source_url,
        sourceDescription: d.source_description,
        fundingDate: parseDate(+d.funded_year, +d.funded_month),
        fundingYear: d.funded_year,
        fundingMonth: d.funded_month,
        fundCompany: d.companies,
        fundOrganization: d.organizations,
        fundPeople: d.people,
        serialID: d.serialid

    }
}
/*--PARSE CURRENCY EXCHANGE DATA--*/
function parseEX(d){
    return {
        year: d.YEAR,
        jpyEx: +d.JPY,
        sekEx: +d.SEK,
        gbpEx: +d.GBP,
        eurEx: +d.EUR,
        nisEx: +d.NIS,
        cadEx: +d.CAD,
        usdEx: +d.USD,
        usdInflationRate: +d.USD_inflation
    }
}

/*--PARSE DATE--*/
function parseDate(year, month){
    return new Date(year, month-1);
}









