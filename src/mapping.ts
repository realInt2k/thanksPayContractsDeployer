import { BigInt, BigDecimal, Bytes, Address} from "@graphprotocol/graph-ts";

import {
  LeagueMaker,
  // OwnershipTransferred,
  leagueIsDoneEvent,
  leagueIsWaitingEvent,
  leagueIsPlayingEvent,
  leagueJoined, 
  prizeClaimed,
  leagueIsCancelledEvent,
  withdrawAsAdminEvent,
  // createUserEvent,
  // updateUserEvent,
  updateContractBalanceEvent,
  editLeagueEvent
} from "../generated/LeagueMaker/LeagueMaker"

import { concat } from "@graphprotocol/graph-ts/helper-functions";

import { Game, Price, Contract,  League, Prize, LeaguePlayer, User, Log, AllLog, WithDrawLog,NickNameToLeaguePlayer } from '../generated/schema';
import { blockPlayerEvent, unblockPlayerEvent, setAdminStateEvent, /*TransferOwnershipCall,*/ kickPlayersEvent, blockUsersEvent, unblockUsersEvent } from '../generated/LeagueMaker/LeagueMaker';


// BigNumber-like references
let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);
let ZERO_BD = BigDecimal.fromString("0");
const noName = "no_name";


// will round up to 2 nearest decimals
function weiToBNB(wei: BigInt): BigDecimal {
  const decimalString = new  BigDecimal(wei).div(new BigDecimal(BigInt.fromI64(1000000000000000000))).toString();
  const number = parseFloat(decimalString);
  const roundNumber = Math.round(number*100)/(100);
  const roundString = roundNumber.toString();
  return BigDecimal.fromString(roundString);
}

// leagueId: 3, parameter: 'totalPrize', value: '3000'
function createNewPrice(leagueId: string, parameter: string, value: BigInt): string { // value is WEI
  let totalPrizePrice = new Price(leagueId.toString() + parameter);

  totalPrizePrice.WEI = ZERO_BI.plus(value as BigInt);
  totalPrizePrice.BNB = weiToBNB(totalPrizePrice.WEI  as BigInt);
  totalPrizePrice.ETH = totalPrizePrice.BNB;
  totalPrizePrice.save();
  return totalPrizePrice.id;
}

function getContractEntity(): string {
  let contract = Contract.load("suka");
  if(contract == null) {
    contract = new Contract("suka");
    contract.save();
  }
  return contract.id;
}

// this function returns all the logs
function getAllLog(): AllLog
{
  let allLog = AllLog.load("suka");
  if(allLog == null) 
  {
    allLog = new AllLog("suka");
    let logs = allLog.logs;
    allLog.nextId = 0;
    // make a starting log
    let log = new Log(allLog.nextId.toString());    
    log.log = "start logging";
    log.save();
    // push the new starting log to allLog
    logs.push(log.id);
    allLog.logs = logs;
    allLog.nextId = allLog.nextId + 1;
    allLog.save();
  }
  return allLog;
}

function saveNewLog(str:string):void {
  let allLog = getAllLog();
  // make a starting log
  let log = new Log(allLog.nextId.toString());    
  log.log = " " + str;
  log.save();
  // push the new starting log to allLog
  //let logs = allLog.logs;
  let newLogs:string[] = []; // make an empty log field
  newLogs.push(log.id);
  let i = allLog.nextId - 1;
  let cnt = 0;
  while(i >= 0 && cnt < 9) // load the 8 latest log
  {
    log = Log.load(i.toString()) as Log;
    newLogs.push(log.id);
    cnt ++;
    i --;
  }
  allLog.logs = newLogs;
  allLog.nextId = allLog.nextId + 1;
  allLog.save();
}

export function handleUpdateContractBalanceEvent(event: updateContractBalanceEvent): void {
  let contract = Contract.load(getContractEntity());
  saveNewLog("updateContractBalanceEvent: " + event.params._amount.toString());
  if(contract)
  {
    contract.balance = createNewPrice(
      event.params._time.toString(), 
      'contractBalance',
      event.params._amount);
    //contract.balance = contractBalance;
    contract.save();
  }
}

