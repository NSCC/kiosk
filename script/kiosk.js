// <reference path="mootools-1.2.4-core-nc.js" />
// <reference path="mootools-1.2.4.4-more.js" />

var kiosk;
var settings = {
    buttons: {
        main: [
            { name: "NEWS", url: '#', icon: 'news.png', click: function () { kiosk.showWebPage('http://www.nscc.ca/News_Events/Events/index.asp'); } },
            { name: "MAP", url: '#', icon: 'map.png', click: function () { kiosk.loadButtons(settings.buttons.map); } },
            { name: "CALENDAR", url: '#', icon: 'calendar.png', click: function () { kiosk.showCalendar(); } },
            { name: "SCHEDULE", url: '#', icon: 'schedule.png', click: function () { kiosk.showWebPage('http://www.nscc.ca/Learning_Programs/Current_Schedule.asp'); } },
            { name: "GREEN CAMPUS", url: '#', icon: 'green.png', click: function () { kiosk.loadButtons(settings.buttons.green); } },
            { name: "CONTACT US", url: '#', icon: 'contact.png', click: function () { kiosk.showWebPage('http://nscc.ca/Contact_Us/campus_listing.asp?Enter+Campus%3A=INSTITUTE', 250000); } },
            { name: "PORTFOLIO", url: '#', icon: 'portfolio.png', click: function () { kiosk.showWebPage('http://nscc.ca/Learning_Programs/Portfolio/index.asp'); } },
            { name: "WEATHER", url: '#', icon: 'weather.png', click: function () { kiosk.showWebPage('http://www.theweathernetwork.com/weather/cans0057?ref=homecity'); } },
            { name: "BUS SCHEDULE", url: '#', icon: 'bus.png', click: function () { kiosk.loadButtons(settings.buttons.bus); } },
            { name: "PROGRAM VIDEOS", url: '#', icon: 'videos.png', click: function () { kiosk.loadButtons(settings.buttons.videos); } },
            { name: "JOB POSTING", url: '#', icon: 'jobs.png', click: function () { kiosk.showWebPage('job_posting.aspx', 20000); } },
            { name: "MIRROR", url: '#', icon: 'mirror.png', click: function () { kiosk.showSwf('media/WebCamMirror.swf', null, 640, 480, 0.75) } }
        ],
        green: [
            { name: "HOME", url: '#', icon: 'home.png', click: function () { kiosk.loadButtons(settings.buttons.main); } },
            { name: "BIOWALL", url: '#', icon: 'biowall.png', click: function () { kiosk.showSwf('pdfs/BIOWALL.swf'); } },
            { name: "SOLATUBE", url: '#', icon: 'solatube.png', click: function () { kiosk.showWebPage('http://kiosk1.campus.nscc.ca/solatube.html'); } }
        ],
        portfolio: [
            { name: "HOME", url: '#', icon: 'home.png', click: function () { kiosk.loadButtons(settings.buttons.main); } }
        ],
        bus: [
            { name: "HOME", url: '#', icon: 'home.png', click: function () { kiosk.loadButtons(settings.buttons.main); } },
            { name: "MANORS-3", url: '#', icon: 'bus3.png', click: function () { kiosk.showSwf('pdfs/busroute3.swf'); } },
            { name: "ROBIE-7", url: '#', icon: 'bus7.png', click: function () { kiosk.showSwf('pdfs/busroute7.swf', null, 403, 885); } },
            { name: "BARRINGTON-9", url: '#', icon: 'bus9.png', click: function () { kiosk.showSwf('pdfs/busroute9.swf', null, 244, 864); } }
        ],
        videos: [
            { name: "HOME", url: '#', icon: 'home.png', click: function () { kiosk.loadButtons(settings.buttons.main); } },
            { name: "INFORMATION TECH", url: '#', icon: 'videos.png', click: function () { kiosk.showSwf('http://www.nscc.ca/inc/media/testdrive/it.swf', null, 480, 273, 0.75); } },
            { name: "DENTAL ASSISTING", url: '#', icon: 'videos.png', click: function () { kiosk.showSwf('http://www.nscc.ca/inc/media/testdrive/dental.swf', null, 480, 273, 0.75); } }
        ],
        map: [
            { name: "HOME", url: '#', icon: 'home.png', click: function () { kiosk.loadButtons(settings.buttons.main); } },
            { name: "1ST FLOOR", url: '#', icon: 'floor1.png', click: function () { kiosk.showImage('images/itc1.png'); } },
            { name: "2ND FLOOR", url: '#', icon: 'floor2.png', click: function () { kiosk.showImage('images/itc2.png'); } }
        ]
    },
    ads: [
      { url: 'images/landscape.jpg', width: 1834, height: 679, start: '2014-10-11', end: '2014-10-13' }, /* bursaries ad */
      { url: 'images/orientation2014sm.png', width: 1606, height: 975, end: '2014-09-06' } /* orientation schedule */
    ]
};

