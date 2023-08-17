FROM node:20-alpine

ENV BACKEND_HOST=localhost:8080
COPY ./build /app
RUN npm install -g serve

CMD ["serve", "-s", "app"]