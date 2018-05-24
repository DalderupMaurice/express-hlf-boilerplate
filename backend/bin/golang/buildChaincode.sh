#!/usr/bin/env bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# Vars for readability
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
LIME_YELLOW=$(tput setaf 190)
BLUE=$(tput setaf 4)
NORMAL=$(tput sgr0)
REVERSE=$(tput smso)

# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

PROJECT_NAME="hlf-first-app"
starttime=$(date +%s)

# Move Go files to $GOPATH/src to compile it
printf "${GREEN}Copying Go files from '$PROJECT_NAME' to '$GOPATH' ${NORMAL} \n"
rm -rf $GOPATH/src/$PROJECT_NAME
mkdir $GOPATH/src/$PROJECT_NAME
cp -af ../chaincode/golang/* $GOPATH/src/$PROJECT_NAME/

printf "${GREEN}Building go.. ${NORMAL} \n"
cd $GOPATH/src/$PROJECT_NAME/
#go get -u --tags nopkcs11 github.com/hyperledger/fabric/core/chaincode/shim
#go build --tags nopkcs11
#./chaincode


#printf "Start by installing required packages run 'npm install'\n"
#printf "Then run 'node enrollAdmin.js', then 'node registerUser'\n\n"

# Clear formatting
printf "\n%40s\n" "${BLUE}Total setup execution time : $(($(date +%s) - starttime)) secs ... ${NORMAL}"


