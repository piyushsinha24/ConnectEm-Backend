
export const formatDate = (str) => {
    const date = new Date(str);

    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
    }).format(date);
};

export const formatTime = (
    str,
    options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short',
    }
) => {
    const date = new Date(str);

    return new Intl.DateTimeFormat('en-IN', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short',
    }).format(date);
};