FROM google/cloud-sdk

RUN curl -sL https://sentry.io/get-cli/ | bash

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]
