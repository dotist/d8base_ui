(function($) {

  /**
   * D8 base_ui scripts.js.
   *
   * @param {*}
   */

  /**
   * Initialize off-canvas menu.
   */
  Drupal.behaviors.offCanvasMenuInit = {
    attach: function (context, settings) {
      $('.main-menu', context).once('offCanvasMenuInit').each(function () {
        var $menu = $(this);
        var $offCanvas = $('<nav>');
        var $menuClone = $menu.find('> ul').clone().removeAttr('class').addClass('off-canvas-menu-item');
        var $burger = $('<img src="/themes/d8base_ui/images/burger.svg" alt="Burger menu icon for launching menu" aria-hidden burger>');
        $offCanvas.insertBefore($menu)
          .append($burger)
          .append($menuClone)
          .addClass('main-menu header-block off-canvas-menu menu-closed')
          .attr('off-canvas-menu', '')
          .attr('off-canvas-status', 1);
      });
    }
  };

  /**
   * Position off-canvas menu.
   */
  Drupal.behaviors.offCanvasMenuPosition = {
    attach: function (context, settings) {
      function offCanvasMenuPosition() {
        $('[off-canvas-menu] > ul', context).once('offCanvasMenuPosition').each(function () {
          // console.log('menu pos')
          var $menu = $(this);
          // let status = $menu.attr('off-canvas-status');
          let status = 1
          let offset = round($menu.outerWidth() * status, 0) + 1;
          // Init position - translateX of menu-width.
          $menu.css({
            'left': offset + 'px',
            'transform': 'translateX(' + offset + 'px)',
          });
          function toggleMenu($menu) {
            let status = $menu.parent().attr('off-canvas-status');
            let offset = round($menu.outerWidth() * status * -1, 0) + 1;
            $menu.velocity({
              'translateX': offset + 'px',
            }, {
              duration: 300,
              easing: 'easeout',
            });
            status = status == 0 ? 1 : 0;
            $menu.parent().attr('off-canvas-status', status);
            $menu.parent().toggleClass('menu-closed');
            $('body').toggleClass('off-canvas-menu-active');
            let $logo = $('.site-branding');
            if (status == 1) {
              // Hide menu & element.
              $canvas.velocity({
                'opacity': 0,
              }, {
                complete: function(elements) {
                  $canvas.css({
                    'z-index': -1,
                    'display': 'none',
                  });
                }
              });
            }
            else {

              $canvas.velocity({
                'opacity': 0.8,
              }).css({
                'z-index': 1,
                'display': 'block',
              });;

            }
          }

          let $burger = $menu.siblings('img[burger]');
          $burger.click(function(e){
            toggleMenu($menu);
          });
          let $canvas = $('#off-canvas-menu-pseudo-canvas');
          $canvas.click(function(e){
            toggleMenu($menu);
          });
        });
      }
      offCanvasMenuPosition();
      var waitForFinalEvent = (function() {
        var timers = {};
        return function(callback, ms, uniqueId) {
          if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
          }
          if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
          }
          timers[uniqueId] = setTimeout(callback, ms);
        };
      })();

      $(window).resize(function() {
        // console.log('resizing');
        waitForFinalEvent(function() {
          offCanvasMenuPosition();
        }, 500);
      });


    }
  };

  /**
   * Initialize Featherlight Slideshow elements.
   */
  Drupal.behaviors.featherlightSlideshow = {
    attach: function (context, settings) {

      $('a[featherlight-item]').featherlightGallery({
        previousIcon: '«',
        nextIcon: '»',
        galleryFadeIn: 300,
        openSpeed: 300
      });

      $.featherlightGallery.prototype.afterContent = function() {
        var caption = this.$currentTarget.find('img').attr('title');
        this.$instance.find('.caption').remove();
        $('<div class="caption">').text(caption).appendTo(this.$instance.find('.featherlight-content'));
      };

    }
  }

  /**
   * Inititalize page-tab items. Currently only works with one per page.
   */
  Drupal.behaviors.pageTabs = {
    attach: function (context, settings) {
      $('#page-tabs', context).once('pageTabs').each(function () {
        // Create Tabmenu & controls.
        var $pageTabs = $(this);
        let tabs = $pageTabs.find('[page-tab]');
        $pageTabs.find('[page-tab]').first().addClass('active');
        let tabLabelSelector = 'page-tabs__tab-labels';
        let tabLabelWrapper = '<ul id="' + tabLabelSelector + '">';
        $(tabLabelWrapper).insertBefore($pageTabs);
        let $tabLabelWrapper = $('#' + tabLabelSelector);
        $tabLabelWrapper.attr('page-tabs-labels', '');
        $.each(tabs, function(i){
          let $tab = $(this);
          let $label = $tab.find('.field__label').first();
          let $tabItem = $('<li><a href="#">');
          $tabLabelWrapper.append($tabItem);
          let $tabLink = $tabLabelWrapper.find('a').last();

          // Insert text from corresponding field-label.
          $tabLink.text($label.text()).attr('page-tab-index', $(this).attr('page-tab'));

          // Click function.
          $tabLink.click(function(e){
            // e.preventDefault();
            let index = $(this).attr('page-tab-index');
            // Reset active link settings.
            $tabLabelWrapper.find('li').removeClass('active-trail').find('a').removeClass('active').parent();
            $(this).addClass('active').parent().addClass('active-trail');
            // Reset active tab settings.
            $pageTabs.find('[page-tab].active').removeClass('active');
            $pageTabs.find('[page-tab="' + index + '"]').addClass('active');
            // @TODO : add ?parameters to allow direct links.
            // var loc = location.href;
            // loc += loc.indexOf("?") === -1 ? "?" : "&";
            // location.href = loc + "?page-tab-index=" + index;
          });

        });

      });
    }
  }

  /**
   * Custom UI for pageTabs menu behavior
   */
  Drupal.behaviors.pageTabsUI = {
    attach: function (context, settings) {
      $('[page-tabs-labels]', context).once('pageTabsUI').each(function () {
        let $labels = $(this);
        $labels.find('li').first().appendTo($(this)).addClass('hide-on-load');
        $labels.find('a').click(function(){
          $labels.find('li').removeClass('hide-on-load');
        });
      });
    }
  }

  /**
   * Init Masonry grids.
   */
  Drupal.behaviors.masonryInit = {
    attach: function (context, settings) {
      let selector = '.content-type-exhibition .field--name-field-images.field--type-entity-reference-revisions';
      $(selector, context).once('masonryInit').each(function () {
        let $masonry = $(this);
        $masonry.imagesLoaded( function() {
          $masonry.masonry({
            itemSelector: '.masonry-item',
            columnWidth: '.masonry-item'
          });
        });
      });
    }
  }

  })(jQuery);

function round(number, precision) {
  var shift = function (number, precision) {
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, +precision)), -precision);
}