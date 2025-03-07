import { group, sleep } from "k6"
import { Cliente, Gerente } from './entities/entities.ts';
import NewClientRegistering from "./scenarios/New-Client-Registering.ts"
import ClientDoingDeposit from "./scenarios/Client-Doing-Deposit.ts";
import ClientDoingWithdraw from "./scenarios/Client-Doing-Withdraw.ts";
import ClientVerifyingTransfers from "./scenarios/Client-Verifying-Transfers.ts";
import ClientDoingTransfer from "./scenarios/Client-Doing-Transfer.ts";
import { GetClientesToTest, GetGerentesToTest } from "./BackendAdapter/BackendAdapter.ts";
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import ManagerCreatingAccount from "./scenarios/Manager-Creating-Account.ts";
import ManagerVerifyingTransfers from "./scenarios/Manager-Verifying-Transfers.ts";

const TEST_SCENARIO = "spike"

const scenarios = {
    load: {
        executor: 'ramping-vus',
        startVUs: 50,
        stages: [
            { duration: '30s', target: 100 },   // Aumenta para 100 usuários em 30s
            { duration: '30s', target: 150 },   // Aumenta para 150 usuários em 30s
            { duration: '30s', target: 200 },   // Aumenta para 200 usuários em 30s
            { duration: '30s', target: 250 },   // Aumenta para 250 usuários em 30s
            { duration: '30s', target: 300 },   // Continua subindo até 1000
            { duration: '30s', target: 350 },
            { duration: '30s', target: 400 },
            { duration: '30s', target: 450 },
            { duration: '30s', target: 500 },
            { duration: '30s', target: 550 },
            { duration: '30s', target: 600 },
            { duration: '30s', target: 650 },
            { duration: '30s', target: 700 },
            { duration: '30s', target: 750 },
            { duration: '30s', target: 800 },
            { duration: '30s', target: 850 },
            { duration: '30s', target: 900 },
            { duration: '30s', target: 950 },
            { duration: '6m', target: 1000 }, // Mantém 1000 usuários até o fim do teste
        ],
        duration: '15m',
    },
    stress: {
        executor: 'ramping-vus',
        startVUs: 1000,
        stages: [
            { duration: '1m', target: 1500 },   // Sobe para 1500 usuários
            { duration: '1m', target: 2000 },   // Sobe para 2000 usuários
            { duration: '1m', target: 2500 },   // Continua subindo até 5000
            { duration: '1m', target: 3000 },
            { duration: '1m', target: 3500 },
            { duration: '1m', target: 4000 },
            { duration: '1m', target: 4500 },
            { duration: '13m', target: 5000 },   // Mantém 5000 usuários até o fim
        ],
        duration: '20m',
    },
    spike: {
        executor: 'ramping-vus',
        stages: [
            { duration: '10s', target: 50 },  // Sobe de 50 para 3000 usuários em 10s
            { duration: '5m', target: 3000 },   // Mantém 3000 usuários ativos por 5 minutos
            { duration: '5m', target: 50 },     // Reduz gradualmente para 50 usuários
        ],
        duration: '10m10s',
    },
    soak: {
        executor: 'constant-vus',
        vus: 1000,
        duration: '12h', // Mantém carga de 1000 usuários ao longo de 12 horas
    },
};

export let options = {
    scenarios: {
        [TEST_SCENARIO]: scenarios[TEST_SCENARIO],
    },
    vus: 1,
    duration: '60s',
};
  

export function setup(): MainPayload {
    return {clientes: GetClientesToTest(500), gerentes: GetGerentesToTest(10)};
}

export default({clientes, gerentes}: MainPayload) => {
    group("Clientes", () => {
        var cliente = NewClientRegistering();
        ClientDoingDeposit(cliente, 1000);
        ClientDoingWithdraw(cliente, 500);
        ClientVerifyingTransfers(cliente);
        ClientDoingTransfer(cliente, randomItem(clientes).cpf, 100);
    });

    group("Gerentes", () => {
        ManagerCreatingAccount(randomItem(gerentes), randomItem(clientes).cpf);
        ManagerVerifyingTransfers(randomItem(gerentes), randomItem(clientes).cpf);
    });

    sleep(1);
}


export interface MainPayload {
    clientes: Cliente[];
    gerentes: Gerente[];
}