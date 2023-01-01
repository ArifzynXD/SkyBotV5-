let confirm = {}

async function handler(m, { conn, args }) {
    //if (!isROwner) throw 'Dalam perbaikan'
    if (m.sender in confirm) throw 'Kamu masih melakukan judi, tunggu sampai selesai!!'
    try {
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
        let user = db.data.users[m.sender]
        let lawan = db.data.users[who]
        let count = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(user.money)) : 1) * 1
        if ((user.money * 1) < count) return m.reply('💹 Uang kamu tidak cukup!!')
        if ((lawan.money * 1) < count) return m.reply('Money Lawan Tidak Mencukupi')
        if (!(m.sender in confirm)) {
            confirm[who] = {
                sender: who,
                count,
                timeout: setTimeout(() => (m.reply('timed out'), delete confirm[m.sender]), 60000)
            }
            let txt = `Apakah anda yakin mau melakukan judi (Y/n)\n\n*Taruhan:* ${count} 💹\n⏰ 60s Timeout`
            return conn.sendButton(m.chat, txt, author, null, [['✔️'], ['✖️']], m)
        }
    } catch (e) {
        console.error(e)
        if (who in confirm) {
            let { timeout } = confirm[who]
            clearTimeout(timeout)
            delete confirm[who]
            m.reply('Rejected')
        }
    }
}

handler.before = async m => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let lawan = db.data.users[who]
    if (!(who in confirm)) return
    if (m.isBaileys) return
    let { timeout, count } = confirm[who]
    let user = global.db.data.users[m.sender]
    let moneyDulu = user.money * 1
    let txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '').toLowerCase()
    try {
        if (/^(✔️|y(es|a))?$/i.test(txt)) {
            let lwn = (Math.ceil(Math.random() * 15)) * 1
            let Kamu = (Math.floor(Math.random() * 9)) * 1
            let status = 'Kalah'
            if (lwn < Kamu) {
                user.money += count * 1
                lawan.money -= count * 1
                status = 'Menang'
            } else if (lwn > Kamu) {
                user.money -= count * 1
                lawan.money += count * 1
            } else {
                status = 'Seri'
                user.money += (Math.floor(count / 1.5)) * 1
            }
            m.reply(`
| *PLAYERS* | *POINT* |
*@${who.split`@`[0]}:*      ${lwn}
*@${m.sender.split`@`[0]}:*    ${Kamu}

Kamu *${status}*, kamu ${status == 'Menang' ? `Mendapatkan *+${count * 2}*` : status == 'Kalah' ? `Kehilangan *-${count * 1}*` : `Mendapatkan *+${Math.floor(count / 1.5)}*`} Money 💹
    `.trim())
            clearTimeout(timeout)
            delete confirm[m.sender]
            return !0
        } else if (/^(✖️|no)?$/i.test(txt)) {
            clearTimeout(timeout)
            delete confirm[m.sender]
            m.reply('Rejected')
            return !0
        }

    } catch (e) {
        clearTimeout(timeout)
        delete confirm[m.sender]
        if (moneyDulu > (user.money * 1)) user.money = moneyDulu * 1
        m.reply('Error saat melakukan judi (Rejected)')
        return !0
    } finally {
        clearTimeout(timeout)
        delete confirm[m.sender]
        return !0
    }
}

handler.help = ['judi [jumlah]']
handler.tags = ['rpg']
handler.command = /^(judiduel)$/i

handler.premium = true 

export default handler

/**
 * Detect if thats number
 * @param {Number} x 
 * @returns Boolean
 */
function number(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x == 'number'
}