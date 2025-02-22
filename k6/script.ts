import { group, sleep } from "k6"
import NewClientRegistering from "./scenarios/New-Client-Registering.ts"

export let options = {
    vus: 1,
    duration: '60s',
  };
  
export default() => {
    group("Group 1", () => {
        NewClientRegistering()
    });

    sleep(1);
}