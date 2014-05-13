var pop3_test_action = function() {
    $('.pop3_debug_data').empty();
    event.preventDefault();
    var form = $(this).parent();
    var id = form.find('#pop3_server_id');
    Hm_Ajax.request(
        form.serializeArray(),
        function(res) {
            Hm_Notices.show(res.router_user_msgs);
        },
        {'pop3_connect': 1}
    );
};

var pop3_save_action = function() {
    $('.pop3_debug_data').empty();
    event.preventDefault();
    var form = $(this).parent();
    var id = form.find('#pop3_server_id');
    Hm_Ajax.request(
        form.serializeArray(),
        function(res) {
            Hm_Notices.show(res.router_user_msgs);
            if (res.just_saved_credentials) {
                form.find('.credentials').attr('disabled', true);
                form.find('.save_pop3_connection').hide();
                form.find('.pop3_password').val('');
                form.find('.pop3_password').attr('placeholder', '[saved]');
                form.append('<input type="submit" value="Forget" class="forget_pop3_connection" />');
                $('.forget_pop3_connection').on('click', pop3_forget_action);
            }
        },
        {'pop3_save': 1}
    );
};

var pop3_forget_action = function() {
    $('.pop3_debug_data').empty();
    event.preventDefault();
    var form = $(this).parent();
    var id = form.find('#pop3_server_id');
    Hm_Ajax.request(
        form.serializeArray(),
        function(res) {
            Hm_Notices.show(res.router_user_msgs);
            if (res.just_forgot_credentials) {
                form.find('.credentials').attr('disabled', false);
                form.find('.pop3_password').val('');
                form.find('.pop3_password').attr('placeholder', 'Password');
                form.append('<input type="submit" value="Save" class="save_pop3_connection" />');
                $('.save_pop3_connection').on('click', pop3_save_action);
                $('.forget_pop3_connection', form).remove();
            }
        },
        {'pop3_forget': 1}
    );
};

var pop3_delete_action = function() {
    $('.pop3_debug_data').empty();
    event.preventDefault();
    var form = $(this).parent();
    var id = form.find('#pop3_server_id');
    Hm_Ajax.request(
        form.serializeArray(),
        function(res) {
            Hm_Notices.show(res.router_user_msgs);
            if (res.deleted_server_id > -1 ) {
                form.parent().remove();
            }
        },
        {'pop3_delete': 1}
    );
};
var display_pop3_mailbox = function(res) {
    Hm_Notices.hide(true);
    var pop3_id = res.pop3_server_id;
    var msg_ids = [];
    for (index in res.formatted_mailbox_page) {
        row = res.formatted_mailbox_page[index][0];
        id = res.formatted_mailbox_page[index][1];
        if (!$('.'+id).length) {
            $('.message_table tbody').append(row);
            $('.'+id).fadeIn(600);
        }
        msg_ids.push(id);
    }
    $('.message_table tbody tr[class^=pop3_'+pop3_id+'_]').filter(function() {
        var id = this.className;
        if (jQuery.inArray(id, msg_ids) == -1) {
            $(this).fadeOut(600, function() { $('.'+id).remove(); });
        }
    });
    if (res.pop3_page_links) {
        $('.pop3_page_links').html(res.pop3_page_links);
    }
};

var select_pop3_folder = function(path, force) {
    var detail = parse_folder_path(path, 'pop3');
    if (detail) {
        if (force) {
            Hm_Notices.show({0: 'Updating folder...'});
        }
        Hm_Ajax.request(
            [{'name': 'hm_ajax_hook', 'value': 'ajax_pop3_folder_display'},
            {'name': 'pop3_server_id', 'value': detail.server_id}],
            display_pop3_mailbox,
            [],
            false
        );
    }
    return false;
};
if (hm_page_name == 'servers') {
    $('.test_pop3_connect').on('click', pop3_test_action);
    $('.save_pop3_connection').on('click', pop3_save_action);
    $('.forget_pop3_connection').on('click', pop3_forget_action);
    $('.delete_pop3_connection').on('click', pop3_delete_action);
}
else if (hm_page_name == 'message_list') {
    if (hm_list_path != '') {
        if ($('.message_table tbody tr').length == 0) {
            select_pop3_folder(hm_list_path, true);
        }
        $('.message_table tr').fadeIn(100);
    }
}