export function handleKickPlayersEvent(event: kickPlayersEvent): void {
  let league = League.load(event.params._leagueId.toString());
  if(league)
  {
    for(let i = 0; i < event.params._names.length; i++)
    {
      let nickNameToLeaguePlayer = NickNameToLeaguePlayer.load(event.params._leagueId.toString() + event.params._names[i]);
      if (nickNameToLeaguePlayer && nickNameToLeaguePlayer.leaguePlayer){
        let leaguePlayer = LeaguePlayer.load(nickNameToLeaguePlayer.leaguePlayer as string);
        if(leaguePlayer)
        {
          leaguePlayer.isKicked = true;
          leaguePlayer.save();    
        }
      }
    }
    if(league.totalPlayers)
      league.totalPlayers = (league.totalPlayers as BigInt).minus(ONE_BI)
    league.save();
  } else {
    const logMsg = "WHAT THE dyxj can't load league to kick players?";
    saveNewLog(logMsg);
  }
}

export function handleWithdrawAsAdminEvent(event: withdrawAsAdminEvent): void {
  saveNewLog("withdrawAsAdminEvent: from " + event.params._from.toHexString() + " to " + event.params._to.toHexString() + " amount " + event.params._amount.toString());
  let fromUser = User.load(event.params._from.toHexString());
  let toUser = User.load(event.params._to.toHexString());
  const amount = event.params._amount;
  if(!toUser)
  {
    let newUser = new User(event.params._to.toHexString());
    newUser.address = event.params._to.toHexString();
    newUser.name = noName;
    newUser.adminLevel = 0;
    newUser.withDrawLogIndex = 0;
    newUser.totalLeagues = BigInt.fromI32(0);
    newUser.isBlocked = false;
    newUser.createdAt = BigInt.fromI32(-1); // denote that this is just a tmp user
    newUser.save();
  }
  if(!fromUser)
  {
    saveNewLog("withdrawAsAdminEvent: fromUser not found");
    return;
  }
  fromUser.withDrawLogIndex = fromUser.withDrawLogIndex + 1;
  fromUser.save();
  let newWithDrawLog = new WithDrawLog(fromUser.address + fromUser.withDrawLogIndex.toString());
  newWithDrawLog.amount = createNewPrice(event.params._time.toString(), 'withdrawLog', amount);
  newWithDrawLog.from = event.params._from.toHexString();
  newWithDrawLog.to = event.params._to.toHexString();
  newWithDrawLog.createdAt = event.params._time;
  newWithDrawLog.message = event.params._message;
  newWithDrawLog.save();
}

// export function handleCreateUserEvent(event: createUserEvent): void {
//   saveNewLog("createUserEvent: " + event.params._userAddr.toHexString() + " " + event.params._name.toString());
//   const userAddr = event.params._userAddr as Address;
//   const state = event.params._state.toI32();  
//   let newUser = new User(userAddr.toHexString().toLowerCase());
//   newUser.address = userAddr.toHexString().toLowerCase();
//   newUser.adminLevel = state;
//   newUser.totalLeagues = BigInt.fromI32(0);
//   newUser.name = event.params._name;
//   newUser.withDrawLogIndex = 0;
//   newUser.createdAt = event.params._time;
//   newUser.save();
// }

// export function handleUpdateUserEvent(event: updateUserEvent): void {
//   saveNewLog("updateUserEvent: " + event.params._userAddr.toHexString() + " " + event.params._name.toString());
//   const userAddr = event.params._userAddr as Address;
//   const state = event.params._state.toI32();  
//   const user = User.load(userAddr.toHexString().toLowerCase());
//   if(user) {
//     user.adminLevel = state;
//     user.name = event.params._name;
//     user.isBlocked = event.params._blockState;
//     user.save();
//   }  else {
//     saveNewLog("update user failed");
//   }
// }

export function handleLeagueIsCancelledEvent(event: leagueIsCancelledEvent): void
{ 
  let league = League.load(event.params._leagueId.toString());
  if(league)
  {
    league.status = "Cancelled";
    league.closeTime = event.params._time;
    league.save();
  }
}

