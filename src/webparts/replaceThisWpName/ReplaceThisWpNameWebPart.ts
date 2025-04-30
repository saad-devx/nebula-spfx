import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ReplaceThisWpNameWebPartStrings';
import ReplaceThisWpName from './components/ReplaceThisWpName';

export interface IReplaceThisWpNameWebPartProps {
  description: string;
  listName: string;
  showDuration: boolean;
  ItemsToShow: string;
}

export default class ReplaceThisWpNameWebPart extends BaseClientSideWebPart<IReplaceThisWpNameWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const propPane = {
      listName: this.properties?.listName || "MyItems",
      ItemsToShow: this.properties?.ItemsToShow || "all",
      showDuration: typeof this.properties?.showDuration == "boolean" ? this.properties?.showDuration : true,
    }
    const element: React.ReactElement<any> = React.createElement(
      ReplaceThisWpName,
      {
        propPane,
        spContext: this.context,
        isDarkTheme: this._isDarkTheme,
        currentUser: this.context.pageContext.user,
        environmentMessage: this._environmentMessage,
        web: {
          absUrl: this.context.pageContext.web.absoluteUrl,
          relUrl: this.context.pageContext.web.serverRelativeUrl,
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    this.domElement.parentElement!.style.width = "100%";
    this.domElement.parentElement!.style.maxWidth = "100%";

    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) {
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) return;

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;
    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: "Webpart Configuration",
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: 'List Name',
                  value: 'MyItems'
                }),
                PropertyPaneDropdown('ItemsToShow', {
                  label: 'Items to Show',
                  options: [
                    { key: 'all', text: 'All items' },
                    ...Array.from({ length: 10 }, (_, i) => ({ key: i + 1, text: (i + 1).toString() }))
                  ]
                }),
                PropertyPaneToggle('showDuration', {
                  label: 'Show Modules Durations',
                  checked: true,
                  onText: 'On',
                  offText: 'Off'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
