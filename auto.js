const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const { url } = require('inspector');
const fetch = require('node-fetch'); //node only
const { TextDecoder, TextEncoder } = require('util'); //node only
const privateKeys = ["私钥在这里"];
const signatureProvider = new JsSignatureProvider(privateKeys);
let urlString = "https://wax.pink.gg";//urls[Math.floor(Math.random() * urls.length)];
const rpc = new JsonRpc(urlString, { fetch }); //required to read blockchain state
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions
const urls = ["https://api.waxsweden.org", "https://wax.pink.gg", "https://api.wax.alohaeos.com", "https://wax.dapplica.io", "https://wax.eosphere.io", "https://api.wax.greeneosio.com", "https://wax.cryptolions.io", "https://wax-bp.wizardsguild.one", "https://api-wax-mainnet.wecan.dev", "https://hyperion2.sentnl.io", "https://api.wax.eosdetroit.io", "https://wax.eosdac.io", "https://wax.blokcrafters.io", "https://api.wax.bountyblok.io", "https://wax-api.eosiomadrid.io", "https://hyperion.wax.blacklusion.io", "https://wax.api.eosnation.io", "https://wax.eoseoul.io"];
const chats = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
// const users = ["xiaozemario", "xiaozemraio", "xiaozemaria", "xiaozemarib", "xiaozemaric"];
let errorCount = 0;
const users = process.argv.slice(2).toString().split(',');
if (users.indexOf('') > -1) {
    console.log('arguments error')
    return
}

let actors = [];
for (const user of users) {
    if (user == "xiaozemario" || user == "xiaozemraio") {
        for (let index = 1; index < 6; index++) {
            let acort = user + index;
            actors.push(acort)
        }
    }
    for (const chat of chats) {
        let acort = user + chat;
        // 还未完成的记录点。
        if (user == "xiaozemaric" && chat == 'm') {
            break;
        }
        else {
            actors.push(acort)
        }
    }
}

// 随机
if (Math.round(Math.random()) == 1) {
    actors.reverse();
}

