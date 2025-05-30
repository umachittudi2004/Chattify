export function formateMessageTime(data) {
    return new Date(data).toLocaleTimeString("en-us", {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
    });
}