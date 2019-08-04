# Installation

(You need nodejs v11 and npm installed)

1. Download latest `lnd`, `lncli`

https://github.com/lightningnetwork/lnd/releases/tag/v0.7.1-beta

```bash
wget https://github.com/lightningnetwork/lnd/releases/download/v0.7.1-beta/lnd-darwin-amd64-v0.7.1-beta.tar.gz
tar -xvf lnd-darwin-amd64-v0.7.1-beta.tar.gz
rm -rf lnd-darwin-amd64-v0.7.1-beta.tar.gz
mv lnd-darwin-amd64-v0.7.1-beta bin
```

2. Install js dependencies

```bash
npm i
```

3. Setup and run `lnd` in light client mode (TESTNET) in a separate terminal window

```bash
bin/lnd --bitcoin.active --bitcoin.testnet --bitcoin.node=neutrino --neutrino.connect=btcd-testnet.lightning.computer --neutrino.feeurl=https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json
```

Mainnet (neutrino is not supported on v0.7.1 yet, build with `experimental` flag from `master`)

```bash
bin/lnd \
  --bitcoin.active \
  --bitcoin.mainnet \
  --bitcoin.node=neutrino \
  --neutrino.connect=btcd-mainnet.lightning.computer \
  --neutrino.feeurl=https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json \
  --neutrino.assertfilterheader=230000:1308d5cfc6462f877a5587fd77d7c1ab029d45e58d5175aaf8c264cee9bde760
```

4. Create a new wallet, follow console instructions

```bash
bin/lncli --network=testnet create
```

5. Copy credentials and certificate

```bash
mkdir data

# On Windows, Linux:
export LND_HOME=~/.lnd

# on Mac:
# export LND_HOME=~/Library/Application\ Support/Lnd

cp $LND_HOME/tls.cert ./data/
cp $LND_HOME/data/chain/bitcoin/testnet/admin.macaroon ./data/
```

6. Copy `rpc.proto` from latest sources

```bash
wget https://github.com/lightningnetwork/lnd/blob/master/lnrpc/rpc.proto
mv rpc.proto ./data/
```

**Comment this line or it won't work**

```
// import "google/api/annotations.proto";
```

7. Wait until `lnd` synces

## Running

8. Run nodejs script to operate your `lnd` node.

```bash
node lnd.js
```

**IN DEVELOPMENT:**

9. Create invoice

```bash
node create-invoice.js
```

10. Send QTUM

```bash
node send-qtum.js
```
