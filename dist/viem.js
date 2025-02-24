var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { formatEther } from "https://esm.sh/viem";
// 🔑 Hardcoded Etherscan API key (replace with your actual key)
const ETHERSCAN_API_KEY = "14N8SWJQQFIPKX1NHEPG2MESEY7VHWDSRW";
const sender = "0x396F2A890F790470c984249D4302df089440C9A7".toLowerCase();
const receiver = "0x248894108C9e5c64B195f0482aFf4415021B002E".toLowerCase();
function fetchGasSpentEtherscan() {
    return __awaiter(this, void 0, void 0, function* () {
        document.getElementById("result").textContent = "Fetching transactions...";
        try {
            // Use a POST request to fetch the latest block number from Alchemy
            const latestBlockResponse = yield fetch("https://eth-sepolia.g.alchemy.com/v2/HlSblFQrHPqPA3Ps1nADamid9ZckXWRw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "eth_blockNumber",
                    params: []
                })
            });
            const latestBlockData = yield latestBlockResponse.json();
            if (!latestBlockData.result) {
                throw new Error("Failed to retrieve the latest block number.");
            }
            const latestBlock = BigInt(latestBlockData.result);
            const startBlock = latestBlock - 100000n; // Check transactions from the last 1,000 blocks
            // Construct the Etherscan API URL to fetch transactions
            const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${sender}&startblock=${startBlock}&endblock=latest&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
            const response = yield fetch(url);
            const data = yield response.json();
            if (!data.result || data.result.length === 0) {
                document.getElementById("result").textContent = "No transactions found.";
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
            document.getElementById("result").textContent =
                `Total Gas Spent: ${formatEther(totalGasSpent)} ETH (in ${txCount} transactions)`;
        }
        catch (error) {
            console.error("Error fetching data:", error);
            document.getElementById("result").textContent = "Error fetching data!";
        }
    });
}
// Expose the function globally so that the HTML button can call it
window.calculateGas = fetchGasSpentEtherscan;
