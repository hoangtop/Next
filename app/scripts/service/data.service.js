(function() {
    'use strict';

    app
        .factory('DataService', DataService);

    DataService.inject = ['$rootScope', '$http', '$q', 'CONSTANT', 'SETTINGS', 'UltilService'];

    function DataService($rootScope, $http, $q, CONSTANT, SETTINGS, UltilService) {
        $rootScope
        //interface
        var service = {
            vodList: [],
            channelList: [],
            seriesVodList: [],
            getChannelList: getChannelList,
            getPrepareChannel: getPrepareChannel,
            getMenuCategories: getMenuCategories,
            getVodListByCategoryId: getVodListByCategoryId,
            getCategoryVodListByCategoryId: getCategoryVodListByCategoryId,
            getSeriesVodList: getSeriesVodList,
            getRelatedVodList: getRelatedVodList,
            getEpisodeListInSeries: getEpisodeListInSeries,
            getEpisodeListBySeriesId: getEpisodeListBySeriesId,
            getVodURL: getVodURL,
            getVodDetails: getVodDetails,
            getEpisodesInSeries: getEpisodesInSeries,
            getCategorySeriesVodListByCategoryId: getCategorySeriesVodListByCategoryId,
            getVodByProgramIdList: getVodByProgramIdList,
            getVodMoreInfoByProgramIdList: getVodMoreInfoByProgramIdList
        };

        return service;

        //implementation

        function getCategorySeriesVodListByCategoryId(categoryId, limit, offset, shortBy) {

            var url = '';
            if (typeof limit !== 'undefined' && limit > 0) {
                if (typeof limit !== 'undefined' && offset !== 0) {
                    if (shortBy === 'popular') {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?popular=true&offset=' + offset + '&limit=' + limit;
                    } else if (shortBy === 'recent') {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?offset=' + offset + '&limit=' + limit;
                    } else {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?offset=' + offset + '&limit=' + limit;
                    }

                } else {
                    if (shortBy === 'popular') {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?popular=true&limit=' + limit;
                    } else if (shortBy === 'recent') {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?limit=' + limit;
                    } else {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?limit=' + limit;
                    }
                }
            } else {
                url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?offset=0&limit=16';
            }

            var seriesVodList = [];
            var def = $q.defer();
            $http.get(url)
                .then(function(response) {
                    if (response.data.data) {
                        seriesVodList = UltilService.transformSeriesVODList(response.data.data);
                        def.resolve(seriesVodList);
                    } else {
                        def.resolve(seriesVodList);
                    }

                }, function(response) {
                    console.error(response);
                    def.resolve(seriesVodList);
                });

            return def.promise;

        }

        function getEpisodesInSeries(seriesId, seriesSort, offset) {
            var url = '';
            if (offset) {
                if (seriesSort) {
                    url = CONSTANT.API_HOST + '/api1/contents/programs/series?include=product&include=multilang&include=purchase&include=fpackage&id=' + seriesId + '&format=long&offset=' + offset + '&until=now&&series=' + seriesSort;
                } else {
                    url = CONSTANT.API_HOST + '/api1/contents/programs/series?include=product&include=multilang&include=purchase&include=fpackage&id=' + seriesId + '&format=long&offset=' + offset + '&until=now&&series=asc';
                }
            } else {
                if (seriesSort) {
                    url = CONSTANT.API_HOST + '/api1/contents/programs/series?include=product&include=multilang&include=purchase&include=fpackage&id=' + seriesId + '&format=long&offset=0&until=now&series=' + seriesSort;
                } else {
                    url = CONSTANT.API_HOST + '/api1/contents/programs/series?include=product&include=multilang&include=purchase&include=fpackage&id=' + seriesId + '&format=long&offset=0&until=now&series=asc';
                }

            }
            var def = $q.defer();
            var episodeVodList = [];
            $http.get(url)
                .then(function(response) {
                    if (response.data.data) {
                        episodeVodList = UltilService.transformVODList(response.data.data);
                        def.resolve(episodeVodList);
                    } else {
                        // def.reject("Failed to get getEpisodesInSeries");
                        def.resolve(episodeVodList);
                    }

                }, function() {
                    // def.reject("Failed to get getEpisodesInSeries");
                    def.resolve(episodeVodList);
                });

            return def.promise;

        }


        function getVodDetails(vodId) {
            var url = CONSTANT.API_HOST + '/api1/contents/programs/' + vodId + '?include=product&include=multilang&include=purchase&include=fpackage&format=long';
            var def = $q.defer();
            $http.get(url)
                .then(function(response) {
                    def.resolve(UltilService.transformVOD(response.data));

                }, function() {
                    def.reject("Failed to get getVodDetails");
                });

            return def.promise;

        };

        function getVodURL(programId, productId, isFreeNoPair) {
            var url;

            var token = $rootScope.token.access_token;
            console.log("$rootScope.access_token");
            console.log($rootScope.token.access_token);
            console.log($rootScope);
            if (isFreeNoPair) {
                // url = CONSTANT.API_HOST + '/api1/watches/fvod/prepare?id=' + programId + '&product_id=' + productId;
                url = CONSTANT.API_HOST + '/api1/watches/fvod/prepare?access_token=' + SETTINGS.guest_access_token + '&id=' + programId + '&product_id=' + productId;
            } else {
                url = CONSTANT.API_HOST + '/api1/watches/vod/prepare?id=' + programId + '&product_id=' + productId;
            }

            var def = $q.defer();
            $http.get(url)
                .then(function(response) {
                    def.resolve(response);

                }, function() {
                    def.reject("Failed to get getVodURL");
                });

            return def.promise;

        };

        function getEpisodeListBySeriesId(categoryId, limit, offset) {
            var url = '';
            if (limit) {
                if (offset) {
                    url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?format=long&offset=' + offset + '&until=now&include=product&include=purchase&include=fpackage&limit=' + limit;
                } else {
                    url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?format=long&offset=0&until=now&include=product&include=purchase&include=fpackage&limit=' + limit;
                }
            } else {
                url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?format=long&offset=0&until=now&include=product&include=purchase&include=fpackage&limit=-1';
            }

            var def = $q.defer();

            $http.get(url)
                .then(function(response) {
                    var episodeVodList = UltilService.transformVODList(response.data.data);
                    def.resolve(episodeVodList);

                }, function() {
                    def.reject("Failed to get getEpisodeListInSeries");
                });
            return def.promise;

        }

        function getEpisodeListInSeries(seriesId, offset) {
            var url = '';
            var seriesSort = 'desc';
            if (offset) {
                url = CONSTANT.API_HOST + '/api1/contents/programs/series?id=' + seriesId + '&include=purchase&include=fpackage&format=long&offset=' + offset + '&until=now&series=' + seriesSort;
            } else {
                url = CONSTANT.API_HOST + '/api1/contents/programs/series?id=' + seriesId + '&include=purchase&include=fpackage&format=long&offset=0&until=now&series=' + seriesSort;
            }
            var def = $q.defer();

            $http.get(url)
                .then(function(response) {
                    var episodeVodList = response.data.data;
                    def.resolve(episodeVodList);

                }, function() {
                    def.reject("Failed to get getEpisodeListInSeries");
                });
            return def.promise;

        }

        function getRelatedVodList(vodId) {
            var url = CONSTANT.RECOMMENDATION_API_HOST + '/so-web-app/so/recommend?frmt=json&dp=VT_PHONE_016_VODINFO_AR_VOD&pc=1&cust=&program_id=' + vodId + '&hot_max=12';
            // console.log(url);


            var def = $q.defer();
            var relatedVodList = [];
            $http.get(url)
                .then(function(response) {
                    // console.log("related response:", response);
                    if (response.data.dp.status !== 'NoScenarioResult') {
                        var programIds = '';
                        angular.forEach(response.data.dp.itemList.items, function(vodItem, key) {
                            programIds = programIds + vodItem.basisInfo.basisList[0].value + ',';
                        });

                        getVodByProgramIdList(programIds).then(
                            function success(response) {
                                relatedVodList = response;
                                def.resolve(relatedVodList);
                            },
                            function error(response) {
                                console.log('Failed to get getRelatedVodList".', response);
                                def.resolve(relatedVodList);
                            });
                    } else {
                        def.resolve(relatedVodList);
                    }
                    // console.log('vodList transformed returned to controller.', vodList);
                }, function(response) {
                    // def.reject("Failed to get getRelatedVodList");
                    console.error('error in getRelatedVodList .', response);
                    def.resolve(relatedVodList);
                });
            return def.promise;

        }

        function getVodByProgramIdList(programIds) {
            var url = CONSTANT.API_HOST + '/api1/contents/programs?id=' + programIds + '&format=long&include=product&include=purchase&include=fpackage';
            // console.log(url);
            var def = $q.defer();

            $http.get(url)
                .then(function(response) {
                    var vodList = UltilService.transformVODList(response.data.data);
                    def.resolve(vodList);

                }, function() {
                    def.reject("Failed to get getVodByProgramIdList");
                });
            return def.promise;

        }

        function getVodMoreInfoByProgramIdList(programIds) {
            var url = CONSTANT.API_HOST + '/api1/contents/programs?id=' + programIds + '&format=long&include=product&include=purchase&include=fpackage';
            // console.log(url);
            var def = $q.defer();

            $http.get(url)
                .then(function(response) {
                    var vodList = new Array(response.data.data.length);
                    var index1 = 0;
                    var index2 = 0;
                    angular.forEach(response.data.data, function(vod, key) {
                        vodList[key] = UltilService.transformVOD(vod);
                        vodList[key].episodes = [];

                        if (vod.program && vod.program.series) {
                            vod.program.series.episodeName = vod.program.series.episode.replace(/^0+/, '');
                            var seriesId = vod.program.series.id;
                            getEpisodesInSeries(seriesId).then(
                                function(episodeVodList) {
                                    index2++;
                                    vodList[key].episodes = episodeVodList;
                                    if (index1 === vodList.length && index2 === vodList.length) {
                                        return def.resolve(vodList);
                                    }
                                });
                        } else {
                            index2++;
                        }


                        getRelatedVodList(vod.program.id).then(
                            function(res) {
                                index1++;
                                vodList[key].relateds = res;
                                if (index1 === vodList.length && index2 === vodList.length) {
                                    return def.resolve(vodList);
                                }

                            });

                    });

                    def.resolve(vodList);

                }, function() {
                    def.reject("Failed to get getVodByProgramIdList");
                });
            return def.promise;

        }


        function getSeriesVodList(categoryId, offset, limit, shortBy) {

            var url = '';
            if (limit) {
                if (offset) {
                    if (shortBy === 'popular') {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?popular=true&offset=' + offset + '&limit=' + limit;
                    } else if (shortBy === 'recent') {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?offset=' + offset + '&limit=' + limit;
                    } else {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?offset=' + offset + '&limit=' + limit;
                    }

                } else {
                    if (shortBy === 'popular') {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?popular=true&limit=' + limit;
                    } else if (shortBy === 'recent') {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?limit=' + limit;
                    } else {
                        url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?limit=' + limit;
                    }
                }
            } else {
                url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/categories?offset=0&limit=10';
            }

            console.log("get danh sach phim bo ...");
            console.log(url);

            var def = $q.defer();

            $http.get(url)
                .then(function(response) {
                    var vodList = new Array(response.data.data.length);
                    var index = 0;
                    angular.forEach(response.data.data, function(seriesVOD, key) {
                        vodList[key] = seriesVOD;
                        getEpisodeListBySeriesId(seriesVOD.id).then(
                            function(episodeVodList) {
                                vodList[key] = episodeVodList[0];
                                vodList[key].episodes = episodeVodList;
                                vodList[key] = UltilService.transformVOD(vodList[key]);
                                getRelatedVodList(vodList[key].program.id).then(
                                    function(res) {
                                        index++;
                                        vodList[key].relateds = res;
                                        if (index === vodList.length) {
                                            def.resolve(vodList);
                                        }
                                    });


                            },
                            function error(response) {
                                console.error('Loi trong qua trinh goi RestService.getEpisodeListBySeriesId! Response = ');
                                console.error(response);
                            });


                    });

                }, function() {
                    def.reject("Failed to get albums");
                });
            return def.promise;

        }

        function getChannelList() {
            var url = CONSTANT.API_HOST + '/api1/contents/channels?region=OTT&child=all&offset=0&limit=500';
            var def = $q.defer();

            $http.get(url)
                .then(function(response) {
                    console.log("channel lisst getting ....", response);
                    service.channelList = response.data.data.map(function(item, index) {
                        var photoUrl = CONSTANT.API_HOST + '/api1/contents/pictures/' + item.channel.id + '?type=original';
                        item.photoUrl = photoUrl;
                        item.name = item.channel.name[0].text;
                        item.firstTitle = item.channel.name[0].text;
                        item.serviceId = item.service_id;
                        item.channelId = item.id;
                        item.isChannel = true;
                        return item;
                    });

                    def.resolve(service.channelList);
                }, function(error, status) {
                    console.error('Failed to get Channel list. status code:' + status);
                    console.error(error);
                    def.reject("Failed to get Channel list");


                });
            return def.promise;
        }

        function getPrepareChannel(param) {
            var url = 'http://otttv.viettel.com.vn/api1/watches/handheld/live/prepare';
            $http.defaults.headers.post["Content-Type"] = "application/json";

            var def = $q.defer();

            $http.post(url, param).then(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("getPrepareChannel service ................ ", data);
                def.resolve(data);
                // console.log('vodList transformed re
            }, function(error, status) {
                console.error('Failed to get getPrepareChannel. status code:' + status);
                console.error(error);
                def.reject("Failed to get getPrepareChannel");

                // def.reject("Failed to get albums");
            });

            // $http.defaults.headers.post["Content-Type"] = "application/json";
            // var resource = $resource(url, {}, {
            //     'getPrepareChannel': { method: 'POST' }
            // });
            // return resource.getPrepareChannel(param);
            return def.promise;
        }

        function getVodListByCategoryId(categoryId, offset, limit) {
            var url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?child=all&format=long&offset=0&include=product&include=purchase&include=fpackage&include=purchase&include=fpackage&until=now&limit=16';

            if (offset || offset === 0) {
                if (limit) {
                    url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?child=all&format=long&offset=' + offset + '&include=product&include=purchase&include=fpackage&include=purchase&include=fpackage&until=now&limit=' + limit;
                } else {
                    url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?child=all&format=long&offset=0&include=product&include=purchase&include=fpackage&include=purchase&include=fpackage&until=now&limit=16';
                }

            } else {
                url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?child=all&format=long&offset=0&include=product&include=purchase&include=fpackage&include=purchase&include=fpackage&until=now&limit=16';

            }

            var def = $q.defer();


            $http.get(url)
                .then(function(response) {
                    var vodList = new Array(response.data.data.length);
                    var index1 = 0;
                    var index2 = 0;
                    angular.forEach(response.data.data, function(vod, key) {
                        vodList[key] = UltilService.transformVOD(vod);
                        vodList[key].episodes = [];

                        if (vod.program && vod.program.series) {
                            vod.program.series.episodeName = vod.program.series.episode.replace(/^0+/, '');
                            var seriesId = vod.program.series.id;
                            getEpisodesInSeries(seriesId).then(
                                function(episodeVodList) {
                                    index2++;
                                    vodList[key].episodes = episodeVodList;
                                    if (index1 === vodList.length && index2 === vodList.length) {
                                        return def.resolve(vodList);
                                    }
                                });
                        } else {
                            index2++;
                        }


                        getRelatedVodList(vod.program.id).then(
                            function(res) {
                                index1++;
                                vodList[key].relateds = res;
                                if (index1 === vodList.length && index2 === vodList.length) {
                                    return def.resolve(vodList);
                                }

                            });

                    });

                }, function(error, status) {
                    console.error('Failed to get getVodListByCategoryId. status code:' + status);
                    console.error(error);
                    def.reject("Failed to get getVodListByCategoryId");

                    // def.reject("Failed to get albums");
                });
            return def.promise;
        }

        function getCategoryVodListByCategoryId(categoryId, limit, offset) {
            var url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?child=all&format=long&offset=0&include=product&include=purchase&include=fpackage&include=purchase&include=fpackage&until=now&limit=16';

            if (typeof limit !== 'undefined' && limit > 0) {
                if (typeof offset !== 'undefined') {
                    url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?child=all&format=long&offset=' + offset + '&include=product&include=purchase&include=fpackage&include=purchase&include=fpackage&until=now&limit=' + limit;
                } else {
                    url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?child=all&format=long&offset=0&include=product&include=purchase&include=fpackage&include=purchase&include=fpackage&until=now&limit=' + limit;
                }

            } else {
                url = CONSTANT.API_HOST + '/api1/contents/categories/' + categoryId + '/programs?child=all&format=long&offset=0&include=product&include=purchase&include=fpackage&include=purchase&include=fpackage&until=now&limit=16';

            }

            var def = $q.defer();


            $http.get(url)
                .then(function(response) {
                    var vodList = UltilService.transformVODList(response.data.data);
                    return def.resolve(vodList);

                }, function(error, status) {
                    console.error('Failed to get getVodListByCategoryId. status code:' + status);
                    console.error(error);
                    def.reject("Failed to get getVodListByCategoryId");

                    // def.reject("Failed to get albums");
                });
            return def.promise;
        }

        function getMenuCategories() {
            var url = CONSTANT.API_HOST + '/api1/contents/menus?' + 'version=Web_Live&child=all';
            var def = $q.defer();
            var menuArray = [];

            $http.get(url)
                .then(function(response) {
                    var menuListLevel2 = [];
                    var menuListLevel3 = [];
                    var menuMap = {};

                    angular.forEach(response.data.data, function(item, key) {
                        var isItemHidden = false;
                        angular.forEach(item.config, function(config, key) {
                            if (config.name === 'hidden' && config.value === 'true') {
                                isItemHidden = true;
                            }
                        });


                        if (item.type !== '__root' && isItemHidden === false) {
                            // console.log(item);

                            if ((item.path_id.match(/\//g) || []).length === 1) {
                                var menuitem = { name: item.name[0].text, this: item, children: [] };
                                menuArray.push(menuitem);

                                menuMap[item.id] = menuitem;
                            }

                            if ((item.path_id.match(/\//g) || []).length === 2) {

                                angular.forEach(menuArray, function(menu1, key) {
                                    //                                    console.log(item.path_id.indexOf(menu2.key.path_id + '/'));
                                    if (item.path_id.indexOf(menu1.this.path_id + '/') !== -1) {
                                        var menuitem = { name: item.name[0].text, this: item, children: [] };
                                        //                                        var menuitem = {this: item,isProBannerCat:isProBannerCat, children: []};
                                        menu1.children.push(menuitem);
                                        menuListLevel2.push(menuitem);

                                        menuMap[item.id] = menuitem;
                                    }
                                });
                            }

                            if ((item.path_id.match(/\//g) || []).length === 3) {
                                angular.forEach(menuListLevel2, function(menu2, key) {
                                    if (item.path_id.indexOf(menu2.this.path_id + '/') !== -1) {
                                        var menuitem = { name: item.name[0].text, this: item, children: [] };
                                        //                                        var menuitem = {this: item,isProBannerCat:isProBannerCat, children: []};
                                        menu2.children.push(menuitem);
                                        menuListLevel3.push(menuitem);

                                        menuMap[item.id] = menuitem;
                                    }
                                });
                            }

                            if ((item.path_id.match(/\//g) || []).length === 4) {
                                //                                console.log(' series....++++++++++++ ' +item.path_id );
                                angular.forEach(menuListLevel3, function(menu3, key) {
                                    if (item.path_id.indexOf(menu3.this.path_id + '/') !== -1) {
                                        var menuitem = { name: item.name[0].text, this: item, children: [] };
                                        //                                        var menuitem = {this: item,isProBannerCat:isProBannerCat, children: []};
                                        menu3.children.push(menuitem);

                                        menuMap[item.id] = menuitem;
                                    }
                                });
                            }

                        }

                    });
                    def.resolve(menuArray);
                    console.log('albums (simple) returned to controller.', menuArray);
                }, function(error, status) {
                    console.error('Failed to get getMenuCategories. status code:' + status);
                    console.error(error);
                    def.reject("Failed to get getMenuCategories");
                    // def.reject("Failed to get albums");
                });
            return def.promise;
        }
    }
})();