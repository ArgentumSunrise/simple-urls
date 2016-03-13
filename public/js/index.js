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
            $http.post('/', data)
                .success(function (data) {
                    $scope.short = data.shortUrl;
                });
        }
        else {
            $scope.error = 'URL is not valid';
        }
    }
}]);
