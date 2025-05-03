export const logger = function (...args: any[]) {
    const styles: Record<string, [string, string]> = {
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
        ],
        success: [
            'color: white; background: #2eb85c; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
            'color: #0a6629; background: #e3f9ec; padding: 2px 6px; border-radius: 4px;'
        ]
    };

    let variant = 'info';
    let loggingArgs = [...args];

    const lastArg = args[args.length - 1];
    if (typeof lastArg === 'string' && styles[lastArg]) {
        variant = lastArg;
        loggingArgs = args.slice(0, -1);
    }

    const [labelStyle, msgStyle] = styles[variant];

    if (loggingArgs.length === 0) {
        console.log(`%c${variant.toUpperCase()}:`, labelStyle);
        return;
    }

    if (loggingArgs.length === 1) {
        const message = loggingArgs[0];

        if (typeof message === 'string') {
            console.log(`%c${variant.toUpperCase()}:%c ${message}`, labelStyle, msgStyle);
        } else {
            console.log(`%c${variant.toUpperCase()}:`, labelStyle);
            console.log(message);
        }
        return;
    }

    console.log(`%c${variant.toUpperCase()}:`, labelStyle);
    loggingArgs.forEach((arg) => {
        console.log(arg);
    });
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