export function handleSetAdminStateEvent(event: setAdminStateEvent): void {
  const userAddr = event.params.userAddr as Address;
  const state = event.params.state.toI32();
  const logMsg1 = "setting " + userAddr.toHexString().toLowerCase() + " to admin state: " + state.toString();
  saveNewLog(logMsg1);
  const user = User.load(userAddr.toHexString().toLowerCase());
  
  if(user)
  {
    user.adminLevel = state;
    user.name = event.params._name;
    user.save();
  } else 
  {
    let newUser = new User(userAddr.toHexString().toLowerCase());
    newUser.address = userAddr.toHexString().toLowerCase();
    newUser.address = userAddr.toHexString().toLowerCase();
    newUser.adminLevel = state;
    newUser.totalLeagues = BigInt.fromI32(0);
    newUser.name = event.params._name;
    newUser.withDrawLogIndex = 0;
    newUser.createdAt = event.params._time;
    newUser.save();
  }
}

export function handleBlockPlayerEvent(event: blockPlayerEvent): void {
  const logMsg1 = "blocking " +  event.params._leagueId.toString() + " " + event.params._name.toString();
  saveNewLog(logMsg1);
  let league = League.load(event.params._leagueId.toString());
  if(league)
  {
    let nickNameToLeaguePlayer = NickNameToLeaguePlayer.load(event.params._leagueId.toString() + event.params._name);
    if(nickNameToLeaguePlayer && nickNameToLeaguePlayer.leaguePlayer)
    {
      let leaguePlayer = LeaguePlayer.load(nickNameToLeaguePlayer.leaguePlayer as string);
      if(leaguePlayer)
      {
        const logMsg2 = "loaded player in league " + event.params._leagueId.toString() + " name: " +  event.params._name;
        saveNewLog(logMsg2);
        leaguePlayer.isBlocked = true;
        leaguePlayer.save();
        let user = User.load(leaguePlayer.user as string);
        if(user)
        {
          user.isBlocked = true;
          user.save();
          const logMsg4 = "blocked user " + (user.address as string);
          saveNewLog(logMsg4);
        }
      }
    }
  } else {
    const logMsg3 = "WHAT THE FUCK can't load league to block player?";
    saveNewLog(logMsg3);
  }
}

export function handleBlockUsersEvent(event: blockUsersEvent): void {
  const userAddrs: Address[] = event.params._userAddrs;
  for(let i = 0; i < userAddrs.length; ++i) {
    let userAddr = userAddrs[i].toHexString().toLowerCase();
    let user = User.load(userAddr);
    if(user) {
      user.isBlocked = true;
      user.save();
    }
  }
}

export function handleUnblockUsersEvent(event: unblockUsersEvent): void {
  const userAddrs: Address[] = event.params._userAddrs;
  for(let i = 0; i < userAddrs.length; ++i) {
    let userAddr = userAddrs[i].toHexString().toLowerCase();
    let user = User.load(userAddr);
    if(user) {
      user.isBlocked = false;
      user.save();
    }
  }
}

// blockchain: function "CreateLeague" -> event "LeagueIsCreated" -> was called at block 30000 with parameters: name, id, participants
// GraphQL: League, Participant, Admin 

export function handleUnblockPlayerEvent(event: unblockPlayerEvent): void {
  const logMsg1 = "unBlocking " +  event.params._leagueId.toString() + " " + event.params._name.toString();
  saveNewLog(logMsg1);
  let league = League.load(event.params._leagueId.toString());
  if(league)
  {
    let nickNameToLeaguePlayer = NickNameToLeaguePlayer.load(event.params._leagueId.toString() + event.params._name);
    if(nickNameToLeaguePlayer && nickNameToLeaguePlayer.leaguePlayer)
    {
      let leaguePlayer = LeaguePlayer.load(nickNameToLeaguePlayer.leaguePlayer as string);
      if(leaguePlayer)
      {
        const logMsg2 = "loaded player in league " + event.params._leagueId.toString() + " name: " +  event.params._name;
        saveNewLog(logMsg2);
        leaguePlayer.isBlocked = false;
        leaguePlayer.save();
        let user = User.load(leaguePlayer.user as string);
        if(user)
        {
          user.isBlocked = false;
          user.save();
          const logMsg4 = "unblocked user " + (user.address as string);
          saveNewLog(logMsg4);
        }
      }
    }
  } else {
    const logMsg3 = "WHAT THE FUCK can't load league to block player?";
    saveNewLog(logMsg3);
  }
}

