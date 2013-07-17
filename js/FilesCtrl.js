'use strict';

FilesCtrl.CALCULATEMD5 = 'calculate md5';
function FilesCtrl($scope, $rootScope, $filter) {
    console.log("files.html refrash!")
    var project = $rootScope.project;
    filesList();
    $scope.tempUploadFiles = [];
    $scope.$watch('tempUploadFiles', function () {
        if ($scope.tempUploadFiles.length == 0) {
            $('.btn.btn-primary.start').attr('disabled', true);
        } else {
            $('.btn.btn-primary.start').attr('disabled', false);
        }
    }, true);
    $('.dashboard-tabs a').removeClass('selected');
    $('.dashboard-tabs a[href="#/files"]').addClass('selected');

    $scope.setUploadFiles = function (filePath) {
        for (var i in  $('#fileToUpload')[0].files) {
            var tempFile = $('#fileToUpload')[0].files[i];
            if (tempFile instanceof File) {
                tempFile["time"] = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $scope.tempUploadFiles.push(tempFile);
                $('#uploadfile').attr('disabled', false);
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
        xhr.open("POST", "file?project=" + project + "&action=upload");
        var fd = new FormData();
        for (var i in $scope.tempUploadFiles) {
            fd.append("fileToUpload", $scope.tempUploadFiles[i]);
        }
        xhr.send(fd);
    }

    $scope.resetFile = function () {
        $scope.tempUploadFiles = [];
    }

    $scope.selectFile = function ($event) {
        console.log($event.target);
        $scope.td = $event.target;
        $('#selectFile').click();
    }


    $scope.md5Check = function (filename, $event) {
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

    $scope.propsUpdate = function (){
        $.ajax({
            url:"/mapflow/file",
            data:{project:'shanghai',action :'propsupdate'},
            type:"POST",
            dataType:"json"
        }).done(function(data){
                $scope.files = [];
                $.each(data.fileMap, function () {
                    if (this) {
                        $scope.files.push(this);

                        if (!this.md5Sum) {
                            this.md5Sum = FilesCtrl.CALCULATEMD5;
                        }

                    }
                });

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
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

    $scope.localFileMd5 = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.target.files;

        var worker = new Worker("lib/worker.js");
        worker.postMessage({file: files[0], id: 1, type: {md5:1}});
        worker.onmessage =  function (response) {
            var progressSpace =  $($scope.td);

            var  fileHash = response.data;
            if (fileHash.status == "progress"){
                var jQProgress = progressSpace.find('>progress');
                if(jQProgress.length == 0){
                    jQProgress =  $('<progress  max="100" value="0"></progress>');
                    progressSpace.text("");
                    progressSpace.append(jQProgress);
                }else{
                    jQProgress.attr('value',Math.ceil(fileHash.progress));
                }
            }else if (fileHash.status == "end") {
                $($scope.td).empty();
                $scope.td.innerText = fileHash.result.md5;
                this.terminate();
            }
        }


//        for (var i = 0, f; f = files[i]; i++) {
//            console.dir(f)
//            var chunkSize = 1024*1024;
//            var chunks = Math.ceil(f.size / chunkSize);
//            for (var i = 0; i < chunks; i++) {
//                var reader = new FileReader();
//                var start = chunkSize * i;
//                var end = start + (chunkSize - 1) >= f.size ? f.size : start + (chunkSize - 1);
//                reader.onloadend = function (event) {
//                    if (event.target.readyState == FileReader.DONE) { // DONE == 2
//                        $scope.td.innerText = md5(event.target.result);
//                    }
//                };
//                var blobSlice = f.slice(start , end );;
//                console.dir(blobSlice);
//
//                reader.readAsBinaryString(blobSlice);
//            }

//            reader.onloadend = function (event) {
//                if (event.target.readyState == FileReader.DONE) { // DONE == 2
//                    $scope.td.innerText = md5(event.target.result);
//                }
//            };
//            reader.onprogress =   function (event) {
//                $scope.td.innerText = "running...";
//            };
//            reader.readAsBinaryString(f);
//            reader.readAsDataURL(f);
//        }


    }


    function filesList() {

        $.ajax({
            url: "/mapflow/file?project=shanghai&action=list",
            type: "POST",
            dataType: "json"
        }).done(function(data){
                $scope.files = [];
                $.each(data.fileMap, function () {
                    if (this) {
                        $scope.files.push(this);

                        if (!this.md5Sum) {
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













