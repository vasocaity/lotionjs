let lotion = require('lotion');
let axios = require('axios');
let app = lotion({
    initialState: {
        count: 0
    },
    genesisPath: '/Users/varaphon.maensiri/.lotion/networks/bcea9d85107bc94f46bfa67176f76e2d/config/genesis.json',
    peers: [],            // array of '<host>:<p2pport>' of initial tendermint nodes to connect to. does automatic peer discovery if not specified.
    logTendermint: true, // if true, shows all output from the underlying tendermint process
    p2pPort: 46658,       // port to use for tendermint peer connections
    tendermintPort: 46657,
    rpcPort: 46659,
    abciPort: 42071,
    txServerPort: 3000,
}
);
// Transaction handlers will be called for every transaction,
// in the same order you passed them to app.use().
app.use((state, tx) => {
    if (state.count === tx.none) {
        state.count++;
    }
});
/*
Add middleware to be called once per block, even if there haven't been any transactions.
 Should mutate state, see above to read more about chainInfo.
*/
app.useBlock(async (state, chainInfo) => {
    if (chainInfo.height > 2) {
        const lastBlock = await axios(`http://localhost:46659/block?height=${chainInfo.height - 1}`)
        const validators = new Set(
            lastBlock.data.result.block.last_commit.precommits
                .filter(el => !!el)
                .map(validator => validator.validator_address)
        ).forEach(validator => {
            state.accounts[validator] = (state.accounts[validator] || 0) + 0.001
        });
    }
});
app.start().then(console.log);
