(function() {
    // 'use strict';

    app
        .factory('VideoService', VideoService);

    VideoService.inject = ['$timeout', '$http', '$q', 'CONSTANT', 'SETTINGS', 'DataService'];

    function VideoService($timeout, $http, $q, CONSTANT, SETTINGS, DataService) {
        //interface
        var hls;

        var service = {
            vodList: [],
            channelList: [],
            playStream: playStream,
            playChannelStream: playChannelStream,
            playVODStream: playVODStream,
            stopStream: stopStream

        };

        return service;

        //implementation
        function playStream(stream, video, def) {
            if (hls) {
                console.log("destroy hls ++++++++++++++++++++++++++++++++++++++++++++++++++");
                // hls.stopLoad();
                // hls.detachMedia();
                hls.destroy();
                if (hls.bufferTimer) {
                    clearInterval(hls.bufferTimer);
                    hls.bufferTimer = undefined;
                }
                hls = null;
            }

            recoverDecodingErrorDate = recoverSwapAudioCodecDate = null;
            hls = new Hls({
                // debug: true,
                // enableWorker: true
            });


            hls.loadSource(stream);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                // def.resolve('load stream successfully')
            });

            hls.on(Hls.Events.LEVEL_LOADED, function(event, data) {
                def.resolve('load stream successfully');
            });

            hls.on(Hls.Events.ERROR, function(event, data) {
                switch (data.details) {
                    case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                        try {
                            console.error("cannot Load <a href=\"" + data.context.url + "\">" + url + "</a><br>HTTP response code:" + data.response.code + " <br>" + data.response.text);
                            if (data.response.code === 0) {
                                console.error("this might be a CORS issue, consider installing <a href=\"https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi\">Allow-Control-Allow-Origin</a> Chrome Extension");
                            }
                        } catch (err) {
                            console.error("cannot Load <a href=\"" + data.context.url + "\">" + url + "</a><br>Reason:Load " + data.response.text);
                        }
                        break;
                    case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                        console.error("timeout while loading manifest");
                        break;
                    case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
                        console.error("error while parsing manifest:" + data.reason);
                        break;
                    case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
                        console.error("error while loading level playlist");
                        break;
                    case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                        console.error("timeout while loading level playlist");
                        break;
                    case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                        console.error("error while trying to switch to level " + data.level);
                        break;
                    case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                        console.error("error while loading fragment " + data.frag.url);
                        break;
                    case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                        console.error("timeout while loading fragment " + data.frag.url);
                        break;
                    case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                        console.error("Frag Loop Loading Error");
                        break;
                    case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                        console.error("Decrypting Error:" + data.reason);
                        break;
                    case Hls.ErrorDetails.FRAG_PARSING_ERROR:
                        console.error("Parsing Error:" + data.reason);
                        break;
                    case Hls.ErrorDetails.KEY_LOAD_ERROR:
                        console.error("error while loading key " + data.frag.decryptdata.uri);
                        break;
                    case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
                        console.error("timeout while loading key " + data.frag.decryptdata.uri);
                        break;
                    case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
                        console.error("Buffer Append Error");
                        break;
                    case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
                        console.error("Buffer Add Codec Error for " + data.mimeType + ":" + data.err.message);
                        break;
                    case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
                        console.error("Buffer Appending Error");
                        break;
                    default:
                        break;
                }
                if (data.fatal) {
                    console.error('fatal error :' + data.details);
                    switch (data.type) {
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            handleMediaError();
                            break;
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error("network error ...");
                            hls.destroy();
                            $timeout(function(params) {
                                playStream(param, video);
                            }, 100);
                            break;
                        default:
                            console.error("unrecoverable error");
                            hls.destroy();
                            break;
                    }
                    // console.error(console.error());
                }

                // if (!stats) stats = {};
                // // track all errors independently
                // if (stats[data.details] === undefined) {
                //     stats[data.details] = 1;
                // } else {
                //     stats[data.details] += 1;
                // }
                // // track fatal error
                // if (data.fatal) {
                //     if (stats.fatalError === undefined) {
                //         stats.fatalError = 1;
                //     } else {
                //         stats.fatalError += 1;
                //     }
                // }
                // console.error(JSON.stringify(sortObject(stats), null, "\t"));
            });

            video.addEventListener('resize', handleVideoEvent);
            video.addEventListener('seeking', handleVideoEvent);
            video.addEventListener('seeked', handleVideoEvent);
            video.addEventListener('pause', handleVideoEvent);
            video.addEventListener('play', handleVideoEvent);
            video.addEventListener('canplay', handleVideoEvent);
            video.addEventListener('canplaythrough', handleVideoEvent);
            video.addEventListener('ended', handleVideoEvent);
            video.addEventListener('playing', handleVideoEvent);
            video.addEventListener('error', handleVideoEvent);
            video.addEventListener('loadedmetadata', handleVideoEvent);
            video.addEventListener('loadeddata', handleVideoEvent);
            video.addEventListener('durationchange', handleVideoEvent);
        }

        function playChannelStream(channel, video) {
            var param = {
                version: 1,
                regionId: "GUEST",
                assetId: channel.serviceId,
                filename: channel.serviceId + ".m3u8",
                clientIP: "220.231.127.1",
                manifestType: "HLS",
                userId: ""
            };

            var def = $q.defer();

            DataService.getPrepareChannel(param).then(
                function success(response) {
                    if (typeof(response.data.glbAddress) !== 'undefined' && response.data.glbAddress.length > 0) {
                        var src = [];
                        var abc = 0;
                        if (response.data.glbAddress.length > 0) {
                            for (var i = 0; i < response.data.glbAddress.length; i++) {
                                var stream = 'http://' + response.data.glbAddress[i] + '/' + param.assetId + ".m3u8" + '?AdaptiveType=HLS&VOD_RequestID=' + response.data.requestId;
                            }

                            playStream(stream, video, def);

                        }
                    }


                },
                function error(data, status) {
                    console.error('Repos error', status, data);

                });
            return def.promise;
        }

        function playVODStream(vod, video) {
            console.log('playVODStream +++++++++++ ', vod);
            var def = $q.defer();


            var playable = false;
            // var sproduct = Ulti.getSpecifyProduct(vm.vod);

            if (vod.isExclusivePackage) {
                if (vod.isPurchasedExclusive) {
                    playable = true;
                }
            } else {
                if (vod.isFreeNoPair || vod.isWifiPackage || vod.isPurchasedPackage) {
                    playable = true;
                }
            }

            if (playable) {
                DataService.getVodURL(vod.program.id, vod.singleProductId, vod.isFreeNoPair).then(
                    function success(response) {
                        console.log('getVodURL success ', response);
                        var vodRequestId = response.data.gsdm.vod_request_id;
                        var stream = '';
                        if (response.data.gsdm.glb_addresses.length > 0) {
                            for (var i = 0; i < response.data.gsdm.glb_addresses.length; i++) {
                                stream = 'http://' + response.data.gsdm.glb_addresses[i] + '/' + vod.vodLocator + '?AdaptiveType=HLS&VOD_RequestID=' + vodRequestId;
                            }
                        }

                        playStream(stream, video, def);
                    },
                    function error(response) {
                        console.error('playVODStream error while retrieving VOD URL', response);
                    });
            } else {
                console.error("the vod cannot play in SmartTV");
            }


            return def.promise;
        }

        function stopStream() {
            if (hls) {
                console.log("stopStream ---------------+++++++ : ::::: ", hls);
                hls.destroy();
                if (hls.bufferTimer) {
                    clearInterval(hls.bufferTimer);
                    hls.bufferTimer = undefined;
                }
                hls = null;
            }
        }

        function handleVideoEvent(evt) {
            var data = '';
            switch (evt.type) {
                case 'durationchange':
                    // if (evt.target.duration - lastDuration <= 0.5) {
                    //     // some browsers reports several duration change events with almost the same value ... avoid spamming video events
                    //     return;
                    // }
                    // lastDuration = evt.target.duration;
                    // data = Math.round(evt.target.duration * 1000);
                    break;
                case 'resize':
                    // data = evt.target.videoWidth + '/' + evt.target.videoHeight;
                    break;
                case 'loadedmetadata':
                    //   data = 'duration:' + evt.target.duration + '/videoWidth:' + evt.target.videoWidth + '/videoHeight:' + evt.target.videoHeight;
                    //  break;
                case 'loadeddata':
                case 'canplay':
                case 'canplaythrough':
                case 'ended':
                case 'seeking':
                case 'seeked':
                case 'play':
                case 'playing':
                    // lastStartPosition = evt.target.currentTime;
                case 'pause':
                case 'waiting':
                case 'stalled':
                case 'error':
                    data = Math.round(evt.target.currentTime * 1000);
                    if (evt.type === 'error') {
                        var errorTxt, mediaError = evt.currentTarget.error;
                        switch (mediaError.code) {
                            case mediaError.MEDIA_ERR_ABORTED:
                                errorTxt = "You aborted the video playback";
                                break;
                            case mediaError.MEDIA_ERR_DECODE:
                                errorTxt = "The video playback was aborted due to a corruption problem or because the video used features your browser did not support";
                                handleMediaError();
                                break;
                            case mediaError.MEDIA_ERR_NETWORK:
                                errorTxt = "A network error caused the video download to fail part-way";
                                break;
                            case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                errorTxt = "The video could not be loaded, either because the server or network failed or because the format is not supported";
                                break;
                        }
                        console.error(errorTxt);
                    }
                    break;
                    // case 'progress':
                    //   data = 'currentTime:' + evt.target.currentTime + ',bufferRange:[' + this.video.buffered.start(0) + ',' + this.video.buffered.end(0) + ']';
                    //   break;
                default:
                    break;
            }

        }

        var recoverDecodingErrorDate, recoverSwapAudioCodecDate;

        function handleMediaError() {
            // if (autoRecoverError) {
            var now = performance.now();
            if (!recoverDecodingErrorDate || (now - recoverDecodingErrorDate) > 3000) {
                recoverDecodingErrorDate = performance.now();
                console.error(",try to recover media Error ...");
                hls.recoverMediaError();
            } else {
                if (!recoverSwapAudioCodecDate || (now - recoverSwapAudioCodecDate) > 3000) {
                    recoverSwapAudioCodecDate = performance.now();
                    console.error(",try to swap Audio Codec and recover media Error ...");
                    hls.swapAudioCodec();
                    hls.recoverMediaError();
                } else {
                    console.error(",cannot recover, last media error recovery failed ...");
                }
            }
            // }
        }



    }
})();