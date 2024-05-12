# Set the base image for subsequent instructions
FROM node:14

LABEL maintainer="fuhanfeng@linhuiba.com"

# Install RSYNC
RUN apt-get update -y && apt-get install rsync -y
