var min = 0;
var nb_bins = 150;
var step = 2.5;//(max-min)/(nb_bins-1);
var max = min + nb_bins*step;
var zoom_area = 1.5;

//var xsensitivity = 20;//px
//var ysensitivity = 20;//px
var point_r = 10;//px
var mode = "curve";

var theme = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',   
             '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(240, 240, 255)']
            ]
        },
    },
    title: {
        style: {
            color: '#000',
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'
        },
        itemHoverStyle:{
            color: 'gray'
        }   
    }
};
// Apply the theme
//Highcharts.setOptions(Highcharts.theme);

function stopdrag(point,e){

														var curve = point.series;
                            var data = curve.data;
														var bins = point.series.chart.series[1].data;
                            var index = point.index;
														var dist = (bins[1].x - bins[0].x)/2;
														

									if(point.dist>2*point_r){
										return false;
										 }else if(index==0)
										 {
										 
										 
											 if (e.newPoint.x >= dist ) {
											 if((e.newPoint.x >= (data[index+1].x)-dist))
										   {return false;}
											 else{
															//return false;
															curve.addPoint([min,bins[0].y],true, false, false);
															}
											 }
										 }
										else if(index==data.length-1){
										
									
										
																				
											if(e.newPoint.x <= bins[bins.length-2].x + (bins[bins.length-1].x - bins[bins.length-2].x)/2){
												if (e.newPoint.x <= (data[index-1].x)+dist)
										{return false;}else{
										curve.addPoint([max,bins[bins.length-1].y],true, false, false);
}
															}
										}
                     else if ((e.newPoint.x <= (data[index-1].x) + dist )||(e.newPoint.x >= (data[index+1].x) - dist)) {
                            return false;
                     }
										
										
										 /*
										 if(data[index-1] && data[index+1])
														{
                        if ((e.newPoint && e.newPoint.x <= data[index-1].x)||(e.newPoint && e.newPoint.x >= data[index+1].x)) {
                            return false;
                        }
												}else{
													//if(e.newPoint && e.newPoint.x > (bins[index+1].x-bins[index].x)/2){
													//((e.newPoint && e.newPoint.x <= data[index-1].x)||(e.newPoint && e.newPoint.x >= data[index+1].x))
																					

													//return false;

													//}
												}*/
												 

												
}
function bindata(){
var data = [];
for (i=min;i<=max;i=i+step){data.push(1/(nb_bins))}
return data;
}
function tickPositions(){
var data = [];
for (i=min;i<=max;i=i+step){data.push(i)}
return data;
}

var initdataspline = [[min, 1/(nb_bins)],[max, 1/(nb_bins)]];
var initsaved = [[initdataspline.slice(),bindata()]];
var saved = initsaved.slice();
function save(){


var lastserie0 = [];
var lastserie1 = [];

	chart.series[0].data.forEach(function(i) {
lastserie0.push([i.x,i.y]);
});
	chart.series[1].data.forEach(function(i) {
lastserie1.push([i.x,i.y]);
});
					//	if(lastserie != saved[saved.length -1]){
					saved.push([lastserie0,lastserie1])
					
					if(saved.length>0){
						$('#undo').prop("disabled",false);
						$('#reset').prop("disabled",false);

						}
						//}
}

function max_zoom(max_h){
//n = chart.series[1].yData.reduce((a, b) => a + (b!=0), 0);
//max = series.yData.reduce((a,b) => Math.max(a,b));
//console.log(max);
//.apply(null, tableauNumérique);
//if(3/n > 1){return 1}else{return 3/n }

if(zoom_area*max_h > 1){return 1}else{return zoom_area*max_h}
//return 1;
}

