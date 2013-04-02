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

goog.require('org.bigdesk.store.Manager');
goog.require('org.bigdesk.store.TestManager');
goog.require('org.bigdesk.net.TestServiceFactory');
goog.require('org.bigdesk.store.event.EventType');
goog.require('org.bigdesk.state.Head');
goog.require('org.bigdesk.state.State');

goog.require('goog.testing.jsunit');

/**
 * Setup new Manager instance into global variable called 'manager'.
 * It allows for customized manager configuration.
 * @param {Object=} opt_configuration
 * @return {org.bigdesk.store.Manager}
 */
var setUpNewGlobalManager = function(opt_configuration) {

    if (goog.isDefAndNotNull(this.manager)) { tearDown() }

    var config = {
        net_service: 'test'
    };

    if (goog.isDefAndNotNull(opt_configuration)) {
        goog.mixin(config, opt_configuration)
    }

    /** @type {org.bigdesk.net.ServiceFactory} */
    var serviceFactory = new org.bigdesk.net.TestServiceFactory();

    if (config.net_service == 'noop') {
        this.manager = new org.bigdesk.store.TestManager(config, serviceFactory);
    } else {
        this.manager = new org.bigdesk.store.Manager(config, serviceFactory);
    }
    return this.manager;
};

var tearDown = function() {
    if (this.manager) {
        this.manager.dispose(); delete this.manager;
    }
};

/**
 * If you start the manager, it pulls all resources immediately without the delay.
 * This test uses TestService which does not execute any async requests thus the results are delivered immediately,
 * in practice, the Service executes some kind of async request, so the results are delivered after some delay.
 */
var testManagerStartStop = function () {

    var manager = setUpNewGlobalManager();

    assertEquals("Manager's store is empty", 0, manager.getNodesStatsCount());
    assertEquals("Manager's store is empty", 0, manager.getNodesInfoCount());
    assertEquals("Manager's store is empty", 0, manager.getClusterHealthCount());
    assertEquals("Manager's store is empty", 0, manager.getClusterStatesCount());
    assertEquals("Manager's store is empty", 0, manager.getIndexSegmentsCount());
    assertEquals("Manager's store is empty", 0, manager.getHotThreadsCount());

    manager.start().stop();

    assertEquals("Manager's store contains just one item", 1, manager.getNodesStatsCount());
    assertEquals("Manager's store contains just one item", 1, manager.getNodesInfoCount());
    assertEquals("Manager's store contains just one item", 1, manager.getClusterHealthCount());
    assertEquals("Manager's store contains just one item", 1, manager.getClusterStatesCount());
    assertEquals("Manager's store contains just one item", 1, manager.getIndexSegmentsCount());
    assertEquals("Manager's store contains just one item", 1, manager.getHotThreadsCount());
};

/**
 * Simple test that Manager dispatches all AddData events.
 */
