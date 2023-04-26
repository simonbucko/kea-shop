export const createMessageObject = (text, sender) => {
    const unixEpochTime = Math.round(new Date().getTime() / 1000).toString();
    return {
        timestamp: unixEpochTime,
        text,
        sender,
    };
};