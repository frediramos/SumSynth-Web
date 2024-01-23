#!/usr/bin/env bash

BIN=/usr/local/bin

create_symlink () {
    sudo ln -sf $1 $2
}

git submodule update --init


# SummSynth ------------------------------
echo "[-] SummSynth"
echo "Installing Haskell Stack"
curl -sSL https://get.haskellstack.org/ | sh

echo "Building SumSynth..."

SUMSYNTH_LINK="spec2json"
SUMSYNTH_PATH="SumSynth/sumsynth"
SUMSYNTH_EXE=$(cd ${SUMSYNTH_PATH}; stack build && find .stack-work/dist -type f -name "sumsynth-exe" | head -n 1)

create_symlink "$(pwd)/${SUMSYNTH_PATH}/${SUMSYNTH_EXE}" "${BIN}/${SUMSYNTH_LINK}"
echo "Symlink (${SUMSYNTH_LINK}) to SumSynth created in ${BIN}"
echo "[-] SumSynth Installed Sucessfully"


# JsonParser ------------------------------
echo "[-] JsonParser"
echo "Installing dependencies..."

$(which python3) -m pip install pycparser==2.21
JSONPARSER_LINK="json2summ"
JSONPARSER_EXE="SumSynth/parsing/json_parser.py"
create_symlink "$(pwd)/${JSONPARSER_EXE}" "${BIN}/${JSONPARSER_LINK}"
echo "Symlink (${JSONPARSER_LINK}) to JsonParser created in ${BIN}"


if command -v ${SUMSYNTH_LINK} &> /dev/null \
    && command -v ${JSONPARSER_LINK} &> /dev/null
then 
    echo "Everything installed!"
else
    echo "Some symlinks may not work..."
    echo "Try running the commands:"
    echo "${SUMSYNTH_LINK}"
    echo "${JSONPARSER_LINK}"
fi