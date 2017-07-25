(function() {
    'use strict';

    app
        .factory('UltilService', UltilService);

    UltilService.inject = ['$http', '$q', 'CONSTANT', 'SETTINGS'];

    function UltilService($http, $q, CONSTANT, SETTINGS) {
        //interface


        var service = {
            vodList: [],
            channelList: [],
            getVodCategoryId: getVodCategoryId,
            checkFreeProduct: checkFreeProduct,
            getLiteProduct: getLiteProduct,
            transformVOD: transformVOD,
            transformVODList: transformVODList,
            isSeriesCategory: isSeriesCategory,
            transformSeriesVOD: transformSeriesVOD,
            transformSeriesVODList: transformSeriesVODList,
            strToTime: strToTime,
            addHours: addHours,
            getCatchupId: getCatchupId

        };

        return service;

        //implementation
        function getCatchupId(start_time, serviceId, pid) {
            var yyyy = start_time.getFullYear();
            var mm = start_time.getMonth() < 9 ? "0" + (start_time.getMonth() + 1) : (start_time.getMonth() + 1); // getMonth() is zero-based
            var dd = start_time.getDate() < 10 ? "0" + start_time.getDate() : start_time.getDate();
            var hh = start_time.getHours() < 10 ? "0" + start_time.getHours() : start_time.getHours();
            var min = start_time.getMinutes() < 10 ? "0" + start_time.getMinutes() : start_time.getMinutes();
            var ss = start_time.getSeconds() < 10 ? "0" + start_time.getSeconds() : start_time.getSeconds();
            var str = "".concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min).concat(ss);

            return str + "_" + serviceId + "_" + pid;
        }

        function addHours(time, h) {
            time.setTime(time.getTime() + (h * 60 * 60 * 1000));
            return time;
        }

        function strToTime(str) {
            var time_temp = str.split(":");
            var time = new Date();
            time.setYear(time_temp[0].substr(0, 4));
            time.setMonth(time_temp[0].substr(5, 2) - 1);
            time.setDate(time_temp[0].substr(8, 2));
            time.setHours(time_temp[0].substr(11, 2));
            time.setMinutes(time_temp[1]);
            time.setSeconds(time_temp[2].substr(0, 2));
            return time;
        }

        function isSeriesCategory(menu) {

            var isLeaf = true;
            if (menu.this.config && menu.this.config.length > 0) {
                angular.forEach(menu.this.config, function(config, key2) {
                    if (config.name === "__leaf_category" && config.value === "false") {
                        isLeaf = false;
                        angular.break;
                    }


                });


                if (menu.this.type === 'general' || !isLeaf) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        function getVodCategoryId(menu) {
            var flag = '';
            if (menu.this.config) {
                angular.forEach(menu.this.config, function(config, key2) {
                    if (config.name === '__category') {
                        flag = config.value;
                        angular.break;
                    }
                });
                return flag;
            } else {
                return '';
            }
        }

        // function isSeriesCategory(menu) {
        //     var flag = false;
        //     if (menu.this.name[0].text) {
        //         angular.forEach(CONSTANT.SERIES_CATEGORIES_BY_NAME, function(value, key2) {
        //             if (menu.this.name[0].text.toUpperCase() === value.toUpperCase()) {
        //                 flag = true;
        //                 angular.break;
        //             }


        //         });
        //         return flag;
        //     } else {
        //         return false;
        //     }
        // }

        function checkFreeProduct(product) {
            var temp = false;
            angular.forEach(product.locations, function(location, key) {
                angular.forEach(location.parameter, function(parameter, key) {
                    if (parameter.name === 'Audience' && parameter.value === 'private:All') {
                        temp = true;
                    }
                });
                if (!temp) {
                    angular.forEach(product.price, function(price, key) {
                        if (price.currency === 'VND' && price.value === 0) {
                            temp = true;
                        }
                    });
                }
            });
            return temp;
        }

        function getLiteProduct(product) {
            var temp = {};
            temp.id = product.id;
            temp.type = product.type;
            temp.name = product.name;
            temp.description = product.description;

            var priceObj = {};
            var priceObjs = [];
            if (product.rental_periods.length > 0) {
                angular.forEach(product.rental_periods, function(rental_period, key) {
                    angular.forEach(rental_period.price, function(price, key) {
                        priceObj = {};
                        if (price.currency === 'VND') {
                            priceObj.price = Math.ceil(price.value - product.discount_rate * price.value);
                            priceObj.period = rental_period.period;
                            priceObj.unit = rental_period.unit;
                            priceObjs.push(priceObj);
                        }
                    });
                });
            } else {
                angular.forEach(product.price, function(price, key) {
                    priceObj = {};
                    if (price.currency === 'VND') {
                        priceObj.price = Math.ceil(price.value - product.discount_rate * price.value);
                        priceObjs.push(priceObj);
                    }
                });
            }
            temp.price = priceObjs;
            return temp;
        }

        function transformVOD(vod) {
            // console.log("transformVOD:::::::-------- ", vod);
            var svod = vod;
            svod.isVisiable = false;
            svod.isPublish = false;
            svod.isVtvCab = false;
            svod.isWifiPackage = false;
            svod.isSingleVOD = false;
            svod.isPurchasedPackage = false;
            svod.isExclusivePackage = false;
            svod.isPurchasedExclusive = false;
            svod.isEncrypted = false;
            svod.purchased_products = [];
            svod.purchasable_products = [];

            if (svod.program) {
                svod.photoUrl = CONSTANT.API_HOST + '/api1/contents/pictures/' + vod.program.id + '?width=215.000000&height=307.000000';
                svod.bigPhotoUrl = CONSTANT.API_HOST + '/api1/contents/pictures/' + vod.program.id;




                svod.name = vod.program.title[0].text;

                var des = vod.program.synopsis[0].text;
                var tm = 'Thuyết minh - ';
                if (des.indexOf(tm) === 0) {
                    des = des.substring(tm.length - 1, des.length - 1);
                }


                tm = 'Phụ đề - ';
                if (des.indexOf(tm) === 0) {
                    des = des.substring(tm.length - 1, des.length - 1);
                }

                tm = 'Phụ đề- ';
                if (des.indexOf(tm) === 0) {
                    des = des.substring(tm.length - 1, des.length - 1);
                }



                svod.description = des.substring(0, 398);
                svod.shortDescription = des.substring(0, 300);


                if (vod.program.series) {
                    svod.isVodInSeries = true;
                } else {
                    svod.isVodInSeries = false;
                }

                // console.log('VOD name +++++++++++++++: ' + svod.name);

                svod.name = svod.name.replace('–', '-');

                var nameSplit = [];
                if (svod.name.indexOf(' - ') > 0) {
                    nameSplit = svod.name.split(' - ');
                } else if (svod.name.indexOf(' – ') > 0) {
                    nameSplit = svod.name.split(' – ');
                } else if (svod.name.indexOf('–') > 0) {
                    nameSplit = svod.name.split('–');
                } else if (svod.name.indexOf('-') > 0) {
                    nameSplit = svod.name.split('-');
                } else {
                    nameSplit = [svod.name];
                }

                if (nameSplit.length > 1) {
                    if (nameSplit[0].toUpperCase().indexOf('TẬP') >= 0) { // series
                        if (nameSplit.length === 4) { //have englisht title
                            svod.firstTitle = nameSplit[2].trim() + ' - ' + nameSplit[3].trim();
                            svod.secondTitle = nameSplit[0].trim() + ' : ' + nameSplit[1].trim();
                        } else if (nameSplit.length === 3) { //have englisht title
                            svod.firstTitle = nameSplit[2].trim();
                            svod.secondTitle = nameSplit[0].trim() + ' : ' + nameSplit[1].trim();
                        } else if (nameSplit.length === 2) { //have englisht title
                            svod.firstTitle = nameSplit[1].trim();
                            svod.secondTitle = nameSplit[0].trim();
                        } else { // dont have english title
                            svod.firstTitle = nameSplit[1];
                            svod.secondTitle = '';
                        }
                    } else if (nameSplit[0].toUpperCase().indexOf('PHẦN') >= 0) { //series with seasion
                        if (nameSplit.length === 3) { //have english title
                            svod.firstTitle = nameSplit[2].trim();
                            svod.secondTitle = nameSplit[0].trim() + ' : ' + nameSplit[1].trim();
                        } else if (nameSplit.length === 2) {
                            svod.firstTitle = nameSplit[1].trim();
                            svod.secondTitle = nameSplit[0].trim();
                        } else {
                            svod.firstTitle = '';
                            svod.secondTitle = '';
                        }
                    } else { //not series
                        if (nameSplit.length === 3) { //have english title
                            svod.firstTitle = nameSplit[1].trim() + ' : ' + nameSplit[2].trim();
                            svod.secondTitle = nameSplit[0].trim();
                        } else if (nameSplit.length === 2) { //have english title
                            svod.firstTitle = nameSplit[1].trim();;
                            svod.secondTitle = nameSplit[0].trim();;
                        } else {
                            svod.firstTitle = '';
                            svod.secondTitle = '';
                        }
                    }
                } else {
                    svod.firstTitle = nameSplit[0].trim();;
                    svod.secondTitle = '';
                }


                if (typeof vod.program.directors_text !== 'undefined' && vod.program.directors_text.length > 0 && vod.program.directors_text[0].text !== '') {
                    svod.directors = vod.program.directors_text[0].text;
                } else {
                    svod.directors = '';
                }

                if (typeof vod.program.actors_text !== 'undefined' && vod.program.actors_text.length > 0 && vod.program.actors_text[0].text !== '') {
                    svod.actors = vod.program.actors_text[0].text;
                } else {
                    svod.actors = '';
                }

                svod.genres = '';
                if (typeof vod.program.genres !== 'undefined' && vod.program.genres !== null) {
                    if (vod.program.genres.length > 1) {
                        angular.forEach(vod.program.genres, function(genres, key) {
                            if (key === vod.program.genres.length - 1) {
                                svod.genres = svod.genres + genres;
                            } else {
                                svod.genres = svod.genres + genres + ',';
                            }
                        });
                    } else {
                        svod.genres = vod.program.genres[0];
                    }
                } else {
                    svod.genres = '';
                }

                if (typeof vod.program.production_country !== 'undefined' && vod.program.production_country !== '') {
                    svod.country = vod.program.production_country.substring(0, vod.program.production_country.length - 1);
                } else {
                    svod.country = '';
                }

            }

            //check program.id for VOD
            if (typeof vod.program !== 'undefined') {
                svod.program_id = vod.program.id;
                // svod.program_categories = vod.program.categories[0].path[0];
            }

            //check isVisiable
            if (typeof vod.visible !== 'undefined' && vod.visible) {
                svod.isVisiable = true;
            }
            //check isPublish
            if (typeof vod.config !== 'undefined') {
                angular.forEach(vod.config, function(item, key) {
                    if (item.name === "Public" && item.value === "1") {
                        svod.isPublish = true;
                    }
                });
            }
            //check isVtvCab
            if (typeof vod.channel !== 'undefined' && typeof vod.channel.genres !== 'undefined') {
                angular.forEach(vod.channel.genres, function(item, key) {
                    if (item === "1:11:0:0") {
                        svod.isVtvCab = true;
                    }
                });
            }

            // check package
            angular.forEach(vod.product, function(product, key) {
                // Check  free
                svod.isFreeNoPair = checkFreeProduct(product);
                //check has Wifi package
                if (typeof product.purchase !== 'undefined' && product.purchasable === "false") {
                    svod.isWifiPackage = true;
                }
                // get purchasable product.
                if (product.type !== 'single' && product.purchasable === "true" && product.cclass.indexOf("HANDHELD") === 0) {
                    //check is exclusive package and purchased exclusive;
                    if (typeof product.exclusive !== 'undefined' && product.exclusive === "true" && product.purchasable === "true") {
                        svod.isExclusivePackage = true;
                        if (typeof product.purchase !== 'undefined') {
                            svod.isPurchasedExclusive = true;
                        }
                    }
                    if (typeof product.purchase !== 'undefined') {
                        svod.isPurchasedPackage = true;
                        svod.purchased_products.push(getLiteProduct(product));
                    } else {
                        svod.purchasable_products.push(getLiteProduct(product));
                    }
                }
                //check single
                if (product.type === 'single' && product.cclass.indexOf("HANDHELD") >= 0) {
                    svod.isSingleVOD = true;
                    svod.singleProductId = product.id;
                    //get vod format
                    if (product.cclass.length === 1) {
                        if (typeof product.location !== "undefined") {
                            if (product.location.device === "handheld") {
                                svod.vodLocator = product.location.locator;
                            }
                            //check encryption
                            if (product.location.device === 'handheld' && product.location.encryption === 'true') {
                                svod.isEncrypted = true;
                            }
                        }
                    } else {
                        //get vod format 1
                        angular.forEach(product.locations, function(location, key) {
                            if (location.device === "handheld") {
                                svod.vodLocator = location.locator;
                            }
                            //check encryption
                            if (location.device === 'handheld' && location.encryption === 'true') {
                                svod.isEncrypted = true;
                            }
                        });
                    }

                }

                if (vod.contentFormat) {
                    if (vod.contentFormat.toUpperCase() === 'HD') {
                        svod.contentFormat = 'HD';
                    } else {
                        svod.contentFormat = 'SD';
                    }
                } else {
                    svod.contentFormat = 'SD';
                }



            });


            if (svod.program) {
                var take = vod.program.display_runtime.split(':');
                var minutes = 0;
                if (take.length > 1) {
                    minutes = parseFloat(take[0]) * 60 + parseFloat(take[1]);
                } else if (take.length === 1) {
                    minutes = parseFloat(take[0]);

                }

                svod.duration = minutes;
            }

            return svod;
        }

        function transformSeriesVOD(seriesVod) {
            // console.log('transform series vod : --- ', seriesVod);
            var svod = seriesVod;
            svod.isSeries = true;
            svod.photoUrl = CONSTANT.API_HOST + '/api1/contents/categories/' + seriesVod.id + "/picture?width=215.000000&height=307.000000";
            console.log("seriename:", seriesVod.name, seriesVod.name[0].text);
            svod.name = seriesVod.name[0].text;
            svod.firstTitle = svod.name;
            svod.secondTitle = '';
            if (svod.description) svod.description = svod.description[0].text;

            svod.isSeriesEnd = false;
            angular.forEach(seriesVod.config, function(config, key) {
                if (config.name === 'seriesend' && config.value === 'true') {
                    svod.isSeriesEnd = true;
                }
            });
            return svod;
        }

        function transformSeriesVODList(seriesVodList) {
            var arrayTemp = [];
            angular.forEach(seriesVodList, function(vod, key) {
                var svod = transformSeriesVOD(vod);
                // console.log('VOD on OTT Check:',vod);
                arrayTemp.push(svod);
            });

            return arrayTemp;
        }

        function transformVODList(vodList) {
            var arrayTemp = [];
            angular.forEach(vodList, function(vod, key) {
                var svod = transformVOD(vod);
                // console.log('VOD on OTT Check:',vod);
                arrayTemp.push(svod);


            });

            return arrayTemp;
        }

    }
})();