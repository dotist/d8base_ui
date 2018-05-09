(function($) {

  /**
   * D8 base_ui scripts.js.
   *
   * @param {*}
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

  Drupal.behaviors.offCanvasMenuPosition = {
    attach: function (context, settings) {
      function offCanvasMenuPosition() {
        console.log('re pos')
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

  Drupal.behaviors.offCanvasResize = {
    attach: function (context, settings) {

      // Usage
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