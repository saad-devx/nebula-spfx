import { useEffect, useState } from "react";
import { logger, sleep } from "@nebula/utils";
import { setupSP } from "@nebula/utils/setup-spfx";

import { LIST_NAME, SAMPLE_DATA } from "./enums";

export default function useService(props: any) {
    const { propPane } = props;
    const [items, setItems]: any = useState([]);
    const [loading, setLoading]: any = useState(false);

    const itemsToSlice = propPane.itemsToShow == "all" ? 1000 : +propPane.itemsToShow;
    const slicedItems = items.slice(0, itemsToSlice);

    useEffect(() => {
        // Initial Setup
        setupSP(props)

        // All other actions
        getItems()
    }, [])

    const startLoading = async () => {
        setLoading(true)
        await sleep(4000)
        alert("Stopping the loading now!")
        setLoading(false)
    }

    const getItems = async () => {
        try {
            // ---------------------------Use below logic for fetching-------------------------

            const { listName } = (window as any).replaceThisWpNameData
            const spList = listName || LIST_NAME;
            logger(`Fetching data from list "${spList}"...`)
            // const items = await sp.web.lists.getByTitle(spList).items
            //     .select("ID,ABC_Title,ABC_description,ABC_Type")
            //     .filter(`ABC_Type eq 'good' and ID ne 0`)
            //     .get();

            // setItems(items);

            // ---------------------Sample Data for demo-----------------------

            setItems(SAMPLE_DATA);
        } catch (e) {
            console.log("Error fetching items: ", e)
        }
    };

    const resetItems = () => setItems([])

    return {
        loading,
        itemsToSlice,
        items: slicedItems,

        setItems,
        getItems,
        resetItems,
        startLoading
    }
}

