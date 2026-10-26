import { ClubApi } from "../../domain/entities/models/club";
import { MachineApi } from "../../domain/entities/models/machine";
import { TenantApi } from "../../domain/entities/models/tenant";
import { UserApi } from "../../domain/entities/models/user";

export type DemoDatabase = {
    tenants: TenantApi[];
    clubs: ClubApi[];
    users: UserApi[];
    machines: MachineApi[];
};

export const DEFAULT_DEMO_DATABASE: DemoDatabase = {
    tenants: [
        {
            tenantId: "demo-tenant-1",
            name: "Smart Padel Automation",
            cif: "B12345678",
            address: "Calle Mayor 12, Madrid",
            phone: "600111222",
            email: "contact@smartpadel.demo",
            remark: "Main demo tenant",
            micronId: "MIC-TEN-001",
            managers: []
        },
        {
            tenantId: "demo-tenant-2",
            name: "Vending Solutions SL",
            cif: "B87654321",
            address: "Avenida Industria 8, Barcelona",
            phone: "600333444",
            email: "info@vendingsolutions.demo",
            remark: "Vending operator",
            micronId: "MIC-TEN-002",
            managers: []
        },
        {
            tenantId: "demo-tenant-3",
            name: "Healthy Snacks Group",
            cif: "B11223344",
            address: "Plaza Mercado 3, Valencia",
            phone: "600555666",
            email: "hello@healthysnacks.demo",
            remark: "Healthy snacks tenant",
            micronId: "MIC-TEN-003",
            managers: []
        }
    ],
    clubs: [
        {
            clubId: "demo-club-1",
            name: "Padel Club Madrid",
            cif: "B20000001",
            address: "Calle de la Pala 5, Madrid",
            phone: "610100200",
            email: "madrid@padelclub.demo",
            remark: "Flagship padel club",
            micronId: "MIC-CLUB-001",
            accountingId: "ACC-CLUB-001",
            tenantId: "demo-tenant-1",
            tenantEntityName: "Smart Padel Automation",
            userManagers: []
        },
        {
            clubId: "demo-club-2",
            name: "Padel Club Barcelona",
            cif: "B20000002",
            address: "Carrer del Mar 21, Barcelona",
            phone: "610300400",
            email: "barcelona@padelclub.demo",
            remark: "Beach padel club",
            micronId: "MIC-CLUB-002",
            accountingId: "ACC-CLUB-002",
            tenantId: "demo-tenant-1",
            tenantEntityName: "Smart Padel Automation",
            userManagers: []
        },
        {
            clubId: "demo-club-3",
            name: "Gym & Vending Center",
            cif: "B20000003",
            address: "Gran Via 100, Barcelona",
            phone: "610500600",
            email: "gym@vendingsolutions.demo",
            remark: "Gym with vending area",
            micronId: "MIC-CLUB-003",
            accountingId: "ACC-CLUB-003",
            tenantId: "demo-tenant-2",
            tenantEntityName: "Vending Solutions SL",
            userManagers: []
        },
        {
            clubId: "demo-club-4",
            name: "Snack Point Valencia",
            cif: "B20000004",
            address: "Calle Colón 14, Valencia",
            phone: "610700800",
            email: "valencia@healthysnacks.demo",
            remark: "Snack point in city center",
            micronId: "MIC-CLUB-004",
            accountingId: "ACC-CLUB-004",
            tenantId: "demo-tenant-3",
            tenantEntityName: "Healthy Snacks Group",
            userManagers: []
        }
    ],
    machines: [
        {
            machineId: "demo-machine-1",
            code: "SPV-001",
            smartFridgeId: "SF-001",
            smartFridgePassword: "sf-demo-1",
            terminalId: "1001",
            toaSerialNumber: "TOA-1001",
            rustdeskId: "RUST-001",
            rustdeskPass: "rust-demo-1",
            clubName: "Padel Club Madrid",
            clubId: "demo-club-1"
        },
        {
            machineId: "demo-machine-2",
            code: "SPV-002",
            smartFridgeId: "SF-002",
            smartFridgePassword: "sf-demo-2",
            terminalId: "1002",
            toaSerialNumber: "TOA-1002",
            rustdeskId: "RUST-002",
            rustdeskPass: "rust-demo-2",
            clubName: "Padel Club Madrid",
            clubId: "demo-club-1"
        },
        {
            machineId: "demo-machine-3",
            code: "SPV-003",
            smartFridgeId: "SF-003",
            smartFridgePassword: "sf-demo-3",
            terminalId: "1003",
            toaSerialNumber: "TOA-1003",
            rustdeskId: "RUST-003",
            rustdeskPass: "rust-demo-3",
            clubName: "Padel Club Barcelona",
            clubId: "demo-club-2"
        },
        {
            machineId: "demo-machine-4",
            code: "SPV-004",
            smartFridgeId: "SF-004",
            smartFridgePassword: "sf-demo-4",
            terminalId: "1004",
            toaSerialNumber: "TOA-1004",
            rustdeskId: "RUST-004",
            rustdeskPass: "rust-demo-4",
            clubName: "Gym & Vending Center",
            clubId: "demo-club-3"
        },
        {
            machineId: "demo-machine-5",
            code: "SPV-005",
            smartFridgeId: "SF-005",
            smartFridgePassword: "sf-demo-5",
            terminalId: "1005",
            toaSerialNumber: "TOA-1005",
            rustdeskId: "RUST-005",
            rustdeskPass: "rust-demo-5",
            clubName: "Gym & Vending Center",
            clubId: "demo-club-3"
        },
        {
            machineId: "demo-machine-6",
            code: "SPV-006",
            smartFridgeId: "SF-006",
            smartFridgePassword: "sf-demo-6",
            terminalId: "1006",
            toaSerialNumber: "TOA-1006",
            rustdeskId: "RUST-006",
            rustdeskPass: "rust-demo-6",
            clubName: "Snack Point Valencia",
            clubId: "demo-club-4"
        }
    ],
    users: [
        {
            userManagerId: "demo-user-1",
            username: "tenant.manager",
            password: "demo-pass-1",
            micronId: "MIC-USR-001",
            micronUser: "tenant-manager",
            micronPass: "micron-pass-1",
            userType: "2",
            tenantEntityName: "Smart Padel Automation",
            tenantEntityId: "demo-tenant-1",
            clubEntityName: null,
            clubEntityId: null
        },
        {
            userManagerId: "demo-user-2",
            username: "madrid.manager",
            password: "demo-pass-2",
            micronId: "MIC-USR-002",
            micronUser: "madrid-manager",
            micronPass: "micron-pass-2",
            userType: "1",
            tenantEntityName: "Smart Padel Automation",
            tenantEntityId: "demo-tenant-1",
            clubEntityName: "Padel Club Madrid",
            clubEntityId: "demo-club-1"
        },
        {
            userManagerId: "demo-user-3",
            username: "gym.manager",
            password: "demo-pass-3",
            micronId: "MIC-USR-003",
            micronUser: "gym-manager",
            micronPass: "micron-pass-3",
            userType: "1",
            tenantEntityName: "Vending Solutions SL",
            tenantEntityId: "demo-tenant-2",
            clubEntityName: "Gym & Vending Center",
            clubEntityId: "demo-club-3"
        },
        {
            userManagerId: "demo-user-4",
            username: "vending.admin",
            password: "demo-pass-4",
            micronId: "MIC-USR-004",
            micronUser: "vending-admin",
            micronPass: "micron-pass-4",
            userType: "2",
            tenantEntityName: "Vending Solutions SL",
            tenantEntityId: "demo-tenant-2",
            clubEntityName: null,
            clubEntityId: null
        }
    ]
};
