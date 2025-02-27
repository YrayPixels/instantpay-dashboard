// click-to-pay.js - Solana Implementation
(function () {
    // Configuration object that will be populated by the user
    const TokenPayConfig = {
        merchantId: null,
        supportedTokens: ['SOL', 'USDC', 'RAY', 'SRM'],
        callbackUrl: null,
        cluster: 'mainnet-beta', // Can be 'mainnet-beta', 'testnet', 'devnet'
        theme: {
            primaryColor: '#3498db',
            buttonColor: '#2ecc71',
            fontFamily: 'Arial, sans-serif'
        }
    };

    // Initialize Solana wallet
    async function initSolanaWallet() {
        if (!window.solana) {
            if (window.PhantomWalletAdapter) {
                // If Phantom adapter is available but not injected
                return new window.PhantomWalletAdapter();
            } else {
                // For other wallet adapters like Solflare, Sollet, etc.
                return null;
            }
        }
        return window.solana;
    }

    // Function to connect wallet
    async function connectWallet() {
        try {
            const wallet = await initSolanaWallet();
            if (!wallet) {
                throw new Error('No Solana wallet found. Please install Phantom, Solflare, or another Solana wallet.');
            }

            // Connect to the wallet
            if (!wallet.isConnected) {
                await wallet.connect();
            }

            // Get public key
            const publicKey = wallet.publicKey || wallet.publicKeys?.[0];
            if (!publicKey) {
                throw new Error('Failed to get wallet public key');
            }

            return {
                publicKey: publicKey.toString(),
                wallet
            };
        } catch (error) {
            console.error('Failed to connect wallet', error);
            throw error;
        }
    }

    // Function to get token balances
    async function getTokenBalances(publicKey) {
        const balances = {};

        try {
            // This is a placeholder. In a real implementation, you would:
            // 1. Connect to Solana RPC using web3.js
            // 2. Use SPL-token library to query token balances
            // 3. Return the actual balances

            // Example placeholder:
            for (const token of TokenPayConfig.supportedTokens) {
                balances[token] = '0.0'; // Placeholder
            }

            // Get SOL balance - would actually use connection.getBalance(publicKey)
            balances.SOL = '0.0';

        } catch (error) {
            console.error('Failed to fetch token balances', error);
        }

        return balances;
    }

    // Function to execute payment
    async function executePayment(tokenSymbol, amount, recipient, userInfo) {
        try {
            const { publicKey, wallet } = await connectWallet();
            let txHash = null;

            // Ensure we have the Solana web3 library
            if (!window.solanaWeb3) {
                throw new Error('Solana Web3 library not found');
            }

            // Create connection to Solana network
            const connection = new window.solanaWeb3.Connection(
                window.solanaWeb3.clusterApiUrl(TokenPayConfig.cluster),
                'confirmed'
            );

            if (tokenSymbol === 'SOL') {
                // For native SOL transfers
                const transaction = new window.solanaWeb3.Transaction().add(
                    window.solanaWeb3.SystemProgram.transfer({
                        fromPubkey: new window.solanaWeb3.PublicKey(publicKey),
                        toPubkey: new window.solanaWeb3.PublicKey(recipient),
                        lamports: amount * window.solanaWeb3.LAMPORTS_PER_SOL
                    })
                );

                // Set recent blockhash and sign transaction
                transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
                transaction.feePayer = new window.solanaWeb3.PublicKey(publicKey);

                // Sign and send transaction
                const signedTransaction = await wallet.signTransaction(transaction);
                txHash = await connection.sendRawTransaction(signedTransaction.serialize());

            } else {
                // For SPL tokens (like USDC)
                // This is a placeholder. You would need to:
                // 1. Find the token account for the user
                // 2. Create a token transfer instruction
                // 3. Sign and send the transaction

                // Placeholder for now
                txHash = 'placeholder_tx_hash';
            }

            // Send transaction data to callback URL if provided
            if (TokenPayConfig.callbackUrl) {
                fetch(TokenPayConfig.callbackUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        merchantId: TokenPayConfig.merchantId,
                        userInfo,
                        payment: {
                            token: tokenSymbol,
                            amount: amount,
                            txHash: txHash,
                            sender: publicKey,
                            recipient: recipient
                        }
                    })
                });
            }

            // Confirm transaction
            await connection.confirmTransaction(txHash);

            return txHash;
        } catch (error) {
            console.error('Payment failed', error);
            throw error;
        }
    }

    // Create payment modal
    function createPaymentModal(options) {
        const { amount, recipient, onSuccess, onError, userName, userEmail } = options;

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'token-pay-modal-container';
        modalContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      font-family: ${TokenPayConfig.theme.fontFamily};
    `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      width: 400px;
      max-width: 90%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    `;

        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    `;

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Complete Payment';
        modalTitle.style.cssText = `
      margin: 0;
      color: ${TokenPayConfig.theme.primaryColor};
    `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    `;
        closeButton.onclick = () => {
            document.body.removeChild(modalContainer);
        };

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Create form
        const form = document.createElement('form');
        form.onsubmit = async (e) => {
            e.preventDefault();

            const selectedToken = form.querySelector('#token-pay-token-select').value;
            const userNameValue = form.querySelector('#token-pay-name').value;
            const userEmailValue = form.querySelector('#token-pay-email').value;

            try {
                const txHash = await executePayment(selectedToken, amount, recipient, {
                    name: userNameValue,
                    email: userEmailValue
                });

                // Show success message
                form.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <h4 style="color: ${TokenPayConfig.theme.buttonColor};">Payment Successful!</h4>
            <p>Transaction Signature: ${txHash}</p>
            <p><a href="https://explorer.solana.com/tx/${txHash}?cluster=${TokenPayConfig.cluster}" target="_blank">View on Solana Explorer</a></p>
          </div>
        `;

                if (onSuccess) {
                    onSuccess(txHash);
                }
            } catch (error) {
                // Show error message
                const errorMsg = document.createElement('p');
                errorMsg.style.cssText = `
          color: red;
          text-align: center;
        `;
                errorMsg.textContent = 'Payment failed: ' + error.message;
                form.appendChild(errorMsg);

                if (onError) {
                    onError(error);
                }
            }
        };

        // Create form fields
        // User Name Input
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = 'token-pay-name';
        nameLabel.textContent = 'Name';
        nameLabel.style.display = 'block';
        nameLabel.style.marginBottom = '5px';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'token-pay-name';
        nameInput.required = true;
        nameInput.value = userName || '';
        nameInput.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    `;

        // User Email Input
        const emailLabel = document.createElement('label');
        emailLabel.htmlFor = 'token-pay-email';
        emailLabel.textContent = 'Email';
        emailLabel.style.display = 'block';
        emailLabel.style.marginBottom = '5px';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'token-pay-email';
        emailInput.required = true;
        emailInput.value = userEmail || '';
        emailInput.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    `;

        // Token Selection
        const tokenLabel = document.createElement('label');
        tokenLabel.htmlFor = 'token-pay-token-select';
        tokenLabel.textContent = 'Select Token';
        tokenLabel.style.display = 'block';
        tokenLabel.style.marginBottom = '5px';

        const tokenSelect = document.createElement('select');
        tokenSelect.id = 'token-pay-token-select';
        tokenSelect.required = true;
        tokenSelect.style.cssText = `
      width: 100%;
      padding: 8px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    `;

        TokenPayConfig.supportedTokens.forEach(token => {
            const option = document.createElement('option');
            option.value = token;
            option.textContent = token;
            tokenSelect.appendChild(option);
        });

        // Payment Details
        const detailsDiv = document.createElement('div');
        detailsDiv.style.cssText = `
      background-color: #f9f9f9;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    `;

        const amountText = document.createElement('p');
        amountText.style.margin = '5px 0';
        amountText.innerHTML = `Amount: <strong>${amount}</strong>`;

        const recipientText = document.createElement('p');
        recipientText.style.margin = '5px 0';
        recipientText.innerHTML = `Recipient: <strong>${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}</strong>`;

        detailsDiv.appendChild(amountText);
        detailsDiv.appendChild(recipientText);

        // Submit Button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Pay Now';
        submitButton.style.cssText = `
      width: 100%;
      padding: 10px;
      background-color: ${TokenPayConfig.theme.buttonColor};
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    `;

        // Assemble the form
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(emailLabel);
        form.appendChild(emailInput);
        form.appendChild(tokenLabel);
        form.appendChild(tokenSelect);
        form.appendChild(detailsDiv);
        form.appendChild(submitButton);

        // Connect wallet info
        const walletInfo = document.createElement('p');
        walletInfo.style.cssText = `
      text-align: center;
      font-size: 0.9em;
      margin-top: 15px;
      color: #666;
    `;
        walletInfo.innerHTML = 'You\'ll need to connect your Solana wallet (Phantom, Solflare, etc.) to complete the payment.';
        form.appendChild(walletInfo);

        // Assemble the modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(form);
        modalContainer.appendChild(modalContent);

        // Add to body
        document.body.appendChild(modalContainer);
    }

    // Main function to initialize the payment button
    function initPayButton(button, options) {
        button.addEventListener('click', () => {
            createPaymentModal(options);
        });
    }

    // Public API
    window.TokenPay = {
        configure: function (config) {
            Object.assign(TokenPayConfig, config);
            return this;
        },
        createButton: function (selector, options) {
            const button = document.querySelector(selector);
            if (button) {
                initPayButton(button, options);
            } else {
                console.error(`Button not found: ${selector}`);
            }
            return this;
        },
        openPaymentModal: function (options) {
            createPaymentModal(options);
            return this;
        }
    };
})();