const serverUrl = "https://d2qwhavjxjpf.usemoralis.com:2053/server";
const appId = "MojOxWSqgTiDG5k83CZH1VP8jwXrSzlRbh1PpGcX";
const CONTRACT_ADDRESS = "0x8B672977595D0E9bfc3b82C45B3629E2489CD756"
Moralis.start({ serverUrl, appId });
let web3;

/* Status Messages */
function showMessage(msg, success) {
  if (success) {
  jQuery('#message').html('<span class="success">'+msg+'</span>');
  } else {
  jQuery('#message').html('<span class="failure">'+msg+'</span>');
  }
}

/* Authentication code */
async function submit_mint() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
      })
      .catch(function (error) {
        console(error);
      });
  }

  showMessage("logging in user", true);
  web3 = await Moralis.Web3.enableWeb3();
  
  let accounts = web3.eth.getAccounts();
  let mintAmount = parseInt(document.querySelector('input[name="mint_amount"]:checked').value);

  if(mintAmount <= 2){
    const contract = web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "paused",
      abi: ABI,
    };
    const isPaused = await Moralis.executeFunction(options);

    if(!isPaused){
      showMessage("beginning mint process", true);
      contract.methods.mint(mintAmount).send( {from: accounts[0], value: (mintAmount*1000000000000)}).on("receipt", function(receipt){
        showMessage("mint is complete", true);
      });

    }
  }else{
    console.log("you can only mint 2");
  } 
   
}

const getContract = async (web3) => {
  const abi = await jQuery.getJSON("abi.json");
  const cadd = '0xE7191C896d59A9c39965E16C5184c44172Ec9CF9';
  const netId = await web3.eth.net.getId();
  console.log(netId);
  if (netId != 1) {
  showMsg('Make sure you are connected to the Ethereum Mainnet ! Refresh the page after you do.', false);
  return false;
  } else {
  const cont = new web3.eth.Contract( abi, netId && cadd );
  return cont;
  }
  };

document.getElementById("submit_mint").onclick = submit_mint;