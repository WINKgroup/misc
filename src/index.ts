export function timeFromNow(ISO:string) {
    const now = (new Date()).getTime()
    const past = (new Date(ISO)).getTime()
    const diff = (now - past) / 1000
    if (diff < 60) return 'now'
    if (diff > 24 * 3600) return `${ Math.floor(diff / 3600 / 24) } days ago`
    if (diff > 3600) return `${ Math.floor(diff / 3600) } hours ago`
    return `${ Math.floor(diff / 60) } minutes ago`
}

export function shrinkUrl(url:string, softMaxLength = 150) {
    if (url.length < softMaxLength) return url
    const parsed = new URL(url)
    const pathNamePieces = parsed.pathname.split('/')
    const lastPathName = pathNamePieces.pop()
    const first = parsed.origin
    const last = '/' + lastPathName + parsed.search + parsed.hash
    return first + '/...' + last
}

export function byteString (fileSize:number):string {
    if (fileSize < 0) return '-' + byteString(-fileSize)
    if (fileSize > 1000000000000) {
        return (fileSize / 1000000000000.0)
            .toFixed(2) + " Tb"
    } else if (fileSize > 1000000000) {
        return (fileSize / 1000000000.0)
            .toFixed(2) + " Gb"
    } else if (fileSize > 1000000) {
        return (fileSize / 1000000.0)
            .toFixed(2) + " Mb"
    } else if (fileSize > 1000) {
        return (fileSize / 1000.0)
            .toFixed(2) + " kb"
    } else {
        return fileSize + " bytes"
    }
}

export function randomId() {
    return Math.random().toString(36).substring(7)
}

export function padZeros(value:number | string, dim:number) {
    let result = (typeof value !== 'string' ? value.toString(): value)
    dim -= result.length
    for (let i = 0; i < dim; i++) result = '0' + result
    return result
}

export function collapse(text:string, limit = 150) {
    if (text.length < limit) return text
    var start = text.substring(0, 70)
    var end = text.substring(text.length - 70)
    return start + ' ... ' + end
}

export function pickRandom(list:string[]) {
    if (list.length === 0) return null
    if (list.length === 1) return list[0]
    var num = Math.round(Math.random() * list.length)
    if (num === list.length) num = list.length - 1
    return list[num]
}