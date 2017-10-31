(function() {
    'use strict';

    function getHash(hash) {
        var Video = hash;
    }

    function UploaderController() {
        this.wistia = {
            url: 'https://upload.wistia.com',
            mediaUrl: 'https://api.wistia.com/v1/medias.json',
            params: {
                //api_password: '9ad6e65b0245ba343f7fd1f1dc7eb4800f3127abe9f20a2d7a84b5cd248fc8f'
                api_password: '9ad6e65b0245ba343f7fd1f1dc7eb4800f3127abe9f20a2d7a84b5cd248fc8f8'
            }
        };
        //this.uploadedVideo2 = { hashedId: "michael" };
        $('#fileupload').fileupload({
            url: this.wistia.url,
            autoUpload: true,
            dataType: 'json',
            paramName: 'file',
            formData: [{
                name: 'api_password',
                value: this.wistia.params.api_password
            }],
            success: function(data, e) {
                var uploadedVideo = {
                    hashedId: data.hashed_id
                };
                console.log('<script src="https://fast.wistia.com/embed/medias/' + uploadedVideo.hashedId + '.jsonp" async></script> <script src = "https://fast.wistia.com/assets/external/E-v1.js"async > < /script><span class="wistia_embed wistia_async_' + uploadedVideo.hashedId + ' popover=true popoverAnimateThumbnail=true" style="display:inline-block;height:84px;width:150px">&nbsp;</span > ');
                var videoembed = angular.element('<script src="https://fast.wistia.com/embed/medias/' + uploadedVideo.hashedId + '.jsonp" async></script> <script src = "https://fast.wistia.com/assets/external/E-v1.js"async></script><span class="wistia_embed wistia_async_' + uploadedVideo.hashedId + ' popover=true popoverAnimateThumbnail=true" style="display:inline-block;height:168px;width:300px">&nbsp;</span > ');
                var embeddiv = angular.element(document).find('#videoembed').eq(0);
                embeddiv.append(videoembed);
                var mediaUrl = 'https://api.wistia.com/v1/medias.json';
                // angular.element(videoembed).appendTo('#fileupload');
                //return this.uploadedVideo;
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