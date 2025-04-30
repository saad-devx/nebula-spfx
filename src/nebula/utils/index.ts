export const logger = function (message: any, variant = 'info') {
    const styles: any = {
        info: [
            'color: white; background: #3b3f5c; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
            'color: #3b3f5c; background: #f1f3f6; padding: 2px 6px; border-radius: 4px;'
        ],
        warning: [
            'color: black; background: #f9c74f; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
            'color: #7a5d00; background: #fff8e1; padding: 2px 6px; border-radius: 4px;'
        ],
        danger: [
            'color: white; background: #d00000; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
            'color: #7a0000; background: #ffe5e5; padding: 2px 6px; border-radius: 4px;'
        ]
    };

    const [labelStyle, msgStyle] = styles[variant] || styles.info;

    if (typeof message === 'string') {
        console.log(`%c${variant.toUpperCase()}:%c ${message}`, labelStyle, msgStyle);
    } else {
        console.log(`%c${variant.toUpperCase()}:`, labelStyle);
        console.log(message);
    }
};

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    });
    return formattedDate
}

export const sleep = (ms: number) => {
    return new Promise((resolve, _) => {
        setTimeout(resolve, ms)
    })
}