import {
    PropertyPaneTextField,
    PropertyPaneToggle,
    PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

export const propertyPaneFields = [
    PropertyPaneTextField('listName', {
        label: 'List Name',
        value: 'MyItems'
    }),
    PropertyPaneDropdown('itemsToShow', {
        label: 'Items to Show',
        options: [
            { key: 'all', text: 'All items' },
            ...Array.from({ length: 10 }, (_, i) => ({ key: i + 1, text: (i + 1).toString() }))
        ],
        selectedKey: "all"
    }),
    PropertyPaneToggle('showDuration', {
        label: 'Show Modules Durations',
        checked: true,
        onText: 'On',
        offText: 'Off'
    })
];

// Export the groups configuration
export const propertyPaneGroups = [
    {
        groupName: "Webpart Configuration",
        groupFields: propertyPaneFields
    }
];