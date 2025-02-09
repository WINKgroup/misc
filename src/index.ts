export function timeFromNow(ISO: string) {
    const now = new Date().getTime();
    const past = new Date(ISO).getTime();
    const diff = (now - past) / 1000;
    if (diff < 60) return 'now';
    if (diff > 24 * 3600) return `${Math.floor(diff / 3600 / 24)} days ago`;
    if (diff > 3600) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 60)} minutes ago`;
}

export function shrinkUrl(url: string, softMaxLength = 150) {
    if (url.length < softMaxLength) return url;
    const parsed = new URL(url);
    const pathNamePieces = parsed.pathname.split('/');
    const lastPathName = pathNamePieces.pop();
    const first = parsed.origin;
    const last = '/' + lastPathName + parsed.search + parsed.hash;
    return first + '/...' + last;
}

export function byteString(fileSize: number): string {
    if (fileSize < 0) return '-' + byteString(-fileSize);
    if (fileSize > 1000000000000) {
        return (fileSize / 1000000000000.0).toFixed(2) + ' Tb';
    } else if (fileSize > 1000000000) {
        return (fileSize / 1000000000.0).toFixed(2) + ' Gb';
    } else if (fileSize > 1000000) {
        return (fileSize / 1000000.0).toFixed(2) + ' Mb';
    } else if (fileSize > 1000) {
        return (fileSize / 1000.0).toFixed(2) + ' kb';
    } else {
        return fileSize + ' bytes';
    }
}

export function padZeros(value: number | string, dim: number) {
    let result = typeof value !== 'string' ? value.toString() : value;
    dim -= result.length;
    for (let i = 0; i < dim; i++) result = '0' + result;
    return result;
}

export function collapse(text: string, limit = 150) {
    if (text.length < limit) return text;
    var start = text.substring(0, 70);
    var end = text.substring(text.length - 70);
    return start + ' ... ' + end;
}

export function pickRandom(list: string[]) {
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];
    var num = Math.round(Math.random() * list.length);
    if (num === list.length) num = list.length - 1;
    return list[num];
}

// dontTryThisAtHome => Dont Try This At Home
export function camelToTitle(camelCase: string) {
    const result = camelCase.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}

export function getDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const secs = seconds % 60;
    const pointSep = secs.toString().split('.');

    return `${padZeros(hours, 2)}:${padZeros(minutes, 2)}:${
        padZeros(Math.floor(secs), 2) +
        (pointSep.length > 1 ? '.' + pointSep[1] : '')
    }`;
}

export function getErrorStrOnException(e: unknown) {
    let error: string;

    if (e instanceof Error) error = e.message;
    else if (typeof e === 'string') error = e;
    else error = JSON.stringify(e);
    return error;
}

// distance between strings
export function levenshtein(s: string, t: string) {
    if (s === t) {
        return 0;
    }
    let n = s.length,
        m = t.length;
    if (n === 0 || m === 0) {
        return n + m;
    }
    let x = 0,
        y,
        a,
        b,
        c,
        d,
        g;
    let h = -1;
    let p = new Uint16Array(n);
    let u = new Uint32Array(n);
    for (y = 0; y < n; ) {
        u[y] = s.charCodeAt(y);
        p[y] = ++y;
    }

    for (; x + 3 < m; x += 4) {
        var e1 = t.charCodeAt(x);
        var e2 = t.charCodeAt(x + 1);
        var e3 = t.charCodeAt(x + 2);
        var e4 = t.charCodeAt(x + 3);
        c = x;
        b = x + 1;
        d = x + 2;
        g = x + 3;
        h = x + 4;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || b < c) {
                c = a > b ? b + 1 : a + 1;
            } else {
                if (e1 !== u[y]) {
                    c++;
                }
            }

            if (c < b || d < b) {
                b = c > d ? d + 1 : c + 1;
            } else {
                if (e2 !== u[y]) {
                    b++;
                }
            }

            if (b < d || g < d) {
                d = b > g ? g + 1 : b + 1;
            } else {
                if (e3 !== u[y]) {
                    d++;
                }
            }

            if (d < g || h < g) {
                g = d > h ? h + 1 : d + 1;
            } else {
                if (e4 !== u[y]) {
                    g++;
                }
            }
            p[y] = h = g;
            g = d;
            d = b;
            b = c;
            c = a;
        }
    }

    for (; x < m; ) {
        var e = t.charCodeAt(x);
        c = x;
        d = ++x;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || d < c) {
                d = a > d ? d + 1 : a + 1;
            } else {
                if (e !== u[y]) {
                    d = c + 1;
                } else {
                    d = c;
                }
            }
            p[y] = d;
            c = a;
        }
        h = d;
    }

    return h;
}

/***
 * @return
 * -3   => i1 is to the left of i2, no overlap
 * -2   => i1 is to the left of i2, with overlap
 * -1   => i1 is inside i2
 * 0    => i1 and i2 are equal
 * 1    => i1 is outside i2
 * 2    => i1 is to the right of i2, with overlap
 * 3    => i1 is to the right of i2, no overlap
 */
export function intervalRelativePosition(
    start1: number,
    end1: number,
    start2: number,
    end2: number,
) {
    if (start1 > end1) {
        const temp = start1;
        start1 = end1;
        end1 = temp;
    }
    if (start2 > end2) {
        const temp = start2;
        start2 = end2;
        end2 = temp;
    }
    if (end1 < start2) return -3;
    if (start1 > end2) return 3;
    if (start1 > start2 && end1 < end2) return -1;
    if (start1 < start2 && end1 > end2) return 1;
    if (start1 < start2) return -2;
    if (end1 > end2) return 2;
    return 0;
}

export function permute<T>(inputArray: T[]): T[][] {
    const result: T[][] = [];

    function permuteHelper(arr: T[], m: T[] = []) {
        if (arr.length === 0) {
            result.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permuteHelper(curr.slice(), m.concat(next));
            }
        }
    }

    permuteHelper(inputArray);

    return result;
}