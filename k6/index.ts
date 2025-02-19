import { group, sleep } from "k6"
import NewClientRegistering from "./scenarios/New-Client-Registering.ts"

export default() => {
    group("Group 1", () => {
        NewClientRegistering()
    });

    sleep(1);
}