'use strict';
angular
    .module('vietteltv')
    .controller('Controller', Controller);

Controller.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$document', 'FocusUtil', 'FocusConstant', 'focusController', 'CONSTANT', 'DataService', '$http', 'UltilService', 'VideoService', 'Principal', 'LoginService', 'Auth', 'toaster'];
/**
 * Controller
 * @author HoangCH
 * 
 * @param {any} $rootScope 
 * @param {any} $scope 
 * @param {any} $state 
 * @param {any} $timeout 
 * @param {any} $document 
 * @param {any} FocusUtil 
 * @param {any} FocusConstant 
 * @param {any} focusController 
 * @param {any} CONSTANT 
 * @param {any} DataService 
 * @param {any} $http 
 * @param {any} UltilService 
 * @param {any} VideoService 
 * @param {any} Principal 
 * @param {any} LoginService 
 * @param {any} Auth 
 * @param {any} toaster 
 */
function Controller($rootScope, $scope, $state, $timeout, $document, FocusUtil, FocusConstant, focusController, CONSTANT, DataService, $http, UltilService, VideoService, Principal, LoginService, Auth, toaster) {

    /*function declaration*/
    $scope.onScrollFinish = onScrollFinish;
    $scope.toggleIsPlaying = toggleIsPlaying;
    $scope.onVodFocused = onVodFocused;
    $scope.onScrollStart = onScrollStart;
    $scope.onRelatedVodFocused = onRelatedVodFocused;
    $scope.onCategoryVodFocused = onCategoryVodFocused;
    $scope.onEpisodeVodFocused = onEpisodeVodFocused;
    $scope.onCategoryMenuFocused = onCategoryMenuFocused;
    $scope.onChannelFocused = onChannelFocused;
    $scope.onVodBlurred = onVodBlurred;
    $scope.onCategoryMenuSelected = onCategoryMenuSelected;
    $scope.onSidebarCategoryFocused = onSidebarCategoryFocused;
    $scope.onChannelSelected = onChannelSelected;
    $scope.onChannelBlurred = onChannelBlurred;
    $scope.onVodSelected = onVodSelected;
    $scope.onCategoryVodSelected = onCategoryVodSelected;
    $scope.onRelatedVodSelected = onRelatedVodSelected;
    $scope.onEpisodeVodSelected = onEpisodeVodSelected;
    $scope.btnVodPlayFocusInDetail = btnVodPlayFocusInDetail;
    $scope.btnVodEpisodeFocusInDetail = btnVodEpisodeFocusInDetail;
    $scope.btnVodRelatedFocusInDetail = btnVodRelatedFocusInDetail;
    $scope.buttonFocusInSpotLight = buttonFocusInSpotLight;
    $scope.btnVodPlaySelected = btnVodPlaySelected;
    $scope.btnViewMoreSelected = btnViewMoreSelected;
    $scope.selectLoginCancelButton = selectLoginCancelButton;
    $scope.selectLoginButton = selectLoginButton;
    $scope.setMediaControllerTimer = setMediaControllerTimer;
    $scope.back = back;

    /* CONSTANT values definition */
    $scope.CATEGORY = CONSTANT.CATEGORY;
    $scope.DEPTH = {
        INDEX: 1,
        DETAIL: 2,
        CATEGORY: 3,
        PLAYER: 4,
        LOGIN: 5,
        DIALOG: 6
    };
    $scope.DEPTH_ZONE = {
        INDEX: {
            SPOTLIGHT: 1,
            CHANNEL: 2,
            CATEGORY: 3,
        },
        DETAIL: {
            SPOTLIGHT: 4,
            CHANNEL: 5,
            CATEGORY: 6,
        },
        CATEGORY: {
            VOD: 7,
            CHANNEL: 8
        }
    };

    /* Initial values are defined.*/
    $scope.currentCategory = CONSTANT.CATEGORY.COLORS;
    $scope.currentDepth = $scope.DEPTH.INDEX;
    $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
    var currentCategoryInHome;
    $scope.isOverviewDark = true;
    $scope.showMediaController = false;
    var lastDepth = $scope.currentDepth;
    var lastDepthZone = $scope.currentDepthZone;
    var items = CONSTANT.ITEMS;
    var fakeItem = CONSTANT.ITEM;
    $scope.dataCategory = [items, items, items, items, items, items, items, items, items, items, items];
    $scope.relatedPlaylist = items;
    $scope.episodePlaylist = items;
    var vodListByCategoryDefault = [fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem, fakeItem];;
    $scope.vodListByCategory = [];
    $scope.isVodCategoryOpened = false;
    $scope.bgImgUrl = CONSTANT.SPOTLIGHT_BG_IMG_URL;
    $scope.bgGradient1 = CONSTANT.SPOTLIGHT_BG_GRADIENT1;
    $scope.bgGradient2 = CONSTANT.SPOTLIGHT_BG_GRADIENT2;
    $scope.bgSize = CONSTANT.SPOTLIGHT_BG_SIZE;
    $scope.isAuthenticated = Principal.isAuthenticated;

    $timeout(function() { //display spotlight background image
        $scope.bgImgCoverOpacity = 0;
        $scope.bgImgUrl = CONSTANT.SPOTLIGHT_BG_IMG_URL;
    }, 400);

    $scope.login = {
        username: '',
        password: ''
            // password: 'qaz123'
    };

    $scope.CATEGORY_MENU = CONSTANT.PREPARED_DATA.CATEGORY_MENUS;
    var hls;
    var video;
    $scope.menuArray = [];
    $scope.headerMenus = [];
    $scope.homeCategoryNameList = [];
    $scope.homeCategoryDataMap = {};
    $scope.isMediaLoaderHidden = false;
    $scope.isMainLoaderShown = false;
    $scope.selectedSidebarCategory = null;
    var currentSpotlight = null;
    var allChannelList = null;
    var noCategoryInHome = 0;
    var isOnline = true;

    main();

    function main() {
        setInternetConnectionTimer();
        processKeydownEvent();

        $timeout(function() {
            DataService.getChannelList().then(function success(channelList) {
                allChannelList = channelList;
                updateCategoryListData(channelList, 0, true);
            }, function error(response) {
                console.error('Loi trong qua trinh goi getChannelList!');
                console.error(response);
            });
            DataService.getMenuCategories().then(function(menus) {
                $scope.menuArray = menus;
                noCategoryInHome = menus[0].children.length;
                var homeCategoryNameList = [];
                for (var index = 1; index < menus[0].children.length; index++) {
                    var menuItem = menus[0].children[index];
                    homeCategoryNameList.push({
                        'index': index,
                        'name': menuItem.this.name[0].text
                    });
                }

                $scope.homeCategoryNameList = homeCategoryNameList;
                for (var index = 1; index < menus[0].children.length; index++) {
                    var menuItem = menus[0].children[index];
                    if (UltilService.isSeriesCategory(menuItem)) {
                        processSeriesVODList(index, menuItem, UltilService.getVodCategoryId(menuItem));
                    } else {
                        processVODList(menuItem, index);
                    }
                }
                $scope.focusedMenu = menus[0];
            }, function() {
                console.error('menus retrieval failed.');
            });
            processSpotlightVodList();
        }, CONSTANT.EFFECT_DELAY_TIME);
    }

    function setInternetConnectionTimer() {
        setInterval(function() {
            isOnline = navigator.onLine;
            if (!isOnline) {
                console.log("mat ket noi .....");
                toaster.clear('*');
                toaster.pop({
                    type: 'warning',
                    title: 'Mất kết nối',
                    body: 'Mất kết nối. Vui lòng kiểm tra lại kết nối Internet để tiếp tục sử dụng ứng dụng!',
                    timeout: 6000
                });

                // $scope.dialog.show = true;
                // $scope.dialog.isConfirm = false;
                // $scope.dialog.message = "Mất kết nối. Vui lòng kiểm tra lại kết nối Internet để tiếp tục sử dụng ứng dụng!";
                // $scope.dialog.title = "Mất kết nối";
            }

        }, 1500);
    }


    function processSpotlightVodList() {
        var vodIdList = '';
        angular.forEach(CONSTANT.SPOTLIGHT_VOD_LIST, function(item, key) {
            vodIdList = vodIdList + item.vodId + ',';
        });
        vodIdList = vodIdList.substr(0, vodIdList.length - 1);
        DataService.getVodMoreInfoByProgramIdList(vodIdList).then(function success(spotlightVodList) {
            $timeout(function() { // Set 'focus' to specific element by 'focus' controller.
                $scope.isInitCompleted = true; // 'Welcome' page will be disappear by this line.
                $scope.isOverviewDark = false;
                spotlightVodList[0].bigPhotoUrl = CONSTANT.SPOTLIGHT_VOD_LIST[0].img;
                spotlightVodList[0].photoUrl = CONSTANT.SPOTLIGHT_VOD_LIST[0].img;
                spotlightVodList[0].isSpotlight = true;
                currentSpotlight = spotlightVodList[0];
                $scope.overview = spotlightVodList[0];
                $scope.lastOverview = $scope.overview;
                focusController.focus('btnView');
            }, 3000);
        }, function error() {});
    }

    /**
     * processVODList
     * @author HoangCH
     * @param {any} menuItem 
     * @param {any} index 
     */
    function processVODList(menuItem, index) {
        DataService.getVodListByCategoryId(UltilService.getVodCategoryId(menuItem)).then(function success(response) {
            var vodList = response;
            if (vodList) {
                updateCategoryListData(vodList, index, true);
            }
        }, function error(response) {
            console.error('Loi trong qua trinh goi getVodListByCategoryId!');
            console.error(response);
            setTimeout(function() {
                console.info('Reload when Connection Reset By Peer ...............................! ');
                // $state.reload();
                processVODList(menuItem, index);
            }, 200);
        });
    }

    function processSeriesVODList(index, menuItem, categoryId) {
        DataService.getSeriesVodList(categoryId, 16).then(function success(response) {
            var seriesVodList = response;
            if (seriesVodList) {
                updateCategoryListData(seriesVodList, index, true);
            }
        }, function error(response) {
            console.error('Loi trong qua trinh goi VodService.getSeriesVodList! Response = ');
            console.error(response);
            setTimeout(function() {
                console.info('Reload when Connection Reset By Peer ...............................! ');
                // $state.reload();
                processSeriesVODList(index, menuItem, categoryId);
            }, 200);
        });
    }
    var lastFocusedGroup;
    var categoryMenuFocusedGroup;
    var categoryVodFocusedGroup;
    var currentItemData;
    var isScrolling = false;

    function onScrollStart() {
        isScrolling = true;
    };

    function onScrollFinish() {
        isScrolling = false;
        updateOverview();
    }

    function toggleIsPlaying(isPlaying) { // Change button shape by '$scope.isPlaying' ('Play' <-> 'Pause')
        $scope.$applyAsync(function() {
            $scope.isPlaying = isPlaying;
        });

    }

    // The callback function which is called when each list component get the 'focus'.
    function onVodFocused($event, category, data, $index) {
        currentCategoryInHome = category;
        if ($scope.currentDepth === $scope.DEPTH.INDEX) {
            $scope.episodePlaylist = [];
            $scope.currentDetailRelatedList = null;
            $scope.currentDetailEpisodeList = null;
            $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.CATEGORY;
            var scrollCount = category;
            // Translate each list component to up or down.
            moveContainer(category, 'list-category', -CONSTANT.SCROLL_HEIGHT_OF_INDEX * scrollCount + 160);
            if (!data || !data || data.loaded === false) {
                return;
            }
            var item = data;
            currentItemData = item;
            if (typeof $scope.currentDetailOverview === 'undefined' || $scope.currentDetailOverview === null || (typeof $scope.currentDetailOverview !== 'undefined' && item.program.id !== $scope.currentDetailOverview.program.id)) { //not update UI when focus after return back from detail page
                setVodDetailPackground(currentItemData.bigPhotoUrl);
            }
            $scope.currentDetailOverview = null; //reset 
            isScrolling === false && updateOverview();
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        }
    }

    function onRelatedVodFocused($event, category, data, $index) {
        $scope.bgGradient1 = CONSTANT.CATEGORY_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_BG_SIZE;
        currentItemData = data;
        $timeout(function() { // Set 'focus' to specific element by 'focus' controller.
            $scope.bgImgCoverOpacity = 0;
            $scope.bgImgUrl = currentItemData.photoUrl;
        }, 400);
        isScrolling === false && updateOverview();
    }

    function onCategoryVodFocused($event, data, element, $index) {
        if (!data || !data || data.loaded === false) {
            return;
        }
        $scope.isVodCategoryOpened = true;
        currentItemData = data;
        isScrolling === false && updateOverview();
        var vodList = $scope.selectedSidebarCategory.vodListByCategory;
        var showElements = $('.category-vod-item:not(.item-fadeout)');
        var hideElements = $('.category-vod-item.item-fadeout');
        var isItemInView = false;
        var isItemBeforeView = false;
        var isItemAfterView = false;
        var isLoadMoreItems = false;
        var noItemPerRow = 8;
        var itemHeight;
        var noItemInView = 2;
        if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.VOD) {
            noItemPerRow = 8;
            itemHeight = 307;
            noItemInView = 2;
        } else {
            noItemPerRow = 5;
            itemHeight = 177;
            noItemInView = 3;
        }
        var currentRowCount = Math.floor($index / noItemPerRow);
        for (var index = 0; index < noItemPerRow * noItemInView; index++) {
            if (showElements[index]) {
                if (showElements[index].id === 'category-vod-item-' + $index) {
                    isItemInView = true;
                }
            }
        }
        for (var index = 0; index < hideElements.length; index++) {
            if (hideElements[index].id === 'category-vod-item-' + $index) {
                isItemBeforeView = true;
            }
        }

        if (!isItemInView && !isItemBeforeView) {
            isItemAfterView = true;
        }

        if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.VOD) {
            if ((vodList.length - $index <= noItemPerRow && vodList.length - $index > 0) && isItemAfterView) {
                isLoadMoreItems = true;
            }
        }

        if (isLoadMoreItems) { //current focused item in the second row fro bottom then load more items
            getMoreVodsInCategory(function() {
                if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.VOD) {
                    moveCategoryVodContainer(-(currentRowCount - 1) * itemHeight - 5);
                } else {
                    moveCategoryVodContainer(-(currentRowCount - 2) * (itemHeight + 7));
                }
                for (var index = 0; index < noItemPerRow; index++) {
                    var ele = showElements[index];
                    $(ele).addClass('item-fadeout');
                }
            });
        } else if (isItemAfterView && !isLoadMoreItems) { //move down without load more items
            if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.VOD) {
                moveCategoryVodContainer(-(currentRowCount - 1) * itemHeight - 5);
            } else {
                moveCategoryVodContainer(-(currentRowCount - 2) * (itemHeight + 7));
            }
            for (var index = 0; index < noItemPerRow; index++) {
                var ele = showElements[index];
                $(ele).addClass('item-fadeout');
            }
        } else if (isItemBeforeView) { //move up
            moveCategoryVodContainer(-currentRowCount * (itemHeight + 7));
            for (var index = $index - $index % noItemPerRow; index < $index - $index % noItemPerRow + noItemPerRow; index++) {
                var ele = $('#category-vod-item-' + index);
                ele.removeClass('item-fadeout');
            }
        }
        setMenuFocusedPackground('images/menu_bg_focused_' + $scope.selectedCategoryMenuIndex + '.jpg');
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        categoryVodFocusedGroup = FocusUtil.getData($event.currentTarget).group;
    }

    function updateEpisodesOfSeries(episodeVodList, $event) {
        currentItemData = episodeVodList[0];
        $scope.episodePlaylist = episodeVodList;
        $scope.currentDetailEpisodeList = episodeVodList;
        $scope.bgGradient1 = CONSTANT.CATEGORY_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_BG_SIZE;
        $timeout(function() { // Set 'focus' to specific element by 'focus' controller.
            $scope.bgImgCoverOpacity = 0;
            $scope.bgImgUrl = currentItemData.photoUrl;
        }, 400);
        isScrolling === false && updateOverview();
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
    }

    function onEpisodeVodFocused($event, category, data, $index) {
        if (!data || !data.item || data.item.loaded === false) {
            return;
        }
        $scope.bgGradient1 = CONSTANT.CATEGORY_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_BG_SIZE;
        currentItemData = data.item;
        $timeout(function() { // Set 'focus' to specific element by 'focus' controller.
            $scope.bgImgCoverOpacity = 0;
            $scope.bgImgUrl = currentItemData.photoUrl;
        }, 400);
        isScrolling === false && updateOverview();
    }

    function onCategoryMenuFocused($event, category, data, $index) {
        if ($scope.currentDepth === $scope.DEPTH.INDEX) {
            $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.CATEGORY;
            // Translate each list component to up or down.
            // moveContainer(category, 'list-category', -CONSTANT.SCROLL_HEIGHT_OF_INDEX * scrollCount);
            if (!data || !data.item || data.item.loaded === false) {
                return;
            }
            currentItemData = data.item;
            $scope.focusedMenu = currentItemData;
            setMenuFocusedPackground('images/menu_bg_focused_' + $index + '.jpg');
            categoryVodFocusedGroup = ''; //reset category vod focus
            // isScrolling === false && updateOverview();
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
            categoryMenuFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        }
    }

    function onChannelFocused($event, category, data, $index) {
        if ($scope.currentDepth === $scope.DEPTH.INDEX) {
            $scope.isOverviewDark = false;
            $scope.bgImgCoverOpacity = 0.3;
            $scope.bgImgCoverWidth = '100%';
            $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.CHANNEL;
            var scrollCount = category;
            // Translate each list component to up or down.
            moveContainer(category, 'list-category', -72);
            if (!data || !data.item || data.item.loaded === false) {
                return;
            }
            // $scope.channelOverview = data.item;
            $scope.overview = data.item;
            currentItemData = data.item;
            $scope.bgImgUrl = CONSTANT.SPOTLIGHT_BG_IMG_URL;
            $scope.bgGradient1 = CONSTANT.SPOTLIGHT_BG_GRADIENT1;
            $scope.bgGradient2 = CONSTANT.SPOTLIGHT_BG_GRADIENT2;
            $scope.bgSize = CONSTANT.SPOTLIGHT_BG_SIZE;

        }
    }
    // The callback function which is called when each list component lose the 'focus'.
    function onVodBlurred($event, category, data) {
        // console.log("The callback function which is called when each list component lose the 'focus'");
        // $scope.isOverviewDark = true;
    }

    function onCategoryMenuSelected($event, category, data, $index) {
        if (!data || !data.item || data.item.loaded === false) {
            console.log('item not loaded ++++++++++++++++++++ ');
            return;
        }
        if ($index === 0) { // Homepage
            moveToSpotlightDown();
        } else if ($index === 1) {
            $scope.overview = null;
            $scope.sidebarCategories = CONSTANT.CHANNEL_CATEGORY_LIST;
            $scope.selectedCategoryMenu = data.item.this.name[0].text;
            $scope.selectedCategoryMenuIndex = $index;
            $scope.vodListByCategory = [];
            $scope.isMainLoaderShown = true;
            changeDepth($scope.DEPTH.CATEGORY, function() {
                // focusController.focus('sidebar-category-item-0');
                $timeout(function() {
                    focusController.focus(document.getElementById('sidebar-category-item-0'));
                }, 300);
            });
            $scope.currentDepthZone = $scope.DEPTH_ZONE.CATEGORY.CHANNEL;
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        } else {
            $scope.overview = null;
            $scope.sidebarCategories = data.item.children;
            $scope.selectedCategoryMenu = data.item.this.name[0].text;
            $scope.selectedCategoryMenuIndex = $index;
            $scope.vodListByCategory = [];
            $scope.isMainLoaderShown = true;
            changeDepth($scope.DEPTH.CATEGORY, function() {
                focusController.focus(document.getElementById('sidebar-category-item-0'));
            });
            $scope.currentDepthZone = $scope.DEPTH_ZONE.CATEGORY.VOD;
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        }
    }

    function setCategoryPagePackground() {
        $scope.bgGradient1 = CONSTANT.CATEGORY_PAGE_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_PAGE_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_PAGE_BG_SIZE;
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function() {
            $scope.bgImgCoverOpacity = 0;
            $scope.bgImgUrl = CONSTANT.CATEGORY_PAGE_BG_IMG_URL;
        }, 400);
    }

    function setSpotlightPackground(bgrUrl, callback) {
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function() { // Set 'focus' to specific element by 'focus' controller.
            $scope.bgGradient1 = CONSTANT.SPOTLIGHT_BG_GRADIENT1;
            $scope.bgGradient2 = CONSTANT.SPOTLIGHT_BG_GRADIENT2;
            $scope.bgSize = CONSTANT.SPOTLIGHT_BG_SIZE;
            $scope.bgImgCoverOpacity = 0;
            if (bgrUrl) {
                $scope.bgImgUrl = bgrUrl;
            } else {
                $scope.bgImgUrl = CONSTANT.SPOTLIGHT_BG_IMG_URL;
            }
            callback && callback();
        }, CONSTANT.EFFECT_DELAY_TIME);
    }

    function moveToSpotlightDown() {
        $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
        setSpotlightPackground(currentSpotlight.bigPhotoUrl, function() {
            focusController.focus('btnView');
        });
        $('.menu-container ').css({
            transform: 'translate3d(0,-1080px,0)'
        });
        $('.overview-container ').css({
            transform: 'translate3d(0,0px,0)'
        });
        $('.list-category').css({
            transform: 'translate3d(0,0px,0)'
        });
    }

    function moveToCategoryMenu() {
        $('.menu-container ').css({
            transform: 'translate3d(0,0px,0)'
        });
        $('.overview-container ').css({
            transform: 'translate3d(0,1080px,0)'
        });
        $('.list-category').css({
            transform: 'translate3d(0,1080px,0)'
        });
    }

    function setCategoryVodFocusedPackground(bgrUrl) {
        $scope.bgGradient1 = CONSTANT.CATEGORY_VOD_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_VOD_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_VOD_BG_SIZE;
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function() {
            $scope.bgImgCoverOpacity = 0;
            if (bgrUrl) {
                $scope.bgImgUrl = bgrUrl;
            } else {
                $scope.bgImgUrl = CONSTANT.CATEGORY_VOD_BG_IMG_URL;
            }
        }, 400);
    }

    function setCategoryChannelFocusedPackground(bgrUrl) {
        $scope.bgGradient1 = CONSTANT.CATEGORY_CHANNEL_PAGE_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.CATEGORY_CHANNEL_PAGE_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.CATEGORY_CHANNEL_PAGE_BG_SIZE;
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function() {
            $scope.bgImgCoverOpacity = 0;
            if (bgrUrl) {
                $scope.bgImgUrl = bgrUrl;
            } else {
                $scope.bgImgUrl = CONSTANT.CATEGORY_CHANNEL_PAGE_BG_IMG_URL;
            }
        }, 400);
    }

    function setVodDetailPackground(bgrUrl) {
        $scope.bgGradient1 = CONSTANT.VOD_DETAIL_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.VOD_DETAIL_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.VOD_DETAIL_BG_SIZE;
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function() {
            $scope.bgImgCoverOpacity = 0;
            if (bgrUrl) {
                $scope.bgImgUrl = bgrUrl;
            } else {
                $scope.bgImgUrl = CONSTANT.VOD_DETAIL_BG_IMG_URL;
            }
        }, 400);
    }

    function setMenuFocusedPackground(bgrUrl) {
        $scope.bgGradient1 = CONSTANT.MENU_BG_GRADIENT1;
        $scope.bgGradient2 = CONSTANT.MENU_BG_GRADIENT2;
        $scope.bgSize = CONSTANT.MENU_BG_SIZE;
        $scope.bgImgCoverOpacity = 1;
        $scope.bgImgCoverWidth = '100%';
        $timeout(function() {
            $scope.bgImgCoverOpacity = 0;
            if (bgrUrl) {
                $scope.bgImgUrl = bgrUrl;
            } else {
                $scope.bgImgUrl = CONSTANT.MENU_BG_IMG_URL;
            }
        }, 400);
    }

    function onSidebarCategoryFocused($event, item, $index) {
        $scope.isVodCategoryOpened = false;
        if (!item) {
            return;
        }

        $scope.selectedSidebarCategory = item;
        $scope.vodListByCategory = [];
        $scope.isVodCategoryOpened = false;
        moveCategoryVodContainer(0); //reset container position
        $('.item-fadeout').removeClass('item-fadeout'); //clear hidden item in container
        if (item.vodListByCategory && item.vodListByCategory.length > 0) {
            $scope.vodListByCategory = item.vodListByCategory;
            $scope.overview = null;
            $scope.isMainLoaderShown = false;
        } else {
            var offset = 0;
            var limit = 24;
            if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.CHANNEL) {
                if ($index === 0) { // all channels
                    $scope.vodListByCategory = allChannelList;
                    item.vodListByCategory = allChannelList;
                } else {
                    var tempChannelList = [];
                    angular.forEach(allChannelList, function(channelItem, key) {
                        var configServices = ',' + $scope.selectedSidebarCategory.CONFIG_SERVICES + ',';
                        if (configServices.indexOf(',' + channelItem.service_id + ',') >= 0) {
                            tempChannelList.push(channelItem);
                        }
                        $scope.vodListByCategory = tempChannelList;
                        item.vodListByCategory = tempChannelList;
                    });
                }
                $scope.overview = null;
                $scope.isMainLoaderShown = false;
            } else {
                retrieveVodListInCategory($scope.selectedSidebarCategory, limit, offset);
            }
        }
    }

    function getMoreVodsInCategory(callback) {
        var selectedSidebarCategory = $scope.selectedSidebarCategory;
        var offset = selectedSidebarCategory.vodListByCategory.length;
        var limit = offset + 24;
        retrieveVodListInCategory(selectedSidebarCategory, limit, offset, callback);
    }

    function retrieveVodListInCategory(sidebarCategory, limit, offset, callback) {
        var cb = callback || angular.noop;
        $scope.isMainLoaderShown = true;
        if (UltilService.isSeriesCategory(sidebarCategory)) {
            DataService.getCategorySeriesVodListByCategoryId(UltilService.getVodCategoryId(sidebarCategory), limit, offset).then(function success(response) {
                var seriesVodList = response;
                if (seriesVodList) {
                    $scope.vodListByCategory = $scope.vodListByCategory.concat(seriesVodList);
                    sidebarCategory.vodListByCategory = $scope.vodListByCategory;
                    $scope.overview = null;
                    $scope.isMainLoaderShown = false;
                    return cb();
                }
            }, function error(response) {
                console.error('Loi trong qua trinh goi getVodListByCategoryId!');
                console.error(response);
                setTimeout(function() {
                    console.info('Reload when Connection Reset By Peer ...............................! ');
                }, 200);
            });
        } else {
            DataService.getCategoryVodListByCategoryId(UltilService.getVodCategoryId(sidebarCategory), limit, offset).then(function success(response) {
                var vodList = response;
                if (vodList) {
                    $scope.vodListByCategory = $scope.vodListByCategory.concat(vodList);
                    sidebarCategory.vodListByCategory = $scope.vodListByCategory;
                    $scope.overview = null;
                    $scope.isMainLoaderShown = false;
                    return cb();
                }
            }, function error(response) {
                console.error('Loi trong qua trinh goi getVodListByCategoryId!');
                console.error(response);
                setTimeout(function() {
                    console.info('Reload when Connection Reset By Peer ...............................! ');
                    // $state.reload();
                    // processVODList(menuItem, index);
                }, 200);
            });
        }
    }

    function onChannelSelected($event, category, data) {
        if (!data || !data.item || data.item.loaded === false) {
            return;
        }
        $scope.channelOverview = data.item;
        $scope.overview = data.item;
        VideoService.stopStream(video);
        video = $('#videoMainPlay')[0];
        $scope.isMediaLoaderHidden = false;
        changeDepth($scope.DEPTH.PLAYER);
        VideoService.playChannelStream($scope.overview, video).then(function success(response) {
            $timeout(function() {
                $scope.isMediaLoaderHidden = true;
            }, 700);
        }, function error(response) {});
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
    }

    function onChannelBlurred($event, category, data) {
        $scope.isOverviewDark = true;
        $scope.channelWatchPreviewLoaded = false;
    }

    // The callback function which is called when user select one item of the list component.
    function onVodSelected($event, category, item, $index) {
        if (item.loaded === false) {
            return;
        }
        goToVodDetailPage(item);
    }

    function onCategoryVodSelected($event, item, $index) {
        if (item.loaded === false) {
            return;
        }

        $scope.isMediaLoaderHidden = false;
        if ($scope.currentDepthZone === $scope.DEPTH_ZONE.CATEGORY.CHANNEL) {
            VideoService.stopStream(video);
            video = $('#videoMainPlay')[0];
            $scope.isMediaLoaderHidden = false;
            changeDepth($scope.DEPTH.PLAYER);
            VideoService.playChannelStream(item, video).then(function success(response) {
                $timeout(function() {
                    $scope.isMediaLoaderHidden = true;
                }, 300);
            }, function error(response) {});
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        } else {
            lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
            categoryVodFocusedGroup = FocusUtil.getData($event.currentTarget).group;
            lastDepth = $scope.DEPTH.CATEGORY;
            $scope.lastDepthZone = '';
            goToVodDetailPage(item);
        }
    }

    function onRelatedVodSelected($event, category, item, $index) {
        if (item.loaded === false) {
            return;
        }
        playVOD(item);
    }

    function onEpisodeVodSelected($event, category, data, $index) {
        if (!data || !data.item || data.item.loaded === false) {
            return;
        }
        playVOD(data.item);
    }

    function goToVodDetailPage(vod) {
        $scope.currentItemData = null;
        updateOverview();
        if (lastFocusedGroup !== 'VOD_LIST_CATEGORY') {
            updateRelatedEpisodeListInDetail(vod);
        } else {
            vod.relateds = [];
            vod.episodes = [];
            if (vod.isVodInSeries) {
                DataService.getRelatedVodList(vod.program.programId).then(function(relatedVodList) {
                    vod.relateds = relatedVodList;
                    var seriesId = vod.program.series.id;
                    DataService.getEpisodesInSeries(seriesId).then(function(episodeVodList) {
                        vod.episodes = episodeVodList;
                        updateRelatedEpisodeListInDetail(vod);
                    }, function(response) {});
                }, function error(response) {
                    console.error('Loi trong qua trinh goi DataService.getRelatedVodList! Response = ');
                    console.error(response);
                });
            } else if (vod.isSeries) {
                DataService.getEpisodeListBySeriesId(vod.id).then(function(episodeVodList) {
                    vod = episodeVodList[0];
                    vod = UltilService.transformVOD(vod);
                    vod.episodes = episodeVodList;
                    DataService.getRelatedVodList(vod.program.id).then(function(relatedVodList) {
                        vod.relateds = relatedVodList;
                        updateRelatedEpisodeListInDetail(vod);
                    });
                }, function error(response) {
                    console.error('Loi trong qua trinh goi DataService.getEpisodeListBySeriesId! Response = ');
                    console.error(response);
                });
            } else {
                DataService.getRelatedVodList(vod.program.id).then(function(relatedVodList) {
                    vod.relateds = relatedVodList;
                    updateRelatedEpisodeListInDetail(vod);
                }, function error(response) {
                    console.error('Loi trong qua trinh goi DataService.getRelatedVodList! Response = ');
                    console.error(response);
                });
            }
        }
    }

    function updateRelatedEpisodeListInDetail(vod) {
        $scope.relatedPlaylist = vod.relateds;
        $scope.episodePlaylist = vod.episodes;
        $scope.currentDetailRelatedList = $scope.relatedPlaylist;
        $scope.currentDetailOverview = vod;
        currentItemData = vod;
        $scope.isRelatedShown = false; //show related list on detail vod page
        $scope.isEpisodeShown = false;
        $scope.isEpisodeBtnNotShown = true;
        if ($scope.relatedPlaylist.length > 0) {
            $scope.isRelatedShown = true; //show related list on detail vod page
            if ($scope.episodePlaylist.length > 0) {
                $scope.isEpisodeBtnNotShown = false;
            } else {
                $scope.isEpisodeBtnNotShown = true;
            }
        } else {
            $scope.isRelatedShown = false;
            if ($scope.episodePlaylist.length > 0) {
                $scope.isEpisodeShown = true;
                $scope.isEpisodeBtnNotShown = true;
            } else {
                $scope.isEpisodeShown = false;
                $scope.isEpisodeBtnNotShown = false;
            }
        }
        var depth;
        depth = $scope.DEPTH.DETAIL;
        depth && changeDepth(depth);
        updateOverview();
        if ($scope.lastDepthZone !== $scope.DEPTH_ZONE.INDEX.SPOTLIGHT && vod.isSpotlight !== true) {
            setVodDetailPackground(vod.bigPhotoUrl);
        }

        if (vod.isSpotlight === true && $scope.lastDepthZone !== $scope.DEPTH_ZONE.INDEX.SPOTLIGHT) {
            setSpotlightPackground(vod.bigPhotoUrl);
        }
        $timeout(function() {
            $('#list-related-vod').trigger('reload');
            $('#list-episode-vod').trigger('reload');
        }, 0);
    }
    $scope.isRelatedShown = false;

    function btnVodPlayFocusInDetail($event, $originalEvent) {
        $scope.isOverviewDark = false;
        if ($scope.currentDetailOverview) {
            $scope.overview = $scope.currentDetailOverview;
        }

        if ($scope.currentDetailRelatedList) {
            $scope.relatedPlaylist = $scope.currentDetailRelatedList;
        }

        if ($scope.currentDetailEpisodeList) {
            $scope.episodePlaylist = $scope.currentDetailEpisodeList;
        }

        if ($scope.lastDepthZone !== $scope.DEPTH_ZONE.INDEX.SPOTLIGHT && lastDepth !== $scope.DEPTH.PLAYER && lastDepth !== $scope.DEPTH.CATEGORY) {
            updateRelatedEpisodeListInDetail($scope.currentDetailOverview);
        }
        lastDepth = $scope.DEPTH.DETAIL;
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        $scope.lastDepthZone = $scope.DEPTH_ZONE.DETAIL.SPOTLIGHT;
    }

    function btnVodEpisodeFocusInDetail($event, $originalEvent) {
        $scope.isOverviewDark = false;
        $scope.isEpisodeShown = true;
        $scope.isRelatedShown = false;
        if ($scope.currentDetailOverview) {
            $scope.overview = $scope.currentDetailOverview;
        }
        if ($scope.currentDetailEpisodeList) {
            $scope.episodePlaylist = $scope.currentDetailEpisodeList;
        }
    }

    function btnVodRelatedFocusInDetail($event, $originalEvent) {
        $scope.isOverviewDark = false;
        $scope.isEpisodeShown = false;
        if ($scope.relatedPlaylist.length > 0) {
            $scope.isRelatedShown = true; //show related list on detail vod page
        }
    }

    function buttonFocusInSpotLight($event, $originalEvent) {
        $scope.isOverviewDark = false;
        $scope.lastDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
        $scope.overview = $scope.lastOverview;
        $scope.currentCategory = '';
        $scope.currentDetailOverview = null;
    }

    function playVOD(vod) {
        if (!$scope.isAuthenticated()) {
            LoginService.openLoginPage(function() {
                lastDepth = $scope.DEPTH.DETAIL;
                changeDepth($scope.DEPTH.LOGIN);
                focusController.focus('btnLogin');
            });
        } else {
            video = $('#videoMainPlay')[0];
            if ($rootScope.isAppLoadedAfterLogin) {
                lastDepth = $scope.DEPTH.DETAIL;
                playVODStream(vod, video);
            } else {
                DataService.getVodDetails($scope.overview.program.id).then(function success(responseVod) {
                    $scope.overview = responseVod;
                    lastDepth = $scope.DEPTH.DETAIL;
                    playVODStream($scope.overview, video);
                }, function error(response) {
                    console.error('load  playVODStream error : ---- : ', response);
                });
            }
        }
    }

    function btnVodPlaySelected($event) {
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        playVOD($scope.overview);
    }


    function btnViewMoreSelected($event, item) {
        $scope.isMainLoaderShown = true;
        $scope.lastDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
        goToVodDetailPage(item);
        lastFocusedGroup = FocusUtil.getData($event.currentTarget).group;
        $timeout(function() {
            $scope.isMainLoaderShown = false;
        }, 200);
    }

    function playVODStream(vod, video) {
        var playable = false;
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
            $scope.isMediaLoaderHidden = false;
            changeDepth($scope.DEPTH.PLAYER);
            VideoService.playVODStream(vod, video).then(function success(response) {
                $timeout(function() {
                    $scope.isMediaLoaderHidden = true;
                }, 1000);
            }, function error(response) {
                console.error('load  playVODStream error : ---- : ', response);
            });
        } else {
            toaster.clear('*');
            toaster.pop({
                type: 'warning',
                title: 'Không xem được Video',
                body: 'Bạn cần mua gói dịch vụ trên ứng dụng ViettelTV phiên bản cho Mobile để tiếp tục xem Video!',
                timeout: 10000
            });
            $scope.isMediaLoaderHidden = true;
        }
    }

    function selectLoginCancelButton(event) {
        $scope.back();
    }

    function selectLoginButton(event) {
        event.preventDefault();
        $scope.isMainLoaderShown = true;
        Auth.login({
            username: $scope.login.username,
            password: $scope.login.password
        }).then(function(response) {
            $scope.isMainLoaderShown = false;
            if (response.data.error) {
                $scope.authenticationError = true;
                console.error("login failed");
                toaster.clear('*');
                toaster.pop({
                    type: 'error',
                    title: 'Đăng nhập không thành công',
                    body: 'Số điện thoại hoặc mật khẩu không đúng!',
                    timeout: 10000
                });
                toaster.clear(toastInstance);
            } else {
                // isLoginOK = true;
                removeKeyboardListenerFunc();
                $scope.authenticationError = false;
                LoginService.closeLoginPage();
                Principal.identity().then(function(account) {
                    $scope.isAuthenticated = Principal.isAuthenticated;
                    toaster.clear('*');
                    toaster.pop({
                        type: 'success',
                        title: 'Đăng nhập thành công',
                        timeout: 2000
                    });
                });
                changeDepth($scope.DEPTH.DETAIL);
            }
            // $state.reload();
            // window.location.reload();
        }).catch(function() {
            $scope.authenticationError = true;
            console.error("login failed");
        });
    };

    $scope.isChannel = false;
    $scope.setting = {
        subTitle: true
    };

    function processKeydownEvent() {
        focusController.addBeforeKeydownHandler(function(context) {
            if (!isOnline) return;

            $scope.isChannel = false;
            if ($scope.isInitCompleted === false) return;
            if ($scope.currentDepth === $scope.DEPTH.PLAYER && !$scope.overview.channel) {
                console.log('not channel ... ');
                if (context.event.keyCode !== CONSTANT.KEY_CODE.RETURN) {
                    if ($scope.showMediaController === false) {
                        $scope.setMediaControllerTimer();
                        return false;
                    } else {
                        $scope.setMediaControllerTimer();
                    }
                }

                $scope.isChannel = false;
            } else if ($scope.overview && $scope.overview.channel) {
                $scope.isChannel = true;
                $scope.setting.channel = true;
            }

            if ($scope.currentDepth === $scope.DEPTH.INDEX) {
                $scope.currentFocusItem = focusController.getCurrentFocusItem();
                var currentCategory = $($scope.currentFocusItem).parents('.list-area');
                switch (context.event.keyCode) {
                    case CONSTANT.KEY_CODE.UP:
                        if (currentCategory.length > 0) { //current focus on category
                            removeFadeoutUpClassToItem(currentCategory);
                        }
                        if (currentCategory.parent().prev().find('.list-area').length > 0) { // previous category exist
                            removeFadeoutUpClassToItem(currentCategory.parent().prev().find('.list-area'));
                        }
                        if ($($scope.currentFocusItem).parents('.list-area').parent().is(':first-child')) { //focusing on category items
                            $scope.lastDepthZone = $scope.currentDepthZone;
                            $scope.currentDepthZone = $scope.DEPTH_ZONE.INDEX.SPOTLIGHT;
                            $scope.overview = $scope.lastOverview;
                            //change background on spotlight
                            setSpotlightPackground(currentSpotlight.bigPhotoUrl, function() {
                                focusController.focus('btnView');
                            });
                            $('.list-category').css({
                                transform: 'translate3d(0, 0px, 0)'
                            });
                            return false;
                        } else if ($($scope.currentFocusItem).hasClass('btn-view')) { //focusing on spotlight
                            moveToCategoryMenu();
                        }
                        break;
                    case CONSTANT.KEY_CODE.DOWN:
                        if ($($scope.currentFocusItem).parents('.list-area.channel').length > 0) {
                            VideoService.stopStream(video);
                        }

                        if (currentCategory.length > 0 && currentCategoryInHome <= noCategoryInHome - 2) { //current focus on category
                            addFadeoutUpClassToItem(currentCategory);
                        }
                        if ($($scope.currentFocusItem).parents('.category-menu-list').length > 0) { //current focused item on category menu
                            $scope.bgImgCoverOpacity = 1;
                            //change background on spotlight
                            moveToSpotlightDown();
                            return false;
                        }
                        break;
                    case CONSTANT.KEY_CODE.RETURN:
                    case CONSTANT.KEY_CODE.BACK:
                    case CONSTANT.KEY_CODE.ESC:
                        $scope.back();
                        break;
                }
            } else if ($scope.currentDepth === $scope.DEPTH.CATEGORY) {
                $scope.currentFocusItem = focusController.getCurrentFocusItem();
                switch (context.event.keyCode) {
                    case CONSTANT.KEY_CODE.UP:
                        if ($scope.currentFocusItem.id === 'sidebar-category-item-0') {
                            $scope.back();
                        }
                        break;
                    case CONSTANT.KEY_CODE.DOWN:
                        break;
                    case CONSTANT.KEY_CODE.RETURN:
                    case CONSTANT.KEY_CODE.BACK:
                    case CONSTANT.KEY_CODE.ESC:
                        $scope.back();
                        break;
                }
            } else {
                switch (context.event.keyCode) {
                    case CONSTANT.KEY_CODE.UP:
                        break;
                    case CONSTANT.KEY_CODE.DOWN:
                        break;
                    case CONSTANT.KEY_CODE.RETURN:
                    case CONSTANT.KEY_CODE.BACK:
                    case CONSTANT.KEY_CODE.ESC:
                        $scope.back();
                        break;
                }
            }
        });
    }

    function getPlayerControls() {
        return {
            play: function() {
                $timeout(function() {
                    $('#player .icon-caph-play').parent().trigger('selected');
                }, 500);
            },
            pause: function() {
                $('#player .icon-caph-pause').parent().trigger('selected');
            },
            restart: function() {
                $('#player .icon-caph-prev').parent().trigger('selected');
            },
            rewind: function() {
                $('#player .icon-caph-rewind').parent().trigger('selected');
            },
            forward: function() {
                $('#player .icon-caph-forward').parent().trigger('selected');
            },
            next: function() {
                $('#player .icon-caph-next').parent().trigger('selected');
            }
        };
    }

    var mediaControllerTimer;

    function setMediaControllerTimer() {
        $scope.showMediaController = true;
        if (mediaControllerTimer) {
            $timeout.cancel(mediaControllerTimer);
        }
        mediaControllerTimer = $timeout(function() {
            $scope.showMediaController = false;
            mediaControllerTimer = null;
        }, CONSTANT.MEDIA_CONTROLLER_TIMEOUT);
    }

    // 'Changing depth' means the scene is changed.
    function changeDepth(depth, callback) {
        lastDepth = $scope.currentDepth;
        $scope.currentDepth = depth;
        $timeout(function() {
            focusController.setDepth(depth);
            if (depth === $scope.DEPTH.DETAIL) {
                focusController.focus('btnPlay');
            }
            callback && callback();
        }, CONSTANT.EFFECT_DELAY_TIME);
    }

    // Update and reload data for each list component.
    function updateCategoryListData(response, category, reload) {
        $scope.dataCategory[category] = response;
        // console.log("dataCategory: ", $scope.dataCategory);
        $timeout(function() {
            reload && $('#list-' + category).trigger('reload');
        }, 0);
    }

    // Change data on overview.
    function updateOverview() {
        $scope.overview = currentItemData;
        $scope.isOverviewDark = false;
    }

    // Translate specific element using css property 'transform'.
    /**
     * 
     * 
     * @param {any} category 
     * @param {any} regionId 
     * @param {any} targetTop 
     * @returns 
     */

    function moveContainer(category, regionId, targetTop) {
        if (category === $scope.currentCategory) {
            return;
        }
        $('.' + regionId).css({
            transform: 'translate3d(0, ' + targetTop + 'px, 0)'
        });
        $scope.currentCategory = category;
    }

    /**
     * moveCategoryVodContainer
     * 
     * @param {any} regionId 
     * @param {any} targetTop 
     */
    function moveCategoryVodContainer(targetTop) {
        $('.category-container').css({
            transform: 'translate3d(0, ' + targetTop + 'px, 0)'
        });
    }

    function back() {
        if ($scope.currentDepth === $scope.DEPTH.INDEX) {
            $scope.dialog.show = true;
            $scope.dialog.isConfirm = true;
            $scope.dialog.message = "Bạn có muốn thoát ứng dụng ViettelTV không?";
            $scope.dialog.title = "Thoát ứng dụng";
            return;
        }

        var focusClass;
        var targetDepth;
        switch ($scope.currentDepth) {
            case $scope.DEPTH.DETAIL:
                if (categoryVodFocusedGroup === 'VOD_LIST_CATEGORY') {
                    $scope.bgImgUrl = '';
                    $scope.relatedPlaylist = [CONSTANT.ITEM];
                    targetDepth = $scope.DEPTH.CATEGORY;
                    $scope.currentDepth = $scope.DEPTH.CATEGORY;
                    $timeout(function() {
                        focusController.setDepth(targetDepth, categoryVodFocusedGroup);
                        // lastFocusedGroup = categoryMenuFocusedGroup;
                    }, CONSTANT.EFFECT_DELAY_TIME);
                } else {
                    $scope.relatedPlaylist = [CONSTANT.ITEM];
                    targetDepth = $scope.DEPTH.INDEX;
                    $scope.currentDepth = $scope.DEPTH.INDEX;
                    $timeout(function() {
                        focusController.setDepth(targetDepth, lastFocusedGroup);
                    }, CONSTANT.EFFECT_DELAY_TIME);
                }
                break;
            case $scope.DEPTH.PLAYER:
                $scope.showMediaController = false;
                mediaControllerTimer = null;
                VideoService.stopStream(video);
                targetDepth = lastDepth;
                $timeout(function() {
                    focusController.setDepth(targetDepth, lastFocusedGroup);
                    lastDepth = $scope.DEPTH.PLAYER;
                }, CONSTANT.EFFECT_DELAY_TIME);
                focusClass = '.btn-resume';
                break;
            case $scope.DEPTH.LOGIN:
                LoginService.closeLoginPage();

                targetDepth = lastDepth;
                focusClass = '.btn-resume';
                $timeout(function() {
                    focusController.setDepth(targetDepth, lastFocusedGroup);
                }, CONSTANT.EFFECT_DELAY_TIME);
                break;
            case $scope.DEPTH.CATEGORY:
                var currentGroup = focusController.getCurrentGroup();
                if (currentGroup === 'VOD_LIST_CATEGORY') {
                    targetDepth = $scope.DEPTH.CATEGORY;
                    $timeout(function() {
                        focusController.setGroup('SIDEBAR_CATEGORY');
                    }, 150);
                } else {
                    targetDepth = $scope.DEPTH.INDEX;
                    $timeout(function() {
                        focusController.setDepth(targetDepth, categoryMenuFocusedGroup);
                    }, CONSTANT.EFFECT_DELAY_TIME);
                }
                focusClass = '.btn-resume';
                break;
            default:
                targetDepth = $scope.DEPTH.INDEX;
                break;
        }
        $scope.currentDepth = targetDepth;

        focusController.focus($(focusClass));
    }

    function isCurrentItemOnChannel() {
        return $($scope.currentFocusItem).parents('.list-area.channel').length > 0;
    }

    function addFadeoutUpClassToItem(item) {
        item.addClass('list-fadeout-up');
    }

    function removeFadeoutUpClassToItem(item) {
        item.removeClass('list-fadeout-up');
    }

    $scope.dialog = {
        show: false,
        center: true,
        isConfirm: true,
        focusOption: {
            depth: $scope.DEPTH.DIALOG
        },
        onSelectButton: function(buttonIndex, $event) {
            if ($scope.dialog.isConfirm) {
                if (buttonIndex === 0) {
                    tizen.application.getCurrentApplication().exit();
                } else {
                    $scope.dialog.show = false;

                }
            } else {
                $scope.dialog.show = false;
            }

        }

    };

}