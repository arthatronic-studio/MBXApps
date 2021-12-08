function getMinutesFromSeconds(time) {
    const days = time >= 86400 ? Math.floor(time / 86400) : 0;
    const hours = time >= 3600 ? Math.floor(time / 3600) : 0;
    const finalHours = hours >= 24 ? hours - (24 * days) : hours;
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const finalMinutes = minutes >= 60 ? minutes - (60 * hours) : minutes;
    const seconds = Math.floor(time - minutes * 60);

    if (days > 0) return `${days}:${finalHours >= 10 ? finalHours : '0' + finalHours}:${finalMinutes >= 10 ? finalMinutes : '0' + finalMinutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
    if (hours > 0) return `${hours}:${finalMinutes >= 10 ? finalMinutes : '0' + finalMinutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
    return `${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
}

const FormatDuration = {
    getMinutesFromSeconds,
};

export default FormatDuration;