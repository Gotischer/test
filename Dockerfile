FROM node:20-alpine

# Crear el directorio de la app
WORKDIR /usr/src/app

# Copiar el proxy.js al contenedor
COPY proxy.js .

# Exponer el puerto por defecto
EXPOSE 8080

# Iniciar el servidor proxy
CMD ["node", "proxy.js"]
