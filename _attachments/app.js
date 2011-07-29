var bitcoinDb = $.couch.db("bitcoin-demo");

function postMessage() {
    var name = $("#message-name").val();
    var msg = $("#message-body").val();

    bitcoinDb.saveDoc({'type': 'message',
                       'msg': msg,
                       'when': new Date(),
                       'from': name});

    $("#message-name").val("");
    $("#message-body").val("");
}

function trackChanges() {
    var template = $("#bodyrow").html();
    var trade_target = $("#tradebody");
    var msg_target = $("#messages");
    var maxItems = 25;

    bitcoinDb.info({success: function(dbi) {
        var since = Math.max(0, dbi.update_seq - (maxItems * 5));
        console.log("Starting fetch at", since, dbi);

        var ch = bitcoinDb.changes(since, {"include_docs": true});
        ch.onChange(function(data) {
            data.results.forEach(function(row) {
                if (row.doc && row.doc.symbol) {
                    trade_target.prepend($.mustache(template, row.doc));
                    $("#tradebody tr:first").effect('highlight', {}, 3000);
                } else if (row.doc && row.doc.type === 'message') {
                    msg_target.prepend($.mustache($('#message').html(), row.doc));
                    $("#messages div:first").effect('highlight', {}, 3000);
                }
            });
            trade_target.find("tr:gt(" + maxItems + ")").remove();
            msg_target.find("div.message:gt(" + 10 + ")").remove();
        });

    }});
}

$(function() {
    trackChanges();
    $("#message-form").submit(function() {
        postMessage();
        return false;
    });
});