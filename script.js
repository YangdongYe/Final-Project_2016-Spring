var m = {t:50,r:100,b:50,l:100},
    w = d3.select('#plot').node().clientWidth,
    h = d3.select('#plot').node().clientHeight,
    color10 = d3.scale.category10(),
    color20 = d3.scale.category20();

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
        
        //Exchange
        var valueH = [];
        for (var i=0;i<fundingRounds.length;i++){
            
            if (fundingRounds[i].currencyID == 'USD') {valueH[i] = fundingRounds[i].raisedAmount;};
            if (fundingRounds[i].currencyID == 'JPY') {valueH[i] = fundingRounds[i].raisedAmount / (currencyEx[fundingRounds[i].fundingYear-1993].JPYEx);};
            if (fundingRounds[i].currencyID == 'SEK') {valueH[i] = fundingRounds[i].raisedAmount / (currencyEx[fundingRounds[i].fundingYear-1993].SEKEx);};
            if (fundingRounds[i].currencyID == 'GBP') {valueH[i] = fundingRounds[i].raisedAmount / (currencyEx[fundingRounds[i].fundingYear-1993].GBPEx);};
            if (fundingRounds[i].currencyID == 'EUR') {valueH[i] = fundingRounds[i].raisedAmount / (currencyEx[fundingRounds[i].fundingYear-1993].EUREx);};
            if (fundingRounds[i].currencyID == 'NIS') {valueH[i] = fundingRounds[i].raisedAmount / (currencyEx[fundingRounds[i].fundingYear-1993].NISEx);};
            if (fundingRounds[i].currencyID == 'CAD') {valueH[i] = fundingRounds[i].raisedAmount / (currencyEx[fundingRounds[i].fundingYear-1993].CADEx);};
            
            valueH[i] = valueH[i] / (currencyEx[fundingRounds[i].fundingYear-1993].usdInflationRate)
        }
       
        var scaleX = d3.time.scale().domain([new Date(1993,0,1),new Date(2013,11,31)]).range([0,w]),
            scaleY = d3.scale.log().domain([d3.min(valueH,function(d){return d}),d3.max(valueH,function(d){return d})]).range([h,0]);
        
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
                    .attr('cy',function(d,i){ return h - scaleY(valueH[i])})
                    .attr('r',2)
                    .style('fill',function(d){return color10(d.currencyID);})
                    .style('fill-opacity',.5);
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
        fundingYear: +d.funded_year,
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
        JPYEx: +d.JPY,
        SEKEx: +d.SEK,
        GBPEx: +d.GBP,
        EUREx: +d.EUR,
        NISEx: +d.NIS,
        CADEx: +d.CAD,
        USDEx: +d.USD,
        usdInflationRate: +d.USD_inflation
    }
}

function parseDate(year, month, day){
    return new Date(year, month-1, day);
}
