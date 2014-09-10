function InputHistory(id, callback_submit) {
    var command_history = [];
    var command_counter = -1;
    var history_counter = -1;

    $(id).keydown(function(e) {
        code = e.keyCode || e.which;
        // Enter key - fire command
        if (code == 13) {
            var command = $(this).val();
            if (command.trim() === '')
                return;
            command_history[command_counter++] = command;
            history_counter = command_counter;
            $(this).val('');
            if (callback_submit) callback_submit(command);
            // Up arrow - traverse history
        } else if (code == 38) {
            if (history_counter >= 0) {
                $(this).val(command_history[--history_counter]);
            }
        } else if (code == 40) {
            if (history_counter <= command_counter) {
                $(this).val(command_history[++history_counter]);
            }
        }
    });            
}