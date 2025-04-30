import * as React from 'react';
import { useEffect, useState } from 'react';
import { ComboBoxListItemPicker } from '@pnp/spfx-controls-react';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { sp } from '@pnp/sp';

export interface ISPItemPickerProps {
    props: any;
    listName?: string;
    listId?: string;
    columnInternalName: string;
    keyColumnInternalName?: string;
    orderBy?: string;
    onSelectedItem: (item: any[]) => void;
    multiSelect?: boolean;
}

export default function SPItemPicker(props: ISPItemPickerProps) {
    const { web, spContext } = props.props;
    const {
        listName,
        listId,
        columnInternalName,
        keyColumnInternalName,
        orderBy,
        onSelectedItem,
        multiSelect,
        ...restProps
    } = props;

    const [resolvedListId, setResolvedListId] = useState<string>(listId || '');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const initialize = async () => {
            if (listId) return
            try {
                sp.setup({ spfxContext: spContext });
                const list = await sp.web.lists.getByTitle(listName!).select('Id')();
                setResolvedListId(list.Id);
            } catch (err) {
                setError(`Failed to load list: ${err.message}`);
                console.error('Error loading list:', err);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, [listName, spContext]);

    if (loading) return <Spinner label="Loading list..." />;
    if (error) return <div className="error">{error}</div>;
    if (!resolvedListId) return <div>List not found</div>;

    return <ComboBoxListItemPicker
        listId={resolvedListId}
        columnInternalName={columnInternalName}
        keyColumnInternalName={keyColumnInternalName || 'ID'}
        orderBy={orderBy}
        onSelectedItem={onSelectedItem}
        multiSelect={multiSelect || false}
        {...restProps}
        webUrl={web.absUrl}
        spHttpClient={spContext.spHttpClient}
    />
};