import { sp } from "@pnp/sp/presets/all";

const setupSP = (props: any) => {
    sp.setup({ spfxContext: props.spContext });
    (window as any).replaceThisWpNameData = props
}

export { sp, setupSP }