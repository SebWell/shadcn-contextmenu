export default {
    editor: {
        label: 'ContextMenu',
        icon: 'cube',
    },
    triggerEvents: [
        { name: 'click', label: 'On Click', event: { value: '' }, default: true },
    ],
    properties: {
        content: {
            label: 'Content',
            type: 'Object',
            section: 'settings',
            bindable: true,
            defaultValue: {}
        }
    }
};
