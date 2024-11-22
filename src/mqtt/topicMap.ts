interface ITopicMap {
  path: string;
  system: string;
  return: string;
}

export const topicMaps: { [key: string]: ITopicMap } = {
  MachineName: {
    path: 'getMachineName',
    system: '/System/MachineName',
    return: '/Return/MachineName',
  },
  MachineModel: {
    path: 'getMachineModel',
    system: '/System/MachineModel',
    return: '/Return/MachineModel',
  },
  HealthCheck: {
    path: 'getHealthCheck',
    system: '/Status/HealthCheck',
    return: '/Return/HealthCheck',
  },
  GetIsRun: {
    path: 'getIsRun',
    system: '/Status/IsRun',
    return: '/Return/IsRun',
  },
  GetFeedrate: {
    path: 'getFeedrate',
    system: '/Actual/Feedrate',
    return: '/Return/Feedrate',
  },
  GetSpindleSpeed: {
    path: 'getSpindleSpeed',
    system: '/Actual/SpindleSpeed',
    return: '/Return/SpindleSpeed',
  },
  GetLoadmeterSvPer: {
    path: 'getLoadmeterSvPer',
    system: '/Actual/LoadmeterSvPer',
    return: '/Return/LoadmeterSvPer',
  },
  GetLoadmeterSvAm: {
    path: 'getLoadmeterSvAm',
    system: '/Actual/LoadmeterSvAm',
    return: '/Return/LoadmeterSvAm',
  },
  GetLoadmeterSpPer: {
    path: 'getLoadmeterSpPer',
    system: '/Actual/LoadmeterSpPer',
    return: '/Return/LoadmeterSpPer',
  },
  GetLoadmeterSpAv: {
    path: 'getLoadmeterSpAv',
    system: '/Actual/LoadmeterSpAv',
    return: '/Return/LoadmeterSpAv',
  },
  GetPos: {
    path: 'getPos',
    system: '/Actual/Pos',
    return: '/Return/Pos',
  },
  GetSequenceNumber: {
    path: 'getSequenceNumber',
    system: '/Modal/SequenceNumber',
    return: '/Return/SequenceNumber',
  },
  GetM_Feedrate: {
    path: 'getM_Feedrate',
    system: '/Modal/M_Feedrate',
    return: '/Return/M_Feedrate',
  },
  GetM_Spindle: {
    path: 'getM_Spindle',
    system: '/Modal/M_Spindle',
    return: '/Return/M_Spindle',
  },
  GetM_Tool: {
    path: 'getM_Tool',
    system: '/Modal/M_Tool',
    return: '/Return/M_Tool',
  },
  GetM_Gcode: {
    path: 'getM_Gcode',
    system: '/Modal/M_Gcode',
    return: '/Return/M_Gcode',
  },
  GetProgramNumber: {
    path: 'getProgramNumber',
    system: '/Modal/ProgramNumber',
    return: '/Return/ProgramNumber',
  },
  GetCycleTime: {
    path: 'getCycleTime',
    system: '/Modal/CycleTime',
    return: '/Return/CycleTime',
  },
};
