#!/usr/bin/env node

'use strict';

/**
 * CricBot launcher script.
 */

var CricBot = require('../lib/cricbot');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
  *  BOT_NAME: the username you want to give to the bot within your organisation.
 */

var botapikey = process.env.BOT_API_KEY;
var cricketapikey = process.env.CRIC_API_KEY

var settings = {
    token: botapikey,
    cricapikey:cricketapikey
    };

var cricBot = new CricBot(settings);
cricBot.run();
