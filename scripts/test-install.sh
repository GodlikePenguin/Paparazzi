#!/bin/bash

set -euxo pipefail

TARBALL=$(npm pack)
npm install -g "$TARBALL"
# Verify the command passes successfully
paparazzi-cli --version
