#!/bin/bash


# Exit on first error
set -e


# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1


# Global config variables
export CHANNEL_NAME="mychannel"
export CHAINCODE_NAME="myChain"
export CHAINCODE_PATH="../chaincode/node/myChain"
export ORDERER_ADDR="orderer.example.com:7050"


# Local vars
starttime=$(date +%s) # timer
versionNumber=$RANDOM # random versioning
rootDir=$(dirname $(dirname "$PWD")) # Get root dir of project
basicNetworkDir="$rootDir/basic-network" # dir of basic network


# See if basic network is present
if [ -d "$basicNetworkDir" ]; then
  # launch network; create channel and join peer to channel
  cd $basicNetworkDir
  ./start.sh
else
  printf "%40s\n" "$(tput setaf 1)Basic network was not found.$(tput sgr0)"
  exit 0
fi


# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger
docker-compose -f ./docker-compose.yml up -d cli


# Default args
arg1="CORE_PEER_LOCALMSPID=Org1MSP"
arg2="CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"


# Installing the chaincode --> ../../../wse-odb absolute path doesn't work
docker exec -e $arg1 -e $arg2 cli peer chaincode install -l node -n $CHAINCODE_NAME -v $versionNumber -p '../../../wse-odb'


# Instantiate the chaincode (Calling the Init function)
docker exec -e $arg1 -e $arg2 cli peer chaincode instantiate -l node -n $CHAINCODE_NAME -v $versionNumber -C $CHANNEL_NAME -c '{"Args":["empty"]}' -o $ORDERER_ADDR
sleep 10


# Invoking instantiate function
# docker exec -e $arg1 -e $arg2  cli peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"initLedger","Args":[""]}'
# sleep 10
printf "\n%40s\n" "$(tput setaf 4)Chaincode $CHAINCODE_NAME version $versionNumber installed and initiated$(tput sgr0)"



# Testing commands
docker exec -e $arg1 -e $arg2  cli peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"createCourse","Args":["course-1","myCourseName","myReference","myWebsite","myCharacteristics","myCompetences","start","providerId","true"]}'
printf "\n%40s\n" "$(tput setaf 4) Create Course executed $(tput sgr0)"
sleep 3

docker exec -e $arg1 -e $arg2  cli peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"createModule","Args":["module-1","course-1","myModule1","myReference","myCredits","myContent","myHours"]}'
printf "\n%40s\n" "$(tput setaf 4) Create Module for course-1 executed $(tput sgr0)"
sleep 3

docker exec -e $arg1 -e $arg2  cli peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"createAccreditation","Args":["accreditation-1","course-1"]}'
printf "\n%40s\n" "$(tput setaf 4) Create accreditation executed $(tput sgr0)"
sleep 3

docker exec -e $arg1 -e $arg2  cli peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"revokeAccreditation","Args":["accreditation-1"]}'
printf "\n%40s\n" "$(tput setaf 4) Revoked accreditation executed $(tput sgr0)"
sleep 3

docker exec -e $arg1 -e $arg2  cli peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"queryCourse","Args":["course-1"]}'
printf "\n%40s\n" "$(tput setaf 4) Query Course executed $(tput sgr0)"
sleep 1

docker exec -e $arg1 -e $arg2  cli peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c '{"function":"queryAllCourses","Args":[""]}'
printf "\n%40s\n" "$(tput setaf 4) Queried all courses executed $(tput sgr0)"
sleep 1






printf "\n%40s\n" "$(tput setaf 2)Total setup execution time : $(($(date +%s) - starttime)) seconds.$(tput sgr0)"
