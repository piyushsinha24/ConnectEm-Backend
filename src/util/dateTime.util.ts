
export const formatDate = (
    str: string,
    timezone: string
) => {
    const date = new Date(str);

    return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        timeZone: timezone,
    }).format(date);
};

export const formatTime = (
    str: string,
    timezone: string
) => {
    const date = new Date(str);

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: timezone,
    }).format(date);
};