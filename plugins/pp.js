import fs from 'fs'

let handler  = async (m, { conn, usedPrefix: _p }) => {
/*let cap = `On Kak @${m.sender.split`@`[0]}`
conn.reply(m.chat, cap, m, { quoted : fkontak }, { mentions: await conn.parseMention(cap) } )*/
let bott = fs.readFileSync('./mp3/Bot.m4a')
conn.sendFile(m.chat, bott, 'ya.mp3', '', m)
}
handler.customPrefix = /^(pp|p|pee|pe|bot|bot?|bott)$/i
handler.command = new RegExp

export default handler