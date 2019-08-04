const grpc = require('grpc')
const fs = require('fs')
const protoLoader = require('@grpc/proto-loader')
const sha256 = require('js-sha256')

// Due to updated ECDSA generated tls.cert we need to let gprc know that
// we need to use that cipher suite otherwise there will be a handhsake
// error when we communicate with the lnd rpc server.
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

// Lnd admin macaroon is at ~/.lnd/data/chain/bitcoin/simnet/admin.macaroon on Linux and
// ~/Library/Application Support/Lnd/data/chain/bitcoin/simnet/admin.macaroon on Mac
const m = fs.readFileSync('./data/admin.macaroon')
const macaroon = m.toString('hex')

// build meta data credentials
const metadata = new grpc.Metadata()
metadata.add('macaroon', macaroon)

const macaroonCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => {
  callback(null, metadata)
})

//  Lnd cert is at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
const lndCert = fs.readFileSync('./data/tls.cert')
const sslCreds = grpc.credentials.createSsl(lndCert)

// combine the cert credentials and the macaroon auth credentials
// such that every call is properly encrypted and authenticated
const credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds)

const packageDefinition = protoLoader.loadSync('./data/rpc.proto')
const { lnrpc } = grpc.loadPackageDefinition(packageDefinition)

const lightning = new lnrpc.Lightning('localhost:10009', credentials)

lightning.getInfo({}, (err, response) => {
  if (err) return console.error(err)

	console.log('GetInfo')
	console.log(response)
})

// lightning.AddInvoice({}, (err, response) => {
//   if (err) return console.error(err)
//
// 	console.log('AddInvoice')
// 	console.log(response)
// })


lightning.ListInvoices({}, (err, response) => {
  if (err) return console.error(err)

	console.log('ListInvoices')
	console.log(response)

  const { invoices } = response

  invoices.forEach(invoice => {
    console.log('preimage', invoice.rPreimage.toString('hex'))
    console.log('hash', invoice.rHash.toString('hex'))
  })


})
