import { formatEther } from "https://esm.sh/viem";

// 🔑 Hardcoded Etherscan API key (replace with your actual key)
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

const sender = "0x396F2A890F790470c984249D4302df089440C9A7".toLowerCase();
const receiver = "0x248894108C9e5c64B195f0482aFf4415021B002E".toLowerCase();

/**
 * Fetches all transactions from/to a specific address using Etherscan API.
 * @returns An array of transactions.
 */
async function fetchTransactions(): Promise<any[]> {
  // Query transactions where the sender is our specified address
  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${sender}&startblock=0&endblock=latest&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
  
  console.log("Fetching transactions with URL:", url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Log the full response for debugging
    console.log("API Response:", data);
    
    if (data.status === "1" && data.result && data.result.length > 0) {
      console.log(`Found ${data.result.length} total transactions for address ${sender}`);
      return data.result;
    } else {
      console.log("No transactions found or API error:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching from Etherscan API:", error);
    return [];
  }
}

/**
 * Alternative method - try fetching by the receiver address
 */
async function fetchTransactionsByReceiver(): Promise<any[]> {
  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${receiver}&startblock=0&endblock=latest&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
  
  console.log("Fetching receiver transactions with URL:", url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Receiver API Response:", data);
    
    if (data.status === "1" && data.result && data.result.length > 0) {
      console.log(`Found ${data.result.length} total transactions for receiver ${receiver}`);
      return data.result;
    } else {
      console.log("No transactions found for receiver or API error:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching receiver data from Etherscan API:", error);
    return [];
  }
}

async function fetchGasSpentEtherscan() {
  const resultElement = document.getElementById("result");
  if (!resultElement) return;
  
  resultElement.textContent = "Fetching transactions...";

  try {
    // Fetch all transactions for the sender address
    const allTransactions = await fetchTransactions();
    
    if (allTransactions.length === 0) {
      // If no transactions found for sender, try checking the receiver
      const receiverTransactions = await fetchTransactionsByReceiver();
      
      if (receiverTransactions.length === 0) {
        resultElement.textContent = "No transactions found for either address. Have these addresses been used on Sepolia?";
        return;
      } else {
        // Filter transactions where the sender sent to our receiver
        const relevantTxs = receiverTransactions.filter(tx => 
          tx.from && tx.from.toLowerCase() === sender
        );
        
        if (relevantTxs.length === 0) {
          resultElement.textContent = `Found ${receiverTransactions.length} transactions for the receiver address, but none from our sender address.`;
          return;
        }
        
        // Calculate gas spent
        calculateAndDisplayGas(relevantTxs, resultElement);
      }
    } else {
      // Filter transactions where the sender sent to our receiver
      const relevantTxs = allTransactions.filter(tx => 
        tx.to && tx.to.toLowerCase() === receiver
      );
      
      if (relevantTxs.length === 0) {
        resultElement.textContent = `Found ${allTransactions.length} transactions for the sender address, but none to our receiver address.`;
        return;
      }
      
      // Calculate gas spent
      calculateAndDisplayGas(relevantTxs, resultElement);
    }
  } catch (error) {
    console.error("Error in main function:", error);
    resultElement.textContent = "Error fetching data: " + (error instanceof Error ? error.message : String(error));
  }
}

function calculateAndDisplayGas(transactions: any[], resultElement: HTMLElement) {
  let totalGasSpent = 0n;
  const txCount = transactions.length;
  
  for (const tx of transactions) {
    const gasUsed = BigInt(tx.gasUsed || 0);
    const gasPrice = BigInt(tx.gasPrice || 0);
    totalGasSpent += gasUsed * gasPrice;
  }
  
  resultElement.textContent = `Total Gas Spent: ${formatEther(totalGasSpent)} ETH (in ${txCount} transactions)`;
  
  // Add details section for each transaction
  const detailsElement = document.createElement("div");
  detailsElement.id = "transaction-details";
  detailsElement.innerHTML = "<h3>Transaction Details:</h3>";
  
  transactions.forEach((tx, index) => {
    const txElement = document.createElement("div");
    txElement.className = "transaction";
    
    const gasUsed = BigInt(tx.gasUsed || 0);
    const gasPrice = BigInt(tx.gasPrice || 0);
    const gasCost = gasUsed * gasPrice;
    
    txElement.innerHTML = `
      <p><strong>TX #${index + 1}:</strong> ${tx.hash}</p>
      <p>Block: ${tx.blockNumber}</p>
      <p>Gas Used: ${tx.gasUsed}</p>
      <p>Gas Price: ${formatEther(gasPrice)} ETH</p>
      <p>Gas Cost: ${formatEther(gasCost)} ETH</p>
    `;
    detailsElement.appendChild(txElement);
  });
  
  // Add the details after the result
  const resultParent = resultElement.parentNode;
  if (resultParent) {
    resultParent.insertBefore(detailsElement, resultElement.nextSibling);
  }
}

// Expose the function globally so that the HTML button can call it.
(window as any).calculateGas = fetchGasSpentEtherscan;