var testManagerAddDataEvents = function () {

    var firedEvents = 0;

    var manager = setUpNewGlobalManager();

    goog.events.listenOnce(
        manager,
        org.bigdesk.store.event.EventType.NODES_STATS_ADD,
        function(e) {
            var event = /** @type {org.bigdesk.store.event.DataAdd} */ (e);
            assertEquals('Expecting event with nodes stats', 'nodes stats', event.getData()['type']);
            firedEvents++;
        }
    );

    goog.events.listenOnce(
        manager,
        org.bigdesk.store.event.EventType.NODES_INFO_ADD,
        function(e) {
            var event = /** @type {org.bigdesk.store.event.DataAdd} */ (e);
            assertEquals('Expecting event with nodes info', 'nodes info', event.getData()['type']);
            firedEvents++;
        }
    );

    goog.events.listenOnce(
        manager,
        org.bigdesk.store.event.EventType.CLUSTER_HEALTH_ADD,
        function(e) {
            var event = /** @type {org.bigdesk.store.event.DataAdd} */ (e);
            assertEquals('Expecting event with cluster health', 'cluster health', event.getData()['type']);
            firedEvents++;
        }
    );

    goog.events.listenOnce(
        manager,
        org.bigdesk.store.event.EventType.CLUSTER_STATE_ADD,
        function(e) {
            var event = /** @type {org.bigdesk.store.event.DataAdd} */ (e);
            assertEquals('Expecting event with cluster states', 'cluster states', event.getData()['type']);
            firedEvents++;
        }
    );

    goog.events.listenOnce(
        manager,
        org.bigdesk.store.event.EventType.INDEX_SEGMENTS_ADD,
        function(e) {
            var event = /** @type {org.bigdesk.store.event.DataAdd} */ (e);
            assertEquals('Expecting event with index segments', 'index segments', event.getData()['type']);
            firedEvents++;
        }
    );

    goog.events.listenOnce(
        manager,
        org.bigdesk.store.event.EventType.HOT_THREADS_ADD,
        function(e) {
            var event = /** @type {org.bigdesk.store.event.DataAdd} */ (e);
            assertEquals('Expecting event with hot threads', 'hot threads', event.getData());
            firedEvents++;
        }
    );

    manager.start().stop();

    assertEquals('We expect 6 events', 6, firedEvents);
};

/**
 * Simple test that Manager's getXLatest() return data.
 */
var testManagerGetLatestData = function () {

    var manager = setUpNewGlobalManager();
    manager.start().stop();

    assertEquals('nodes info',      manager.getNodesInfoLatest().value['type']);
    assertEquals('nodes stats',     manager.getNodesStatsLatest().value['type']);
    assertEquals('cluster health',  manager.getClusterHealthLatest().value['type']);
    assertEquals('cluster states',  manager.getClusterStateLatest().value['type']);
    assertEquals('index segments',  manager.getIndexSegmentsLatest().value['type']);
    assertEquals('hot threads',     manager.getHotThreadsLatest().value);
};

/**
 * Simple test of State position.
 */
var testManagerGetStateFor = function () {

    var manager = /** @type {org.bigdesk.store.TestManager} */ (setUpNewGlobalManager({net_service: 'noop'}));

    manager.addIntoClusterHealthsTest(2, {value:2});
    manager.addIntoClusterHealthsTest(4, {value:4});
    manager.addIntoClusterHealthsTest(5, {value:5});
    manager.addIntoClusterHealthsTest(7, {value:7});
    manager.addIntoClusterHealthsTest(9, {value:9});

    var head = new org.bigdesk.state.Head(manager);

    assertNull(head.getState(-10).getClusterHealth());
    assertNull(head.getState(-1).getClusterHealth());
    assertNull(head.getState(0).getClusterHealth());
    assertNull(head.getState(1).getClusterHealth());
    assertEquals(2, head.getState(2).getClusterHealth().timestamp);
    assertEquals(2, head.getState(3).getClusterHealth().timestamp);
    assertEquals(4, head.getState(4).getClusterHealth().timestamp);
    assertEquals(5, head.getState(5).getClusterHealth().timestamp);
    assertEquals(5, head.getState(6).getClusterHealth().timestamp);
    assertEquals(7, head.getState(7).getClusterHealth().timestamp);
    assertEquals(7, head.getState(8).getClusterHealth().timestamp);
    assertEquals(9, head.getState(9).getClusterHealth().timestamp);
    assertEquals(9, head.getState(10).getClusterHealth().timestamp);
    assertEquals(9, head.getState(100).getClusterHealth().timestamp);

    assertEquals(-10, head.getState(-10).getPosition());
    assertEquals(0, head.getState(0).getPosition());
    assertEquals(5, head.getState(5).getPosition());
    assertEquals(100, head.getState(100).getPosition());

    var state = head.getState(-10);

    assertNull(state.getNodesStats());
    assertNull(state.getNodesInfo());
    assertNull(state.getClusterState());
    assertNull(state.getClusterHealth());
    assertNull(state.getIndicesSegments());
    assertNull(state.getHotThreads());
};