(function($) {

  /**
   * D8 base_ui scripts.js.
   *
   * @param {*}
   */

  Drupal.behaviors.offCanvasMenu = {
    attach: function (context, settings) {
      $('.main-menu', context).once('offCanvasMenu').each(function () {
        var $menu = $(this);
        var $offCanvas = $('<nav>');
        var $menuClone = $menu.find('> ul').clone().removeAttr('class').addClass('off-canvas-menu-item');
        var $burger = $('<img src="/themes/d8base_ui/images/burger.svg" alt="Burger menu icon for launching menu" aria-hidden>');
        let $canvas = $('#off-canvas-menu-pseudo-canvas');
        $offCanvas.insertBefore($menu)
          .append($burger)
          .append($menuClone)
          .addClass('main-menu header-block offcanvas-menu menu-closed')
          .attr('off-canvas-menu', '')
          .attr('off-canvas-status', 1);

        var $menu = $menuClone;
        let status = $offCanvas.attr('off-canvas-status');
        let offset = round($menuClone.outerWidth() * status, 0) + 1;
        // Init position - translateX of menu-width.
        $menu.css({
          'left': offset + 'px',
          'transform': 'translateX(' + offset + 'px)',
        });
        function toggleMenu() {
          let status = $offCanvas.attr('off-canvas-status');
          let offset = round($menuClone.outerWidth() * status * -1, 0) + 1;
          $menu.velocity({
            'translateX': offset + 'px',
          }, {
            duration: 300,
            easing: 'easeout',
          });
          status = status == 0 ? 1 : 0;
          $offCanvas.attr('off-canvas-status', status);
          $offCanvas.toggleClass('menu-closed');
          $('body').toggleClass('off-canvas-menu-active');
          if (status == 1) {
            // Hide canvas.
            $canvas.velocity({
              'opacity': 0,
            }, {
              complete: function(elements) {
                $canvas.css({
                  'z-index': -1
                });
              }
            });
          }
          else {
            $canvas.velocity({
              'opacity': 0.8,
            }).css({
              'z-index': 1
            });;

          }
        }

        $burger.click(function(e){
          toggleMenu();
        });
        $canvas.click(function(e){
          toggleMenu();
        });
      });
    }
  };

  })(jQuery);

function round(number, precision) {
  var shift = function (number, precision) {
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };
  return shift(Math.round(shift(number, +precision)), -precision);
}