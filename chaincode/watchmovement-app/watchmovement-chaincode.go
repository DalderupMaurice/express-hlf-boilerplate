package main

/* Imports  
* 4 utility libraries for handling bytes, reading and writing JSON, 
formatting, and string manipulation  
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts  
*/ 
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

/* Define Watch Movement structure, with 4 properties.  
Structure tags are used by encoding/json library
*/
type WatchMovement struct {
	Transporter string `json:"transporter"`
	Timestamp string `json:"timestamp"`
	Location  string `json:"location"`
	Holder  string `json:"holder"`
}

/*
 * The Init method *
 called when the Smart Contract "watchmovement-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function 
 -- see initLedger()
 */
func (s *WatchMovement) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "watchmovement-chaincode"
 The app also specifies the specific smart contract function to call with args
 */
func (s *WatchMovement) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "queryWatchMovement" {
		return s.queryWatchMovement(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordWatchMovement" {
		return s.recordWatchMovement(APIstub, args)
	} else if function == "queryAllWatchMovement" {
		return s.queryAllWatchMovement(APIstub)
	} else if function == "changeWatchMovementHolder" {
		return s.changeWatchMovementHolder(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 * The queryWatchMovement method *
Used to view the records of one particular watch movement
It takes one argument -- the key for the watch movement in question
 */
func (s *WatchMovement) queryWatchMovement(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	watchmovementAsBytes, _ := APIstub.GetState(args[0])
	if watchmovementAsBytes == nil {
		return shim.Error("Could not locate watch movement")
	}
	return shim.Success(watchmovementAsBytes)
}

/*
 * The initLedger method *
Will add test data (10 watch movements)to our network
 */
func (s *WatchMovement) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	watchmovement := []WatchMovement{
		WatchMovement{Transporter: "ERC2", Location: "67.0006, -70.5476", Timestamp: "1504054225", Holder: "Victor"},
		WatchMovement{Transporter: "HVD8", Location: "91.2395, -49.4594", Timestamp: "1504057825", Holder: "Sophia"},
		WatchMovement{Transporter: "JM01", Location: "58.0148, 59.01391", Timestamp: "1493517025", Holder: "Joseph"},
		WatchMovement{Transporter: "MD32", Location: "-45.0945, 0.7949", Timestamp: "1496105425", Holder: "Amelia"},
		WatchMovement{Transporter: "BD87", Location: "-107.6043, 19.5003", Timestamp: "1493512301", Holder: "Ceasar"},
		WatchMovement{Transporter: "SDA2", Location: "-155.2304, -15.8723", Timestamp: "1494117101", Holder: "Yoon"},
		WatchMovement{Transporter: "B1M0", Location: "103.8842, 22.1277", Timestamp: "1496104301", Holder: "Sam"},
		WatchMovement{Transporter: "JW52", Location: "-132.3207, -34.0983", Timestamp: "1485066691", Holder: "Masse"},
		WatchMovement{Transporter: "028Z", Location: "153.0054, 12.6429", Timestamp: "1485153091", Holder: "Charlotte"},
		WatchMovement{Transporter: "UYIZ", Location: "51.9435, 8.2735", Timestamp: "1487745091", Holder: "Omar"},
	}

	i := 0
	for i < len(watchmovement) {
		fmt.Println("i is ", i)
		watchmovementAsBytes, _ := json.Marshal(watchmovement[i])
		APIstub.PutState(strconv.Itoa(i+1), watchmovementAsBytes)
		fmt.Println("Added", watchmovement[i])
		i = i + 1
	}

	return shim.Success(nil)
}

/*
 * The recordWatchMovement method *
Watch Movement producers like Alex would use to record each of his watch movements. 
This method takes in five arguments (attributes to be saved in the ledger). 
 */
func (s *WatchMovement) recordWatchMovement(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	var watchmovement = WatchMovement{ Transporter: args[1], Location: args[2], Timestamp: args[3], Holder: args[4] }

	watchmovementAsBytes, _ := json.Marshal(watchmovement)
	err := APIstub.PutState(args[0], watchmovementAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record watch movement: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The queryAllWatchMovement method *
allows for assessing all the records added to the ledger(all watch movements)
This method does not take any arguments. Returns JSON string containing results. 
 */
func (s *WatchMovement) queryAllWatchMovement(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllWatchmMovement:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
 * The changeWatchMovementHolder method *
The data in the world state can be updated with who has possession. 
This function takes in 2 arguments, watchmovement id and new holder name. 
 */
func (s *WatchMovement) changeWatchMovementHolder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	watchmovementAsBytes, _ := APIstub.GetState(args[0])
	if watchmovementAsBytes == nil {
		return shim.Error("Could not locate watch movement")
	}
	watchmovement := WatchMovement{}

	json.Unmarshal(watchmovementAsBytes, &watchmovement)

	// Normally check that the specified argument is a valid holder of watch movement
	// we are skipping this check for this example
	watchmovement.Holder = args[1]

	watchmovementAsBytes, _ = json.Marshal(watchmovement)
	err := APIstub.PutState(args[0], watchmovementAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change watch movement holder: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * main function *
calls the Start function 
The main function starts the chaincode in the container during instantiation.
 */
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(WatchMovement))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}