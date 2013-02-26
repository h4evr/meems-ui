define(["meems-utils", "meems-scroll", "./widget"], function(Utils, Scroll, Widget) {
    function Tab() {
        Widget.apply(this, arguments);
        this._scroller = null;
        this._holder = null;
        this.facet('content', null);
        return this;
    }
    
    Tab.extend(Widget, {
        update : function () {            
            if (!this.el()) {
                this.el(document.createElement("div"));
                this.el().className = "ui-tab";
            }
            
            var _facetContent = this.facet("content");
            
            if (_facetContent) {
                _facetContent.update();
                
                if (!this._holder) {
                    this._holder = document.createElement("div");
                    this._holder.className = "ui-fill-width";
                    this.el().appendChild(this._holder);
                }                

                if (_facetContent.el().parentNode !== this._holder) {                
                    this._holder.appendChild(_facetContent.el());
                    
                    if (this._scroller) {
                        this._scroller.destroy();
                    }
                    
                    this._scroller = new Scroll(this.el(), {
                        scrollX: false,
                        scrollY: true
                    });
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Tab;
});