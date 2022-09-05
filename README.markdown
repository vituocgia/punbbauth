#PunBB Authentication JQuery Plugin#
# Old commit
# This is a test commit
Provides an easy way to hook into [PunBB](http://punbb.informer.com/) auth login/logout.  Hooks should be applied to your own applications login form and logout link.  Another option is available to hook into an "access" link, however this will likely not see much use under most normal circumstances.

This plugin does not attempt to solve the issue of syncing your application with PunBB.  Rather, it attempts to solve the issue of single sign on when the user logs into your application.

##Gotchas##

As the plugin uses [XHR](http://en.wikipedia.org/wiki/XMLHttpRequest) to communicate with PunBB, it's usage is of course limited to the XHR [same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy)

##Examples##

###BIND TO LOGIN FORM###

####ex. 1####

    $('.punbb').punbbauth();                    //assumes a username fieldname of username
                                                //assumes a password fieldname of password
                                                //also assumes form class structure: <form ... class="punbb login" ... >
                            
####ex. 2####

    $('.punbb').punbbauth({
        app_uname_field : 'uname_fieldname',    //username fieldname: <input name="uname_fieldname" />                                
        app_pword_field : 'pword_fieldname'     //password fieldname: <input name="pword_fieldname" />
                                                //also assumes form class structure: <form ... class="punbb login" ... >
    });

###BIND TO LOGOUT LINK###

####ex. 1####

    $('.punbb').punbbauth();                    //assumes link class structure: <a ... class="punbb logout">...</a>

###BIND TO ACCESS LINK###

NOTE: This will likely not see very much use, as it requires access to a plain text password.  See notes below

####ex. 1####

    $('.punbb').punbbauth({
        punbb_username : 'username', 
        punbb_password : 'password'             //assumes link class structure: <a ... class="punbb access">...</a>
    });
