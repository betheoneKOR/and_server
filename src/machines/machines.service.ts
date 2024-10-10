import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Machine } from '../postgresql/entities/machine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
  ) {}

  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const machine = this.machineRepository.create(createMachineDto);
    return await this.machineRepository.save(machine);
  }

  async findAll(): Promise<Machine[]> {
    return await this.machineRepository.find();
  }

  async getCount(): Promise<number> {
    return await this.machineRepository.count();
  }

  async findOne(id: number): Promise<Machine> {
    const machine = await this.findByMachineNumber(id);
    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }
    return machine;
  }

  async findByMachineNumber(machineNumber: number): Promise<Machine | null> {
    return await this.machineRepository.findOneBy({ machineNumber });
  }

  async update(
    id: number,
    updateMachineDto: UpdateMachineDto,
  ): Promise<Machine> {
    const machine = await this.findOne(id);
    await this.machineRepository.update(machine.id, updateMachineDto);
    return { ...machine, ...updateMachineDto };
  }

  async remove(id: number): Promise<void> {
    const machine = await this.findOne(id);
    await this.machineRepository.delete(machine.id);
  }
}