function normalize(){

var sum = chart.series[1].yData.reduce((a, b) => a + b, 0);


var data_bins= [];
var sum_bins = 0;
var data_curve= [];
var max_height = 0;
chart.series[1].data.forEach(function(point) {
var new_point = point.y/sum;
if(new_point > max_height){max_height = new_point}
sum_bins = sum_bins + new_point ;
data_bins[point.index] = new_point;
          });
					
chart.series[0].data.forEach(function(point) {
data_curve[point.index]=[Math.round(point.x/step)*step,point.y/sum];		
		//	if (data_curve[point.index]>1){
		//	data_curve[point.index] = 1;
		//	}
          });

					
if(isNaN(sum_bins))
	{
	setTimeout(function(){ 
		chart.series[0].setData(initdataspline.slice(),true);
		chart.series[1].setData(bindata(),true);
			chart.yAxis[0].setExtremes(0,1);

		}, 0);
	}
else{
	
	setTimeout(function(){ 
chart.series[1].setData(data_bins,true);	
chart.series[0].setData(data_curve,true);


	//chart.yAxis[0].setExtremes(0,null);
//chart.yAxis[0].setExtremes(0,e.newPoint.y);
chart.yAxis[0].setExtremes(0,max_zoom(max_height));
chart.series[0].update({dragDrop: {dragMaxY:chart.yAxis[0].max}});
	
										
//chart.yAxis[0].setExtremes(0,max_zoom(max));
//chart.yAxis[0].setExtremes(0,null);
		}, 0);

}
}


function update_bins(point,remove) {


var x0 = Math.round(point.x/step)*step;
var y0 = point.y;

			 



if(point.series.data[point.index-1]){
var x_start = point.series.data[point.index-1].x;
var y_start = point.series.data[point.index-1].y;
}else{
var x_start = point.series.xAxis.dataMin;
var y_start = point.series.yAxis.dataMin;
}
if(point.series.data[point.index+1]){
var x_end = point.series.data[point.index+1].x;
var y_end = point.series.data[point.index+1].y;
}else{
var x_end = point.series.xAxis.dataMax;
var y_end = point.series.yAxis.dataMax;
}




	if(remove){ //if point was removed
	x0 = x_end;
	y0 = y_end;
	point.remove();	

	}
	
		var updatebins = [];
chart.series[1].data.forEach(function(bin) {

  var x = bin.x;
	
	if(x>=x_start && x<=x_end){
	
	
	if(x<x0){
	var linear_y = (((y0-y_start)/(x0-x_start))*(x-x_start))+y_start;

	}else if(x>x0){
	var linear_y = (((y0-y_end)/(x0-x_end))*(x-x_end))+y_end;

	}else{
	var linear_y = y0;

	}

	
}
	updatebins.push(linear_y);
  });
	
	chart.series[1].setData(updatebins,false,false,true);


		 normalize();

	
	//}
	

	
	save();


}


function add_point(serie,x,y) {
if (mode=="curve" && x>=min && x<=max){ 								

                // Add it
								x = Math.round(x/step)*step;
								
								
								serie.data.forEach(function(point) {
								

								if((point.x === x)){ // point in the same x
									point.remove(); 
									if(point.y === y){
									}
								}
								
						});
						 serie.addPoint([x, y],true, false, false);
									serie.data.forEach(function(point) {
								if((point.x === x)&&(point.y === y)){ // point found															
	
								 update_bins(point);								
								}		
          }
        );

}else{
 var i = Math.round(x/step);
 var bin = chart.series[1].data[i];
 bin.update(y);
 add_point_from_bins(bin);
}
            

}

