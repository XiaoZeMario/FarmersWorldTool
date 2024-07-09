const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const { url } = require('inspector');
const fetch = require('node-fetch'); //node only
const { TextDecoder, TextEncoder } = require('util'); //node only
// privateKeys私钥
const privateKeys = ["5KJDVxxxxxxxxx"];
const signatureProvider = new JsSignatureProvider(privateKeys);

const urls = ["https://api.waxsweden.org", "https://wax.pink.gg", "https://api.wax.alohaeos.com", "https://wax.dapplica.io", "https://wax.eosphere.io", "https://api.wax.greeneosio.com", "https://wax.cryptolions.io", "https://wax-bp.wizardsguild.one", "https://api-wax-mainnet.wecan.dev", "https://hyperion2.sentnl.io", "https://api.wax.eosdetroit.io", "https://wax.eosdac.io", "https://wax.blokcrafters.io", "https://api.wax.bountyblok.io", "https://wax-api.eosiomadrid.io", "https://hyperion.wax.blacklusion.io", "https://wax.api.eosnation.io", "https://wax.eoseoul.io"];
// 我的账号是abdc结尾的
const chats = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const users = ["xxxx1", "xxxx2", "xxxx3"];



// 创建账号列表
let actors = [];
for (const user of users) {
    if (user == "" || user == "") {
        for (let index = 1; index < 6; index++) {
            let acort = user + index;
            actors.push(acort)
        }
    }
    for (const chat of chats) {
        let acort = user + chat;
        actors.push(acort)
    }
}

let index = 0;
let sendCoin = function () {
    if (index >= actors.length) {
        clearInterval(timer);
    }
    let actor = actors[index];
    index ++;
    let url = "https://wax.pink.gg";//urls[Math.floor(Math.random() * urls.length)];
    const rpc = new JsonRpc(url, { fetch }); //required to read blockchain state
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions

    console.log("获取农夫币数量");
    (async () => {
        const result = await rpc.get_table_rows({ "json": true, "code": "farmersworld", "scope": "farmersworld", "table": "coinstake", "lower_bound": actor, "upper_bound": actor, "index_position": 1, "key_type": "", "limit": "1", "reverse": false, "show_payer": false })
        console.log(result)
        if (result.rows.length >0) {
            let amount = result.rows[0].amount;
            if (amount > 100) {
                console.log("转移农夫币");
                (async () => {
                    const result = await api.transact({
                        actions: [{
                            account: "farmersworld",
                            name: 'sendcoin',
                            authorization: [{
                                actor: actor,
                                permission: 'active',
                            }],
                            data: {
                                from: actor,
                                to: 'fyaio.wam',
                                amount: amount,
                                memo: ''
                            },
                        }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    });
                    console.dir(result);
                })();
            }
            else {
                console.log("农夫币不足");
            }
        }
    })();
    
}
sendCoin();
// 转移农夫币
let timer = setInterval(function() {
    sendCoin();
}, 10000);




// (async () => { 
//     const result = await rpc.get_block(1) //get the first block
//     console.log(result)
// })();

// 获取余额
// (async () => {
//     const result = await rpc.get_currency_balance("farmerstoken","xiaozemariaa",null) //get alice's account info.  This assumes the account 'alice' has been created on the chain specified in the rpc object.
//     console.log(result)
// })();

// // 获取农夫币数量
// (async () => {
//     const result = await rpc.get_table_rows({ "json": true, "code": "farmersworld", "scope": "farmersworld", "table": "coinstake", "lower_bound": "xiaozemariaa", "upper_bound": "xiaozemariaa", "index_position": 1, "key_type": "", "limit": "1", "reverse": false, "show_payer": false })
//     console.log(result)
// })();


// // 转账
// (async () => {
//     const result = await api.transact({
//       actions: [{
//         account: 'farmerstoken',
//         name: 'transfer',
//         authorization: [{
//           actor: 'xiaozemariab',
//           permission: 'active',
//         }],
//         data: {
//           from: 'xiaozemariab',
//           to: 'xiaozemariaa',
//           quantity: '1.0000 FWW',
//           memo: '',
//         },
//       }]
//     }, {
//       blocksBehind: 3,
//       expireSeconds: 30,
//     });
//     console.dir(result);
//   })();




// 转移农夫币
// (async () => {
//     const result = await api.transact({
//         actions: [{
//             account: "farmersworld",
//             name: 'sendcoin',
//             authorization: [{
//                 actor: 'xiaozemariab',
//                 permission: 'active',
//             }],
//             data: {
//                 from: 'xiaozemariab',
//                 to: 'xiaozemariaa',
//                 amount: '1',
//                 memo: ''
//             },
//         }]
//     }, {
//         blocksBehind: 3,
//         expireSeconds: 30,
//     });
//     console.dir(result);
// })();

