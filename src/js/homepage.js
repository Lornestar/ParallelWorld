var ethnetwork = 0;
var potsize = 0;

function setupcounter(){
    var utcSeconds = 1531673100; //world cup ending
    var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(utcSeconds);

    $('#countdown').countdown(date, function(event) {
      $(this).html(event.strftime('%D days %H:%M:%S'));
    });
}


    App = {
        web3Provider: null,
        contracts: {},
      
        init: function() {
          
          return App.initWeb3();
        },
      
        initWeb3: function() {
          // Is there an injected web3 instance?
          if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;      
          } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
          }
          web3 = new Web3(App.web3Provider);
      
          web3.version.getNetwork((err, netId) => {
            switch (netId) {        
              case "1":     
                ethnetwork = 1;     
                console.log('This is the main network.')
                break
              case "4":        
                ethnetwork = 4;  
                console.log('This is the rinkeby test network.')
                break
              case "5777":
                ethnetwork = 5777;
                console.log('This is local dev environment')
                break
              default:
                document.getElementById("metamaskwarning").innerHTML = "***Please set metamask to Rinkeby Test Network***<br/><a href='https://metamask.io/'>Click here to get metamask</a><br/><a href='https://www.rinkeby.io/#faucet'>Click here to get free ETH on the Rinkeby testnet'</a>";
      
            }
          });
      
          return //App.initContract();
        },
      
        initContract: function() {
          $.getJSON('/events/worldcup.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var ParallelWorldArtifact = data;
            App.contracts.ParallelWorld = TruffleContract(ParallelWorldArtifact);
          
            // Set the provider for our contract
            App.contracts.ParallelWorld.setProvider(App.web3Provider);
      
            if (document.getElementById("currentethaddress"))
            {
              document.getElementById("currentethaddress").innerHTML = web3.eth.accounts[0];
              getaccountinfo(web3.eth.accounts[0]);
            }      
          
            // Use our contract to retrieve and mark the adopted pets
            return App.handleiteminfo();
          });
      
          return App.bindEvents();
        },
      
      
        handleuserinfo: function(){
          
          var parallelworldInstance;
      
          web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
      
            var account = accounts[0];
      
            
          });
        }
    }

$(window).on('load', function(){
    setupcounter();
    App.init();    
    setupaccordian();
    getpotsize();
});

function gotomarket()
{
    //send to market.html
    $(location).attr('href', 'market.html');
}

function setupaccordian()
{
    $( function() {
        $( "#accordion" ).accordion({
          collapsible: true,
          heightStyle: "content"
        });
      } );
}

function getpotsize()
{
  var apiurl = "https://api.parallelworldcup.com/api/smartcontract/potsize";
  $.ajax({
    type: "GET",
    url: apiurl,
    dataType :"json",
    success : function(data){
        potsize = data;        
        $('#potsize').text("Pot Size is " + parseFloat(potsize).toFixed(4) + " ETH");
        updateethconversion();
      }
  });
}

function updateethconversion()
{
  var apiurl = "https://api.coinmarketcap.com/v1/ticker/ethereum/";
  $.ajax({
    type: "GET",
    url: apiurl,
    dataType :"json",
    success : function(data){
        var ethusd = data[0].price_usd;
        var priceinusd = potsize * ethusd;
        priceinusd = Math.round(priceinusd * 100) / 100
        $('#potsize').append(" ( $" + priceinusd + " USD)");
      }
  });
}