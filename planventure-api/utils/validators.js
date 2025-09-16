export function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}

export function validateUsername(username) {
    if (!username) return false;
    if (username.length < 3 || username.length > 16) return false;
    const pattern = /^[a-zA-Z_](?!_)[a-zA-Z0-9_]{2,15}$/;
    return pattern.test(username);
}