EXAMPLE
CONTRACT=dev-1634618467984-96560315274593
YOUR_ACCOUNT=yairnava.testnet

Initialize contract

    near call $CONTRACT new '{}' --account_id $YOUR_ACCOUNT 

Get required cost to create a token

    near call $CONTRACT get_required_deposit '{                    
        "args" : {
            "owner_id": "YOUR_ACCOUNT.testnet",
            "total_supply": "1000000",
            "metadata": {
                "spec": "ft-1.0.0",
                "name": "rwerwer",
                "symbol": "TrwerwerT",
                "icon": null,
                "decimals": 18
            }
        },
        "account_id" : "YOUR_ACCOUNT.testnet"
    }' --account_id $YOUR_ACCOUNT

Deposit funds

    near call $CONTRACT storage_deposit '{}' --account_id $YOUR_ACCOUNT  --amount 3 --gas=200000000000000  

Create a new token

    near call $CONTRACT create_token '{                    
        "args" : {
            "owner_id": "yairnava.testnet",
            "total_supply": "1000000000000000000000000000",
            "metadata": {
                "spec": "ft-1.0.0",
                "name": "TToken",
                "symbol": "TToken",
                "icon": null,
                "decimals": 18
            }
        }
    }' --account_id $YOUR_ACCOUNT --amount 3 --gas=200000000000000

Get number of tokens

    near view $CONTRACT get_number_of_tokens

Get all tokens

    near call $CONTRACT get_tokens '{"from_index": 0, "limit":10}' --account_id $YOUR_ACCOUNT

Get token by id (symbol)

    near call $CONTRACT get_token '{"token_id": "mmfft"}' --account_id $YOUR_ACCOUNT