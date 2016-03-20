var w = d3.select('#plot').node().clientWidth,
    h = d3.select('#plot').node().clientHeight;

var queue = d3_queue.queue()
    .defer(d3.csv, "../data/Crunchbase_FundingRounds.csv",parse)
    .await(function(err,fundingRounds){
        
        console.log(fundingRounds);
    })

function parse(d){
    if(+d.raised_amount<0) return;

    return {
        fundingRoundsID: d.funding_rounds,
        codeType: d.round_code,
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

function parseDate(year, month, day){
    return new Date(year, month-1, day);
}

