#!/bin/bash


# Exit on first error
set -e


# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1


# Global config variables
export CHANNEL_NAME="mychannel"
export CHAINCODE_NAME="watchmovement-app"
export ORDERER_ADDR="orderer.example.com:7050"


# Local vars
starttime=$(date +%s)
versionNumber=$RANDOM
frontendDirectory="../$CHAINCODE_NAME/src/services/"
basicNetworkFolder="../../basic-network"


# See if basic network is present
if [ -d "$basicNetworkFolder" ]; then
  # launch network; create channel and join peer to channel
  cd ../../basic-network
  ./start.sh
else
  printf "%40s\n" "$(tput setaf 1)Basic network was not found.$(tput sgr0)"
  exit 0
fi


# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger with our 10 cars
docker-compose -f ./docker-compose.yml up -d cli


# Default args
arg1="CORE_PEER_LOCALMSPID=Org1MSP"
arg2="CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"


# Installing the chaincode
docker exec -e $arg1 -e $arg2 cli peer chaincode install -n $CHAINCODE_NAME -v $versionNumber -p github.com/$CHAINCODE_NAME


# Instantiate the chaincode (Calling the Init function)
docker exec -e $arg1 -e $arg2 cli peer chaincode instantiate -C $CHANNEL_NAME -n $CHAINCODE_NAME -v $versionNumber -c '{"Args":[""]}'
sleep 10


# Invoking instantiate function
docker exec -e $arg1 -e $arg2  cli peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"initLedger","Args":[""]}'
printf "\n%40s\n" "$(tput setaf 4)Chaincode $CHAINCODE_NAME version $versionNumber installed and initiated$(tput sgr0)"


# See if frontend service layer exists and admin can be enrolled + user can be registered
if [ -e "$frontendDirectory/enrollAdmin.js" ] && [ -e "$frontendDirectory/registerUser.js" ]; then
  cd $frontendDirectory
  node enrollAdmin.js
  sleep 5
  node registerUser.js
else
  printf "%40s\n" "$(tput setaf 1)Could not enroll admin and/or register user. 'enrollAdmin.js' and/or 'registerUser.js' not found in '$frontendDirectory'.$(tput sgr0)"
fi


printf "\n%40s\n" "$(tput setaf 2)Total setup execution time : $(($(date +%s) - starttime)) seconds.$(tput sgr0)"
