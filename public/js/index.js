var app = angular.module('app', []);

// from Henry Kaufman's URL shortener, https://github.com/hcjk/ShortURL
app.controller('UrlCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.newURL = function (post) {
        if ((post.url.substring(0, 7).toLowerCase() === 'http://') || (post.url.substring(0, 8).toLowerCase() === 'https://')) {
            $scope.url = '';
            var data = {
                url: post.url
            }
            post.url = '';

            $http.post('/api/longUrl', data)
            // posts data to app.js
                .success(function (data) {
                    $scope.short = data.shortUrl;
                    // gets shortened URL from the object passed in by app.js
                });
        }
        else {
            $scope.error = 'URL is not valid';
        }
    }
}]);