function add_point_from_bins(bin){console.log("here");
										var x = bin.x;
										var y = bin.y;
										var pointadded;
										
										chart.series[0].addPoint([x,y],true, false, false); 
										chart.series[0].data.forEach(function(point) {
												if(point.x === x && point.y === y)
												{									
												pointadded = point;
												}
        					  });
										
										// remove point if there is already one
										if(pointadded.series.data[pointadded.index-1] && Math.abs(pointadded.series.data[pointadded.index-1].x-x)<step*0.5){
										pointadded.series.data[pointadded.index-1].remove();
										}
										if(pointadded.series.data[pointadded.index+1] && Math.abs(pointadded.series.data[pointadded.index+1].x-x)<step*0.5){
										pointadded.series.data[pointadded.index+1].remove();
										}
										
										// not adding a point if there is already one close to 1.5*step
										if(pointadded.series.data[pointadded.index-1] && Math.abs(pointadded.series.data[pointadded.index-1].x-x)>step*1.5){
										chart.series[0].addPoint([bin.series.data[bin.index-1].x, bin.series.data[bin.index-1].y],true, false, false); 										
										}
										if(pointadded.series.data[pointadded.index+1] && Math.abs(pointadded.series.data[pointadded.index+1].x-x)>step*1.5){
										chart.series[0].addPoint([bin.series.data[bin.index+1].x, bin.series.data[bin.index+1].y],true, false, false); 
										}


										
								update_bins(pointadded);
				
					}

