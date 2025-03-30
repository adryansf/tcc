import { group, sleep } from "k6";
import { Cliente, Gerente } from "./entities/entities.ts";
import NewClientRegistering from "./scenarios/New-Client-Registering.ts";
import ClientDoingDeposit from "./scenarios/Client-Doing-Deposit.ts";
import ClientDoingWithdraw from "./scenarios/Client-Doing-Withdraw.ts";
import ClientVerifyingTransfers from "./scenarios/Client-Verifying-Transfers.ts";
import ClientDoingTransfer from "./scenarios/Client-Doing-Transfer.ts";
import {
  GetClientesToTest,
  GetGerentesToTest,
} from "./BackendAdapter/BackendAdapter.ts";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.6.0/index.js";
import ManagerCreatingAccount from "./scenarios/Manager-Creating-Account.ts";
import ManagerVerifyingTransfers from "./scenarios/Manager-Verifying-Transfers.ts";

const TEST_SCENARIO = "load";

const scenarios = {
  load: {
    executor: "ramping-vus",
    startVUs: 100,
    stages: [
      { duration: "90s", target: 100 }, // Mantém 100 VUs por 30s
      { duration: "0s", target: 200 }, // Sobe imediatamente para 200 VUs
      { duration: "90s", target: 200 }, // Mantém 200 VUs por 30s
      { duration: "0s", target: 300 }, // Sobe imediatamente para 300 VUs
      { duration: "90s", target: 300 }, // Mantém 300 VUs por 30s
      { duration: "0s", target: 400 }, // Sobe imediatamente para 400 VUs
      { duration: "90s", target: 400 }, // Mantém 400 VUs por 30s
      { duration: "0s", target: 500 }, // Sobe imediatamente para 500 VUs
      { duration: "90s", target: 500 }, // Mantém 500 VUs por 30s
    ],
  },
  stress: {
    executor: "ramping-vus",
    startVUs: 1000,
    stages: [
      { duration: "1m", target: 1500 }, // Sobe para 1500 usuários
      { duration: "1m", target: 2000 }, // Sobe para 2000 usuários
      { duration: "1m", target: 2500 }, // Continua subindo até 5000
      { duration: "1m", target: 3000 },
      { duration: "1m", target: 3500 },
      { duration: "1m", target: 4000 },
      { duration: "1m", target: 4500 },
      { duration: "13m", target: 5000 }, // Mantém 5000 usuários até o fim
    ],
  },
  spike: {
    executor: "ramping-vus",
    stages: [
      { duration: "10s", target: 50 }, // Sobe de 50 para 3000 usuários em 10s
      { duration: "5m", target: 3000 }, // Mantém 3000 usuários ativos por 5 minutos
      { duration: "5m", target: 50 }, // Reduz gradualmente para 50 usuários
    ],
  },
  soak: {
    executor: "constant-vus",
    vus: 10,
    duration: "15m",
  },
};

export let options = {
  scenarios: {
    [TEST_SCENARIO]: scenarios[TEST_SCENARIO],
  },
  vus: 1,
};

export function setup(): MainPayload {
  return { clientes: GetClientesToTest(500), gerentes: GetGerentesToTest(10) };
}

export default ({ clientes, gerentes }: MainPayload) => {
  group("Clientes", () => {
    var cliente = NewClientRegistering();

    if (cliente !== null) {
      var resultadoDeposito = ClientDoingDeposit(cliente!, 1000);
      if (resultadoDeposito) {
        ClientDoingWithdraw(cliente!, 500);
        ClientVerifyingTransfers(cliente!);
        ClientDoingTransfer(cliente!, randomItem(clientes).cpf, 10);
      }
    }
  });

  group("Gerentes", () => {
    ManagerCreatingAccount(randomItem(gerentes), randomItem(clientes).cpf);
    ManagerVerifyingTransfers(randomItem(gerentes), randomItem(clientes).cpf);
  });
};

export interface MainPayload {
  clientes: Cliente[];
  gerentes: Gerente[];
}
