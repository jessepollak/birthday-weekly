#!/bin/sh

set -e

echo "${{ secrets.GoogleServiceKey }}" | base64 --decode > "$HOME"/gcloud.json

gcloud auth activate-service-account --key-file="$HOME"/gcloud.json --project birthday-weekly
gcloud auth configure-docker

gcloud builds submit --tag gcr.io/birthday-weekly/master

gcloud beta run deploy birthday-weekly \
  --image birthday-weekly/master \
  --region us-east1 \
  --platform managed \
  --allow-unauthenticated

gcloud beta run deploy birthday-weekly-scheduled \
  --image birthday-weekly/master \
  --region us-east1 \
  --platform managed \