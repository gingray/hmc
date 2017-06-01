(function($) {
    var app = {
        elements: {},
        timer: null,
        scrollTo: function($target, options){
            var $target = $($target);

            var options = $.extend({
                offset: 0,
                duration: 500,
                forced: true,
                speed: null,
                onAfter: null
            }, options || {});

            var scrollPoint = $target.offset().top + options.offset,
                windowTop = $(window).scrollTop();

            if (!options.forced && windowTop <= scrollPoint) return;

            if (this.elements.$header.hasClass('is-fixed')) scrollPoint -= this.elements.$header.height();

            if (scrollPoint < 100) scrollPoint = 0;

            $('html,body').animate({
                scrollTop: scrollPoint,
            }, {
                duration: options.duration,
                complete: options.onAfter
            });
        },
        initPhoneMask: function(){
            var self = this,
                $inputs = self.elements.$body.find('input.tel');

            $inputs.inputmask({
                mask: '+7 (999) 999-99-99',
                showMaskOnHover: false
            });
        },
        initForms: function(){
            var self = this,
                $forms = self.elements.$body.find('.form-subscribe');

            $forms.each(function(){
                var $form = $(this),
                    $successMessage = self.elements.$body.find('.hide #success-message').clone(),
                    $errorMessage = self.elements.$body.find('.hide #error-message').clone();

                $successMessage.removeAttr('id');
                $errorMessage.removeAttr('id');

                $form.parsley(ParsleyConfig);

                $form.on('submit', function(e){
                    e.preventDefault();

                    var url = $form.attr('action'),
                        data = {};

                    $($form.serializeArray()).each(function(i, obj){
                        data[obj.name] = obj.value;
                    });

                    $form.addClass('is-loading');

                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        dataType: 'json',
                        url: url,
                        method: 'POST',
                        data: JSON.stringify(data),
                        success: function(response, status){
                            $form.removeClass('is-loading');
                            $form.append($successMessage);
                            $form[0].reset();
                            $form.find('.form-item').removeClass('has-success')
                            $form.addClass('has-submitted is-success');
                        },
                        error: function(response, status){
                            $form.removeClass('is-loading');
                            $form.addClass('has-submitted is-error');
                            $form.append($errorMessage);
                        }
                    });
                });
            });
        },
        initInputs: function(){
            var self = this,
                $inputs = self.elements.$body.find('.form-input input');

            $inputs.each(function(){
                var $input = $(this);
                if ($input.val().length) {
                    $input.addClass('has-value');
                }
                $input.on('blur', function(){
                    $input.toggleClass('has-value', !!$input.val().length);
                });
            });
        },
        init: function(){
            var self = this,
                els = self.elements;

            els.$window = $(window);
            els.$html = $('html');
            els.$body = $('body');
            els.$header = $('.site-header');
            els.$mainNav = els.$header.find('#main-nav');

            self.isTouch = 'ontouchstart' in window ||
                window.DocumentTouch && document instanceof window.DocumentTouch ||
                navigator.maxTouchPoints > 0 ||
                window.navigator.msMaxTouchPoints > 0;

            els.$html.addClass(self.isTouch ? 'touchevents' : 'no-touchevents');

            els.$body.find('a.link-scroll').on('click.scroll_to', function(e){
                e.preventDefault();

                var $link = $(this),
                    $destination = $($link.attr('href'));

                self.scrollTo($destination);
            });

            window.ParsleyConfig = {
                errorsContainer: function(field){
                    var $field = $(field.$element),
                        $fieldWrapper = $field.closest('.form-item'),
                        $container = $('<div class="form-item-errors" />');

                    $container.appendTo($fieldWrapper);
                    return $container;
                },
                successClass: 'has-success',
                errorClass: 'has-error',
                classHandler: function (el) {
                    return el.$element.closest('.form-item');
                }
            }

            self.initPhoneMask();
            self.initForms();
            self.initInputs();
        }
    }
    app.init();
})(jQuery);