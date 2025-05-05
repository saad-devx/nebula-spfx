import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as strings from 'ReplaceThisWpNameWebPartStrings';
import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import ReplaceThisWpName from './components/ReplaceThisWpName';
import { propertyPaneFields, propertyPaneGroups } from './components/lib/prop-pane.config';

export interface IReplaceThisWpNameWebPartProps {
  [key: string]: any;
  description?: string;
}

export default class ReplaceThisWpNameWebPart extends BaseClientSideWebPart<IReplaceThisWpNameWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  private getInitializedProps(): IReplaceThisWpNameWebPartProps {
    const result: IReplaceThisWpNameWebPartProps = {};

    for (const field of propertyPaneFields) {
      const propName = field.targetProperty;
      const propValue = this.properties[propName];

      let defaultValue: any = undefined;

      if ('checked' in field.properties) defaultValue = field.properties.checked;
      if ('selectedKey' in field.properties) defaultValue = field.properties.selectedKey;
      else if ('value' in field.properties) defaultValue = field.properties.value;

      if (propValue !== undefined) result[propName] = propValue;
      else if (defaultValue !== undefined) result[propName] = defaultValue;
    }

    if (this.properties.description !== undefined) {
      result.description = this.properties.description;
    }

    return result;
  }

  public render(): void {
    const propPane = this.getInitializedProps();

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
          groups: propertyPaneGroups
        }
      ]
    };
  }
}