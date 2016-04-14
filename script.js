module.exports = {
    command: '',

    // ################################# BEGIN SETTINGS ###############################
    realRefreshFrequency: 1000, // Time in milliseconds between refreshes             #
    // ################################## END SETTINGS ################################

    refreshFrequency: false,

    dataLoaded: false,

    // Runs once at the load of the script
    afterRender: function () {
        // A workaround to use scss instead of stylus
        var widget = $('#epoch-time-widget-index-js');
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].ownerNode.nextElementSibling.id === 'epoch-time-widget-index-js') {
                for (var j in document.styleSheets[i].rules[0].style) {
                    if (typeof document.styleSheets[i].rules[0].style[j] === 'string' && document.styleSheets[i].rules[0].style[j] !== '') {
                        widget.css(j, document.styleSheets[i].rules[0].style[j]);
                    }
                }
                break;
            }
        }

        // Keeping a constant context through varying scopes
        var uber = this;

        // Show an error if user hasn't changed the setting
        if (uber.changeThisSetting === false) {
            widget.html('You need to modify "changeThisSetting" in the compiled index.js');
            widget.css('text-shadow', '1px 1px 15px rgb(0, 0, 0)');
            widget.css('font-weight', 900);
            widget.css('font-size', '20px');
            return;
        }

        // Executes shell command (curl) on timer
        var ready = function () {
            uber.run(uber.command, function () {});
            uber.refresh();
            setInterval(function () {
                uber.refresh();
            }, uber.realRefreshFrequency);
        };

        $('#epoch-time-widget-index-js').click(function () {
            uber.run('echo \'' + Math.round(Date.now() / 1000) + '\' | pbcopy', function () {});
        });

        ready();
    },

    // Composes the shell command to execute (curl)
    makeCommand: function (epoch) {
        return 'echo \'' + epoch + '\' | pbcopy';
    },

    // Runs every <realRefreshFrequency> milliseconds
    update: function () {
        $('#epoch-time').text(Math.round(Date.now() / 1000));

        if (!this.dataLoaded) {
            $('.epoch-time-widget').removeClass('loading');
            this.dataLoaded = true;
        }
    }
};