var Button = new Class({

    initialize: function (params) {
        this.params = params;
    },
    inject: function (parent, where) {
        var container = new Element('div', {
            'class': 'button'
        });
        var link = new Element('a', {
            'href': this.params.url,
            'text': this.params.name,
            'class': 'button_link',
            'styles': {
                'background-image': 'url(images/' + this.params.icon + ')'
            },
            'events': {
                'click': this.params.click,
                'mouseover': function () {
                    this.tween('background-color', '#fff');
                },
                'mouseout': function () {
                    this.tween('background-color', '#666');
                }
            }
        });
        link.inject(container);
        var text = new Element('div', {
            'class': 'button_text',
            'text': this.params.name
        });
        text.inject(container);
        container.inject(parent, where);
    }
});

var Popup = new Class({
    Implements: Options,
    options: {
        width: Window.getWidth() - 40,
        height: Window.getHeight() - 40,
        timeout: 300000, // 5 minute timeout on popups
        title: 'PRESS ANYWHERE ON SCREEN TO RETURN TO MENU'
    },
    initialize: function (options) {

        // added in case browser window is resized
        this.options.width = Window.getWidth() - 40;
        this.options.height = Window.getHeight() - 40;

        this.setOptions(options);

        this.popupDiv = new Element('div', { 'class': 'popup' });

        if ($chk(this.options.title)) {
            var titleDiv = new Element('div', {
                'class': 'popup_title',
                'text': this.options.title
            }).inject(this.popupDiv);
            this.options.height -= 50;
        }

        this.contentDiv = new Element('div', {
            'class': 'popup_content',
            'styles': {
                'height': this.options.height,
                'width': this.options.width
            }
        }).inject(this.popupDiv);


        this.barrierIframeDiv = new Element('div', {
            'styles': {
                'z-index': 1001,
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'width': this.options.width,
                'height': this.options.height
            }
        }).inject(this.popupDiv);
        this.barrierIframe = new Element('iframe', {
            'src': '',
            'styles': {
                'z-index': 1001,
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'width': this.options.width,
                'height': this.options.height,
                'opacity': 0.01
            },
            'frameborder': '0',
            'scrolling': 'no',
            'allowtransparency': 'true'
        }).inject(this.barrierIframeDiv);
        this.barrierDiv = new Element('div', {
            'styles': {
                'z-index': 1002,
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'width': this.options.width,
                'height': this.options.height
            },
            'events': {
                'click': function () {
                    this.popupDiv.dispose();
                } .bind(this)
            }
        }).inject(this.popupDiv);

        this.resetHideTimer();
    },
    toElement: function () {
        return this.contentDiv;
    },
    getHeight: function () {
        return this.options.height;
    },
    getWidth: function () {
        return this.options.width;
    },
    hide: function () {
        $clear(this.hide_timer);
        this.popupDiv.dispose();
    },
    show: function () {
        this.popupDiv.inject('content');
        this.createScrollBar();
    },
    resetHideTimer: function () {
        $clear(this.hide_timer);
        this.hide_timer = this.hide.delay(this.options.timeout, this);
    },
    createScrollBar: function () {

        var scrollHeight = this.contentDiv.getScrollSize().y - this.contentDiv.getSize().y;
        if (scrollHeight > 10) {

            this.contentDiv.setStyle('width', this.options.width - 100);
            this.barrierIframeDiv.setStyle('width', this.options.width - 100);
            this.barrierIframe.setStyle('width', this.options.width - 100);
            this.barrierDiv.setStyle('width', this.options.width - 100);

            var scrollbar = new Element('div', {
                'class': 'popup_scrollbar',
                'styles': {
                    'height': this.options.height
                }
            }).inject(this.popupDiv);
            var scrollbarButton = new Element('div', {
                'class': 'popup_scrollbutton'
            }).inject(scrollbar);

            this.slider = new Slider(scrollbar, scrollbarButton, {
                mode: 'vertical',
                steps: scrollHeight,
                onChange: function (step) {
                    this.contentDiv.scrollTo(0, step);
                } .bind(this)
            });
        }
    }
});

