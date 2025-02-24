import { formatEther } from "https://esm.sh/viem";

// 🔑 Hardcoded Etherscan API key (replace with your actual key)
const ETHERSCAN_API_KEY = "14N8SWJQQFIPKX1NHEPG2MESEY7VHWDSRW";

const sender = "0x396F2A890F790470c984249D4302df089440C9A7".toLowerCase();
const receiver = "0x248894108C9e5c64B195f0482aFf4415021B002E".toLowerCase();

async function fetchGasSpentEtherscan() {
  document.getElementById("result")!.textContent = "Fetching transactions...";

  try {
    // Use a POST request to fetch the latest block number from Alchemy
    const latestBlockResponse = await fetch("https://eth-sepolia.g.alchemy.com/v2/HlSblFQrHPqPA3Ps1nADamid9ZckXWRw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_blockNumber",
        params: []
      })
    });

    const latestBlockData = await latestBlockResponse.json();
    if (!latestBlockData.result) {
      throw new Error("Failed to retrieve the latest block number.");
    }

    const latestBlock = BigInt(latestBlockData.result);
    const startBlock = latestBlock - 10000000n;  // Check transactions from the last 1,000 blocks

    // Construct the Etherscan API URL to fetch transactions
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${sender}&startblock=${startBlock}&endblock=latest&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.result || data.result.length === 0) {
      document.getElementById("result")!.textContent = "No transactions found.";
      return;
    }

    let totalGasSpent = 0n;
    let txCount = 0;

    for (const tx of data.result) {
      if (tx.to && tx.to.toLowerCase() === receiver) {
        const gasUsed = BigInt(tx.gasUsed);
        const gasPrice = BigInt(tx.gasPrice);
        totalGasSpent += gasUsed * gasPrice;
        txCount++;
      }
    }

    document.getElementById("result")!.textContent =
      `Total Gas Spent: ${formatEther(totalGasSpent)} ETH (in ${txCount} transactions)`;

  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("result")!.textContent = "Error fetching data!";
  }
}

// Expose the function globally so that the HTML button can call it
(window as any).calculateGas = fetchGasSpentEtherscan;