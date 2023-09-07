FROM node:18

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# install project dependencies
RUN npm install

# build app for productiocln with minification
RUN npm run build
CMD ["npm", "run", "dev"]