var chartoptions = {
		//theme,
    credits: {
         enabled: false
    },
    chart: {
		className: 'pointChart',
        margin: [70, 50, 100, 80],
        events: {
				
    			


            click: function(e){

						add_point(this.series[0],e.xAxis[0].value,e.yAxis[0].value)
						},
						
						load:function(e){
						this.yAxis[0].setExtremes(0,1);
						},
						render:function(e){
						var series = this.series[1];						
						var coords = series.yData;
					$('#showdata').val("["+coords.toString()+"]"); 
					}
					}
    },
    title: {
        text: ''
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: [{    
      id: 'first',
         linkedTo: 1, 
				 visible:false
   }, {
      id: 'second',
		title: {
            text: 'Brent price on Jan 1st, 2025'
        }, 
				//tickInterval : step,
				//tickAmount: nb_bins,
				//startOnTick: true,
				//tickPixelInterval : 100,
				tickPositions : tickPositions(),
								labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
								y:30,
								},
        gridLineWidth: 1,
        min: min,
        max: max,
				/*plotLines: [{
        color: '#FFF', // Red
        width: 5,
        value: 0 // Position, you'll have to translate this to the values on your x axis
    }]*/
    }],
    yAxis: {/*
		events:{
		afterSetExtremes : function (e) {
                        // Returning false stops the drag and drops. Example:
									//	setTimeout(function(){ alert("Hello"); }, 3000);

												
                    },
		},*/
		        
        title: {
            text: 'Probability'
        },
					labels: {
                //format: '{value} %',
                style: {
                    fontSize: '10px'
                },
                x: -10
            },

       
        //    tickInterval: 0.1,
				//max:1,
				min: 0,

    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: true
    },
    plotOptions: {
        series: {
				
				dragDrop: {
                dragMinY: 0,
                dragMaxY: 1,
								dragMinX: min,
								dragMaxX: max,
								//dragPrecisionX : step,//dragging not smooth when activated
            },
            //lineWidth: 0,
						marker:{
            enabled: true,
						radius : point_r,
							states: {
								hover: {
									radiusPlus : 0,
								}
							}
							},
			
            point: {
               events:{
							
							 
							 mouseOut: function () {
							 	$('#cursor').hide();
		 						},
						/*	 // function to follow mouse
						mouseOver: function () { 
										var point = this;
										 var cursor = $('#cursor');
										cursor.show();
											 
										 $(document).on('mousemove', function(e) {

										  if(!$(point.graphic.element).is(":hover")) {
												cursor.css({
									top: e.clientY - cursor.height() / 2,
									left: e.clientX - cursor.width() / 2
							});
							 }else{
							 cursor.hide();
							 }
					 });
                    },*/
							 
                    click: function (e) {	
										e.preventDefault();		
									
									var x = chart.series[0].xAxis.toValue(e.chartX),
											y = chart.series[0].yAxis.toValue(e.chartY);
										
					if(this.series.index == 0)
					{
							if(this.index == 0) { // si point extrème
												this.update([min,0]);
												update_bins(this); 
							}else if(this.index == this.series.data.length-1){
							this.update([max,0]);
												update_bins(this); 
							}else if(this.dist< point_r){
							update_bins(this,true); // true = remove;
							}else{
								
											add_point(chart.series[0],x,y);	
											}
							
					}else{
											//add_point(chart.series[0],e.xAxis[0].value,e.yAxis[0].value)
											add_point(chart.series[0],x,y);	

					}
							/*											
					*/
                    },
										dragStart : function (e) {
                        // Returning false stops the drag and drops. Example:

                    },
										drag: function (e) {
                        // Returning false stops the drag and drops. Example:
										//chart.yAxis[0].setExtremes(0,1.25*chart.series[0].yAxis.toValue(e.origin.chartY));
/*
chart.yAxis[0].setExtremes(0,null);
function setext(prevmax)
{
if(prevmax>1)
{
return 1;
}else
{return prevmax}
}
if((e.chartY-chart.yAxis[0].top)/chart.yAxis[0].height < 0.1){
setTimeout(function(){ 
chart.yAxis[0].setExtremes(0,setext(1.1*chart.yAxis[0].max));
console.log("time");
}, 1000);

//chart.yAxis[0].setExtremes(0,null);
//chart.series[0].update({dragDrop: {dragMaxY:chart.yAxis[0].max}});

//if((e.origin.prevdY < 0)){//if 10% next to the top

//chart.yAxis[0].setExtremes(0,setext(chart.yAxis[0].max + e.newPoint.y - this.y));
//chart.series[0].update({dragDrop: {dragMaxY:setext(chart.yAxis[0].max + e.newPoint.y - this.y)}});



//console.log(chart.yAxis[0].max);
//chart.series[0].update({dragDrop: {dragMaxY:1}});

/*
if(1.01*chart.yAxis[0].max<1){
setTimeout(function(){ 
chart.yAxis[0].setExtremes(0,1.01*chart.yAxis[0].max);
}, 1000);
}else{chart.yAxis[0].setExtremes(0,1);
}
 
console.log(e.chartY ,chart.yAxis[0].height);console.log(e.chartY ,chart.yAxis[0].height);


}*/

	/*setTimeout(function(){ 
chart.yAxis[0].setExtremes(0,1.2*chart.yAxis[0].max);

		}, 10);*/


//chart.yAxis[0].setExtremes(0,null);
												if(this.series.index == 0) 
										{

								
											/*
									
										if (e.origin.prevdY < 0){// drag up
										chart.yAxis[0].setExtremes(0,1.2*e.newPoint.y);
}
										if (e.origin.prevdY > 0){
										//console.log(chart.series[0].yAxis.toValue(e.origin.chartY));
										//chart.yAxis[0].setExtremes(0,e.newPoint.y);
										chart.series[0].update({
        dragDrop: {dragMaxY: 0.8*chart.series[0].yAxis.toValue(e.origin.chartY)}});
										
									
										}
										*/
																			

										
										
										
												return stopdrag(this,e);
												
												
                            }
														else{
														/*if((e.chartY-chart.yAxis[0].top)/chart.yAxis[0].height < 0.05){
													chart.yAxis[0].setExtremes(0,null);
}*/
														}
												
                    },
										drop: function (e) { 
										if(this.series.index == 1) // bins modified
										{
										add_point_from_bins(this);
										
         
										
									
}else{							
var bins = chart.series[1];
	


	if(this.index == 0){	
	
	this.update([min,this.y]);
	
	}else if(this.index == this.series.data.length-1)
	{
	
this.update([max,this.y]);

}


update_bins(this);
}
										

										
										return stopdrag(this,e);

										
										},
										
										
                }
            },

				
				
				},

				column: {
					
				
				
				states: {
                inactive: {
                    enabled: false
                }
            },
				allowPointSelect: false,

            stacking: 'normal',
enableMouseTracking: false,
            opacity : 0.8,
minPointLength : 2,
pointStart : min,
pointInterval : step,
//pointWidth : 30,
        grouping: false,
        pointPadding: 0.05,
        groupPadding: 0.05,
        borderWidth: 0,
						color: "#3f93c7",
            
        },
				

				
    },
		    tooltip: {
        enabled: false,
        snap: 2
    },
    series: [{
        data: initdataspline.slice(),
				zIndex : 1,
stickyTracking : false,
type : "line",
		xAxis: 'first',
		dashStyle: 'dot',
		opacity : 0.3,
		allowPointSelect: false,
				dragDrop: {
						draggableY: true,
						draggableX: true,
            },
    },
		{
        data: bindata(),
        type: 'column',
				xAxis: 'second',
				zIndex : 0,
				 dragDrop: {
					dragHandle:{
            lineWidth : 30
            }
            },
						
    }, ]
}

