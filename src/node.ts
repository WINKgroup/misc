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