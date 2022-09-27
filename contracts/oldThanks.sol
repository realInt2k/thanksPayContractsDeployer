pragma solidity ^0.8.7;
pragma experimental ABIEncoderV2;
import './SafeMath.sol';

/**
 * 추가 구현사항 - pay에 대한것 
 * 
 **/
contract oldThanks{
    using SafeMath for uint;
    struct Worker{              //user field
        string workerEmail;     //근로자 e-mail//pk
        string partnerLicenseId;//근로자 회사 사업자등록번호
        address klaytnAcc;      //근로자 클레이튼 어카운트
        bool blackWorkerState;  //이용불가 근로자
        string workerHashData;  //근로자 정보 해쉬값
        bool isReg;             //솔리디티 상에서만 사용함/ 등록된 근로자인지 확인하기 위함
        //고려사항 : 미납금을 근로자가 가지고 있어야되느냐, 
        uint serviceFeeRate;// 개인별 수수료율 (기본 2.5%)
        }
 
    struct Partner{
        string partnerLicenseId;//파트너사 사업자등록번호//pk\
        address klaytnAcc;      //파트너사 클레이튼 어카운트
        uint initialDeposit;    //보증금 금액(얼마 하겠다.)
        uint depositType;       // 1: 현금예치, 2: 이행보증보험 발행
        uint[] addDeposit;      //보증금 입금 이력
        uint[] addDepositDate;  //보증금 입금일
        uint salaryDay;         //파트너사 급여일
        uint realtimeDeposit;   //보증금 현재 잔액
        uint partnerState;      // 1 : 이용 가능 2 : 일시 정지 3 : 영구 정지 
        string partnerHashData; //파트너사 정보 해쉬값
        bool isReg;             //솔리디티 상에서만 사용함/ 등록된 파트너사인지 확인하기 위함  
        // string[] yearMonth;
        // string[] date;
        //uint[] serviceFeeDebt;
        //uint[] depositDebt;
        uint[] deposit;         //정산후 보증금(사실상 리얼타임인데, 보증금 입금시만 변경됨)
        //debt[] debts;//
    }

    struct Pay{
        string workerEmail;
        uint payState;//1 pending, 2 requestComplete, 3 overdue, 4 done
        uint payReqDate;
        uint payReqAmount;
        uint payDate;
        uint payAmount; 
        uint repaymentDate;
        uint repaymentAmount;
        // uint advancedPay;
        // uint repayment;
        //bool isReg;
    }
    mapping (string => mapping (uint => Pay)) workerDatePayMap;
    mapping (string => uint[]) workerDateMap; 
    mapping (string => mapping (uint => string[])) partnerDateWorkerMap;
    string[] public workers;//모든 근로자의 이메일 리스트 workers email list
    string[] public partners;//모든 파트너사의 사업자등록번호 리스트partners licenseId list
    mapping (string => Worker)  public workerMap;// workerEmail - Worker
    mapping (string => Partner) public partnerMap;// partnerLicenseId - Partner
    address public thanksAdmin; //thanks admin klaytn account address
   
/**
 * modifer
 * 함수 구문 진입 이전에
 * 조건 등을 확인하는 function guard 역할
 **/
   
    
    modifier isNewWorker(string memory workerEmail){//근로자 중복 가입 방지
        require(workerMap[workerEmail].isReg == false, "already exist worker");
        _;
    }
    
    modifier existWorker(string memory workerEmail){//등록된 근로자인지 확인
        require(workerMap[workerEmail].isReg == true, "not registed worker!");
        _;
    }
    
    modifier isNewPartner(string memory partnerLicenseId){//파트너사 중복가입 방지
        require(partnerMap[partnerLicenseId].isReg == false, "already exist partner");
        _;
    }
    modifier existPartner(string memory partnerLicenseId){//등록된 파트너사인지 확인
        require(partnerMap[partnerLicenseId].isReg == true, "not registed partner!");
        _;
    }
    
    modifier allowedWorker(string memory workerEmail){//pay 이용이 가능한 근로자인지 확인(블랙사용자)
        require(workerMap[workerEmail].blackWorkerState == false, "this worker cannot use thanks service!");
        _;
    }
    modifier haveBalance(string memory partnerLicenseId, uint payAmount){//해당 파트너사의 예치금 잔액이 요청금액보다 큰 지 확인 
        require(partnerMap[partnerLicenseId].realtimeDeposit >= payAmount , "this worker already regist this date!"); 
        _;
    }
    
       
    // modifier onlyInit(string memory workerEmail, string memory date){
    //     require(workerDatePayMap[workerEmail][date].payState == 1, "this worker's pay is not init state!"); 
    //     _;
    // }
    modifier onlyPending(string memory workerEmail, uint date){
        require(workerDatePayMap[workerEmail][date].payState == 1, "this worker's pay is not pending state!"); 
        _;
    }
    // modifier onlyRequestComplete(string memory workerEmail, string memory date){
    //     require(workerDatePayMap[workerEmail][date].payState == 3, "this worker's pay is not requestComplete state!"); 
    //     _;
    // }
    // modifier onlyOverdue(string memory workerEmail, string memory date){
    //     require(workerDatePayMap[workerEmail][date].payState == 4, "this worker's pay is not overdue state!"); 
    //     _;
    // }
    modifier oneDayOneReq(string memory workerEmail, uint date){
        require(workerDatePayMap[workerEmail][date].payState==0 || workerDatePayMap[workerEmail][date].payState==5, "worker can request one thanksPay for a day");
        _;
    }
    modifier repayable(string memory workerEmail, uint date){
        require(workerDatePayMap[workerEmail][date].payState == 2 || workerDatePayMap[workerEmail][date].payState == 3,
        "this worker don't have to repayment");
        _;
    }
    // modifier notRepay(string memory workerEmail, uint date){
    //     require(workerDatePayMap[workerEmail][date].advancedPay > workerDatePayMap[workerEmail][date].repayment,"this worker not repayment");
    //     _;
    // }
    //관리자 modifier
    modifier isAdmin(){//관리자 클레이튼 어카운트로부터의 송신인지 확인
        require(thanksAdmin == msg.sender, "you are not admin");
        _;
    }
    modifier notZeroSizeKey(string memory key){
        require(bytes(key).length != 0 , "key size is zero!");
        _;
    }
    modifier onlyRequestAmount(uint payReqAmount, uint payAmount){
        require(payReqAmount == payAmount , "pay request amount and pay amount not same!");
        _;
    }
   
    
/** 
 * constructor 
 * 최초 컨트랙트 배포자 클레이튼 어카운트를 
 * 땡쓰 서비스 관리자 어카운트로 등록
**/
    constructor () public {
        thanksAdmin = msg.sender;
    }
    
/**
 * 근로자 함수
 **/
    function newWorker(string memory workerEmail, string memory partnerLicenseId, address klaytnAcc, string memory workerHashData)
    public payable
    isNewWorker(workerEmail) 
    isAdmin() 
    notZeroSizeKey(workerEmail)
    {
        if(workerMap[workerEmail].isReg == false){
            workers.push(workerEmail);    
        }
        workerMap[workerEmail] = Worker({
            workerEmail : workerEmail,
            partnerLicenseId : partnerLicenseId,
            klaytnAcc : klaytnAcc,
            blackWorkerState : false,
            workerHashData : workerHashData,
            isReg : true,
            serviceFeeRate: 0
        });
        
    }
    
    function editWorker(Worker memory worker) public payable 
        existWorker(worker.workerEmail)
        isAdmin()
        { 
        workerMap[worker.workerEmail] = worker;
    }
    
    // function getWorker(string memory workerEmail) public view returns (Worker memory){
    //     return workerMap[workerEmail];
    // }
 
    function getAllWorker() public view isAdmin() returns (Worker[] memory){
        Worker[] memory allWorkers = new Worker[](workers.length);
        for(uint i=0; i<workers.length;i++){
            allWorkers[i] = workerMap[workers[i]];
        }
        return allWorkers;
    }
/**
 * 파트너사 함수 
 **/
    function newPartner(
        string memory partnerLicenseId,
        address klaytnAcc,
        uint initialDeposit,
        uint depositType,
        uint salaryDay,
        string memory partnerHashData
    ) public payable 
        isNewPartner(partnerLicenseId) 
        isAdmin()
        notZeroSizeKey(partnerLicenseId)
        {
        partners.push(partnerLicenseId);
        partnerMap[partnerLicenseId] = Partner({
            partnerLicenseId : partnerLicenseId,
            klaytnAcc : klaytnAcc,
            initialDeposit : initialDeposit,
            depositType : depositType,
            addDeposit : new uint[](0),
            addDepositDate : new uint[](0),
            salaryDay : salaryDay,
            realtimeDeposit : 0,
            partnerState : 1,
            partnerHashData : partnerHashData,
            isReg : true,
            deposit: new uint[](0)
           
        });
         
    }    
    
    function editPartner(
        string memory partnerLicenseId,
        address klaytnAcc,
        uint initialDeposit,
        uint depositType,
        uint salaryDay,
        uint partnerState,
        string memory partnerHashData
    ) public payable 
        existPartner(partnerLicenseId) 
        isAdmin()
       
        {
        partnerMap[partnerLicenseId].klaytnAcc = klaytnAcc;
        partnerMap[partnerLicenseId].initialDeposit = initialDeposit;
        partnerMap[partnerLicenseId].depositType = depositType;
        partnerMap[partnerLicenseId].salaryDay = salaryDay;
        partnerMap[partnerLicenseId].partnerState = partnerState;
        partnerMap[partnerLicenseId].partnerHashData = partnerHashData;
    }
    // function getPartnerDepositLength(string memory partnerLicenseId) public view returns(uint){
    //     return partnerMap[partnerLicenseId].addDeposit.length;
    // }
    function partnerAddDeposit(string memory partnerLicenseId, uint addDeposit, uint addDepositDate) 
    public payable 
    existPartner(partnerLicenseId){ 
        partnerMap[partnerLicenseId].addDeposit.push(addDeposit);
        partnerMap[partnerLicenseId].addDepositDate.push(addDepositDate);
        partnerMap[partnerLicenseId].realtimeDeposit += addDeposit;
        partnerMap[partnerLicenseId].deposit.push(partnerMap[partnerLicenseId].realtimeDeposit);
        // if(partnerMap[partnerLicenseId].deposit.length == 0){//첫 시작 보증금인지 확인
        //     partnerMap[partnerLicenseId].serviceFeeDebt.push(0);
        //     partnerMap[partnerLicenseId].depositDebt.push(0);
        //     partnerMap[partnerLicenseId].deposit.push(addDeposit);
        //     partnerMap[partnerLicenseId].realtimeDeposit += addDeposit;
            
        // }else{ //첫 시작이 아닌 이용 도중의 보증금 입금
        //     uint tmpDepositDebt = SafeMath.sub(partnerMap[partnerLicenseId].deposit[partnerMap[partnerLicenseId].deposit.length-1], partnerMap[partnerLicenseId].realtimeDeposit);
        //     uint tmpFeeDebt = SafeMath.div(SafeMath.mul(SafeMath.sub(partnerMap[partnerLicenseId].deposit[partnerMap[partnerLicenseId].deposit.length-1], partnerMap[partnerLicenseId].realtimeDeposit), 25), 1000);
        //     uint latestDepositDebt = partnerMap[partnerLicenseId].depositDebt[partnerMap[partnerLicenseId].depositDebt.length-1];
        //     uint latestServiceFeeDebt = partnerMap[partnerLicenseId].serviceFeeDebt[partnerMap[partnerLicenseId].serviceFeeDebt.length-1];
        //     uint tmpTotalDebt = tmpFeeDebt + tmpDepositDebt;
        //     uint latestTotalDebt = latestServiceFeeDebt + latestDepositDebt;
        //     uint totalServiceFeeDebt = tmpFeeDebt + latestServiceFeeDebt;
        //     uint totalDepositDebt = tmpDepositDebt + latestDepositDebt;
        //     emit Deposit(tmpDepositDebt, tmpFeeDebt, latestDepositDebt, latestServiceFeeDebt);
        //     if(tmpTotalDebt + latestTotalDebt <= addDeposit){
        //         //입금액이 이용금액 + 수수료 + 미납보증금 + 미납수수료보다 큰 경우
        //         partnerMap[partnerLicenseId].serviceFeeDebt.push(0);
        //         partnerMap[partnerLicenseId].depositDebt.push(0);
        //         partnerMap[partnerLicenseId].deposit.push(partnerMap[partnerLicenseId].realtimeDeposit+addDeposit-tmpFeeDebt);
        //         partnerMap[partnerLicenseId].realtimeDeposit = partnerMap[partnerLicenseId].realtimeDeposit + addDeposit - tmpFeeDebt;
        //     }else if(tmpTotalDebt + latestTotalDebt > addDeposit && totalServiceFeeDebt <= addDeposit){
        //         //입금액이 미납수수료+ 수수료보다 크지만, 이용금액+수수료+미납보증금+미납수수료보다 작은경우
        //         partnerMap[partnerLicenseId].serviceFeeDebt.push(0);
        //         partnerMap[partnerLicenseId].depositDebt.push(SafeMath.sub(totalDepositDebt,SafeMath.sub(addDeposit,totalServiceFeeDebt)));
        //         partnerMap[partnerLicenseId].deposit.push(partnerMap[partnerLicenseId].realtimeDeposit+addDeposit-totalServiceFeeDebt);
        //         partnerMap[partnerLicenseId].realtimeDeposit = partnerMap[partnerLicenseId].realtimeDeposit + addDeposit - totalServiceFeeDebt;
        //     }else if(totalServiceFeeDebt > addDeposit){
        //         //입금액이 미납수수료 + 수수료보다 작은 경우
        //         partnerMap[partnerLicenseId].serviceFeeDebt.push(totalServiceFeeDebt - addDeposit);
        //         partnerMap[partnerLicenseId].depositDebt.push(totalDepositDebt);
        //         partnerMap[partnerLicenseId].deposit.push(partnerMap[partnerLicenseId].realtimeDeposit);
        //         //partnerMap[partnerLicenseId].realtimeDeposit = partnerMap[partnerLicenseId].realtimeDeposit + addDeposit - totalServiceFeeDebt;
        //     }
            
            
            // if((tmpFeeDebt + tmpDepositDebt )<= addDeposit && partnerMap[partnerLicenseId].depositDebt[partnerMap[partnerLicenseId].depositDebt.length-1] == 0 && partnerMap[partnerLicenseId].serviceFeeDebt[partnerMap[partnerLicenseId].serviceFeeDebt.length-1] == 0 ){
            // //입금액이 이용금액 + 수수료보다 크거나 같은경우
            // //빚이 없는 경우 
            //         partnerMap[partnerLicenseId].serviceFeeDebt.push(0);
            //         partnerMap[partnerLicenseId].depositDebt.push(0);
            //         partnerMap[partnerLicenseId].deposit.push(partnerMap[partnerLicenseId].realtimeDeposit+addDeposit-tmpFeeDebt);
            //         partnerMap[partnerLicenseId].realtimeDeposit = partnerMap[partnerLicenseId].realtimeDeposit + addDeposit - tmpFeeDebt ;
              
            // }else if(tmpFeeDebt <= addDeposit && (tmpFeeDebt + tmpDepositDebt ) > addDeposit && partnerMap[partnerLicenseId].depositDebt[partnerMap[partnerLicenseId].depositDebt.length-1] + partnerMap[partnerLicenseId].serviceFeeDebt[partnerMap[partnerLicenseId].serviceFeeDebt.length-1] > 0 ){
            //     //입금액이 수수료보다 크고, 이용금액 + 수수료보다 작은 경우
            //     //빚이 있던 경우
            //         partnerMap[partnerLicenseId].serviceFeeDebt.push(0);
            //         partnerMap[partnerLicenseId].depositDebt.push(partnerMap[partnerLicenseId].depositDebt[partnerMap[partnerLicenseId].deposit.length-1]+tmpDepositDebt + tmpFeeDebt - addDeposit);
            //         partnerMap[partnerLicenseId].deposit.push(partnerMap[partnerLicenseId].realtimeDeposit+addDeposit-tmpFeeDebt);
            //         partnerMap[partnerLicenseId].realtimeDeposit = partnerMap[partnerLicenseId].realtimeDeposit + addDeposit - tmpFeeDebt ;
                
            // }else if(tmpFeeDebt <= addDeposit && (tmpFeeDebt + tmpDepositDebt ) > addDeposit ){
            //     //입금액이 수수료보다 크고, 이용금액 + 수수료보다 작은 경우
            //     //빚이 없던 경우 
            //         partnerMap[partnerLicenseId].serviceFeeDebt.push(0);
            //         partnerMap[partnerLicenseId].depositDebt.push(partnerMap[partnerLicenseId].depositDebt[partnerMap[partnerLicenseId].deposit.length-1]+tmpDepositDebt + tmpFeeDebt - addDeposit);
            //         partnerMap[partnerLicenseId].deposit.push(partnerMap[partnerLicenseId].realtimeDeposit+addDeposit-tmpFeeDebt);
            //         partnerMap[partnerLicenseId].realtimeDeposit = partnerMap[partnerLicenseId].realtimeDeposit + addDeposit - tmpFeeDebt ;
                
            // }
            // else if(tmpFeeDebt>addDeposit){//입금액이 수수료보다 작은 경우 
            //     partnerMap[partnerLicenseId].serviceFeeDebt.push(partnerMap[partnerLicenseId].serviceFeeDebt[partnerMap[partnerLicenseId].serviceFeeDebt.length-1] - addDeposit);
            //     partnerMap[partnerLicenseId].depositDebt.push(partnerMap[partnerLicenseId].depositDebt[partnerMap[partnerLicenseId].depositDebt.length-1]);
            //     partnerMap[partnerLicenseId].deposit.push(partnerMap[partnerLicenseId].realtimeDeposit);
            //     }
       // }
        
       
    }
    
    function getPartner(string memory partnerLicenseId) public view  isAdmin() returns (Partner memory){// 3 
        return partnerMap[partnerLicenseId];
    }
    
    // function getAllPartnersLicenseId() public view isAdmin() returns (string[] memory){// 4
    //  return partners;
    // }
    
    function getAllPartner() public view isAdmin() returns (Partner[] memory){
        Partner[] memory allPartners = new Partner[](partners.length);
        for(uint i=0; i<partners.length;i++){
            allPartners[i] = partnerMap[partners[i]];
        }
        return allPartners;
    }
   
/**
 * 땡쓰페이 관련 함수
 **/
    
    
    function payRequest(string memory workerEmail, uint payReqAmount,uint payReqDate)
    public payable
    existWorker(workerEmail) 
    //onlyWorkerMyself(workerEmail)
    oneDayOneReq(workerEmail, payReqDate)
    
    {
        workerDatePayMap[workerEmail][payReqDate] = Pay({
            workerEmail: workerEmail,
            payState: 1,
            //workerSalary: salary,
            payReqDate: payReqDate,
            payReqAmount: payReqAmount,
            payDate: 0,
            payAmount: 0,
            repaymentDate: 0,
            repaymentAmount: 0
      
        });
        uint dupCheck = 0; 
        
        for(uint i=0; i<partnerDateWorkerMap[workerMap[workerEmail].partnerLicenseId][payReqDate].length;i++){
            if(keccak256(bytes(partnerDateWorkerMap[workerMap[workerEmail].partnerLicenseId][payReqDate][i])) == keccak256(bytes(workerEmail))){
                dupCheck++;
            }
            
        }
        
        if(dupCheck == 0){
            partnerDateWorkerMap[workerMap[workerEmail].partnerLicenseId][payReqDate].push(workerEmail);
            workerDateMap[workerEmail].push(payReqDate);
        }
    }
    
    function pay(string memory workerEmail, uint payReqDate, uint payAmount,uint payDate)
    public payable 
    haveBalance(workerMap[workerEmail].partnerLicenseId, payAmount)
    onlyPending(workerEmail, payReqDate)
    onlyRequestAmount(workerDatePayMap[workerEmail][payReqDate].payReqAmount, payAmount)
    isAdmin()
    {
        uint serviceFee = SafeMath.div(SafeMath.mul(payAmount, workerMap[workerEmail].serviceFeeRate), 1000);
        workerDatePayMap[workerEmail][payReqDate].payAmount=payAmount;
        workerDatePayMap[workerEmail][payReqDate].payDate=payDate;
        workerDatePayMap[workerEmail][payReqDate].payState = 2;
        partnerMap[workerMap[workerEmail].partnerLicenseId].realtimeDeposit -= payAmount;
        partnerMap[workerMap[workerEmail].partnerLicenseId].realtimeDeposit -= serviceFee;
    }
     function cancelPay(string memory workerEmail, uint payReqDate)
    public payable {
        workerDatePayMap[workerEmail][payReqDate].payState = 5;
    }
    
    // function repayment(string memory workerEmail, uint payReqDate, uint repaymentAmount,uint repaymentDate)  
    // public payable
    // existWorker(workerEmail)
    // isAdmin()
    // repayable(workerEmail, payReqDate) {
    //     workerDatePayMap[workerEmail][payReqDate].repaymentAmount=repaymentAmount;
    //     workerDatePayMap[workerEmail][payReqDate].repaymentDate=repaymentDate;
    //   // workerDatePayMap[workerEmail][payReqDate].repayment += repaymentAmount;
    //     // if(workerDatePayMap[workerEmail][payReqDate].repayment>=workerDatePayMap[workerEmail][payReqDate].advancedPay){
    //     //     workerDatePayMap[workerEmail][payReqDate].payState = 4;
    //     // }
    //     if(workerMap[workerEmail].blackWorkerState == true){
    //         workerMap[workerEmail].blackWorkerState = false;
    //     }
    //     partnerMap[workerMap[workerEmail].partnerLicenseId].realtimeDeposit += repaymentAmount;
    // }
    // function overdue(string memory workerEmail, uint payReqDate) 
    // public payable 
    // existWorker(workerEmail) 
    //  notRepay(workerEmail, payReqDate)
    // //isAdmin()
    // {
    //     workerDatePayMap[workerEmail][payReqDate].payState = 3;
    //     workerMap[workerEmail].blackWorkerState = true;
    // }
    
    // function getPay(string memory workerEmail, string memory date)//근로자와 이용월을 입력받아, 근로자의 해당월 이용 이력 조회
    // public view 
    // isAdmin()
    // existWorker(workerEmail) 
    // returns(Pay memory){
    //     return workerDatePayMap[workerEmail][date];
    // }
   
    // function getPayByPartner(string memory partnerLicenseId, uint payReqDate) 
    //     public view 
    //     isAdmin() 
    //     existPartner(partnerLicenseId)
    //     returns(Pay[] memory){
    //     uint i = partnerDateWorkerMap[partnerLicenseId][payReqDate].length;
    //     Pay[] memory pays = new Pay[](i);
    //     for(uint j=0;j<i;j++){
    //         pays[j] = workerDatePayMap[partnerDateWorkerMap[partnerLicenseId][payReqDate][j]][payReqDate];
    //     }
    //     return pays;
    // }
    function getPayByPartnerAndDate(string memory partnerLicenseId, uint fromDate, uint toDate)
        public view 
        isAdmin() 
        existPartner(partnerLicenseId)
        returns(Pay[] memory){
        uint i = 0;
        uint l = 0;
        uint index = 0;
        for(uint j = fromDate; j<=toDate; j++){
            i += partnerDateWorkerMap[partnerLicenseId][j].length;        
        }
        Pay[] memory pays = new Pay[](i);
        
        for(uint k = fromDate; k<=toDate; k++){
            l = partnerDateWorkerMap[partnerLicenseId][k].length;
                for(uint m = 0; m<l;m++){
                    if(workerDatePayMap[partnerDateWorkerMap[partnerLicenseId][k][m]][k].payState != 0){
                        pays[index] = workerDatePayMap[partnerDateWorkerMap[partnerLicenseId][k][m]][k];
                        index++;
                    }
                }
            
        }
        return pays;
        
    }
    function getPayByWorker(string memory workerEmail) 
        public view 
        isAdmin() 
        existWorker(workerEmail)
        returns(Pay[] memory){
        uint i = workerDateMap[workerEmail].length;
        Pay[] memory pays = new Pay[](i);
        for(uint j=0;j<i;j++){
            pays[j] = workerDatePayMap[workerEmail][workerDateMap[workerEmail][j]];
        }
        return pays;
    }
    function getPayByWorkerAndDate(string memory workerEmail, uint fromDate, uint toDate)
        public view
        isAdmin()
        existWorker(workerEmail)
        returns(Pay[] memory)
        {
            uint i = 0;
            for(uint j=0; j<workerDateMap[workerEmail].length;j++){
                if(workerDateMap[workerEmail][j]>=fromDate && workerDateMap[workerEmail][j]<=toDate){
                    i++;
                }
            }
            Pay[] memory pays = new Pay[](i);
            uint l=0;
            for(uint k=0; k<workerDateMap[workerEmail].length;k++){
                if(workerDateMap[workerEmail][k]>=fromDate && workerDateMap[workerEmail][k]<=toDate){
                    pays[l]=workerDatePayMap[workerEmail][workerDateMap[workerEmail][k]];
                    l++;
                }
            }
            return pays;
        }
   
}