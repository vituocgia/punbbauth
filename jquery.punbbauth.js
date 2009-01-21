/**
 * jQuery PunbbAuth Plugin
 * @copyright (c) 2008
 * @author Jason R. Leveille
 * @license http://www.opensource.org/licenses/mit-license.php
 * @description Provides an easy way to hook into punbb auth login/logout
 *      Hooks should be applied to your own applications login form
 *      and logout link.  Another option is available to hook into
 *      an "access" link, however this will likely not see much use
 *      under most normal circumstances
 *      
 * @example
 * 
 *      BIND TO LOGIN FORM
 *      
 *      ex. 1
 *      $('.punbb').punbbauth();                    //assumes a username fieldname of username
 *                                                  //assumes a password fieldname of password
 *                                                  //also assumes form class structure: <form ... class="punbb login" ... >
 *                                  
 *      ex. 2
 *      $('.punbb').punbbauth({
 *          app_uname_field : 'uname_fieldname',    //username fieldname: <input name="uname_fieldname" />                                
 *          app_pword_field : 'pword_fieldname'     //password fieldname: <input name="pword_fieldname" />
 *                                                  //also assumes form class structure: <form ... class="punbb login" ... >
 *      });
 *      
 *      
 *      
 *      BIND TO LOGOUT LINK
 *      
 *      ex. 1
 *      $('.punbb').punbbauth();                    //assumes link class structure: <a ... class="punbb logout">...</a>
 *      
 *      
 *      
 *      BIND TO ACCESS LINK
 *      NOTE: This will likely not see very much use, as it requres access to a plain text password.  See notes below
 *      
 *      ex. 1
 *      $('.punbb').punbbauth({
 *          punbb_username : 'username', 
 *          punbb_password : 'password'             //assumes link class structure: <a ... class="punbb access">...</a>
 *      });                    
 * 
 * Thanks to Mike Alsup for his plugin template 
 *  (http://www.learningjquery.com/2007/10/a-plugin-development-pattern)
 */

(function($){
    $.fn.punbbauth = function(options){
        var opts = $.extend({}, $.fn.punbbauth.defaults, options);
        
        return this.each(function(){            
            var $this = $(this);
            if ($this.hasClass('access')) {
                bind_access(opts, $this);
            } else if ($this.hasClass('logout')) {
                bind_logout(opts, $this); 
            } else {
                //Assume the plugin is being bound to
                //the user application login
                bind_login(opts, $this);   
            }
        });
    };
    
    $.fn.punbbauth.defaults = {
        punbb_path : '',                //If relevant, include leading slash
                                            //never include trailing slash
                                            //default is site root ('/'), 
                                            //and is implied by leaving punbb_path empty
                                            
                                        //This plugin is bound by the limitations
                                            //of the XHR same origin/domain policy
                                            //http://stackoverflow.com/questions/231478/ajax-subdomains-and-ssl
                                        
                                        //punbb_username and punbb_password settings will likely not be
                                            //used under most circumstances   
                                                           
        punbb_username : '',            //Punbb username with which to authenticate
        punbb_password : '',            //Punbb password with which to authenticate
        
        app_uname_field : 'username',   //Your applications input fieldname for username
        app_pword_field : 'password'    //Your applications input fieldname for password
    };
    
    /**
     * Bind punbb authentication to current applications auth
     * By default this method will set the punbb remember-me cookie
     * @param {Object} o
     * @param {Object} $this
     * @scope private
     */
    function bind_login(o, $this){
        $this.bind('submit', function(e){
            $that = $(this);
            e.preventDefault();
            $('<div id="punbb-login-form">')
                .appendTo('body')
                .hide()
                .load(o.punbb_path + "/login.php #afocus", function(){
                    $.post($('#afocus').attr('action'), {
                        'req_username' : $('input[name=' + o.app_uname_field + ']').val(),
                        'req_password' : $('input[name=' + o.app_pword_field + ']').val(),
                        'save_pass' : '1',
                        'csrf_token' : $('#afocus input[name=csrf_token]').val(),
                        'redirect_url' : $('#afocus input[name=redirect_url]').val(),
                        'form_sent' : $('#afocus input[name=form_sent]').val()
                    }, function(){
                        //After post, trigger submit behavior for 
                        //current application login form
                        $that.trigger('submit');
                    });
                });
        });
    };
    
    /**
     * Bind punbb authentication/access to a link
     * 
     *     This function will likely not see much use, as it requires
     *     the plain text password version of the current logged-in user,
     *     wheter that be stored in a session or elsewhere.  This method is useful
     *     when you have access to the username/password, and you want to ensure
     *     a user is automatically logged in when they visit your forum (if for
     *     whatever reason they have been logged out)
     * 
     * @param {Object} o
     * @param {Object} $this
     * @scope private
     */
    function bind_access(o, $this){
        $this.bind('click', function(e){
            e.preventDefault();
            var this_href = $(this).attr('href');
            $('<div id="punbb-login-form">')
                .appendTo('body')
                .hide()
                .load(o.punbb_path + "/login.php form#afocus", function(){
                    if ($('#afocus').length > 0) {
                        $('#afocus input[name=req_username]').val(o.punbb_username);
                        $('#afocus input[name=req_password]').val(o.punbb_password);
                        $('#afocus input[name=save_pass]').attr({
                            checked: 'checked'
                        });
                        
                        $("#afocus").trigger("submit");
                    } else {
                        window.location = this_href;
                    }
                });
        });
    };
    
    /**
     * Bind punbb logout to current application logout
     * 
     * @param {Object} o
     * @param {Object} $this
     * @scope private
     */
    function bind_logout(o, $this){
        $this.bind('click', function(e){
            e.preventDefault();
            var this_href = $(this).attr('href');
            $('<div id="punbb-logout">')
                .appendTo('body')
                .hide()
                .load(o.punbb_path + "/index.php li#navlogout", function(){
                    //we only want to attempt to logout of punbb if we
                    //are actually logged in
                    if ($('#navlogout').length > 0) {
                        //submit a get request to punbb's navlogout anchor
                        $.get($('li#navlogout a').attr('href'), function(){
                            window.location = this_href;
                        });
                    } else {
                        window.location = this_href;    
                    }
                });
        });
    };
    
})(jQuery);