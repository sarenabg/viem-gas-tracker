<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sepolia Gas Tracker</title>
</head>
<body>
    <h2>Gas Spent by Address on Sepolia</h2>
    <p>Tracking transactions from:</p>
    <p><b>Sender:</b> 0x396F2A890F790470c984249D4302df089440C9A7</p>
    <p><b>Receiver:</b> 0x248894108C9e5c64B195f0482aFf4415021B002E</p>
    
    <button onclick="calculateGas()">Calculate Gas Spent</button>
    <p id="result"></p>

    <script type="module">
        import { createPublicClient, http, formatEther } from "https://esm.sh/viem";
        import { sepolia } from "https://esm.sh/viem/chains";

        const client = createPublicClient({
            chain: sepolia,
            transport: http("https://ethereum-sepolia-rpc.publicnode.com"), // Free public RPC
        });

        const sender = "0x396F2A890F790470c984249D4302df089440C9A7".toLowerCase();
        const receiver = "0x248894108C9e5c64B195f0482aFf4415021B002E".toLowerCase();

        async function calculateGas() {
            document.getElementById("result").textContent = "Fetching transactions...";

            try {
                const latestBlock = await client.getBlockNumber();
                
                // Fetch logs for transactions from the last 5000 blocks
                const logs = await client.getLogs({
                    address: sender,
                    fromBlock: latestBlock - BigInt(5000),
                    toBlock: "latest"
                });

                let totalGasSpent = BigInt(0);
                let count = 0;

                for (const log of logs) {
                    const receipt = await client.getTransactionReceipt({ hash: log.transactionHash });

                    if (receipt && receipt.from.toLowerCase() === sender && receipt.to?.toLowerCase() === receiver) {
                        const gasUsed = BigInt(receipt.gasUsed);
                        const gasPrice = BigInt(receipt.effectiveGasPrice || receipt.gasPrice);
                        totalGasSpent += gasUsed * gasPrice;
                        count++;
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
    </script>
</body>
</html>
