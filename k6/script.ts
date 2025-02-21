import { group, sleep } from "k6"
import NewClientRegistering from "./scenarios/New-Client-Registering.ts"

export let options = {
    vus: 10,
    duration: '30s',
    ext: {
      loadimpact: {
        projectID: 123456,  // Se estiver usando LoadImpact (opcional)
      },
    },
  };
  
export default() => {
    group("Group 1", () => {
        NewClientRegistering()
    });

    sleep(1);
}