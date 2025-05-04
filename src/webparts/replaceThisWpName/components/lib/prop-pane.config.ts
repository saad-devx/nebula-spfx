import {
    PropertyPaneTextField,
    PropertyPaneToggle,
    PropertyPaneDropdown
} from '@microsoft/sp-property-pane';

export const propertyPaneFields = [
    {
        fieldName: 'listName',
        fieldConfig: PropertyPaneTextField('listName', {
            label: 'List Name'
        }),
        defaultValue: 'MyItems'
    },
    {
        fieldName: 'ItemsToShow',
        fieldConfig: PropertyPaneDropdown('ItemsToShow', {
            label: 'Items to Show',
            options: [
                { key: 'all', text: 'All items' },
                ...Array.from({ length: 10 }, (_, i) => ({ key: i + 1, text: (i + 1).toString() }))
            ]
        }),
        defaultValue: 'all'
    },
    {
        fieldName: 'showDuration',
        fieldConfig: PropertyPaneToggle('showDuration', {
            label: 'Show Modules Durations',
            onText: 'On',
            offText: 'Off'
        }),
        defaultValue: true
    }
];

// Groups configuration
export const propertyPaneGroups = [
    {
        groupName: "Webpart Configuration",
        groupFields: propertyPaneFields.map(field => field.fieldConfig)
    }
];