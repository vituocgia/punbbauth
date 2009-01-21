(function($){
    $.fn.punbbauth = function(options){
        var opts = $.extend({}, $.fn.punbbauth.defaults, options);
        
        return this.each(function(){            
            var $this = $(this);
            if ($this.hasClass('login')) {
                bind_login(opts, $this);
            } else  if ($this.hasClass('access')) {
                bind_access(opts, $this);
            } else if ($this.hasClass('logout')) {
                bind_logout(opts, $this); 
            } else {
                alert('invalid class');    
            }
        });
    };
    
    $.fn.punbbauth.defaults = {
        punbb_path : '/',
        punbb_username : '',
        punbb_password : '',
        app_uname_field : 'username',
        app_pword_field : 'password'
    };
    
    function debug($obj){
        if (window.console && window.console.log) 
            window.console.log($obj.size());
    };
    
    function bind_login(o, $this){
        $('<div id="punbb-login-form">')
            .appendTo('body')
            .hide()
            .load(o.punbb_path + "login.php #afocus", function(){
                $this.children('input[type=submit]').bind('click', function(e){
                    e.preventDefault();
                    var $that = $(this);
                    if ($('#afocus').length > 0) {
                        $.post($('#afocus').attr('action'), {
                            'req_username' : $('input[name=' + o.app_uname_field + ']').val(),
                            'req_password' : $('input[name=' + o.app_pword_field + ']').val(),
                            'save_pass' : '1',
                            'csrf_token' : $('#afocus input[name=csrf_token]').val(),
                            'redirect_url' : $('#afocus input[name=redirect_url]').val(),
                            'form_sent' : $('#afocus input[name=form_sent]').val()
                        }, function(){
                            $that.trigger('submit');
                        });
                    } else {
                        $that.trigger('submit');
                    }
                });
            });
    };
    
    function bind_access(o, $this){
        $('<div id="punbb-login-form">')
            .appendTo('body')
            .hide()
            .load(o.punbb_path + "login.php form#afocus", function(){
                $this.bind('click', function(e){
                    if ($('#afocus').length > 0) {
                        $('#afocus input[name=req_username]').val(o.punbb_username);
                        $('#afocus input[name=req_password]').val(o.punbb_password);
                        $('#afocus input[name=save_pass]').attr({
                            checked: 'checked'
                        });
                        
                        $("#afocus").trigger("submit");
                        return false;
                    }
                });
            });
    };
    
    function bind_logout(o, $this){
        $('<div id="k12-punbb-logout">')
            .appendTo('body')
            .hide()
            .load(o.punbb_path + "index.php li#navlogout", function(){
                $this.bind('click', function(e){
                    e.preventDefault();
                    var that = $(this).attr('href');
                    if ($('#navlogout').length > 0) {
                        $.get($('li#navlogout a').attr('href'), function(){
                            window.location = that;
                        });
                    } else {
                        window.location = that;    
                    }
                });
            });
    };
})(jQuery);