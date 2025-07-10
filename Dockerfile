FROM node:18
WORKDIR /app/src
COPY package*.json ./
RUN cd .. && npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]