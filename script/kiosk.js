var kiosk;
var settings = {
    buttons: {
        main: [
            { name:"NEWS", url:'#', icon:'news.png', click:function(){kiosk.showWebPage('http://www.nscc.ca/News_Events/Events/index.asp');} },
            { name:"MAP", url:'#', icon:'map.png', click:function(){kiosk.showPdf('plan.pdf');} },
            { name:"CALENDAR", url:'#', icon:'calendar.png', click:function(){kiosk.showCalendar();} },
            { name:"SCHEDULE", url:'#', icon:'schedule.png', click:function(){kiosk.showWebPage('http://www.nscc.ca/Learning_Programs/Current_Schedule.asp');} },
            { name:"GREEN CAMPUS", url:'#', icon:'green.png', click:function() {kiosk.loadButtons(settings.buttons.green);} },
            { name:"CONTACT US", url:'#', icon:'contact.png', click:function() {kiosk.showWebPage('http://www.nscc.ca/Contact_Us/');} },
            { name:"PORTFOLIOS", url:'#', icon:'portfolio.png', click:function() {kiosk.loadButtons(settings.buttons.portfolio);} }
        ],
        green: [
            { name:"HOME", url:'#', icon:'home.png', click:function(){kiosk.loadButtons(settings.buttons.main);} },            
            { name:"BIOWALL", url:'#', icon:'', click:function(){kiosk.showWebPage('http://localhost/biowall.html');} },            
            { name:"SOLATUBE", url:'#', icon:'', click:function(){} }            
        ],
        portfolio: [
            { name:"HOME", url:'#', icon:'home.png', click:function(){kiosk.loadButtons(settings.buttons.main);} }           
        ]
    }
};

