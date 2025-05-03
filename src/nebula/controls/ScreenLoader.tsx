import * as React from 'react';
import { createPortal } from 'react-dom';
import "./controls.scss";

interface IScreenLoaderPropsTypes {
    loading: boolean;
    text?: string
}

export default function ScreenLoader({ loading, text }: IScreenLoaderPropsTypes) {
    const portalRoot = typeof document !== "undefined" ? document.body : null
    if (!loading || !portalRoot) return null;

    return createPortal(
        <div id='nebula-spfx-control-screen-loader'>
            <p className="loading-text">
                {text || "Loading"}
                <div className="loading-dots">
                    <i className="pl1__a"></i>
                    <i className="pl1__b"></i>
                    <i className="pl1__c"></i>
                </div>
            </p>
        </div>,
        portalRoot
    )
}