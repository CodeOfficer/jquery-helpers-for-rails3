// http://dev.jquery.com/ticket/5945
// Namespaced events don't work with live in 1.4.1 (they are never fired). 
// I'm ommiting the namespace for now on ajax events
// This demonstrates what doesn't work in 1.4.1
// $('body').live('click.foo', function(){ alert('clicked'); }); 
// $('body').trigger('click.foo');

;(function($) {
	$(function() {
	
		var authToken = $('meta[name=csrf-token]').attr('content');
		var authParam = $('meta[name=csrf-param]').attr('content');
	  var formTemplate = '<form method="#{method}" action="#{action}">\
	      #{realmethod}<input name="#{param}" value="#{token}" type="hidden">\
	      </form>';
		var realmethodTemplate = '<input name="_method" value="#{method}" type="hidden">';
	
		String.prototype.interpolate = function() {  
			for ( i in arguments[0] ) {  
				eval( i + " = '" + arguments[0][i] + "'" );  
			};
			return this.replace( /#\{.*?\}/g, function(match) {  
				return eval( match.replace( /^#\{|\}$/g , '') );  
			});  
		}; 

		function handleRemote(element) {
			var $element = $(element);
			var method, url, params, dataType;
	
			dataType = $element.attr('data-type') || 'script';
	
			if ($element.is('form')) {
				method = $element.attr('method') || 'post';
				url    = $element.attr('action');
				params = $element.serialize();
			} else {
				method = $element.attr('data-method') || 'get';
				// TODO: data-url support is going away, just use href
				url    = $element.attr('data-url') || $element.attr('href');
				params = {};
			};
		
			// Trigger any beforeAjax event handlers on self and ancestors
			// We're looking for a return of false to cancel this action.
			// Prototype has a much cleaner way of doing this
			// 	var event = element.fire("ajax:before");
	    // 	if (event.stopped) return false;
			function triggerHandlers($element, event_name) {
				var proceed = true;
				if ($element.triggerHandler(event_name) == false) {
					proceed = false;
				} else {
					var x = $.each( $element.parents(), function(index, dom) {
						if ($(dom).triggerHandler(event_name) == false) {
							proceed = false;
						};
					});
				};
				return proceed;
			};

			if (!triggerHandlers($element, "beforeAjax")) return false;
		
			$.ajax({
			  url: url,
			  type: method,
			  dataType: dataType,
			  data: params,
			  beforeSend: 	function(request){ $element.trigger("beforeSendAjax", [request]); }, 
			  dataFilter: 	function(data, type){ $element.trigger("dataFilterAjax", [data, type]); }, 
			  complete: 		function(request, textStatus){ $element.trigger("completeAjax", [request, textStatus]); }, 
			  success: 			function(data, textStatus, request){ $element.trigger("successAjax", [data, textStatus, request]); }, 
			  error: 				function(request, textStatus, errorThrown){ $element.trigger("errorAjax", [request, textStatus, errorThrown]); } 
			});
		
			$element.trigger("afterAjax");
		};

		$('body').live('click', function(e){
			var target = e.target;
		
			var message = $(target).attr('data-confirm');
			if (message && !confirm(message)) {
				return false;
			};
		
			var remoteElement = $(target).closest('a[data-remote=true]').get(0);
			if (remoteElement) {
				handleRemote(remoteElement);
				return false;
			};
		
			var element = $(target).closest('a[data-method]').get(0);
			if (element && $(element).attr('data-remote') != 'true') {
				var method 			= $(element).attr('data-method');
				var piggyback 	= method.toLowerCase() != 'post';
				var formHTML 		= formTemplate.interpolate({
					method: 'POST',
					realmethod: piggyback ? realmethodTemplate.interpolate({ method: method }) : '',
					action: $(element).attr('href'),
					token: authToken,
					param: authParam
				});
				var $form = $('<div>').html(formHTML).children().hide().appendTo('body');
				
				$form.submit();
				return false;
			};
		});

		$('body').live('submit', function(e){
			var target = e.target;

			var message = $(target).attr('data-confirm');
			if (message && !confirm(message)) {
				return false;
			};

			var inputs = $(target).find('input[type=submit][data-disable-with]');
			$.each(inputs, function(i, input) {
				var $input = $(input);
				$input.attr('disabled', 'disabled');
				$input.attr('data-original-value', $input.val());
				$input.val($input.attr('data-disable-with'));
			});

			var element = $(target).closest('form[data-remote=true]').get(0);
			if (element) {
				handleRemote(element);
				return false;
			};
		});
	
		$('body').live('completeAjax', function(e){
			var target = e.target;
		
			if (target.tagName.toLowerCase() == 'form') {
				var inputs = $(target).find('input[type=submit][disabled=true][data-disable-with]');
				$.each(inputs, function(i, input) {
					var $input = $(input);
					$input.val($input.attr('data-original-value'));
					$input.attr('data-original-value', null);
					$input.attr('disabled', false);
				});
			};

		});
	
	});
})(jQuery);
