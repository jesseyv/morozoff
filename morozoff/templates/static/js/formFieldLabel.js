

function formFieldLabel(params)
{
	if(!params) {
		return;
	}
	
	this.params = params;
	
	this.init = function()
	{
		this.bindEvents();
	}
	
	
	this.bindEvents = function() 
	{
		var thisObj = this;

		for(key in this.params.fields) {
		
			var field = $(thisObj.params.fields[key].field);
			
			if(field.length > 0 && field.val().length > 0) {
				$(thisObj.params.fields[key].label).hide();
			}
			
			$(thisObj.params.fields[key].field).focus(function() {
				thisObj.hideLabel($(thisObj.params.fields[key].label));
				
			});
			$(thisObj.params.fields[key].field).blur(function() {
				if($(this).val().length < 1) {
					thisObj.showLabel($(thisObj.params.fields[key].label));
				}
			});
			$(thisObj.params.fields[key].label).click(function() {
				thisObj.hideLabel(this);
				$(thisObj.params.fields[key].field).focus();
			});
		
		}
	}
	
	
	
	this.hideLabel = function(obj)
	{
		$(obj).hide();
	}
	
	this.showLabel = function(obj)
	{
		$(obj).show();
	}
}