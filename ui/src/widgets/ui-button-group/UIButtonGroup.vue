<template>
    <div class="nrdb-ui-button-group-wrapper">
        <label v-if="label" class="v-label">
            {{ label }}
        </label>
        <v-btn-toggle v-model="selection" mandatory divided :rounded="props.rounded ? 'xl' : ''" :color="selectedColor" :disabled="!state.enabled" @update:model-value="onChange(selection)">
            <v-btn v-for="option in options" :key="option.value" :value="option.value">
                <template v-if="option.icon && option.label !== undefined && option.label !== ''" #prepend>
                    <v-icon size="x-large" :icon="`mdi-${option.icon.replace(/^mdi-/, '')}`" />
                </template>
                <v-icon v-if="option.icon && !option.label" :icon="`mdi-${option.icon.replace(/^mdi-/, '')}`" size="x-large" />
                {{ option.label }}
            </v-btn>
        </v-btn-toggle>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'DBUIButtonGroup',
    inject: ['$socket', '$dataTracker'],
    props: {
        id: { type: String, required: true },
        props: { type: Object, default: () => ({}) },
        state: { type: Object, default: () => ({}) }
    },
    data () {
        return {
            selection: null
        }
    },
    computed: {
        ...mapState('data', ['messages']),
        selectedColor: function () {
            if (this.selection !== null && this.props.useThemeColors === false) {
                return this.findOptionByValue(this.selection)?.color
            } else {
                return 'rgb(var(--v-theme-primary))'
            }
        },
        variant: function () {
            return this.look === 'default' ? null : this.look
        },
        label: function () {
            return this.getProperty('label')
        },
        options: function () {
            const options = this.getProperty('options')
            if (options) {
                return options.map(option => {
                    if (typeof option === 'string') {
                        return { label: option, value: option }
                    } else {
                        return option
                    }
                })
            }
            return options
        }
    },
    created () {
        // can't do this in setup as we are using custom onInput function that needs access to 'this'
        this.$dataTracker(this.id, this.onInput, this.onLoad, this.onDynamicProperty)

        // let Node-RED know that this widget has loaded
        this.$socket.emit('widget-load', this.id)
    },
    methods: {
        onInput (msg) {
            // update our vuex store with the value retrieved from Node-RED
            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })

            // make sure our v-model is updated to reflect the value from Node-RED
            if (msg.payload !== undefined) {
                if (Array.isArray(msg.payload) && msg.payload.length === 0) {
                    this.selection = null
                } else {
                    if (this.findOptionByValue(msg.payload) !== null) {
                        this.selection = msg.payload
                    }
                }
            }
        },
        onLoad (msg) {
            if (msg) {
                // update vuex store to reflect server-state
                this.$store.commit('data/bind', {
                    widgetId: this.id,
                    msg
                })
                // make sure we've got the relevant option selected on load of the page
                if (msg.payload !== undefined) {
                    if (Array.isArray(msg.payload) && msg.payload.length === 0) {
                        this.selection = null
                    } else {
                        if (this.findOptionByValue(msg.payload) !== null) {
                            this.selection = msg.payload
                        }
                    }
                }
            }
        },
        onDynamicProperty (msg) {
            const updates = msg.ui_update
            if (updates) {
                this.updateDynamicProperty('label', updates.label)
                this.updateDynamicProperty('options', updates.options)
            }
        },
        onChange (value) {
            if (value !== null && typeof value !== 'undefined') {
                // Tell Node-RED a new value has been selected
                this.$socket.emit('widget-change', this.id, value)
            }
        },
        // Keep the code of this function in sync with the server-side function
        findOptionByValue: function (val) {
            const opt = this.options?.find(option => {
                if (typeof (val) === 'object') {
                    return (JSON.stringify(val) === JSON.stringify(option.value))
                } else {
                    return option.value === val
                }
            })
            if (opt) {
                return opt
            }
            return null
        }
    }
}
</script>

<style>
.nrdb-ui-button-group-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.nrdb-ui-button-group-wrapper .v-chip__content{
    white-space: normal;
}
.nrdb-ui-button-group-wrapper .v-btn-group {
    width: max-content;
    border-width: thin;
    border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}
/* default styling for an unselected option */
.nrdb-ui-button-group-wrapper .v-btn--variant-elevated {
   color: rgb(var(--v-theme-on-group-background));
   background-color: rgb(var(--v-theme-group-background));
}

.nrdb-ui-button-group-wrapper .v-btn--variant-elevated {
    --v-activated-opacity: 0;
}

.nrdb-ui-button-group-wrapper .icon-only .v-btn__prepend {
    margin-inline: 0;
}

.nrdb-ui-button-group-wrapper .v-btn.v-btn--disabled .v-btn__overlay {
    opacity: 0.1;
}

.nrdb-ui-button-group-wrapper .v-btn-group .v-btn--disabled .v-btn__content {
    color: rgb(var(--v-theme-on-group-background), var(--v-disabled-opacity));
}
</style>
