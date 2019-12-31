#!/bin/sh

set -e

echo $GOOGLE_SERVICE_KEY | base64 --decode > "$HOME"/gcloud.json


gcloud auth activate-service-account --key-file="$HOME"/gcloud.json --project birthday-weekly
gcloud auth configure-docker

gcloud builds submit --tag gcr.io/birthday-weekly/birthday-weekly

VERSION=$(gcloud builds list | grep SUCCESS | sed -n 2p | awk '{print $1;}')
sentry-cli releases new -p birthday-weekly "$VERSION"
sentry-cli releases set-commits --auto "$VERSION"

gcloud beta run deploy birthday-weekly \
  --image gcr.io/birthday-weekly/birthday-weekly \
  --region us-east1 \
  --platform managed \
  --allow-unauthenticated

sentry-cli releases finalize "$VERSION"