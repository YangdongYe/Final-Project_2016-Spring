d3.scatterplot = function(){

	//declare variables
	//margins and plot
	var w=900,
	h=800,
	m = {t:10,r:10,b:30,l:70},
    chartW = w - m.l - m.r,
    chartH = h - m.t - m.b,
    //color scales
    color10 = d3.scale.category10(),
    color20 = d3.scale.category20(),
	color20c = d3.scale.category20c(),
    color20b = d3.scale.category20b(),
    colorScale,
    //value range
    amountExtent= [1000000,4000000000],
    //time range
    timeRange = [new Date(), new Date()],
    //scales
    scaleX = d3.time.scale().range([0,chartW]).domain(timeRange),
    scaleY = d3.scale.log().range([chartH-10,0]).domain(amountExtent),
    //value accessor
    valueAccessor = function(d){ return d;},
    id = 2,
    formatNumber = d3.format(".1f"),
    byRound = [['','a','angel','b','c','d','debt_round','e','f','g','grant','post_ipo_debt','post_ipo_equity','private_equity','seed','unattributed'],
              ['','USD','JPY','SEK','GBP','EUR','NIS','CAD']];


//write the exports function
function exports(_selection){
    _selection.each(draw);
}

//write the draw function
function draw(d){
    
    //scatterplot
    var svg = d3.select(this)
                .selectAll('svg')
                .data([d]);

    var svgEnter = svg.enter().append('svg').attr('id','svg1').attr('width',w+800).attr('height',h).attr('z-index',10);
    
    svgEnter.append('g').attr('class','circle').attr('transform', 'translate('+m.l+','+m.t+')').append('circle');
    svgEnter.append('g').attr('class','rect').attr('transform', 'translate('+m.l+','+m.t+')').append('rect');
    svgEnter.append('g').attr('class','text').attr('transform', 'translate('+m.l+','+m.t+')');
    svgEnter.append('g').attr('class','axisX').attr('transform','translate('+m.l+','+chartH+')');
    svgEnter.append('g').attr('class','axisY').attr('transform','translate('+m.l+','+m.t+')');
    
//    var byRoundCode = d3.nest()
//                        .key(function(d){return d.roundCode})
//                        .map(d,d3.map);
//    var byCurrencyCode = d3.nest()
//                        .key(function(d){return d.currencyCode})
//                        .map(d,d3.map);
//    
//    console.log(byRoundCode);
    
    var circle = svg.selectAll('.circle')
                .selectAll('circle')
                .data(d)
                .enter()
                .append('circle')
                .attr('r',1.5)
                .attr('cx',function(d) { return scaleX(d.fundingDate);})
                .attr('cy',function(d) { return scaleY(d.raisedAmount)})
                .style('fill',function(d){ return color20(d.roundCode)})
                .style('fill-opacity',.5)
                .on('mouseenter', onMouseEnter)
                .on('mouseleave', onMouseLeave);

    var axisX = d3.svg.axis()
                .orient('bottom')
                .scale(scaleX)
                .ticks(d3.time.years)
                .tickFormat(function(v){
                    return v.getFullYear();
                });

    var axisY = d3.svg.axis()
                .orient('left')
                .scale(scaleY)
                .ticks(10)
                .tickFormat(d3.format("g"));

     svg.select('.axisX')
            .transition()
            .call(axisX);
     svg.select('.axisY')
            .transition()
            .call(axisY);
    
    if (id == 0) { 
        circle.attr('cy',function(d) {return scaleY(d.raisedAmount)})
    } else if (id == 1) {
        circle.attr('cy',function(d) {return scaleY(d.usdOrgYear)})
                .style('fill-opacity',function(d){
                    if (d.usdOrgYear >= 1000000) {
                        return 0.5;
                    }else{
                        return 0;
                    }
                });
    } else if (id == 2) {
        circle.attr('cy',function(d) {return scaleY(d.usdThisYear)})
                .style('fill-opacity',function(d){
                    if (d.usdThisYear >= 1000000) {
                        return 0.5;
                    }else{
                        return 0;
                    }
                });
    }
    
    var rectScale,
        infoValueText,
        scaleD;
    
    if (colorScale == 'round') {
        
        circle.style('fill',function(d){ return color20(d.roundCode)});
        scaleD = byRound[0];
        
    } else if (colorScale == 'currency') {
        
        circle.style('fill',function(d){ return color10(d.currencyCode)});
        scaleD = byRound[1];
    }
    
    rectScale = svg.selectAll('.rect')
                .selectAll('rect')
                .data(scaleD)
                .enter()
                .append('rect')
                .attr('width',5)
                .attr('height',5)
                .attr('x',820)
                .attr('y',function(_d,i) {return (i-1)*20})
                .style('fill',function(_d){
                    if (colorScale == 'round'){return color20(_d)}
                    else {return color10(_d)};
                })
                .style('fill-opacity',.5);
    
    infoValueText = svg.selectAll('.text')
                .data(scaleD)
                .enter()
                .append('text')
                .text(function(_d) {return _d})
                .attr("x",900)
                .attr("y",function(_d,i) {return i*20-5})
                .style("fill","black")
                .style("text-anchor","start");
    
}

//getter and setter
	exports.width = function(_v){
		if(!arguments.length) return w;
		w = _v;
		return this;
	}
	exports.height = function(_v){
		if(!arguments.length) return h;
		h = _v;
		return this;
	}
	exports.timeRange = function(_r){
		if(!arguments.length) return timeRange;
		timeRange = _r;
        scaleX.domain(timeRange);
		return this;
	}
	exports.value = function(_v){
		if(!arguments.length) return value();
		valueAccessor = _v;
		return this;
	}
    exports.binSize = function(_b){
        //@param _b: d3.time.interval
        if(!arguments.length) return binSize;
        binSize = _b;
        return this;
    }
    exports.colorScale = function(_c){
        if(!arguments.length) return colorScale;
        colorScale = _c;
        return this;
    }
    exports.gettingID = function(_v){
		if(!arguments.length) return gettingID;
		id = _v;
		return this;
	}
    exports.gettingColor = function(_v){
		if(!arguments.length) return gettingID;
		colorScale = _v;
		return this;
	}

return exports;

}

