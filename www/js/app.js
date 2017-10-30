(function() {
    'use strict';

    function UploaderController() {
        this.wistia = {
            url: 'https://upload.wistia.com',
            mediaUrl: 'https://api.wistia.com/v1/medias.json',
            params: {
                api_password: '9ad6e65b0245ba343f7fd1f1dc7eb4800f3127abe9f20a2d7a84b5cd248fc8f8'
            }
        };
        $('#fileupload').fileupload({
            url: this.wistia.url,
            autoUpload: true,
            dataType: 'json',
            paramName: 'file',
            formData: [{
                name: 'api_password',
                value: this.wistia.params.api_password
            }],
            done: function(e, data) {
                var hashedId = data.result.hashed_id,
                    params = {
                        api_password: this.wistia.params.api_password,
                        hashed_id: hashedId
                    };
                $http.get(this.wistia.mediaUrl, { params }).then(success, error);
            }

        });
    }
    angular.module('angularJSTest', [
            'blueimp.fileupload'
        ])
        .component('wistiaUploader', {
            templateUrl: 'js/uploader.html',
            controller: UploaderController

        })
        .config([
            '$httpProvider', 'fileUploadProvider',
            function($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
            }
        ])
        .controller('FileDestroyController', [
            '$scope', '$http',
            function($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function() {
                        return state;
                    };
                    file.$destroy = function() {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function() {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function() {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function() {
                        $scope.clear(file);
                    };
                }
            }
        ]);
}());