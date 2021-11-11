FROM golang

WORKDIR /

COPY . .

RUN go mod download
ENV PORT 9092
EXPOSE 9092
CMD [ "go", "run", "main.go" ]