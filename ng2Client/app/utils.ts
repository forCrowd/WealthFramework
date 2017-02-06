export function getUniqueEmail() {
    return this.getUniqueUserName() + "@forcrowd.org";
}

export function getUniqueUserName() {

    var now = new Date();
    var year = now.getFullYear().toString().substring(2);
    var month = (now.getMonth() + 1).toString();
    var day = now.getDate().toString();
    var hour = now.getHours().toString();
    var minute = now.getMinutes().toString();
    var second = now.getSeconds().toString();
    var millisecond = now.getMilliseconds().toString();

    return "guest-" + year + pad(month) + pad(day) + "-" + pad(hour) + pad(minute) + pad(second) + pad(millisecond);
}

export function pad(value: string) {
    const pad: string = "00";
    return pad.substring(0, pad.length - value.length) + value;
}

export function stripInvalidChars(value: string) {

    // Trim, remove special chars and replace space with dash
    if (value !== null) {
        value = value.trim()
            .replace(/[^-\w\s]/gi, "")
            .replace(/\s+/g, "-");
    }

    return value;
}
