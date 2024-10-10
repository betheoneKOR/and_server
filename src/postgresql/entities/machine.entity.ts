import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Machine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    machineName: string;

    @Column()
    modelYear: string;
    
    @Column()
    machineNumber: number;
}
