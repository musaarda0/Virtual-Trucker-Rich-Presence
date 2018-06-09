// VIRTUAL TRUCKER RICH PRESENCE 2.50

var fetch = require('node-fetch');
const notifier = require('node-notifier');
const config = require('./config');
const packageInfo = require('./package.json');
const LogManager = require('./LogManager');
const opn = require('open');

class UpdateNotifier {
    constructor() {
        this.logger = new LogManager();
    }

    checkUpdates() {

        var instance = this;

        this.logger.info('Checking updates..');

        fetch(config.latestReleaseAPIUrl).then((body) => {
            return body.json();
        }).then((response) => {

            instance.logger.info(`Current version: ${packageInfo.version}, Latest release: ${response.tag_name}`);

            if (packageInfo.version != response.tag_name && !response.prerelease) {

                instance.logger.info('Sending notification');

                notifier.notify({
                        title: 'Virtual Trucker Rich Presence update available',
                        message: `Download new version ${response.tag_name}`,
                        sound: true, // Only Notification Center or Windows Toasters
                        wait: true, // Wait with callback, until user action is taken against notification,    
                        open: config.latestRelesePage                    
                    },
                    function (err, response) {
                        // Response is response from notification

                        if (err) {
                            instance.logger.info('Notification sent with error');
                        }
                        else
                            instance.logger.info('Notification sent');
                    }
                );

                notifier.on('click', function (notifierObject, options) {
                    // Triggers if `wait: true` and user clicks notification
                    opn(options.open);
                });

                notifier.on('timeout', function (notifierObject, options) {
                    // Triggers if `wait: true` and notification closes
                });
            }
        });
    }
}

module.exports = UpdateNotifier;