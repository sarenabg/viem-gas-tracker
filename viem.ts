import { createPublicClient, http, formatEther } from "https://esm.sh/viem";
import { sepolia } from "https://esm.sh/viem/chains";

const client = createPublicClient({
    chain: sepolia,
    transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
});

const sender = "0x396F2A890F790470c984249D4302df089440C9A7".toLowerCase();
const receiver = "0x248894108C9e5c64B195f0482aFf4415021B002E".toLowerCase();

async function calculateGas() {
    document.getElementById("result").textContent = "Fetching transactions...";

    try {
        const latestBlock = await client.getBlockNumber();
        const blockRange = 5000; // Search in last 5000 blocks

        let totalGasSpent = BigInt(0);
        let count = 0;

        // Loop through recent blocks
        for (let i = latestBlock - BigInt(blockRange); i <= latestBlock; i++) {
            const block = await client.getBlock({ blockNumber: i, includeTransactions: true });

            for (const tx of block.transactions) {
                if (
                    tx.from.toLowerCase() === sender &&
                    tx.to?.toLowerCase() === receiver
                ) {
                    console.log("Matching Transaction:", tx);
                    const gasUsed = BigInt(tx.gas);
                    const gasPrice = BigInt(tx.gasPrice);
                    totalGasSpent += gasUsed * gasPrice;
                    count++;
                }
            }
        }

        document.getElementById("result").textContent =
            `Total Gas Spent: ${formatEther(totalGasSpent)} ETH (in ${count} transactions)`;

    } catch (error) {
        console.error(error);
        document.getElementById("result").textContent = "Error fetching data!";
    }
}

window.calculateGas = calculateGas;