var Ad = new Class({
    Implements: Options,
    options: {
        imgUrl: null,
        startDate: null,
        endDate: null
    },
    initialize: function(options) {
        this.setOptions(options);
        this.image = Asset.image(this.options.imgUrl);
    },
    toElement: function() {
      return this.image;
    },
    expired: function() {
        var today = new Date();
        return (this.options.startDate && (today < this.options.startDate)) || 
               (this.options.endDate   && (today > this.options.endDate));
    }
});

var AdRotater = new Class({
    Implements: [Options,Events],
    options: {
        timeout: 6000 // 1 minute timeout on ads
    },
    ads: [],
    initialize: function (options) {

        this.setOptions(options);
        this.ads = settings.ads.map(function(i) { 
            return new Ad({
              imgUrl: i.url,
              startDate: Date.parse(i.start),
              endDate: Date.parse(i.end)
            }); 
        });
        this.current_ad = 0;

        /* if the user touches the screen,
           generate a click event */
        this.element = new Element('div', {
            events: {
                click: function () {
                  this.fireEvent('click');
                }.bind(this)
            }
        });

        this.show();
    },
    toElement: function() {
      return this.element;
    },
    activeCount: function() {
      var length = 0;
      for( var i=0; i<this.ads.length; i++ ) {
        if( !this.ads[i].expired() ) {
          length += 1;
        }
      }
      return length;
    },
    hide: function () {
        $clear(this.timer);
    },
    show: function () {
        this.resetTimer();
        
        this.element.empty();

        /* show the next non-expired ad */
        if( this.activeCount() > 0 ) {
          var start_ad = this.current_ad;
          do {
            this.current_ad = (this.current_ad + 1) % settings.ads.length;
          } while( this.ads[this.current_ad].expired() && (this.current_ad != this.start_ad) );

          var img = this.ads[this.current_ad].image;

          /* center the ad vertically */
          var vpad = (Window.getHeight() - img.height - 165) / 2;
          this.element.setStyle('padding', vpad + 'px 0');
          
          this.element.adopt(img);
        }
    },
    resetTimer: function () {
        $clear(this.timer);
        this.timer = this.show.delay(this.options.timeout, this);
    }
});