var Button = new Class({

    initialize: function(params) {
        this.params = params;
    },
    inject: function(parent, where) {
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
                'mouseover': function() {
                    this.tween('background-color', '#fff');
                },
                'mouseout': function() {
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
        timeout: 300000 // 5 minute timeout on popups
    },
    initialize: function(options) {
    
        // added in case browser window is resized
        this.options.width = Window.getWidth() - 40;
        this.options.height = Window.getHeight() - 40;
    
        this.setOptions(options);
        
        this.popupDiv = new Element('div', {'class':'popup'});
        this.contentDiv = new Element('div', {
            'class':'popup_content',
            'styles': {
                'height':this.options.height,
                'width':this.options.width
            }
        }).inject(this.popupDiv);
        
        this.barrierIframeDiv = new Element('div', {
            'styles': {
                'z-index':1001,
                'position':'absolute',
                'top':0,
                'left':0,
                'width': this.options.width,
                'height': this.options.height
            }
        }).inject(this.popupDiv);
        this.barrierIframe= new Element('iframe', {
            'src':'',
            'styles': {
                'z-index':1001,
                'position':'absolute',
                'top':0,
                'left':0,
                'width': this.options.width,
                'height': this.options.height
            },
            'frameborder':'0',
            'scrolling':'no'
        }).inject(this.barrierIframeDiv);
        this.barrierDiv = new Element('div', {
            'styles': {
                'z-index':1002,
                'position':'absolute',
                'top':0,
                'left':0,
                'width': this.options.width,
                'height': this.options.height
            },
            'events': {
                'click': function() {
                    this.popupDiv.dispose();
                }.bind(this)
            }
        }).inject(this.popupDiv);

        this.resetHideTimer();
    },
    toElement: function() {
        return this.contentDiv;
    },
    getHeight: function() {
        return this.options.height;
    },
    getWidth: function() {
        return this.options.width;
    },
    hide: function() {
        this.popupDiv.dispose();
    },
    show: function() {
        this.popupDiv.inject('content');
        this.createScrollBar();
    },
    resetHideTimer: function() {
        $clear(this.hide_timer);
        this.hide_timer = this.hide.delay(this.options.timeout, this);
    },
    createScrollBar: function() {

        var scrollHeight = this.contentDiv.getScrollSize().y - this.contentDiv.getSize().y;
        if( scrollHeight > 10 ) {

            this.contentDiv.setStyle('width', this.options.width - 100);
            this.barrierIframeDiv.setStyle('width', this.options.width - 100);
            this.barrierIframe.setStyle('width', this.options.width - 100);
            this.barrierDiv.setStyle('width', this.options.width - 100);

            var scrollbar = new Element('div', {
                'class':'popup_scrollbar',
                'styles' : {
                    'height':this.options.height
                }
            }).inject(this.popupDiv);
            var scrollbarButton = new Element('div', {
                'class':'popup_scrollbutton'
            }).inject(scrollbar);
    
            this.slider = new Slider(scrollbar, scrollbarButton, {
                mode:'vertical',
                steps: scrollHeight,
                onChange: function(step) {
                    this.contentDiv.scrollTo(0,step);
                }.bind(this)
            });
        }
    }
});

var Kiosk = new Class({
    initialize: function() {
        this.loadButtons(settings.buttons.main);
        this.current_page = 1;
    },
    createButton: function(params, div, where) {
        var button = new Button(params);
        button.inject(div, where);
        return button;
    },
    loadButtons: function(buttons) {
        $('buttons').empty();
        for( var i=0; i<buttons.length; i++ ) {
            this.createButton(buttons[i], 'buttons');            
        }
    },
    showCalendar: function() {
        this.popup = new Popup();
        var iframe = new Element('iframe', {
            'src':'http://www.google.com/calendar/embed?src=kvhfe329ifedq7le5hs51ml2jg%40group.calendar.google.com&ctz=America/Halifax',
            'styles': {
                'width': '100%',
                'height': this.popup.getHeight()
            },
            'frameborder':'0',
            'scrolling':'no'
        }).inject(this.popup);
        this.popup.show();
    },
    showPdf: function(filename) {
        this.popup = new Popup();
        var pdf = new Element('object', {
            'data':'pdfs/' + filename,
            'type':'application/pdf',
            'width':this.popup.getWidth(),
            'height':this.popup.getHeight()
        });
        pdf.inject(this.popup);
        this.popup.show();
    },
    showSwf: function(filename) {
        this.popup = new Popup();
        var pdf = new Element('object', {
            'width':this.popup.getWidth(),
            'height':this.popup.getHeight(),
            'z-index':1000
        });
        pdf.inject(this.popup);
        var param = new Element('param', {
            'name':'movie',
            'value':'pdfs/' + filename
        });
        param.inject(pdf);
        param = new Element('param', {
            'name':'wmode',
            'value':'transparent'
        });
        param.inject(pdf);
        var embed = new Element('embed', {
            'src':'pdfs/' + filename,
            'width':this.popup.getWidth(),
            'height':this.popup.getHeight(),
            'z-index':1000
        });
        embed.inject(pdf);
        this.popup.show();
    },
    showWebPage: function(url) {
        this.popup = new Popup();
        var iframe = new Element('iframe', {
            'src':url,
            'width':'100%',
            'height':2000,
            'frameborder':'0',
            'scrolling':'no'
        });
        iframe.inject(this.popup);
        this.popup.show();
    },
    showSchedule: function() {
        var request = new Request.HTML({
            url: 'http://www.nscc.ca/Learning_Programs/Current_Schedule.asp',
            onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
                //$('content').adopt(responseTree.getElement('form'));
                alert(responseHTML);
            },
            onFailure: function() {
                alert('failed');
            }
        }).get();
    },
    showTest: function() {
        var request = new Request.HTML({
            url: 'http://localhost/NSCCKiosk/schedule.html',
            onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
                var popup = new Popup();                
                popup.contentDiv.set('html', responseHTML);
                popup.show();
            },
            onFailure: function() {
                alert('failed');
            }
        }).get();
    },
    showGreen: function() {
        
    },
    showPortfolios: function() {
        
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