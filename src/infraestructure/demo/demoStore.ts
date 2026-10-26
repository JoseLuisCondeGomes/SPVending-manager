import {
    ClubApiResponse,
    MachineApiResponse,
    TenantApiResponse,
    UserApiResponse
} from "../../domain/entities/api-models/apiResponse";
import {
    Club,
    ClubApi,
    ClubInfoDisplay,
    ClubOfTenant,
    ClubOption
} from "../../domain/entities/models/club";
import {
    Machine,
    MachineApi,
    MachineInfoDisplay
} from "../../domain/entities/models/machine";
import {
    PotentialTenant,
    Tenant,
    TenantApi,
    TenantInfoDisplay
} from "../../domain/entities/models/tenant";
import {
    User,
    UserApi,
    UserInfoDisplay
} from "../../domain/entities/models/user";
import { DEFAULT_DEMO_DATABASE, DemoDatabase } from "./demoData";

const STORAGE_KEY = "spvending-demo-database-v1";

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function isDemoDatabase(value: unknown): value is DemoDatabase {
    if (typeof value !== "object" || value === null) return false;
    const database = value as Partial<DemoDatabase>;
    return Array.isArray(database.tenants)
        && Array.isArray(database.clubs)
        && Array.isArray(database.users)
        && Array.isArray(database.machines);
}

function readDatabase(): DemoDatabase {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
            const parsed: unknown = JSON.parse(raw);
            if (isDemoDatabase(parsed)) return parsed;
        }
    } catch {
        // Fall through to the seed data when localStorage is unavailable or corrupted.
    }

    const seed = clone(DEFAULT_DEMO_DATABASE);
    writeDatabase(seed);
    return seed;
}

function writeDatabase(database: DemoDatabase): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    } catch {
        // The demo still works in memory for the current render without localStorage.
    }
}

function updateDatabase(updater: (database: DemoDatabase) => void): void {
    const database = readDatabase();
    updater(database);
    writeDatabase(database);
}

function createId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function tenantName(database: DemoDatabase, tenantId: string): string {
    return database.tenants.find(tenant => tenant.tenantId === tenantId)?.name ?? "";
}

function clubName(database: DemoDatabase, clubId: string): string {
    return database.clubs.find(club => club.clubId === clubId)?.name ?? "";
}

// Tenants:
export function getDemoTenantList(): TenantApiResponse {
    const database = readDatabase();
    const content: TenantInfoDisplay[] = database.tenants.map(tenant => ({
        tenantId: tenant.tenantId,
        name: tenant.name,
        cif: tenant.cif,
        phone: tenant.phone,
        email: tenant.email,
        clubsCount: database.clubs.filter(club => club.tenantId === tenant.tenantId).length
    }));

    return {
        content,
        page: { size: 10, number: 0, totalElements: content.length, totalPages: 1 }
    };
}

export function findDemoTenant(tenantUuid: string): TenantApi | null {
    const database = readDatabase();
    const tenant = database.tenants.find(item => item.tenantId === tenantUuid);
    if (tenant === undefined) return null;

    return {
        ...clone(tenant),
        managers: database.users
            .filter(user => user.tenantEntityId === tenantUuid)
            .map(user => user.username)
    };
}

export function addDemoTenant(tenant: Omit<Tenant, "tenantId" | "numberOfClubs">): void {
    updateDatabase(database => {
        database.tenants.push({
            tenantId: createId("demo-tenant"),
            name: tenant.tenantName,
            cif: tenant.cif,
            address: tenant.address,
            phone: String(tenant.phone),
            email: tenant.email,
            remark: tenant.remark,
            micronId: tenant.micronId,
            managers: []
        });
    });
}

export function modifyDemoTenant(tenant: Omit<Tenant, "numberOfClubs">): void {
    updateDatabase(database => {
        const storedTenant = database.tenants.find(item => item.tenantId === tenant.tenantId);
        if (storedTenant === undefined) return;

        storedTenant.name = tenant.tenantName;
        storedTenant.cif = tenant.cif;
        storedTenant.address = tenant.address;
        storedTenant.phone = String(tenant.phone);
        storedTenant.email = tenant.email;
        storedTenant.remark = tenant.remark;
        storedTenant.micronId = tenant.micronId;

        database.clubs
            .filter(club => club.tenantId === storedTenant.tenantId)
            .forEach(club => { club.tenantEntityName = storedTenant.name; });
    });
}

