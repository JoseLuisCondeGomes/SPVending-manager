import { MachineRepository } from "../../../domain/ports/MachineRepository";
import { Machine, MachineApi } from "../../../domain/entities/models/machine";
import { API_PREFIX, BASE_URL_SERVER, PATH_PREFIX } from "../../../utilities/defines/api/api-routes";
import { mapMachineToApi } from "../../mappers/ToApi/MachineMapperToApi";
import { authHandler } from "../Auth/AuthHandler";
import { MachineApiResponse } from "../../../domain/entities/api-models/apiResponse";
import { DEMO_MODE } from "../../../utilities/defines/demo";
import {
    addDemoMachine,
    deleteDemoMachine,
    findDemoMachine,
    getDemoMachineList,
    modifyDemoMachine
} from "../../demo/demoStore";

export class MachineRepositoryHttp implements MachineRepository{
    private BASEURL = BASE_URL_SERVER + API_PREFIX + PATH_PREFIX.machinesPath;

    async findMachineByUuid(machineUuid: string): Promise<MachineApi | null> {
        if (DEMO_MODE) return findDemoMachine(machineUuid);

        const response = await authHandler(`${this.BASEURL}/${machineUuid}`, {credentials: "include"});
        return await response;
    }

    async getAllMachines(page:number): Promise<MachineApiResponse> {
        if (DEMO_MODE) return getDemoMachineList();

        const response = await fetch(`${this.BASEURL}?page=${page}`, {credentials: "include"});
        if (response.ok) return await response.json();
        if (response.status === 401) throw new Error(`${response.status}`);
        if (response.status === 404) return {content:[],page:{number:0,size:0,totalElements:0,totalPages:0}};
        throw new Error(`Error fetching machines: ${response.statusText}`);
    }

    async addMachine(machine: Omit<Machine, "machineId" | "state">): Promise<void> {
        if (DEMO_MODE) return addDemoMachine(machine);

        const body = mapMachineToApi(machine);
        const response = await authHandler(
            this.BASEURL,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
        );
        return response;
    }

    async modifyMachine(machine: Omit<Machine, "state">): Promise<void> {
        if (DEMO_MODE) return modifyDemoMachine(machine);

        const body = mapMachineToApi(machine);
        const response = await authHandler(
            this.BASEURL+`/${machine.machineId}`,
            {
                method: "PUT",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
        );
        return response;
    }

    async deleteMachine(uuid: string): Promise<void> {
        if (DEMO_MODE) return deleteDemoMachine(uuid);

        const response = await authHandler(
            `${this.BASEURL}/${uuid}`,
            {
                method: "DELETE",
                credentials: "include"
            });
        return response;
    }
}