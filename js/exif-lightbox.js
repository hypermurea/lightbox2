/* global angular, $, loadImage, window */
angular.module('exif-lightbox', [])
.directive('exifLbSrc', ['$http', function ($http) {
	return {
		restrict: 'A',
		link: function(scope, element) {

			$(element).bind('click', function(e) {
				
				var $element = $(element);

				var title = $element.attr('exif-lb-title');
				var url = $element.attr('exif-lb-src');
				var loadFailedMessage = $element.attr('exif-lb-fail-message') ? $element.attr('exif-lb-fail-message') : 'image display failed';
				
				
				window.lightbox.startFromScript(function(fn) {

					$http.get(url, {responseType: 'arraybuffer'}).
					success(function(data, status, headers) {

						var blob = new Blob([data], {type: headers('Content-Type')});

						loadImage.parseMetaData(blob, function (data) {
							var options = {canvas:true};
							if (data.exif) {
								options.orientation = data.exif.get('Orientation');
							}
							fn({link: url, title: title, blob: blob, options: options});
						}, {maxMetaDataSize: 262144, disabledImageHead: false});

					}).
					error(function(data, status) {
						fn(undefined);
						alert(loadFailedMessage + ' (' + status + ')');
					});

				});
			});
		}
	};

}]);