export const timeConverter = (timestamp) => {
    const date = new Date(timestamp+"Z");
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const dateConverter = (timestamp) => {
    const date = new Date(timestamp+"Z");
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    if (date.toLocaleDateString() === today.toLocaleDateString()) {
        return "Today";
    } else if (date > weekAgo) {
        const weekDate = new Date(date - weekAgo);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (date.toLocaleDateString() === yesterday.toLocaleDateString()) {
            return "Yesterday";
        }
        return days[weekDate.getDay()];
    } else {
        return date.toLocaleString([], {
            // hour: "2-digit",
            // minute: "2-digit",
            // hour12: true,
            day: "numeric",
            year: "numeric",
            month: "numeric",
        });
    }
};
