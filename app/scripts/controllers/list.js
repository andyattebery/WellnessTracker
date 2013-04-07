Clementine.add('wt.controllers.list', function(exports) {

  // Imports

  var ViewController = Clementine.ViewController;
  
  
  // View Controllers
  
  var ItemListController = ViewController.extend({
  
    // Configuration

    getType: function() {
      return 'item-list';
    },

    setup: function() {

      if (!this.hasOwnProperty('template') || !this.template) {
        this.template = this.target.find('[itemscope]').outerHTML();
      }
      
      this.target.find('[itemscope]').remove();
      
      this.indicatorMsg = this.find('.indicator').hide().text();

    },


    // @region Public Methods

    setData: function(data) {

      // store data
      this.listData = data;

      // build list
      if (this._visible) {
        this.build(data);
      }

    },
    
    setTemplateFunction: function(fn) {
      this.template = fn;
    },

    build: function(data) {

      var li = null, list = this.getElement('list'), that = this;
      
      list.empty();

      if (data.length === 0) {
        return;
      }
      
      function processImg() {
        var path = $(this).attr('data-path');
        if (path) {
          $(this).attr('src', path);
        }
      }

      var itemprop, template;

      function cleanModel(data) {
        for (var prop in data) {
          data[prop] = (typeof data[prop] === 'function') ? data[prop]() : data[prop];
        }
        return data;
      }

      function cleanModels(items) {
        for (var i = 0; i < items.length; i++) {
          items[i] = cleanModel(items[i]);
        }
        return items;
      }

      data = cleanModels(data);

      // bind list of data
      for (var i = 0; i < data.length; i++) {
        if (typeof this.template === 'function') {
          template = this.template(data[i]);
        } else {
          template = this.template || '<li></li>';
        }
        li = $(template);
        if (data[i].hasOwnProperty('id')) {
          li.attr('itemid', data[i].id);
        }
        for (var prop in data[i]) {
          itemprop = li.find('[itemprop="' + prop + '"]');
          if (itemprop.length && $(itemprop).get(0).tagName === 'SELECT') {
            if (itemprop.find('[value="' + data[i][prop] + '"]').length) {
              itemprop.val(data[i][prop]);
            } else {
              itemprop.append($('<option selected="selected" value="' + data[i][prop] + '">' + data[i][prop] + '</option>'));
            }
          } else if (itemprop.length && $(itemprop).get(0).tagName === 'INPUT') {
            itemprop.val(data[i][prop]);
          } else if (itemprop) {
            itemprop.text(data[i][prop]);
          }
        }
        li.find('img[data-path]').each(processImg);
        list.append(li);
      }

    },

    markEmpty: function() {
      var msg = this.indicatorMsg || 'No Results';
      this.getElement('list').empty();
      this.getElement('list').append('<li class="empty">' + msg + '</li>');
    },
    
    clear: function() {
      this.listData = [];
      this.getElement('list').empty();
    },


    // @region State Handlers

    onWillLoad: function() {
      if (!this.clearManually) {
        this.listData = [];
      }
      if (!Browser.scroll) { this.target.wrapInner('<div class="scroller"></div>'); }
      this._super();
    },

    onDidAppear: function() {
      if (this.listData && this.listData.length > 0) {
        this.build(this.listData);
      } else {
        this.getElement('list').empty();
      }
      this.getElement('list').on('click', 'li:not(.ignored)', $.proxy(this.$onSelect, this));
      this._super();
    },


    // @region Public Methods

    $onSelect: function(e) {
      if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT') {
        e.stopPropagation();
        if (Object.keys(this.listData).length === 0) { return; }
        var id = $(e.currentTarget).closest('[itemid]').attr('itemid');
        if (this.listData) {
          var data = null;
          for (var i = 0; i < this.listData.length; i++) {
            if (this.listData[i].id === parseInt(id, 10)) {
              data = this.listData[i];
              break;
            }
          }
          this.fire('select', data);
        }
      }
    }

  });
  
  
  // Exports
  
  exports.ItemListController = ItemListController;

}, [], '1.0');