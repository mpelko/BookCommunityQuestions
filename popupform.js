
function add_popupform {

thingy = document.body;
thingy.innerHTML += "\
<div id='fg_formContainer'>\
    <div id='fg_container_header'>\
        <div id='fg_box_Title'>Contact us</div>\
        <div id='fg_box_Close'><a href='javascript:fg_hideform('fg_formContainer','fg_backgroundpopup');'>Close(X)</a></div>\
    </div>\
    <div id='fg_form_InnerContainer'>\
    <form id='contactus' action='javascript:fg_submit_form()' method='post' accept-charset='UTF-8'>\
    <input type='hidden' name='submitted' id='submitted' value='1'/>\
    <input type='hidden' name='<?php echo $formproc->GetFormIDInputName(); ?>' value='<?php echo $formproc->GetFormIDInputValue(); ?>'/>\
    <input type='text'  class='spmhidip' name='<?php echo $formproc->GetSpamTrapInputName(); ?>' />\
    <div class='short_explanation'>* required fields</div>\
    <div id='fg_server_errors' class='error'></div>\
    <div class='container'>\
        <label for='name' >Your Full Name*: </label><br/>\
        <input type='text' name='name' id='name' value='' maxlength='50' /><br/>\
        <span id='contactus_name_errorloc' class='error'></span>\
    </div>\
    <div class='container'>\
    <label for='email' >Email Address*:</label><br/>\
        <input type='text' name='email' id='email' value='' maxlength='50' /><br/>\
        <span id='contactus_email_errorloc' class='error'></span>\
    </div>\
    <div class='container'>\
        <label for='message' >Message:</label><br/>\
        <span id='contactus_message_errorloc' class='error'></span>\
        <textarea rows='10' cols='50' name='message' id='message'></textarea>\
    </div>\
    <div class='container'>\
        <input type='submit' name='Submit' value='Submit' />\
    </div>\
    </form>\
    </div>\
</div>\
<div id='fg_backgroundpopup'></div>";

}
