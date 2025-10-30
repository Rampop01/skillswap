const { Client, AccountId, PrivateKey, ContractCreateFlow, Hbar } = require('@hashgraph/sdk');
const fs = require('fs');
require('dotenv').config();

async function deploySkillSwap() {
  try {
    console.log('🎯 SkillSwap Contract Deployment');
    console.log('================================\n');

    const accountId = process.env.HEDERA_TESTNET_ACCOUNT_ID;
    const privateKeyDer = process.env.HEDERA_TESTNET_PRIVATE_KEY;
    if (!accountId || !privateKeyDer) throw new Error('Please set HEDERA_TESTNET_ACCOUNT_ID and HEDERA_TESTNET_PRIVATE_KEY in your .env file');

    console.log(`📋 Account ID: ${accountId}`);
    console.log(`🔑 Private Key: ${privateKeyDer.substring(0, 20)}...`);

    const client = Client.forTestnet();
    const operatorId = AccountId.fromString(accountId);
    const operatorKey = PrivateKey.fromStringDer(privateKeyDer);
    client.setOperator(operatorId, operatorKey);
    client.setMaxTransactionFee(new Hbar(50));
    console.log('✅ Client configured successfully');

    // Load creation bytecode (init code) from Foundry artifact
    const artifactPath = 'out/SkillSwapSimple.sol/SkillSwap.json';
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const initBytecodeRaw = artifact.bytecode?.object || artifact.bytecode;
    if (!initBytecodeRaw) throw new Error('Bytecode not found in artifact: ' + artifactPath);
    const contractBytecode = initBytecodeRaw.startsWith('0x') ? initBytecodeRaw : '0x' + initBytecodeRaw;
    console.log('📦 Contract bytecode prepared from artifact');

    console.log('📝 Creating contract deployment transaction...');
    const contractCreateFlow = new ContractCreateFlow()
      .setBytecode(contractBytecode)
      .setGas(5_000_000)
      .setAdminKey(operatorKey.publicKey);

    console.log('⏳ Executing deployment transaction...');
    const contractCreateResponse = await contractCreateFlow.execute(client);
    const contractCreateReceipt = await contractCreateResponse.getReceipt(client);
    const contractId = contractCreateReceipt.contractId;

    console.log('\n🎉 Contract deployed successfully!');
    console.log(`📄 Contract ID: ${contractId.toString()}`);
    console.log(`🌐 Network: testnet`);
    console.log(`🔗 Explorer: https://hashscan.io/testnet/contract/${contractId.toString()}`);

    const deploymentInfo = {
      contractId: contractId.toString(),
      network: 'testnet',
      accountId,
      timestamp: new Date().toISOString(),
      explorer: `https://hashscan.io/testnet/contract/${contractId.toString()}`,
      artifact: artifactPath,
    };
    const filename = `deployment-testnet-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`💾 Deployment info saved to: ${filename}`);

    return contractId;
  } catch (error) {
    console.error('💥 Deployment failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  deploySkillSwap();
}

module.exports = { deploySkillSwap };
