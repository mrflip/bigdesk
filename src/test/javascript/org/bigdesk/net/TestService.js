/*
 * Copyright 2011-2013 Lukas Vlcek
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('org.bigdesk.net.TestService');

goog.require('org.bigdesk.net.Service');

goog.require('goog.debug.Logger');

/**
 *
 * @constructor
 * @implements {org.bigdesk.net.Service}
 */
org.bigdesk.net.TestService = function() {
    /** @private */ this.log = goog.debug.Logger.getLogger('org.bigdesk.net.TestService');
};

/** @inheritDoc */
org.bigdesk.net.TestService.prototype.getNodesStats = function (callback, opt_timestamp) {;

    var data = { type: 'nodes stats' };
    callback(opt_timestamp, data);

};

/** @inheritDoc */
org.bigdesk.net.TestService.prototype.getNodesInfo = function (callback, opt_timestamp) {

    var data = { type: 'nodes info' };
    callback(opt_timestamp, data);

};