function drawDefaultChart() {
    chart = new Highcharts.Chart('container', chartoptions);
}

drawDefaultChart();

//var chart = new Highcharts.Chart('container', chartoptions);
// chart.fullscreen.open();

//   Highcharts.fireEvent(chart.series[0], 'click');


$( document ).ready(function() {

$('#curve').click(function(e){
$('#activebin').toggle();
$('#curve').toggle();

mode = "curve";

chart.series[1].setState("inactive",true);


// hack to disable enablemousetracking

var series = chart.series[1];

  series.trackerGroups.forEach(function(key) {
    if (series[key]) {
      // we don't always have dataLabelsGroup
      series[key]
        .removeClass('highcharts-tracker')
        .on('mouseover', Highcharts.noop)
        .on('mouseout', Highcharts.noop);


      series[key].on('touchstart', Highcharts.noop);

    }
 });


chart.series[1].update(
		{
		zIndex : 0,
		enableMouseTracking: false,
		dragDrop: {
					draggableY: false,
					}
});

chart.series[0].update(
		{       
            marker: {
                enabled: true
            },
   opacity: 0.3,
dragDrop: {
						draggableY: true,
						draggableX: true,
            },
});

});





$('#activebin').click(function(e){
	 
$('#activebin').toggle();
$('#curve').toggle();

mode = "bins";

		chart.series[1].update(
		{
		zIndex : 2,
		enableMouseTracking: true,

		dragDrop: {
					draggableY: true,
					}
});

chart.series[0].setState("inactive",true);
chart.series[0].update(
		{       
            marker: {
                enabled: false
            },
   opacity: 0.2,
dragDrop: {
						draggableY: false,
						draggableX: false,
            },
});
});

$('#reset').click(function(e){
		chart.series[0].setData(initdataspline.slice(),true);
		chart.series[1].setData(bindata(),true);
		chart.yAxis[0].setExtremes(0,1);
		saved = initsaved.slice();
		$('#undo').prop("disabled",true);
		$('#reset').prop("disabled",true);
		
		if(mode=="bins"){
			$('#curve').click();
			}
});

$('#undo').click(function(e){
if(saved.length>1){
		chart.series[0].setData(saved[saved.length-2][0],true);
		chart.series[1].setData(saved[saved.length-2][1],true);
		var max_height = chart.series[0].yData.reduce((a,b) => Math.max(a,b));
saved.pop();	
chart.yAxis[0].setExtremes(0,max_zoom(max_height));
chart.series[0].update({dragDrop: {dragMaxY:chart.yAxis[0].max}});

		if(saved.length==1){
		$('#undo').prop("disabled",true);
		$('#reset').prop("disabled",true);
}		
if(chart.series[0].data.length == 2){
		chart.yAxis[0].setExtremes(0,1);
		chart.series[0].update({dragDrop: {dragMaxY:1}});

}

		}


});
/* // put in html <input id="nb_bins" class="nb_bins" type="number" min="2" step="1" value="10"/>
$( "#nb_bins" ).change(function(e) {	
e.preventDefault();
chart.destroy();
drawDefaultChart();
});
*/
});
