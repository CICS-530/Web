var w = 600,
    h = 500,
    r = 500,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root;

var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; })

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

/*
$.getJSON("http://pollutantapi-aaroncheng.rhcloud.com/category/index", function(categories, status, xhr){
  var categoryData = []
  if (status == "success"){
    $.each(categories, function(index, item){
      var categoryName = item['Category']['name']
      var diseaseData = []
      $.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/category/getDiseases/' + categoryName,function(diseases, status, xhr) {
        if (status == "success"){
          $.each(diseases['diseases'], function(index, item){
            var diseaseName = item['name']
            var toxinData = []
            $.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/disease/getToxins/' + diseaseName,function(toxins, status, xhr) {
              if (status == "success"){
                $.each(toxins['toxins'], function(index, item){
                  var toxinInfo = {
                    'name': item['toxin'],
                    'size': parseInt(item['evidence_str'])
                  }
                  toxinData.push(toxinInfo)
                })
              }
              //console.log(toxinData)
            })
            var diseaseInfo = {
              'name': diseaseName,
              'children': toxinData
            }
            diseaseData.push(diseaseInfo)
          })
        }
        //console.log(diseaseData)
      })
      var categoryInfo = {
        'name': categoryName,
        'children': diseaseData
      }
      categoryData.push(categoryInfo)
    })
  }
  //console.log(categoryData)
  var jsonData = {
    "name": "EnvironmentalDiseases",
    'children': categoryData
  }
  json_data = JSON.stringify(jsonData);
  console.log(json_data)
})
*/

d3.json("environ.json", function(data) {
  console.log(data)
  node = root = data;
  var nodes = pack.nodes(root);

  vis.selectAll("circle")
      .data(nodes)
    .enter().append("svg:circle")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.r; })
      .on("click", function(d) { return zoom(node == d ? root : d); });

  vis.selectAll("text")
      .data(nodes)
    .enter().append("svg:text")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
      .text(function(d) { return d.name; });

  d3.select(window).on("click", function() { zoom(root); });
});

function zoom(d, i) {
  var k = r / d.r / 2;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

  node = d;
  d3.event.stopPropagation();
}

