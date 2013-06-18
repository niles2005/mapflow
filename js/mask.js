(function($) {
    $.fn.Mask = function() {
        var mask = $(".Mask");
        if ($(this).find('.Mask').length > 0)
            return null;
        var __ctrl = $(this)[0];
//        if (__ctrl.tagName != 'DIV') return null;

        var containerCssPaddingTop = $(__ctrl).css('padding-top');
        var containerCssPaddingRight = $(__ctrl).css('padding-right');
        var containerCssPaddingBottom = $(__ctrl).css('padding-bottom');
        var containerCssPaddingLeft = $(__ctrl).css('padding-left');

        $(__ctrl).css('position', 'relative');
//        $(__ctrl).css('overflow', 'hidden');


        mask.css("display", "block");
//        var mask = '<div class="Mask"><canvas class="MaskCanvas"></div></div>';
        $(__ctrl).prepend(mask);

        var m = $(this).find('.Mask');
        var mc = $(this).find('#MaskCanvas');

        m.css('margin-top', '-' + containerCssPaddingTop);
        m.css('margin-right', '-' + containerCssPaddingRight);
        m.css('margin-bottom', '-' + containerCssPaddingBottom);
        m.css('margin-left', '-' + containerCssPaddingLeft);

        // The 16 just comes from the fact that the image displayed is 32x32
        mc.css('left', m.width() / 2 - 16 + "px");

        mc.width(880);
        mc.height(36);

        var toReturn = {
            RemoveMask: function() {

                mask.css("display", "none");
                $("body").append(mask);
            }
        };

        return toReturn;
    };
})(jQuery);