// 开始工作
let start = async function (index) {
    let actor = actors[index];
    console.log('[' + actor + '][' + dateString(new Date().getTime() / 1000) + '] Item start!!!');
    try {
        console.log('[' + actor + ']' + 'Check Energy');
        const Account = await rpc.get_table_rows({ "json": true, "code": "farmersworld", "scope": "farmersworld", "table": "accounts", "lower_bound": actor, "upper_bound": actor, "index_position": 1, "key_type": "i64", "limit": "100", "reverse": false, "show_payer": false })
        for (var i = 0; i < Account.rows.length; i++) {
            let item = Account.rows[i];
            console.log('[' + actor + ']' + 'Gold[' + item.balances[0] + '] Wood[' + item.balances[2] + '] Food[' + item.balances[1] + '] Energy[' + item.energy + '/' + item.max_energy + ']');
            if (item.energy < 400) {
                console.log('[' + actor + ']' + 'Recover energy:[' + (item.max_energy - item.energy) + ']');
                let transact = await api.transact({
                    actions: [{
                        'account': 'farmersworld',
                        'name': 'recover',
                        'authorization': [{
                            'actor': actor,
                            'permission': 'active'
                        }],
                        'data': {
                            'energy_recovered': item.max_energy - item.energy,
                            'owner': actor
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                if (transact && transact.transaction_id) {
                    console.log('[' + actor + ']' + 'Recovered Energy: [' + transact.transaction_id + ']');
                }
            }
        }
        console.log('[' + actor + ']' + 'Check Silver Member');
        const Silver = await rpc.get_table_rows({ "json": true, "code": "farmersworld", "scope": "farmersworld", "table": "mbs", "lower_bound": actor, "upper_bound": actor, "index_position": 2, "key_type": "i64", "limit": "100", "reverse": false, "show_payer": false })
        let items = [];
        for (var i = 0; i < Silver.rows.length; i++) {
            let item = Silver.rows[i];
            console.log('[' + actor + ']' + "[Silver Member][" + item.type + "] [" + item.asset_id + "] [Next Time:" + dateString(item.next_availability) + ']')
            if (new Date().getTime() / 1000 > item.next_availability) {
                items.push(item);
            }
        }
        if (items.length > 0) {
            console.log('[' + actor + ']' + 'Claim Silver Member:');
            for (const item of items) {
                console.log('[' + actor + ']' + "[Silver Member][" + item.type + "] [" + item.asset_id + "] [Next Time:" + dateString(item.next_availability) + ']')
                let transact = await api.transact({
                    actions: [{
                        'account': 'farmersworld',
                        'name': 'mbsclaim',
                        'authorization': [{
                            'actor': actor,
                            'permission': 'active'
                        }],
                        'data': {
                            'asset_id': item.asset_id,
                            'owner': actor
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                if (transact && transact.transaction_id) {
                    console.log('[' + actor + ']' + 'Claimed Silver Member: [' + item.type + '] [' + transact.transaction_id + ']');
                }
            }
        }
        // 读取工具
        const Tool = await rpc.get_table_rows({ "json": true, "code": "farmersworld", "scope": "farmersworld", "table": "tools", "lower_bound": actor, "upper_bound": actor, "index_position": 2, "key_type": "i64", "limit": "100", "reverse": false, "show_payer": false })
        let nowTime = new Date().getTime() / 1000;
        for (var i = 0; i < Tool.rows.length; i++) {
            let item = Tool.rows[i];
            console.log('[' + actor + ']' + "[" + item.type + "] [" + item.asset_id + "] [Durability" + item.current_durability + '/' + item.durability + '] [Next Time:' + dateString(item.next_availability) + ']')
            ////////////// 1维修
            if (item.current_durability / item.durability < 0.3) {
                let transact = await api.transact({
                    actions: [{
                        'account': 'farmersworld',
                        'name': 'repair',
                        'authorization': [{
                            'actor': actor,
                            'permission': 'active'
                        }],
                        'data': {
                            'asset_id': item.asset_id,
                            'asset_owner': actor
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                if (transact && transact.transaction_id) {
                    console.log('[' + actor + ']' + 'Repaired: [' + item.asset_id + '] [' + transact.transaction_id + ']');
                }
            }
            ////////////// 2采矿 
            if (nowTime > item.next_availability) {
                let transact = await api.transact({
                    actions: [{
                        'account': 'farmersworld',
                        'name': 'claim',
                        'authorization': [{
                            'actor': actor,
                            'permission': 'active'
                        }],
                        'data': {
                            'asset_id': item.asset_id,
                            'owner': actor
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                if (transact && transact.transaction_id) {
                    console.log('[' + actor + ']' + 'Mining: [' + item.asset_id + '] [' + transact.transaction_id + ']');
                }
            }
        }
        console.log('[' + actor + ']' + 'Check Withdraw');
        const Fee = await rpc.get_table_rows({ "json": true, "code": "farmersworld", "scope": "farmersworld", "table": "config", "lower_bound": "", "upper_bound": "", "index_position": 1, "key_type": "", "limit": "1", "reverse": false, "show_payer": false })
        for (var i = 0; i < Fee.rows.length; i++) {
            let item = Fee.rows[i];
            console.log('[' + actor + ']' + 'Fee:' + item.fee);
            if (item.fee == 5) {
                for (var i = 0; i < Account.rows.length; i++) {
                    let item = Account.rows[i];
                    // 提现
                    let gold = parseInt(item.balances[0].replace(' GOLD', '')) - 5000;
                    let food = parseInt(item.balances[1].replace(' FOOD', '')) - 12000;
                    let wood = parseInt(item.balances[2].replace(' WOOD', ''));
                    if (gold > 0 && food > 0 && wood > 0 && gold + food + wood > 10000) {
                        let quantities = [gold + '.0000 GOLD', food + '.0000 FOOD', wood + '.0000 WOOD'];
                        console.log('[' + actor + ']' + 'Withdraw: [' + quantities + ']');
                        let transact = await api.transact({
                            actions: [{
                                'account': 'farmersworld',
                                'name': 'withdraw',
                                'authorization': [{
                                    'actor': actor,
                                    'permission': 'active'
                                }],
                                'data': {
                                    'fee': 5,
                                    'quantities': quantities,
                                    'owner': actor
                                }
                            }]
                        }, {
                            blocksBehind: 3,
                            expireSeconds: 30,
                        });
                        if (transact && transact.transaction_id) {
                            console.log('[' + actor + ']' + 'Withdraw: [' + quantities + '] [' + transact.transaction_id + ']');
                        }
                    }
                    else {
                        console.log('[' + actor + ']' + 'Never Withdraw');
                    }
                }
            }
        }
        // 转移到主账号
        console.log('[' + actor + ']' + 'Check Token');
        const Balance = await rpc.get_table_rows({
            json: true,               // Get the response as json
            code: 'farmerstoken',      // Contract that we target
            scope: actor,         // Account that owns the data
            table: 'accounts',        // Table name
            limit: 10,                // Maximum number of rows that we want to get
            reverse: false,           // Optional: Get reversed data
            show_payer: false          // Optional: Show ram payer
        })
        if (Balance && Balance.rows.length > 0) {
            let fwf = 0;
            let fwg = 0;
            let fww = 0;
            for (const item of Balance.rows) {
                if (item.balance.indexOf('FWG') > -1) {
                    fwg = parseInt(item.balance.replace(' FWG', ''));
                }
                else if (item.balance.indexOf('FWF') > -1) {
                    fwf = parseInt(item.balance.replace(' FWF', ''));
                }
                else if (item.balance.indexOf('FWW') > -1) {
                    fww = parseInt(item.balance.replace(' FWW', ''));
                }
            }
            let quantities = [fwg + '.0000 FWG', fwf + '.0000 FWF', fww + '.0000 FWW'];
            console.log('[' + actor + ']' + 'Token:[' + quantities + ']');
            if (fwg > 0 && fwf > 0 && fww > 0 && fwf + fwg + fww > 5000) {
                console.log('[' + actor + ']' + 'Send Token[' + quantities + ']');
                const transact = await api.transact({
                    actions: [{
                        account: "farmerstoken",
                        name: 'transfers',
                        authorization: [{
                            actor: actor,
                            permission: 'active',
                        }],
                        data: {
                            'from': actor,
                            'to': 'fyaio.wam',
                            'quantities': quantities,
                            'memo': 'Mario666'
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                if (transact && transact.transaction_id) {
                    console.log('[' + actor + ']' + 'Send Token OK: [' + quantities + '] [' + transact.transaction_id + ']');
                }
            }
        }

        // 农夫币
        const Coins = await rpc.get_table_rows({ "json": true, "code": "farmersworld", "scope": "farmersworld", "table": "coinstake", "lower_bound": actor, "upper_bound": actor, "index_position": 1, "key_type": "", "limit": "1", "reverse": false, "show_payer": false })
        if (Coins.rows.length > 0) {
            let amount = Coins.rows[0].amount;
            console.log('[' + actor + ']' + 'Farmer Coin[' + amount + ']');
            if (amount > 100) {
                console.log('[' + actor + ']' + "Send Farmer Coin");
                const transact = await api.transact({
                    actions: [{
                        account: "farmersworld",
                        name: 'sendcoin',
                        authorization: [{
                            actor: actor,
                            permission: 'active',
                        }],
                        data: {
                            'from': actor,
                            'to': 'fyaio.wam',
                            'amount': amount,
                            'memo': 'Mario666'
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                if (transact && transact.transaction_id) {
                    console.log('[' + actor + ']' + 'Send Farmer Coin OK: [' + amount + '] [' + transact.transaction_id + ']');
                }
            }
        }
        console.log('[' + actor + ']' + 'Item Finish!!!');
        errorCount = 0;
        await sleep(5000);
        if (index + 1 == actors.length) {
            start(0)
        }
        else {
            start(++index);
        }
    } catch (e) {
        console.error(e.details);
        console.log('[' + actor + ']' + 'Error!!!');
        if (actor == undefined) {
            start(0);
            return
        }
        await sleep(5000);
        errorCount++;
        if (errorCount >= 2) {
            errorCount = 0;
            if (index + 1 == actors.length) {
                start(0)
            }
            else {
                start(++index);
            }
        }
        else {
            start(index);
        }
    }
}

start(0);

function dateString(time) {
    return new Date(time * 1000).toLocaleString()
}

function sleep(ms) {
    return new Promise(function (resolve, reject) {
        // 异步操作
        setTimeout(function () {
            resolve('异步操作返回结果');
        }, ms);
    });
}