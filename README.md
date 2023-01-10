# misc
Utility library used in WiNK for miscellaneous tasks

## functions
- **timeFromNow**: english text like "30 minutes ago", etc...
- **shrinkUrl**: http://veryloooooooooongurl => http://sh...rturl
- **byteString**: 123456789 => 123.5Mb
- **padZeros**: padZeros(50, 3) => "050"
- **collapse**: looooooong text => lo...xt
- **pickRandom**: ["1", "4", "8"] => "4" (random)
- **camelToTitle**: dontTryThisAtHome => Dont Try This At Home

## extra functions available only on NodeJS (server side)
- **readline(question:string)**: to provide a question on the cli
- **getKeypress() => Promise<string>**: to read a key pressing in the cli