# 1. Alap kép (Node.js környezet)
FROM node:18

# 2. Munkakönyvtár létrehozása a konténeren belül
WORKDIR /usr/src/app

# 3. Függőségek másolása és telepítése
COPY package*.json ./
RUN npm install

# 4. A teljes projektkód másolása
COPY . .

# 5. A port, amin a szerverünk hallgatózik
EXPOSE 3000

# 6. Az alkalmazás indítása
CMD ["node", "server.js"]