export function handleEditLeagueEvent(event: editLeagueEvent): void {
  saveNewLog("leagueIsWaitingEvent: " + event.params._leagueId.toString() + " " + event.params._gameName.toString());
  let league = League.load(event.params._leagueId.toString());
  if(league) {
    //league.adminMadeCreateAccount = event.params._byAdmin.toHexString();
    let game = Game.load(event.params._gameName.toString());
    if (game === null){
      game = new Game(event.params._gameName.toString());
      game.name = event.params._gameName.toString();
    }
    league.game = game.id;
    let winCondsTmp:Array<string> = [];
    let winCondOpsTmp:Array<string> = [];
    for(let i = 0; i < event.params._winConds.length; ++i) {
      let winCond = event.params._winConds[i] as string;
      winCondsTmp.push(winCond);
    }
    for(let i = 0; i < event.params._winCondOps.length; ++i) {
      winCondOpsTmp.push(event.params._winCondOps[i] as string);
    }
    league.winCondOps = winCondOpsTmp;
    league.winConds = winCondsTmp;
    league.maxPlayer = event.params._maxPlayer;    
    league.liveTime = event.params._liveTime;
    league.closeTime = event.params._closeTime;
    game.save();
    league.save();
  }
}

// an Admin created this league
export function handleLeagueIsWaitingEvent(event: leagueIsWaitingEvent): void {
  saveNewLog("leagueIsWaitingEvent: " + event.params._leagueId.toString() + " " + event.params._gameName.toString());
  let league = new League(event.params._leagueId.toString());
  league.adminMadeCreateAccount = event.params._byAdmin.toHexString();
  let game = Game.load(event.params._gameName.toString());
  if (game === null){
    game = new Game(event.params._gameName.toString());
    game.name = event.params._gameName.toString();
  }
  league.game = game.id;


  league.totalPlayers = ZERO_BI;
  
  league.totalPrize = createNewPrice(event.params._leagueId.toString(), 
  'totalPrize', 
  ZERO_BI.plus(event.params._initReward as BigInt));

  league.minEntry = createNewPrice(event.params._leagueId.toString(), 
  'minEntry', 
  event.params._minEntry as BigInt);
  league.initReward = createNewPrice(event.params._leagueId.toString(), 
  'initReward', 
  event.params._initReward as BigInt);


  let winCondsTmp:Array<string> = [];
  let winCondOpsTmp:Array<string> = [];
  for(let i = 0; i < event.params._winConds.length; ++i) {
    let winCond = event.params._winConds[i] as string;
    winCondsTmp.push(winCond);
  }
  for(let i = 0; i < event.params._winCondOps.length; ++i) {
    winCondOpsTmp.push(event.params._winCondOps[i] as string);
  }
  league.winCondOps = winCondOpsTmp;
  league.winConds = winCondsTmp;
  league.maxPlayer = event.params._maxPlayer;
  
  league.openTime = event.params._openTime;
  league.liveTime = event.params._liveTime;
  league.closeTime = event.params._closeTime;
  league.status = "Waiting";

  game.save();
  league.save();
}

export function handleLeagueIsPlayingEvent(event: leagueIsPlayingEvent): void {
  let league = League.load(event.params._leagueId.toString());
  if (league){
    league.adminMadeLiveAccount = event.params._byAdmin.toHexString();
    league.status = "Playing";
    league.save();
  }

}

