// export function isDrive(name: string) {
//     return /\([A-Z]:\)/.test(name);
// }

// should only match "C:/"
export function isDrive(name: string) {
    return /[A-Z]:/.test(name);
}
