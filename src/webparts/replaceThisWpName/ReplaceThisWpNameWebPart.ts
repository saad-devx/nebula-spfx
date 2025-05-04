import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as strings from 'ReplaceThisWpNameWebPartStrings';
import { Version } from '@microsoft/sp-core-library';
import { DisplayMode } from '@microsoft/sp-core-library';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

import ReplaceThisWpName from './components/ReplaceThisWpName';
import { propertyPaneFields, propertyPaneGroups } from './components/lib/prop-pane.config';

interface IReplaceThisWpNameWebPartProps {
  [key: string]: any;
  description: string;
  // TypeScript won't let us dynamically add properties at runtime,
  // but the [key: string]: any allows any properties from propertyPaneFields
}

export default class ReplaceThisWpNameWebPart extends BaseClientSideWebPart<IReplaceThisWpNameWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  private getDefaultProps(): Partial<IReplaceThisWpNameWebPartProps> {
    const defaultProps: Partial<IReplaceThisWpNameWebPartProps> = {
      description: ''
    };
    propertyPaneFields.forEach(field => {
      defaultProps[field.fieldName] = field.defaultValue;
    });

    return defaultProps;
  }

  private getInitializedProps(): IReplaceThisWpNameWebPartProps {
    const defaultProps = this.getDefaultProps();
    const result = { ...defaultProps } as IReplaceThisWpNameWebPartProps;

    for (const field of propertyPaneFields) {
      const propName = field.fieldName;
      const propValue = this.properties[propName];

      if (propValue !== undefined) {
        if (typeof field.defaultValue === typeof propValue) result[propName] = propValue;
        else result[propName] = field.defaultValue;
      }
    }

    if (this.properties.description !== undefined) {
      result.description = this.properties.description;
    }

    return result as IReplaceThisWpNameWebPartProps;
  }

  public render(): void {
    const element: React.ReactElement<any> = React.createElement(
      ReplaceThisWpName,
      {
        propPane: this.getInitializedProps(),
        spContext: this.context,
        isEditMode: this.displayMode === DisplayMode.Edit,
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