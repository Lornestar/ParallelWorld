var usersteams = [];
var apibaseurl = "https://api.parallelworldcup.com/api/"
var pathname = window.location.pathname;
var intprizeamount;

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load teams.    
    if (!pathname.includes('myteams.html'))
    {
      $.getJSON(teamsjsonfile, function(data) {
        for (i = 0; i < data.length; i ++) {
          addteamtoscreen(i, data);
        }
      });
    }
    
    //setup countdown
    setupcounter();

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;      
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      $('#metamaskwarning').css("display", "block");
    }
    web3 = new Web3(App.web3Provider);

    web3.version.getNetwork((err, netId) => {
      switch (netId) {        
        case "1":          
          console.log('This is the main network.')
          break
        case "4":          
          console.log('This is the rinkeby test network.')
          break
        case "5777":
          console.log('This is local dev environment')
          break
        default:
          //document.getElementById("metamaskwarning").innerHTML = "***Please set metamask to Rinkeby Test Network***<br/><a href='https://metamask.io/'>Click here to get metamask</a><br/><a href='https://www.rinkeby.io/#faucet'>Click here to get free ETH on the Rinkeby testnet'</a>";

      }
      if (netId != "1")
      {
        $('#metamaskwarning').css("display", "block");
      }
    });

    return App.initContract();
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

  bindEvents: function() {
    //$(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-buyteam', App.handlebuy);    
  },

  handleuserinfo: function(){
    
    var parallelworldInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      
    });
  },

  handlebuy: function(event) {
    event.preventDefault();

    var teamId = parseInt($(event.target).data('id'));

    var parallelworldInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.ParallelWorld.deployed().then(function(instance) {
        parallelworldInstance = instance;

        // Execute buy as a transaction by sending account
        var buyamount = document.getElementById("nextprice_"+teamId).innerHTML;
        buyamount.replace(" ETH","");
        var buyamountfloat = parseFloat(buyamount);     
        buyamountfloat = buyamountfloat * 1e18;   
        return parallelworldInstance.buy(teamId, {value:buyamountfloat, from: account, gas: 21e4}).then(function(){
            App.handleiteminfo();
        });
      }).then(function(result) {
        return App.handleiteminfo();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  
  handleiteminfo: function(){
    
    App.contracts.ParallelWorld.deployed().then(function(instance) {
      parallelworldInstance = instance;

      var listeditems = [];
      //get list of all items
      parallelworldInstance.getlistedItems.call().then(function(result){
        listeditems = result;
        for (var i = 0; i < listeditems.length; i++) {
          listeditems[i] = listeditems[i].c[0];
        }
                
        //show prize amount
        instance.getprizeamount.call().then(function(result)
        {
            var prizeamount = parseethamount(result);            
            intprizeamount = prizeamount;
            prizeamount = prizeamount + " ETH";
            document.getElementById("prizeamount").innerHTML = "Pot Size = " + prizeamount;
            document.getElementById("prizeamount").value = prizeamount;
            updateethconversion();
        });

        //get next price & name on each item
        for (var i = 0; i < listeditems.length; i++) {
          parallelworldInstance.allOf.call(i).then(function(result){
            var specificiteminfo = result;
            var currentindex = specificiteminfo[0].c[0];//column 0

            var currentprice = web3.toBigNumber(specificiteminfo[3]); //column 3
            var nextpriceamount = web3.toBigNumber(specificiteminfo[4]); //column 4
            var itemname = web3.toAscii(specificiteminfo[5]); //column 5
            var currentowner = specificiteminfo[1];


            nextpriceamount = parseethamount(nextpriceamount);              
            var intnextpriceamount = nextpriceamount;
            nextpriceamount = nextpriceamount + " ETH";

            currentprice = parseethamount(currentprice);
            currentprice = currentprice + " ETH";

            if (pathname.includes('myteams.html')) //on myteams page
            {
              if (currentowner == web3.eth.accounts[0]) //current owner of team , so display team on page
              {
                $.getJSON(teamsjsonfile, function(data) {   
                    data[currentindex].name = itemname;     
                    data[currentindex].age = currentprice;    
                    addteamtoscreen(currentindex, data);                    
                });
                
              }
            }

            var currentpricedom = document.getElementById("theypaid_"+currentindex);
            if (currentpricedom)
            {
              
              var currentpricedom = document.getElementById("theypaid_"+currentindex);
              currentpricedom.innerHTML = currentprice;
              var pricedom = document.getElementById("nextprice_"+currentindex);
              pricedom.innerHTML = nextpriceamount;
              var titledom = document.getElementById("title_"+currentindex);
              titledom.innerHTML = itemname;
              var ownerdom = document.getElementById("owner_"+currentindex);
              ownerdom.innerHTML = currentowner;
              
                          

              //calculate odds you're getting
              var oddsyouregetting = intprizeamount / intnextpriceamount;
              document.getElementById("oddsyouget_"+currentindex).innerHTML = oddsyouregetting.toFixed(1) + " : 1"; 
            }            
          });
        }

        //watch event if can
        parallelworldInstance.TransactionOccured().watch ( (err, response) => {  //set up listener for the AuctionClosed Event
          //once the event has been detected, take actions as desired
          console.log(response);
          //Call our api - to inform an event has occured
          var itemid = response.args._itemId;
          itemid = itemid.c[0];
          var price = response.args._price;
          price = parseethamount(price);
          var oldowner = response.args._oldowner;
          var newowner = response.args._newowner;
          var txhash = response.transactionHash;
          console.log("Itemid = " + itemid + " / Price = " + price);
        
          //Call parallelworld API to inform a tx has occured
          var apidata = {'itemid':itemid,'tournamentid':tournamentid,'pricepaid':price,'oldowner':oldowner,'newowner':newowner,'txhash':txhash};
          var apiurl = apibaseurl + "transaction"
          $.ajax({
            type: "POST",
            url: apiurl,
            data: JSON.stringify(apidata),
            success: function(){},
            dataType: "json",
            contentType:  "application/json"
          });

        });
  
      });

      /*parallelworldInstance.nextPriceOf.call(1).then(function(resultprice){
        var resultpricejs = resultprice.c[0];
        console.log("Price of = " + resultpricejs);
      });

      parallelworldInstance.allOf.call(0).then(console.log);
      parallelworldInstance.allOf.call(1).then(console.log);

      //parallelworldInstance.gettestuint256.call().then(console.log);
      parallelworldInstance.nameOf.call(1).then(function(resultname){
          var resultnamejs = web3.toAscii(resultname);
          console.log(resultnamejs);
      });*/
      return ;
    }).then(function(resultprice) {
      console.log(resultprice);
    }).catch(function(err) {
      console.log(err.message);
    });
  }
  

  /*markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }*/

};


$(window).on('load', function(){
    App.init();    
  });


function parseethamount(amount)
{
  currentamount = parseFloat(amount);
  currentamount = currentamount * 0.000000000000000001;
  currentamount = parseFloat(currentamount).toFixed(4);
  return currentamount;
}

function getaccountinfo(ethaddress)
{
  //Call parallelworld API to inform a tx has occured
  var apidata;
  var apiurl = apibaseurl + "account/" + ethaddress;
  $.ajax({
    type: "GET",
    url: apiurl,
    data: apidata,
    dataType :"json",
    success : function(data){
        var nickname = data.nickname;
        var email = data.email;
        if (document.getElementById('nickname'))
        {
          document.getElementById('nickname').value = nickname;
        }
        if (document.getElementById('email'))
        {
           document.getElementById('email').value = email;
        }

      }
  });
}

function updateaccountinfo()
{
  //Call parallelworld API to inform a tx has occured
  var ethaddress =  document.getElementById("currentethaddress").innerHTML;
  var nickname = document.getElementById("nickname").value;
  var email = document.getElementById("email").value;

  var apidata = {"ethaddress":ethaddress,"email":email,"nickname":nickname};
  var apiurl = apibaseurl + "account"
  $.ajax({
    type: "POST",
    url: apiurl,
    data: JSON.stringify(apidata),    
    success: function(){alert('Saved');},
    dataType :"json",
    contentType:  "application/json"
  });
}

function addteamtoscreen(i, data)
{
  var petTemplate = $('#petTemplate');
  petTemplate.find('.panel-title').text(data[i].name).attr('id','title_'+i);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-odds').text(data[i].odds);
        petTemplate.find('.pet-price').text(data[i].age);
        petTemplate.find('.pet-owner').text(data[i].location);
        petTemplate.find('.btn-buyteam').attr('data-id', data[i].id);
        
        petTemplate.find('.pet-oddsyouget').attr('id',"oddsyouget_"+i);
        petTemplate.find('.pet-price').attr('id',"nextprice_"+i);
        petTemplate.find('.pet-owner').attr('id',"owner_"+i);
        petTemplate.find('.pet-theypaid').attr('id', "theypaid_"+i);

        var teamstatus = data[i].status;
        if (teamstatus == false)
        {
          //team is out, communicate that
          var buttonpanel = petTemplate.find('.btn-buyteam');
          buttonpanel.text('Team Out');
          buttonpanel.attr('style','background-color:red').attr('disabled','true');          
        }
        else{
          //team is in, communicate that
          var buttonpanel = petTemplate.find('.btn-buyteam');
          buttonpanel.text('Buy Team');
          buttonpanel.attr('style','background-color:lightgray');
          buttonpanel.removeAttr("disabled"); 
        }
        //var testdom = petTemplate.find('.pet-title');
        //testdom.attr('id',"title_"+i);

        //petsRow.append(petTemplate.html());
        var test = petTemplate.html();
        $('#petsRow').append(petTemplate.html());
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
        var priceinusd = intprizeamount * ethusd;
        priceinusd = Math.round(priceinusd * 100) / 100
        $('#ethusdprice').text("($" + priceinusd + " USD)");
      }
  });
}

function setupcounter(){
  var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCSeconds(utcSeconds);

    $('#countdown').countdown(date, function(event) {
      $(this).html(event.strftime('%D days %H:%M:%S'));
    });
}