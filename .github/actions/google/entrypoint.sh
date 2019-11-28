#!/bin/sh

set -e

echo $GOOGLE_SERVICE_KEY | base64 --decode > "$HOME"/gcloud.json

gcloud auth activate-service-account --key-file="$HOME"/gcloud.json --project birthday-weekly
gcloud auth configure-docker

gcloud builds submit --tag gcr.io/birthday-weekly/birthday-weekly

gcloud beta run deploy birthday-weekly \
  --image gcr.io/birthday-weekly/birthday-weekly \
  --region us-east1 \
  --platform managed \
  --allow-unauthenticated

gcloud beta run deploy birthday-weekly-scheduled \
  --image gcr.io/birthday-weekly/birthday-weekly \
  --region us-east1 \
  --platform managed \