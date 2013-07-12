'use strict';
FilesCtrl.CALCULATEMD5 = 'calculate md5' ;
function FilesCtrl($scope, $filter) {

    filesList();
    $('.dashboard-tabs a').removeClass('selected');
    $('.dashboard-tabs a[href="#/files"]').addClass('selected');

    $scope.setUploadFiles = function (filePath) {
        $scope.tempUploadFiles = [];
        for (var i in  $('#fileToUpload')[0].files) {
            var tempFile = $('#fileToUpload')[0].files[i];
            if (tempFile instanceof File) {
                tempFile["time"] = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $scope.tempUploadFiles.push(tempFile);
                $('#uploadfile').attr('disabled',false);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
    }

    $scope.uploadFile = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        var xhr = new XMLHttpRequest();
        xhr.enctype = 'multipart/form-data';
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "file?project=shanghai&action=upload");
        var fd = new FormData();
        for (var i in $scope.tempUploadFiles) {
            fd.append("fileToUpload", $scope.tempUploadFiles[i]);
        }
        xhr.send(fd);
    }

    $scope.resetFile = function(){
        $scope.tempUploadFiles = [];
    }

    $scope.md5Check = function(filename,$event){
        console.dir($event.target.text);
        if ($event.target.text === FilesCtrl.CALCULATEMD5) {
            $.ajax({
                url: "/mapflow/file",
                data: {project: 'shanghai', action: 'md5sum', name: filename},
                type: "POST",
                dataType: "text"
            }).done(function (data) {
                    if (data) {
                        $event.target.innerText = data;
                    }
                });
        }
    }

    function uploadComplete(evt) {
        /* This event is raised whenthe server send back a response */
        filesList();
        $scope.tempUploadFiles = [];
    }

    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            $('#progressPercent').attr('value', percentComplete);
            $('#progressNumber').text(percentComplete + '%');
        }
    }

    function uploadFailed(evt) {

    }

    function uploadCanceled(evt) {

    }



    function filesList() {
        console.log("in filesList()")
        $.ajax({
            url: "/mapflow/file?project=shanghai&action=list",
            type: "POST",
            dataType: "json"
        }).done(function (data) {
                console.dir(data.fileMap);
                $scope.files = [];
                $.each(data.fileMap ,function(){
                    if(this){
                        $scope.files.push(this);

                        if(!this.md5Sum){
                           this.md5Sum = FilesCtrl.CALCULATEMD5;
                        }

                    }
                });

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
    }




}













