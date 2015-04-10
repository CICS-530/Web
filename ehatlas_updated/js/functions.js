function loadSelectBox(url,type,select_box_id) {
	var defaultOptions = [];
		
	defaultOptions.push('<option value=""></option>');
	defaultOptions.push('<option value="all">View all...</option>');
	defaultOptions.push('<option value="_null_2">-------------------------</option>');
	
	//Loading the select box from pulling the data from api
	$.getJSON(url,function(data) {
		try {
			var response	= 	data,
				options		=	defaultOptions,
				selectElem	=	$("#" + select_box_id);
				
			for(var i in response)
				if( response.hasOwnProperty(i) )
					options.push('<option value="' + response[i][type].id + '">' + response[i][type].name + '</option>');
			
			selectElem
				.html(options.join('')) //Loading data to the select box
				.trigger("chosen:updated"); //Updating the chosen plugin with loaded options

		} catch(e) {
			console.log(e.message);
		}
	});
}

//Loading the canvas with disease data based on category
function loadBasedOnCategory(value) {
	$('#disease,#toxin').val('').trigger("chosen:updated");
	$.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/category/getDiseases/' + value,function(data) {
		try {
			var response	= 	data,
				json_data	=	{};

			if( response.hasOwnProperty('diseases') ) {
				json_data['cat_id'] = response.id;
				json_data['name'] = response.name;
				json_data['children'] = [];
				for(var i in response.diseases) {
					if( response.diseases.hasOwnProperty(i) ) {
						json_data['children'].push({ cat_id: response.diseases[i]['id'],name: response.diseases[i]['name'] });
					}
				}
				updateTree(json_data);
			}
		} catch(e) {
			console.log(e.message);
		}
	});
}

//Loading the canvas with toxin data based on disease
function loadBasedOnDisease(value) {
	$('#category,#toxin').val('').trigger("chosen:updated");
	$.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/disease/getToxins/' + value,function(data,status,jqXhr) {
		try {
			var response	= 	data,
				index		=	0,
				strong		=	[],
				good		=	[],
				limited		=	[],
				json_data	=	{};
			
			if( response.hasOwnProperty('disease') && response.hasOwnProperty('toxins') ) {
				json_data['id'] = ++index;
				json_data['disease_id'] = response.disease.id;
				json_data['name'] = response.disease.name;
				json_data['children'] = [];
				for(var i in response.toxins) {
					if( response.toxins[i].hasOwnProperty('evidence_str') && response.toxins[i].hasOwnProperty('toxin') ) {
						switch(parseInt(response.toxins[i].evidence_str)) {
							case 1:
								strong.push({ id:++index, cas_no: 1, name: response.toxins[i].toxin});
								break;
							case 2:
								good.push({ id:++index, cas_no: 2, name: response.toxins[i].toxin});
								break;
							case 3:
								limited.push({ id:++index, cas_no: 3, name: response.toxins[i].toxin});
								break;
						}
					}
				}
				if( strong.length )
					json_data['children'].push({ id:++index, evidence_id:1, name:"STRONG", children : strong });
				if( good.length )
					json_data['children'].push({ id:++index, evidence_id:2, name:"GOOD", children : good });
				if( limited.length )
					json_data['children'].push({ id:++index, evidence_id:3, name:"LIMITED", children : limited });
				
				updateTree(json_data);
			}
		} catch(e) {
			console.log(e.message);
		}
	}).fail(function( jqxhr, textStatus, error ) {
		if( jqxhr.statusText == 'Not Found') {
			json_data	=	{ id:1, name:'OOPS', children: [ { id:2, name:'No data found !!!' } ] };
			updateTree(json_data);
		}
	});
}

//Loading the canvas with disease data based on toxin
function loadBasedOnToxin(value) {
	$('#disease,#category').val('').trigger("chosen:updated");
	$.getJSON('http://pollutantapi-aaroncheng.rhcloud.com/toxin/getDiseases/' + value,function(data) {
		try {
			var response	= 	data,
				index		=	0,
				strong		=	[],
				good		=	[],
				limited		=	[],
				json_data	=	{};
				
			if( response.hasOwnProperty('diseases') && response.hasOwnProperty('toxin') ) {
				json_data['id'] = ++index;
				json_data['toxin_id'] = response.toxin.id;
				json_data['name'] = response.toxin.name;
				json_data['children'] = [];
				for(var i in response.diseases) {
					if( response.diseases[i].hasOwnProperty('evidence_str') && response.diseases[i].hasOwnProperty('name') ) {
						switch(parseInt(response.diseases[i].evidence_str)) {
							case 1:
								strong.push({ id:++index, cas_no: 1, name: response.diseases[i].name});
								break;
							case 2:
								good.push({ id:++index, cas_no: 2, name: response.diseases[i].name});
								break;
							case 3:
								limited.push({ id:++index, cas_no: 3, name: response.diseases[i].name});
								break;
						}
					}
				}
				if( strong.length )
					json_data['children'].push({ id:++index, evidence_id:1, name:"STRONG", children : strong });
				if( good.length )
					json_data['children'].push({ id:++index, evidence_id:2, name:"GOOD", children : good });
				if( limited.length )
					json_data['children'].push({ id:++index, evidence_id:3, name:"LIMITED", children : limited });
				
				updateTree(json_data);
			}
		} catch(e) {
			console.log(e.message);
		}
	});
}


function updateTree(sources,sort) {
	var sort	=	(typeof sort !== 'undefined') ? sort : true;
	root = sources;
	root.x0 = viewerHeight / 2;
	root.y0 = 0;

	totalNodes = 0;
	maxLabelLength = 0;
	visit(root, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);
		maxLabelLength	=	15;
    }, function(d) {
		return d.children && d.children.length > 0 ? d.children : null;
    });
	
	// Collapse all children of roots children before rendering.
	root.children.forEach(function(child){
		collapse(child);
	});
	
	getMaxDepth(root);

	
	if(sort) sortTree();
	update(root);
	centerNode(root);
}

function getMaxDepth(json_data) {
	var maxDepth = 0;
	
	return 1;
}

$(document).ready(function() {
	if( $(".chosen").length ) {
		
		$(".chosen").chosen();
		
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/category/index','Category','category');
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/disease/index','Disease','disease');
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/toxin/index','Toxin','toxin');
		
		$("#category,#disease,#toxin").change(function() {
			var _this		=	$(this),
				id			=	_this.attr("id"),
				value		=	_this.find("option:selected").text(),
				optionVal	=	_this.val();
			switch(id) {
				case 'category':
				
					if( optionVal != '_null_2' && optionVal != '' )
						loadBasedOnCategory(value);
					
					break;
				case 'disease':
				
					if( optionVal != '_null_2' && optionVal != '' )
						loadBasedOnDisease(value);

					break;
				case 'toxin':
					
					if( optionVal != '_null_2' && optionVal != '' )
						loadBasedOnToxin(value);
					
					break;
			}
		});
	}
});