export function deleteDemoTenant(tenantUuid: string): void {
    updateDatabase(database => {
        const clubIds = database.clubs
            .filter(club => club.tenantId === tenantUuid)
            .map(club => club.clubId);

        database.tenants = database.tenants.filter(tenant => tenant.tenantId !== tenantUuid);
        database.clubs = database.clubs.filter(club => club.tenantId !== tenantUuid);
        database.machines = database.machines.filter(machine => !clubIds.includes(machine.clubId));
        database.users = database.users.filter(user => user.tenantEntityId !== tenantUuid);
    });
}

export function getDemoPotentialTenants(): PotentialTenant[] {
    return readDatabase().tenants.map(tenant => ({
        tenantId: tenant.tenantId,
        name: tenant.name
    }));
}

export function getDemoTenantClubs(tenantUuid: string): ClubOfTenant[] {
    const database = readDatabase();
    return database.clubs
        .filter(club => club.tenantId === tenantUuid)
        .map(club => ({
            clubId: club.clubId,
            name: club.name,
            address: club.address,
            phone: club.phone,
            tenantEntityName: club.tenantEntityName,
            userManagers: database.users
                .filter(user => user.clubEntityId === club.clubId)
                .map(user => user.username),
            machinesCount: database.machines.filter(machine => machine.clubId === club.clubId).length
        }));
}

// Clubs:
export function getDemoClubList(): ClubApiResponse {
    const database = readDatabase();
    const content: ClubInfoDisplay[] = database.clubs.map(club => ({
        clubId: club.clubId,
        name: club.name,
        address: club.address,
        phone: club.phone,
        tenantEntityName: club.tenantEntityName,
        machinesCount: database.machines.filter(machine => machine.clubId === club.clubId).length
    }));

    return {
        content,
        page: { size: 10, number: 0, totalElements: content.length, totalPages: 1 }
    };
}

export function findDemoClub(clubUuid: string): ClubApi | null {
    const database = readDatabase();
    const club = database.clubs.find(item => item.clubId === clubUuid);
    if (club === undefined) return null;

    return {
        ...clone(club),
        userManagers: database.users
            .filter(user => user.clubEntityId === clubUuid)
            .map(user => user.username)
    };
}

export function addDemoClub(club: Omit<Club, "clubId" | "numberOfMachines">): void {
    updateDatabase(database => {
        database.clubs.push({
            clubId: createId("demo-club"),
            name: club.clubName,
            cif: club.cif,
            address: club.address,
            phone: String(club.phone),
            email: club.email,
            remark: club.remark,
            micronId: club.micronId,
            accountingId: club.accountingId,
            tenantId: club.tenantId,
            tenantEntityName: tenantName(database, club.tenantId),
            userManagers: []
        });
    });
}

export function modifyDemoClub(club: Omit<Club, "numberOfMachines">): void {
    updateDatabase(database => {
        const storedClub = database.clubs.find(item => item.clubId === club.clubId);
        if (storedClub === undefined) return;

        storedClub.name = club.clubName;
        storedClub.cif = club.cif;
        storedClub.address = club.address;
        storedClub.phone = String(club.phone);
        storedClub.email = club.email;
        storedClub.remark = club.remark;
        storedClub.micronId = club.micronId;
        storedClub.accountingId = club.accountingId;
        storedClub.tenantId = club.tenantId;
        storedClub.tenantEntityName = tenantName(database, club.tenantId);

        database.machines
            .filter(machine => machine.clubId === storedClub.clubId)
            .forEach(machine => { machine.clubName = storedClub.name; });
    });
}

export function deleteDemoClub(clubUuid: string): void {
    updateDatabase(database => {
        database.clubs = database.clubs.filter(club => club.clubId !== clubUuid);
        database.machines = database.machines.filter(machine => machine.clubId !== clubUuid);
        database.users = database.users.filter(user => user.clubEntityId !== clubUuid);
    });
}

export function getDemoClubOptions(): ClubOption[] {
    return readDatabase().clubs.map(club => ({
        clubId: club.clubId,
        name: club.name
    }));
}

// Machines:
export function getDemoMachineList(): MachineApiResponse {
    const database = readDatabase();
    const content: MachineInfoDisplay[] = database.machines.map(machine => ({
        machineId: machine.machineId,
        code: machine.code,
        clubName: machine.clubName,
        toaSerialNumber: machine.toaSerialNumber,
        terminalId: machine.terminalId,
        smartFridgeId: machine.smartFridgeId
    }));

    return {
        content,
        page: { size: 10, number: 0, totalElements: content.length, totalPages: 1 }
    };
}

