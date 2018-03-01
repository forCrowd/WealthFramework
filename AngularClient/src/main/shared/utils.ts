export function getUniqueEmail() {
    return `${getUniqueUserName()}@forcrowd.org`;
}

export function getUniqueUserName() {
    return `guest-${getUniqueValue()}`;
}

export function getUniqueValue() {
    return new Date().getTime().toString();
}

export function getUniqueValueOld() {
    const now = new Date();
    const year = now.getFullYear().toString().substring(2);
    const month = (now.getMonth() + 1).toString();
    const day = now.getDate().toString();
    const hour = now.getHours().toString();
    const minute = now.getMinutes().toString();
    const second = now.getSeconds().toString();
    const millisecond = now.getMilliseconds().toString();

    return `${year}${pad(month)}${pad(day)}-${pad(hour)}${pad(minute)}${pad(second)}${pad(millisecond)}`;
}

export function pad(value: string) {
    const pad: string = "00";
    return pad.substring(0, pad.length - value.length) + value;
}

export function stripInvalidChars(value: string) {

    // Trim, remove special chars and replace space with dash
    if (value) {
        value = value.trim()
            .replace(/[^-\w\s]/gi, "")
            .replace(/\s+/g, "-");
    }

    return value;
}