var Kiosk = new Class({
    initialize: function () {
        this.ad = new AdRotater({
          onClick: function() { this.loadButtons(settings.buttons.main); }.bind(this)
        });
        this.showHome();
        this.current_page = 1;
    },
    createButton: function (params, div, where) {
        var button = new Button(params);
        button.inject(div, where);
        return button;
    },
    loadButtons: function (buttons) {
        $('buttons').empty();
        for (var i = 0; i < buttons.length; i++) {
            this.createButton(buttons[i], 'buttons');
        }

        // reset to home page, if we aren't already there
        $clear(this.home_timer);
        if( buttons != settings.buttons.main ) {
            this.home_timer = this.showHome.delay(60000, this);
        } else {
            // show the ads after 60 secs if we are there
            this.home_timer = this.showAds.delay(60000, this);
        }
    },
    showAds: function() {
        if( this.ad.activeCount() > 0 ) {
            $('buttons').empty();

            /* display the advertisements */
            $(this.ad).inject('buttons');
        }
    },
    showHome: function () {
        this.loadButtons(settings.buttons.main);
    },
    showCalendar: function () {
        this.popup = new Popup();
        var iframe = new Element('iframe', {
            'src': 'http://www.google.com/calendar/embed?src=kvhfe329ifedq7le5hs51ml2jg%40group.calendar.google.com&ctz=America/Halifax',
            'styles': {
                'width': '100%',
                'height': this.popup.getHeight()
            },
            'frameborder': '0',
            'scrolling': 'no'
        }).inject(this.popup);
        this.popup.show();
    },
    showPdf: function (filename) {
        this.popup = new Popup();
        var pdf = new Element('object', {
            'data': 'pdfs/' + filename,
            'type': 'application/pdf',
            'width': this.popup.getWidth(),
            'height': this.popup.getHeight()
        });
        pdf.inject(this.popup);
        this.popup.show();
    },
    showSwf: function (filename, title, swfwidth, swfheight, zoom) {
        this.popup = new Popup();
        var height = this.popup.getHeight();
        var width = this.popup.getWidth();
        if ($chk(zoom)) {
            height = height * zoom;
            width = width * zoom;
        }
        if ($chk(swfwidth)) {
            height = width / swfwidth * swfheight;
        }
        var swf = new Swiff(filename, {
            width: '100%',
            height: height,
            params: {
                wmode: 'transparent',
                quality: 'high'
            }
        });
        swf.inject(this.popup);
        if ($chk(zoom)) {
            var zoomdiv = new Element('div', {
                styles: {
                    width: width,
                    height: height,
                    'margin-left': (this.popup.getWidth() - width) / 2,
                    'margin-top': (this.popup.getHeight() - height) / 2
                }
            });
            zoomdiv.wraps(swf);
        }
        this.popup.show();
    },
    showWebPage: function (url, height) {
        this.popup = new Popup();
        if (!$chk(height)) {
            height = 2000;
        }
        var iframe = new Element('iframe', {
            'src': url,
            'width': '100%',
            'height': height,
            'frameborder': '0',
            'scrolling': 'no'
        });
        iframe.inject(this.popup);
        this.popup.show();
    },
    showSchedule: function () {
        var request = new Request.HTML({
            url: 'http://www.nscc.ca/Learning_Programs/Current_Schedule.asp',
            onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
                //$('content').adopt(responseTree.getElement('form'));
                alert(responseHTML);
            },
            onFailure: function () {
                alert('failed');
            }
        }).get();
    },
    showTest: function () {
        var request = new Request.HTML({
            url: 'http://localhost/NSCCKiosk/schedule.html',
            onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
                var popup = new Popup();
                popup.contentDiv.set('html', responseHTML);
                popup.show();
            },
            onFailure: function () {
                alert('failed');
            }
        }).get();
    },
    showJobPosting: function () {
        var request = new Request.HTML({
            url: 'job_posting.aspx',
            onSuccess: function (responseTree, responseElements, responseHTML, responseJavaScript) {
                var popup = new Popup();
                popup.contentDiv.set('html', responseHTML);
                popup.show();
            },
            onFailure: function () {
                alert('failed');
            }
        }).get();
    },
    showImage: function (filename, imgwidth, imgheight) {
        this.popup = new Popup();
        var img = Asset.image(filename, {
            width: imgwidth,
            height: imgheight,
            'onload': function () {
                this.inject(kiosk.popup);
                kiosk.popup.show();
            },
            'onerror': function () { alert('error'); },
            'onabort': function () { alert('abort'); }
        });
    }
});



function updateFooter() {
    $('date').innerHTML = getDate();
    $('time').innerHTML = getTime();
}

function onDomReady() {
    kiosk = new Kiosk();
    setInterval('updateFooter()', 1000);
}

window.addEvent('domready', onDomReady);
