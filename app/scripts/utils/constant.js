'use strict';

app.factory('CONSTANT', function() {
    var ITEM = {
        loaded: false
    };


    var SERIES_CATEGORIES_BY_NAME = [
        'PHIM BỘ', 'PHIM BỘ MIỄN PHÍ', 'KHU VƯỜN PHIM BỘ', 'Tiếng Anh lớp 6', 'Luyện Thi Toeic', 'YanTV', 'TV Show', 'Toán lớp 6', 'Tiếng Việt lớp 6', 'Toán lớp 10', 'Ngữ văn lớp 10', 'Tiếng Anh lớp 10', 'Toán THPTQG', 'Lý THPTQG', 'Hóa THPTQG', 'Giáo dục'
    ];

    return {
        API_HOST: 'http://otttv.viettel.com.vn',
        HTTPS_API_HOST: 'https://otttv.viettel.com.vn',
        RECOMMENDATION_API_HOST: 'http://otttv.viettel.com.vn',

        SERIES_CATEGORIES_BY_NAME: SERIES_CATEGORIES_BY_NAME,
        ITEM: ITEM,
        ITEMS: [ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM, ITEM],
        CATEGORY: {
            MENU: 0,
            CHANNEL: 1,
            COLORS: 2,
            ALPHABETS: 3,
            NUMBERS: 4,
            RELATED_PLAY_LIST: 5,
            RELATED_PLAY_LIST2: 6


        },
        EFFECT_DELAY_TIME: 500,
        SCROLL_HEIGHT_OF_INDEX: 380, // 297, //269, //369, 265+28
        MEDIA_CONTROLLER_TIMEOUT: 3500,
        KEY_CODE: {
            RETURN: 10009,
            ESC: 27,
            UP: 38,
            DOWN: 40,
            BACK: 461 //for LG TV
        },
        SPOTLIGHT_BG_GRADIENT1: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, transparent)',
        SPOTLIGHT_BG_GRADIENT2: 'linear-gradient(to top, rgba(0, 0, 0, 1) 5%, transparent)',
        // SPOTLIGHT_BG_SIZE: '80% 100%, 60% 0%, 100% 100%',
        SPOTLIGHT_BG_SIZE: '100%',
        SPOTLIGHT_BG_IMG_URL: "images/spotlight_movie.jpg",
        SPOTLIGHT_BG_WIDTH: '100%',

        CATEGORY_PAGE_BG_GRADIENT1: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, transparent)',
        CATEGORY_PAGE_BG_GRADIENT2: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, transparent)',
        CATEGORY_PAGE_BG_SIZE: '40% 100%, 0% 0%, 100% 100%',
        CATEGORY_PAGE_BG_IMG_URL: "images/spotlight_movie.jpg",

        CATEGORY_CHANNEL_PAGE_BG_GRADIENT1: 'linear-gradient(to right, rgb(0, 0, 0) 0%, transparent)',
        CATEGORY_CHANNEL_PAGE_BG_GRADIENT2: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, transparent)',
        CATEGORY_CHANNEL_PAGE_BG_SIZE: '100% 100%, 100% 100%, 100% 100%',
        CATEGORY_CHANNEL_PAGE_BG_IMG_URL: "images/menu_bg_focused_1.jpg",

        MENU_BG_GRADIENT1: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, transparent)',
        MENU_BG_GRADIENT2: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, transparent)',
        MENU_BG_SIZE: '100%',
        MENU_BG_IMG_URL: "images/menu_bg_focused_0.jpg",
        MENU_BG_WIDTH: '100%',

        CATEGORY_BG_GRADIENT1: 'linear-gradient(to right, rgb(0, 0, 0) 40%, transparent)',
        CATEGORY_BG_GRADIENT2: 'linear-gradient(to top, rgb(0, 0, 0) 60%, transparent)',
        CATEGORY_BG_SIZE: '100% 100%, 60% 40%, 60% 100%',

        CATEGORY_VOD_BG_GRADIENT1: 'linear-gradient(to right, rgb(0, 0, 0) 40%, transparent)',
        CATEGORY_VOD_BG_GRADIENT2: 'linear-gradient(to top, rgb(0, 0, 0) 0%, transparent)',
        CATEGORY_VOD_BG_SIZE: '100% 100%, 60% 40%, 60% 100%',

        VOD_DETAIL_BG_GRADIENT1: 'linear-gradient(to right, rgba(0, 0, 0, 1) 40%, transparent)',
        VOD_DETAIL_BG_GRADIENT2: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, transparent)',
        // VOD_DETAIL_BG_SIZE: '80% 100%, 100% 40%, 60% 100%',
        VOD_DETAIL_BG_SIZE: '100%',
        VOD_DETAIL_BG_IMG_URL: "images/spotlight_movie.jpg",
        VOD_DETAIL_BG_WIDTH: '60%',




        CHANNEL_BG_SIZE: '100% 100%, 100% 100%, 100%',

        CHANNEL_CATEGORY_LIST: [
            { name: 'Tất cả các kênh', CONFIG_SERVICES: '154,193,194,150,141,20,9,157,158,133,196,197,205,229,210,31,32,30,226,159,214,215,223,37,145,221,222' },
            { name: 'Tin tức tổng hợp', CONFIG_SERVICES: '154,193,194,150,141,20,9,157,158,133,196,197' },
            { name: 'Phim truyện', CONFIG_SERVICES: '205,229,210,31,32,30,226,159' },
            { name: 'Thể thao', CONFIG_SERVICES: '214,215,223,37,145,221,222' },
            { name: 'Giải trí tổng hợp', CONFIG_SERVICES: '155,225,206,227,228,231,232,213,48,277,47,156,54,71,25,59,56,57,46,58,152,209,28,29,14,50,211,212,216,219,220,160' },
            { name: 'Thiếu nhi', CONFIG_SERVICES: '207,72,234' },
            { name: 'Khoa giáo', CONFIG_SERVICES: '192,195,181,198' },
            { name: 'Du lịch Khám phá', CONFIG_SERVICES: '237,60' },
            { name: 'Kinh tế Tài chính', CONFIG_SERVICES: '177,208' },
            { name: 'Địa phương', CONFIG_SERVICES: '136,128,84,78,126,92,131,111,123,124,121,118,125,137,77,107,116,115,86,127,132,112,76,97,10,103,93,94,138,100,96,102,140,110,85,119,83,88,129,98,114,99,117,90,122,104,108,109,81,82,105,139,87,120,95,80,101,106,130,135,79,91,134,89' },
        ],
        SPOTLIGHT_VOD_LIST: [
            { img: 'images/spotlight/spotlight_0.jpg', vodId: '592cc930718c10cd8bc9f5be' },
            { img: 'images/spotlight/spotlight_1.jpg', vodId: '58268148718c8a23a4b3645a' },
        ],
        /*
        CLASS_NAMES: {
            BTN: '.btn',
            BTN_PLAY: '.btn-play',
            BTN_RESUME: '.btn-resume',
            BTN_RESTART: '.btn-restart',
            BTN_ADD_MY_TALKS: '.btn-add-talks',
            BTN_REMOVE_MY_TALKS: '.btn-remove-talks',
            BTN_PLAYER_MY_TALKS: '.player_talks',
            BTN_PLAYER_MY_TALKS_ACTIVE: '.player_talks_active',
            BTN_ABOUT_SPEAKER: '.btn-about-speaker',
            BTN_ABOUT_TALK: '.btn-about-talk',
            VIDEO_INFORMATION: '.video-information',
            CONTROLS_BAR: '.controls-bar',
            SUBTITLE_BOTTOM: 'subtitle-bottom',
            SUBTITLE_MID: 'subtitle-mid',
            SUBTITLE: '#subtitle'
        },*/
        PREPARED_DATA: {
            COLORS: [{
                    description: 'Bộ phim là câu chuyện xoay quanh luật sư James Donovan. Xuất thân là luật sư bảo hiểm, có ít kinh nghiệm về các vụ án hình sự, nhưng CIA đã lựa chọn và giao cho ông một nhiệm vụ an ninh tầm cỡ quốc gia vô cùng quan trọng trong thời kỳ cao điểm của Chiến tranh lạnh giữa Mỹ và Liên Xô những năm 60.',
                    id: 'color_1',
                    name: 'Người Đàm Phán',
                    photo_urls: [{
                        size: '144x206',
                        url: 'http://otttv.viettel.com.vn/api1/contents/pictures/586da1d9718cde303c37a8d5'
                    }],
                    color: 'rgba(0, 0, 255,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',
                    name: 'BROWN color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/brown.png'
                    }],
                    color: 'rgba(165, 42, 24,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_3',
                    name: 'CITRUS color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/citrus.png'
                    }],
                    color: 'rgba(161, 197, 10,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_4',
                    name: 'Deep Green color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/deepGreen.png'
                    }],
                    color: 'rgba(2, 89, 15,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_5',
                    name: 'Dusk color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/dusk.png'
                    }],
                    color: 'rgba(78, 84, 129,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_6',
                    name: 'Lime color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/lime.png'
                    }],
                    color: 'rgba(153, 255, 153,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_7',
                    name: 'Maroon color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/maroon.png'
                    }],
                    color: 'rgba(101, 0,1,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_8',
                    name: 'Merlot color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/merlot.png'
                    }],
                    color: 'rgba(102, 0, 51,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_9',
                    name: 'Mint color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/mint.png'
                    }],
                    color: 'rgba(159, 254, 176,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_10',
                    name: 'Mustard color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/mustard.png'
                    }],
                    color: 'rgba(255, 204, 102,1)'
                }
            ],
            CHANNEL: [{
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_0',
                    name: 'RED color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'http://otttv.viettel.com.vn/api1/contents/pictures/586da1d9718cde303c37a8d5'
                    }],
                    color: 'rgba(255, 0, 0,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_1',
                    name: 'BLUE color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'http://otttv.viettel.com.vn/api1/contents/pictures/586da1d9718cde303c37a8d5'
                    }],
                    color: 'rgba(0, 0, 255,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',
                    name: 'BROWN color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/brown.png'
                    }],
                    color: 'rgba(165, 42, 24,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_3',
                    name: 'CITRUS color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/citrus.png'
                    }],
                    color: 'rgba(161, 197, 10,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_4',
                    name: 'Deep Green color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/deepGreen.png'
                    }],
                    color: 'rgba(2, 89, 15,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_5',
                    name: 'Dusk color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/dusk.png'
                    }],
                    color: 'rgba(78, 84, 129,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_6',
                    name: 'Lime color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/lime.png'
                    }],
                    color: 'rgba(153, 255, 153,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_7',
                    name: 'Maroon color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/maroon.png'
                    }],
                    color: 'rgba(101, 0,1,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_8',
                    name: 'Merlot color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/merlot.png'
                    }],
                    color: 'rgba(102, 0, 51,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_9',
                    name: 'Mint color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/mint.png'
                    }],
                    color: 'rgba(159, 254, 176,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_10',
                    name: 'Mustard color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/mustard.png'
                    }],
                    color: 'rgba(255, 204, 102,1)'
                }
            ],
            ALPHABETS: [{
                    description: 'This is alphabet description.',
                    id: 'alphabet_0',
                    name: 'Alphabet A',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_a.png'
                    }],
                    color: 'rgba(200, 191,11,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_1',
                    name: 'Alphabet B',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_b.png'
                    }],
                    color: 'rgba(200, 191,11,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_2',
                    name: 'Alphabet C',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_c.png'
                    }],
                    color: 'rgba(200, 191,11,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_3',
                    name: 'Alphabet D',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_d.png'
                    }],
                    color: 'rgba(78, 84, 129,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_4',
                    name: 'Alphabet E',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_e.png'
                    }],
                    color: 'rgba(78, 84, 129,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_5',
                    name: 'Alphabet F',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_f.png'
                    }],
                    color: 'rgba(78, 84, 129,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_6',
                    name: 'Alphabet G',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_g.png'
                    }],
                    color: 'rgba(63, 72, 204,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_7',
                    name: 'Alphabet H',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_h.png'
                    }],
                    color: 'rgba(63, 72, 204,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_8',
                    name: 'Alphabet I',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_i.png'
                    }],
                    color: 'rgba(63, 72, 204,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_9',
                    name: 'Alphabet J',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_j.png'
                    }],
                    color: 'rgba(2, 89, 15,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_10',
                    name: 'Alphabet K',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_k.png'
                    }],
                    color: 'rgba(2, 89, 15,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_11',
                    name: 'Alphabet L',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_l.png'
                    }],
                    color: 'rgba(2, 89, 15,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_12',
                    name: 'Alphabet M',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_m.png'
                    }],
                    color: 'rgba(102, 0, 51,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_13',
                    name: 'Alphabet N',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_n.png'
                    }],
                    color: 'rgba(102, 0, 51,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_14',
                    name: 'Alphabet O',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_o.png'
                    }],
                    color: 'rgba(102, 0, 51,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_15',
                    name: 'Alphabet P',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_p.png'
                    }],
                    color: 'rgba(101, 55, 0,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_16',
                    name: 'Alphabet Q',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_q.png'
                    }],
                    color: 'rgba(101, 55, 0,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_17',
                    name: 'Alphabet R',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_r.png'
                    }],
                    color: 'rgba(101, 55, 0,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_18',
                    name: 'Alphabet S',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_s.png'
                    }],
                    color: 'rgba(136, 0, 21,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_19',
                    name: 'Alphabet T',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_t.png'
                    }],
                    color: 'rgba(136, 0, 21,1)'
                },
                {
                    description: 'This is alphabet description.',
                    id: 'alphabet_20',
                    name: 'Alphabet U',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/alphabet_u.png'
                    }],
                    color: 'rgba(136, 0, 21,1)'
                }
            ],
            NUMBERS: [{
                    description: 'NUMBER Description',
                    id: 'number_1',
                    name: 'Number 1',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/1.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_2',
                    name: 'Number 2',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/2.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_3',
                    name: 'Number 3',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/3.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_4',
                    name: 'Number 4',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/4.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_5',
                    name: 'Number 5',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/5.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_6',
                    name: 'Number 6',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/6.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_7',
                    name: 'Number 7',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/7.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_8',
                    name: 'Number 8',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/8.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_9',
                    name: 'Number 9',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/9.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                },
                {
                    description: 'NUMBER Description',
                    id: 'number_10',
                    name: 'Number 10',
                    photo_urls: [{
                        size: '268x268',
                        url: 'images/10.png'
                    }],
                    color: 'rgba(0, 162,12,1)'
                }
            ],
            CATEGORY_MENUS: [{
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_0',
                    name: 'Tìm kiếm',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/deepGreen.png'
                    }],
                    color: 'rgba(255, 0, 0,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_1',
                    name: 'Phim',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/deepGreen.png'
                    }],
                    color: 'rgba(0, 0, 255,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_2',
                    name: 'Thiếu nhi',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/brown.png'
                    }],
                    color: 'rgba(165, 42, 24,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_3',
                    name: 'Nhạc',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/deepGreen.png'
                    }],
                    color: 'rgba(161, 197, 10,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_4',
                    name: 'Hài - Dân gian',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/deepGreen.png'
                    }],
                    color: 'rgba(2, 89, 15,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_5',
                    name: 'Dusk color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/dusk.png'
                    }],
                    color: 'rgba(78, 84, 129,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_6',
                    name: 'Lime color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/lime.png'
                    }],
                    color: 'rgba(153, 255, 153,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_7',
                    name: 'Maroon color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/maroon.png'
                    }],
                    color: 'rgba(101, 0,1,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_8',
                    name: 'Merlot color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/merlot.png'
                    }],
                    color: 'rgba(102, 0, 51,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_9',
                    name: 'Mint color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/mint.png'
                    }],
                    color: 'rgba(159, 254, 176,1)'
                },
                {
                    description: 'Put the description of color here. Put the description of blue color here. Put the description of color here. Put the description of color here. Put the description of blue color here. Put the description of color here.',
                    id: 'color_10',
                    name: 'Mustard color',
                    photo_urls: [{
                        size: '144x206',
                        url: 'images/mustard.png'
                    }],
                    color: 'rgba(255, 204, 102,1)'
                }
            ],
        }
    };
});