export function handleLeagueJoined(event: leagueJoined): void{
  let leaguePlayer = LeaguePlayer.load(event.params._leagueId.toString() + "-" + event.params._pAddress.toHexString());
  if (!leaguePlayer)
    leaguePlayer = new LeaguePlayer(event.params._leagueId.toString() + "-" + event.params._pAddress.toHexString());
  
  if (leaguePlayer) 
  {
    leaguePlayer.nickName = event.params._nickName;
    leaguePlayer.joinedAt = event.params._time;
    leaguePlayer.isBlocked = event.params.isBlocked;
    leaguePlayer.isKicked = false;
    leaguePlayer.uniqueId = event.params._uniqueIdCnt.toI32();
    let user = User.load(event.params._pAddress.toHexString().toLowerCase());
    if (user === null){
      user = new User(event.params._pAddress.toHexString().toLowerCase());
      user.address = event.params._pAddress.toHexString().toLowerCase();
      user.totalLeagues = ONE_BI;
      user.isBlocked = event.params.isBlocked;
      user.withDrawLogIndex = 0;
      user.name = noName;
      user.createdAt = event.params._time;
      user.adminLevel = 0;
    } else {
      let totallgs: BigInt = user.totalLeagues as BigInt;
      user.totalLeagues = totallgs.plus(ONE_BI);
    }
    if(user){
      leaguePlayer.user = user.id;
      user.totalLeaguesWinner = ZERO_BI;
    } 
    let league = League.load(event.params._leagueId.toString());
    
    if (league){
      if(league.totalPlayers)
        league.totalPlayers = (league.totalPlayers as BigInt).plus(ONE_BI);
      
      let _minEntry = Price.load(event.params._leagueId.toString() + 'minEntry');//: BigInt = league.minEntry as BigInt;
      let _totalPrize = Price.load(event.params._leagueId.toString() + 'totalPrize');//: BigInt = league.minEntry as BigInt;
      //let _totalPrize = Price.load(event.params._leagueId.toString() + 'totalPrize');//: BigInt = league.minEntry as BigInt;
      
      // increase leagueTotalPrize
      if (_minEntry && _minEntry.WEI && _totalPrize && _totalPrize.WEI){
      
        // let amt = (_minEntry.WEI.times(BigInt.fromI32(100))).div(BigInt.fromI32(100)).times(BigInt.fromI32(80));
        // amt = amt.div(BigInt.fromI32(100));
        _totalPrize.WEI = (_totalPrize.WEI as BigInt).plus((_minEntry.WEI as BigInt).times(BigInt.fromI32(80))).div(BigInt.fromI32(100));
        _totalPrize.BNB = weiToBNB(_totalPrize.WEI as BigInt);
        league.totalPrize = _totalPrize.id;
        _minEntry.save();
        _totalPrize.save();
      let contract = Contract.load(getContractEntity());
      if(contract && _minEntry) {
        let ninety_percent:BigInt = ((_minEntry.WEI as BigInt).times(BigInt.fromI32(90))).div(BigInt.fromI32(100));
        let ten_percent:BigInt = (_minEntry.WEI as BigInt).minus(ninety_percent);
        contract.balance = createNewPrice(
          event.params._time.toString(), 
          'contractBalance',
          ten_percent);
        saveNewLog("updateContractBalanceEvent: " + ten_percent.toString());
        //contract.balance = contractBalance;
        contract.save();
      }
      league.save();
      leaguePlayer.league = league.id;
    }
  }
    user.save();

    let nickNameToLeaguePlayer = new NickNameToLeaguePlayer(event.params._leagueId.toString() + event.params._nickName.toString());
    nickNameToLeaguePlayer.leaguePlayer = leaguePlayer.id;

    nickNameToLeaguePlayer.save();

    leaguePlayer.save();
    user.save();
  }
}

export function handleLeagueIsDoneEvent(event: leagueIsDoneEvent): void {
  let league = League.load(event.params._leagueId.toString());
  if (league){
    league.adminMadeClosedAccount = event.params._byAdmin.toHexString();
    league.status = "Done";
    league.save();
  }
  let wnrs = event.params._winners;
  for(let i =0; i < wnrs.length; i++){
    let prize = new Prize(event.params._leagueId.toString() + wnrs[i].toString());
    if (league){
    prize.league = league.id;
    }
    let prizeAmount = createNewPrice(event.params._leagueId.toString(), 'prize', event.params._prizePerParticipant);
    prize.amount = prizeAmount;
    prize.createdAt = event.params._time;
    
    let nickNameToLeaguePlayer = NickNameToLeaguePlayer.load(event.params._leagueId.toString() + wnrs[i]);
    if (nickNameToLeaguePlayer){
      let leaguePlayer = LeaguePlayer.load(nickNameToLeaguePlayer.leaguePlayer as string);
      if(leaguePlayer){
          leaguePlayer.isWinner = true;
          let str: string = leaguePlayer.user as string;
          let user = User.load(str.toLowerCase());
          if (user){
            prize.claimableBy = user.id;
            if (user.totalLeaguesWinner){
              let total: BigInt = user.totalLeaguesWinner as BigInt;
              user.totalLeaguesWinner = total.plus(ONE_BI);
            }
            user.save();
          }
          leaguePlayer.save();
      }
    }
    prize.claimed = false;
    if(prize){
      prize.save();
    }
    }
}

export function handlePrizeClaimed(event: prizeClaimed): void{
  let prize = Prize.load(event.params._leagueId.toString() + event.params._nickName.toString());
  if (prize){
    prize.claimed = true; 
    prize.claimedAt = event.params._time;
    prize.save();
  }
}