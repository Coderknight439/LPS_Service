FROM node:16.13.0
ENV NODE_ENV development
# Copy app files
WORKDIR /app/frontend
COPY package.json /app/frontend

#RUN npm install

EXPOSE 3000
CMD ["npm", "start"]