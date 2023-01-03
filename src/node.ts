import readline from 'readline'

export function question(question:string) {
    return new Promise<string>( (resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl.question(question, (answer) => {
            resolve(answer)
            rl.close()
        })
    } )
}

export async function getKeypress() {
    return new Promise(resolve => {
        process.stdin.setRawMode(true)
        process.stdin.resume()
        process.stdin.once('data', onData)
        function onData(buffer: any) {
            process.stdin.setRawMode(false)
            resolve(buffer.toString())
        }
    })
}