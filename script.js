var m = {t:50,r:100,b:50,l:100},
    w = d3.select('#plot').node().clientWidth,
    h = d3.select('#plot').node().clientHeight;

var plot = d3.select('.plot').append('svg')
    .attr('width',w+ m.l+ m.r)
    .attr('height',h+ m.t+ m.b)
    .append('g').attr('class','histogram')
    .attr('transform','translate('+ m.l+','+ m.t+')');

var sum = 0;

var queue = d3_queue.queue()
    .defer(d3.csv, "../data/Crunchbase_FundingRounds_Final.csv",parse)
    .defer(d3.csv, "../data/currency_exchange_v2.csv",parseEX)
    .await(function(err, fundingRounds, currencyEx){
        
        console.log(fundingRounds);
        console.log(currencyEx);
        
        var scaleX = d3.time.scale().domain([new Date(1993,0,1),new Date(2013,11,31)]).range([0,w]),
            scaleY = d3.scale.linear().domain([0,d3.max(fundingRounds,function(d){return d.raisedAmount})]).range([h,0]);
        
        var axisX = d3.svg.axis()
            .orient('bottom')
            .scale(scaleX)
            .ticks(d3.time.year)
            .tickFormat(function(v){
                return v.getFullYear();
            });
        
        plot.append('g')
            .attr('class','axis axis-x')
            .attr('transform','translate(0,'+h+')')
            .call(axisX);
        
        var points = plot.selectAll('.point')
                    .data(fundingRounds)
                    .enter()
                    .append('circle').attr('class','point')
                    .attr('cx',function(d){ return scaleX(d.fundingDate)})
                    .attr('cy',function(d){ return h - scaleY(d.raisedAmount)})
                    .attr('r',3)
                    .style('fill','black')
                    .style('fill-opacity',.7);
    })

function parse(d){
    if(+d.raised_amount<0) return;

    return {
        fundingRoundsID: d.funding_rounds,
        roundCode: d.round_code,
        raisedAmount: +d.raised_amount,
        currencyID: d.raised_currency_code,
        sourceURL: d.source_url,
        sourceDescription: d.source_description,
        fundingDate: parseDate(+d.funded_year, +d.funded_month, +d.funded_day),
        fundCcompanyID: d.companies,
        fundOrganizationID: d.organizations,
        fundPeopleID: d.people,
        serialID: d.serialid
    }
}

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

function parseDate(year, month, day){
    return new Date(year, month-1, day);
}

