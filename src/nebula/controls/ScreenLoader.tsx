import * as React from 'react';
import "./controls.scss";

interface IScreenLoaderPropsTypes {
    loading: boolean;
    text?: string
}

export default function ScreenLoader({ loading, text }: IScreenLoaderPropsTypes) {
    if (!loading) return null;
    return <div id='nebula-spfx-control'>
        <p className="loading-text">
            {text || "Loading"}
            <div className="loading-dots">
                <i className="pl1__a"></i>
                <i className="pl1__b"></i>
                <i className="pl1__c"></i>
            </div>
        </p>
    </div>
}