export function findDemoMachine(machineUuid: string): MachineApi | null {
    return clone(readDatabase().machines.find(machine => machine.machineId === machineUuid) ?? null);
}

export function addDemoMachine(machine: Omit<Machine, "machineId" | "state">): void {
    updateDatabase(database => {
        database.machines.push({
            machineId: createId("demo-machine"),
            code: machine.machineCode,
            smartFridgeId: machine.smartFridgeld,
            smartFridgePassword: machine.smartFridgePassword,
            terminalId: String(machine.terminalId),
            toaSerialNumber: machine.tnaSerialNumber,
            rustdeskId: machine.rustdeskId,
            rustdeskPass: machine.rustdeskPass,
            clubName: clubName(database, machine.clubId),
            clubId: machine.clubId
        });
    });
}

export function modifyDemoMachine(machine: Omit<Machine, "state">): void {
    updateDatabase(database => {
        const storedMachine = database.machines.find(item => item.machineId === machine.machineId);
        if (storedMachine === undefined) return;

        storedMachine.code = machine.machineCode;
        storedMachine.smartFridgeId = machine.smartFridgeld;
        storedMachine.smartFridgePassword = machine.smartFridgePassword;
        storedMachine.terminalId = String(machine.terminalId);
        storedMachine.toaSerialNumber = machine.tnaSerialNumber;
        storedMachine.rustdeskId = machine.rustdeskId;
        storedMachine.rustdeskPass = machine.rustdeskPass;
        storedMachine.clubId = machine.clubId;
        storedMachine.clubName = clubName(database, machine.clubId);
    });
}

export function deleteDemoMachine(machineUuid: string): void {
    updateDatabase(database => {
        database.machines = database.machines.filter(machine => machine.machineId !== machineUuid);
    });
}

// Users:
export function getDemoUserList(): UserApiResponse {
    const database = readDatabase();
    const content: UserInfoDisplay[] = database.users.map(user => ({
        userManagerId: user.userManagerId,
        username: user.username,
        micronId: user.micronId,
        micronUser: user.micronUser,
        tenantEntityName: user.tenantEntityName ?? "",
        clubEntityName: user.clubEntityName ?? ""
    }));

    return {
        content,
        page: { size: 10, number: 0, totalElements: content.length, totalPages: 1 }
    };
}

export function findDemoUser(userUuid: string): UserApi | null {
    return clone(readDatabase().users.find(user => user.userManagerId === userUuid) ?? null);
}

function resolveUserTenant(database: DemoDatabase, tenantId: string, clubId?: string): string {
    if (tenantId) return tenantId;
    if (!clubId) return "";
    return database.clubs.find(club => club.clubId === clubId)?.tenantId ?? "";
}

export function addDemoUser(user: Omit<User, "userId" | "clubName">): void {
    updateDatabase(database => {
        const resolvedTenantId = resolveUserTenant(database, user.tenantId, user.clubId);

        database.users.push({
            userManagerId: createId("demo-user"),
            username: user.username,
            password: user.password,
            micronId: user.micronId,
            micronUser: user.micronUser,
            micronPass: user.micronPass,
            userType: String(user.userType),
            tenantEntityName: resolvedTenantId ? tenantName(database, resolvedTenantId) : null,
            tenantEntityId: resolvedTenantId || null,
            clubEntityName: user.clubId ? clubName(database, user.clubId) : null,
            clubEntityId: user.clubId ?? null
        });
    });
}

export function modifyDemoUser(user: User): void {
    updateDatabase(database => {
        const storedUser = database.users.find(item => item.userManagerId === user.userId);
        if (storedUser === undefined) return;

        const resolvedTenantId = resolveUserTenant(database, user.tenantId, user.clubId);

        storedUser.username = user.username;
        storedUser.password = user.password;
        storedUser.micronId = user.micronId;
        storedUser.micronUser = user.micronUser;
        storedUser.micronPass = user.micronPass;
        storedUser.userType = String(user.userType);
        storedUser.tenantEntityId = resolvedTenantId || null;
        storedUser.tenantEntityName = resolvedTenantId ? tenantName(database, resolvedTenantId) : null;
        storedUser.clubEntityId = user.clubId ?? null;
        storedUser.clubEntityName = user.clubId ? clubName(database, user.clubId) : null;
    });
}

export function deleteDemoUser(userUuid: string): void {
    updateDatabase(database => {
        database.users = database.users.filter(user => user.userManagerId !== userUuid);
    });
}