function onMouseEnter(d){
  
    //var xy = d3.mouse(d3.select('.plot1').node());
    var xy =[w-237,h+70];
    
    var _id = '', //string spacer
        idHeight = 0,
        gapTooltips = 0;
    
    if (d.fundCompany != ''){ _id = _id + d.fundCompany + ' ';} //initial '' is empty, ' ' represents spacer
    if (d.fundOrganization != ''){ _id = _id + d.fundOrganization + ' ';}
    if (d.fundPeople != ''){ _id = _id + d.fundPeople + ' ';}
    
    d3.select('.custom-tooltip-date')
        .style('visibility','visible')
        .style('left',(xy[0]+10)+'px')
        .style('top',(xy[1]-10)+'px');
    d3.select('.custom-tooltip-date')
        .select('h2')
        .html(d.fundingYear + "-" + d.fundingMonth);
    gapTooltips += 1;
    
    if (d.roundCode != ''){
        d3.select('.custom-tooltip-round')
            .style('visibility','visible')
            .style('left',(xy[0]+10)+'px')
            .style('top',(xy[1]-10-(gapTooltips*20))+'px');
        d3.select('.custom-tooltip-round')
            .select('h2')
            .html("Round " + d.roundCode);
        
        gapTooltips += 1;
    }
    
    d3.select('.custom-tooltip-raisedAmount')
        .style('visibility','visible')
        .style('left',(xy[0]+10)+'px')
        .style('top',(xy[1]-10-(gapTooltips*20))+'px');
    d3.select('.custom-tooltip-raisedAmount')
        .select('h2')
        .html(d.currencyCode + " " + d.raisedAmount);
    gapTooltips += 1;
    
    if (_id != ''){
        console.log("1 "+d.fundCompany+" 2 "+d.fundOrganization+" 3 "+d.fundPeople);
        
        d3.select('.custom-tooltip-id1')
            .attr('id','idTooltip1')
            .style('visibility','visible')
            .style('left',(xy[0]+10)+'px')
            .style('top',(xy[1]-10-(gapTooltips*20))+'px');
        d3.select('.custom-tooltip-id1')
            .select('h2')
            .html(_id);
        
        idHeight = document.getElementById('idTooltip1').offsetHeight - 8;
        
        d3.select('.custom-tooltip-id1')
            .attr('id','idTooltip1')
            .style('visibility','hidden')
    }
    
    if (_id != ''){
        d3.select('.custom-tooltip-id')
            .attr('id','idTooltip')
            .style('visibility','visible')
            .style('left',(xy[0]+10)+'px')
            .style('top',(xy[1]-10-((gapTooltips-1)*20)-idHeight)+'px');
        d3.select('.custom-tooltip-id')
            .select('h2')
            .html(_id);
    }
    
    if (d.fundingRoundsID != ''){
        d3.select('.custom-tooltip-fundingRoundsID')
            .style('visibility','visible')
            .style('left',(xy[0]+10)+'px')
            .style('top',(xy[1]-10-(gapTooltips*20)-idHeight)+'px');
        d3.select('.custom-tooltip-fundingRoundsID')
            .select('h2')
            .style('font-weight','bold')
            .html(d.fundingRoundsID);
    }
}

function onMouseLeave(d){
    d3.select('.custom-tooltip-fundingRoundsID')
        .style('visibility','hidden');
    d3.select('.custom-tooltip-id')
        .style('visibility','hidden');
    d3.select('.custom-tooltip-raisedAmount')
        .style('visibility','hidden');
    d3.select('.custom-tooltip-round')
        .style('visibility','hidden');
    d3.select('.custom-tooltip-raisedAmountUSD')
        .style('visibility','hidden');
    d3.select('.custom-tooltip-date')
        .style('visibility','hidden');
}