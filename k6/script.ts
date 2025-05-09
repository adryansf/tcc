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

const TEST_SCENARIO = "stress";

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
    startVUs: 100,
    stages: [
      { duration: "60s", target: 100 }, 
      { duration: "0s", target: 200 },
      { duration: "60s", target: 200 }, 
      { duration: "0s", target: 300 },
      { duration: "60s", target: 300 }, 
      { duration: "0s", target: 400 },
      { duration: "60s", target: 400 }, 
      { duration: "0s", target: 500 },
      { duration: "60s", target: 500 }, 
      { duration: "0s", target: 600 },
      { duration: "60s", target: 600 }, 
      { duration: "0s", target: 700 },
      { duration: "60s", target: 700 }, 
      { duration: "0s", target: 800 },
      { duration: "60s", target: 800 }, 
      { duration: "0s", target: 900 },
      { duration: "60s", target: 900 }, 
      { duration: "0s", target: 1000 },
      { duration: "60s", target: 1000 }, 
    ],
  },
  spike: {
    executor: "ramping-vus",
    startVUs: 50,
    stages: [
      { duration: "60s", target: 50 },
      { duration: "10s", target: 1500 },
      { duration: "5m", target: 50 }, 
    ],
  }
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
