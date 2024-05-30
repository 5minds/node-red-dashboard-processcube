const statestore = require('../store/state.js')

module.exports = function (RED) {
    function SliderNode (config) {
        RED.nodes.createNode(this, config)
        const node = this

        // which group are we rendering this widget
        const group = RED.nodes.getNode(config.group)

        this.pt = config.passthru
        this.state = [' ', ' ']

        node.status({})

        const evts = {
            onChange: true,
            beforeSend: function (msg) {
                if (msg.payload !== undefined) {
                    if (!node.pt) {
                        node.state[0] = msg.payload
                        node.status({ shape: 'dot', fill: 'grey', text: node.state[0] + ' | ' + node.state[1] })
                    } else if (node._wireCount === 0) {
                        node.status({ shape: 'dot', fill: 'grey', text: msg.payload })
                    }
                }
                /**
                 * Dynamic Properties
                 * */
                const updates = msg.ui_update
                if (updates) {
                    if (typeof (updates.label) !== 'undefined') {
                        // dynamically set "label" property
                        statestore.set(group.getBase(), node, msg, 'label', updates.label)
                    }
                    if (typeof (updates.thumbLabel) !== 'undefined') {
                        statestore.set(group.getBase(), node, msg, 'thumbLabel', updates.thumbLabel)
                    }
                    if (typeof (updates.min) !== 'undefined') {
                        statestore.set(group.getBase(), node, msg, 'min', updates.min)
                    }
                    if (typeof (updates.step) !== 'undefined') {
                        statestore.set(group.getBase(), node, msg, 'step', updates.step)
                    }
                    if (typeof (updates.max) !== 'undefined') {
                        statestore.set(group.getBase(), node, msg, 'max', updates.max)
                    }
                }
                return msg
            }
        }

        // inform the dashboard UI that we are adding this node
        group.register(node, config, evts)
    }
    RED.nodes.registerType('ui-slider', SliderNode)
}
