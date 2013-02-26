define(["meems-utils", "./widget"], function(Utils, Widget) {
    function Form() {
        Widget.apply(this, arguments);
        this._titleEl = null;
        this._holder = null;
        this._fields = [];
        return this;
    }
    
    Form.extend(Widget, {
        addField : function (field) {
            this._fields.push(field);
        },
        
        fields : function (val) {
            if (val === undefined) {
                return this._fields;
            } else {
                this._fields = val;
                return this;
            }
        },
        
        update : function () {            
            if (!this.el()) {
                this.el(document.createElement("form"));
                this.el().className = "ui-form";
                this.el().setAttribute("action", this.attr("action") || "#");
                
                this._titleEl = document.createElement("div");
                this._titleEl.className = "ui-title";
                this.el().appendChild(this._titleEl);
                
                this._holder = document.createElement("div");
                this._holder.className = "ui-form-fields";
                this.el().appendChild(this._holder);
            }

            var newTitle = this.attr("title") || "";
            Utils.Dom.setHtml(this._titleEl, newTitle);
            this._titleEl.style.display = (newTitle.length > 0 ? 'block' : 'none');
            
            var field;
            
            for (var i = 0; i < this._fields.length; ++i)  {
                field = this._fields[i];
                field.update();
                
                if (field.el().parentNode !== this._holder) {
                    this._holder.appendChild(field.el());
                }
            }
            
            Widget.prototype.update.apply(this, arguments); //super
        }
    });
    
    return Form;
});