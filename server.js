const express = require("express");
const cors = require("cors");

const { spawn } = require("child_process");

const http = require("http");

const app = express();
const server = http.createServer(app);

const port = 3000;

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/play', express.static('play'))

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.post('/move', (req, res) => {
    const key = req.headers.key;


    if (key !== "66db2261f432a09ba3ff83f4aa85f75af4110f51041517c13d4479a450c385e0") {
        res.status(401).send("Chave inválida")
        return;
    }

    const fen = req.body.fen;

    const capi = spawn("./capizero", [], { stdio: ['pipe', 'pipe', 'pipe'], shell: true });

    capi.stdin.write(`fen ${fen}\n`);

    if (req.body.depth === undefined){
        capi.stdin.write(`tempo ${req.body.time}\n`);
    }
    else{
        capi.stdin.write(`prof ${req.body.depth}\n`);    
    }
    capi.stdin.write('calc');
    capi.stdin.end();

    const pvs = []

    capi.stdout.on('data', (data) => {
        const outputs = { nps: 0, nodes: 0, time: 0, pvs: [], move: "", fen: fen };

        const lines = data.toString().split('\n');

        lines.forEach((line) => {
            if (line.length === 0) {
                ;
            }
            else if (!isNaN(line.split(" ")[0])) {
                pvs.push(line);
            }
            else if (line.includes("Lance do computador")) {
                const subs = line.split(" ");
                outputs.move = subs[3];
            }
            else if (line.includes("Tempo gasto")) {
                const subs = line.split(" ");
                outputs.time = parseInt(subs[2]);
            }
            else if (line.includes("Lances por segundo")) {
                const subs = line.split(" ");
                outputs.nps = parseInt(subs[3]);
                outputs.nodes = (outputs.time / 1000) * outputs.nps;
                outputs.pvs = pvs;

                res.send(outputs);

                capi.kill();
            }
        });
    });
});

server.listen(port, () => {
    console.log(`Servidor está no ar no ar em http://localhost:${port}`);
})
