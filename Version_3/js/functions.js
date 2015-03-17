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
$(document).ready(function() {
	if( $(".chosen").length ) {
		
		$(".chosen").chosen();
		
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/category/index','Category','category');
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/disease/index','Disease','disease');
		loadSelectBox('http://pollutantapi-aaroncheng.rhcloud.com/toxin/index','Toxin','toxin');
		
		$("#category,#disease,#toxin").change(function() {
			var _this	=	$(this),
				id		=	_this.attr("id"),
				value	=	_this.find("option:selected").text();
			switch(id) {
				case 'category':
					//To-do: category search codes
					break;
				case 'disease':
					//To-do: disease search codes
					break;
				case 'toxin':
					//To-do: toxin search codes
					break;
			}
		});
	}
});