import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  async create(
    @Body() createMachineDto: CreateMachineDto,
  ): Promise<{ message: string }> {
    try {
      const existingMachine = await this.machinesService.findByMachineNumber(createMachineDto.machineNumber);
      if (existingMachine) {
        throw new BadRequestException(`Machine with machineNumber ${createMachineDto.machineNumber} already exists.`);
      }
      await this.machinesService.create(createMachineDto);
      return { message: 'Machine created successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.machinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.machinesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto) {
    const machine = await this.machinesService.findOne(+id);
    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found.`);
    }
    return this.machinesService.update(+id, updateMachineDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const machine = await this.machinesService.findOne(+id);
    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found.`);
    }
    await this.machinesService.remove(+id);
    return { message: `Machine with ID ${id} has been removed successfully.` };
  }
}
