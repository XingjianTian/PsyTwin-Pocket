import { normalizeCollection, requestPocket, isSuccessResponse, unwrapData } from './pocket';

const fallbackServices = [
  {
    id: 1,
    name: '心理咨询室 A01',
    type: 'counseling',
    status: 'available',
    location: '学生活动中心 3 层',
    duration: 50,
    description: '专业心理咨询师一对一深度咨询',
    devices: [{ name: '小米手环 9', online: true }],
    availableTimes: ['09:00', '09:30', '10:00', '14:00', '14:30', '15:00'],
  },
];

const fallbackRecords = [
  {
    id: 101,
    serviceId: 1,
    serviceName: '心理咨询室 A01',
    serviceType: 'counseling',
    date: '2026-04-08',
    time: '14:00',
    status: 'pending',
    reason: '最近睡眠质量较差，想了解改善方法',
    cancelable: true,
    location: '学生活动中心 3 层',
    counselor: '王老师',
  },
];

function mapRoomToService(room) {
  const roomStatus = String(room.status || 'AVAILABLE').toLowerCase();
  const isVR = room.name && room.name.includes('VR');
  const isDecompression = room.name && room.name.includes('减压舱');
  const type = isVR ? 'vr' : isDecompression ? 'decompression' : 'counseling';
  const duration = isVR ? 30 : isDecompression ? 50 : 50;
  const isBusy = roomStatus === 'in_use';

  return {
    id: room.id,
    name: room.name,
    type,
    status: isBusy ? 'busy' : roomStatus === 'maintenance' ? 'maintenance' : 'available',
    location: room.location,
    duration,
    description: isVR
      ? 'VR 放松训练、冥想引导、场景暴露疗法'
      : isDecompression
        ? '减压放松训练、生物反馈调节、压力释放'
        : '专业心理咨询师一对一深度咨询',
    devices: isVR
      ? [
          { name: 'Pico 4 Enterprise', online: true },
          { name: '生物反馈仪', online: false },
        ]
      : [{ name: '小米手环 9', online: true }],
    availableTimes: ['09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'],
    currentUser: isBusy
      ? {
          name: '张同学',
          studentId: room.currentStudentId || '2024001',
          plan: '社交焦虑脱敏',
          usedMinutes: 25,
          totalMinutes: duration,
        }
      : null,
  };
}

function mapRecord(record) {
  return {
    ...record,
    serviceName: record.serviceName || record.name || '',
    serviceType: String(record.serviceType || record.type || 'counseling').toLowerCase(),
    status: String(record.status || 'pending').toLowerCase(),
  };
}

function buildStats(services) {
  return {
    available: services.filter((item) => item.status === 'available').length,
    busy: services.filter((item) => item.status === 'busy').length,
    total: services.length,
  };
}

function sortServices(services) {
  const typePriority = { counseling: 1, decompression: 2, vr: 3 };

  return [...services].sort((left, right) => {
    const priority = (typePriority[left.type] || 99) - (typePriority[right.type] || 99);
    if (priority !== 0) {
      return priority;
    }

    const leftNumber = Number(String(left.name || '').match(/\d+/)?.[0] || 0);
    const rightNumber = Number(String(right.name || '').match(/\d+/)?.[0] || 0);
    return leftNumber - rightNumber;
  });
}

export async function getAppointmentOverview() {
  try {
    const [servicesResponse, recordsResponse] = await Promise.all([
      requestPocket({
        method: 'GET',
        url: '/student/appointment/services',
      }),
      requestPocket({
        method: 'GET',
        url: '/student/appointment/records',
      }),
    ]);

    const servicesPayload = unwrapData(servicesResponse, ['rooms']) || {};
    const recordsPayload = unwrapData(recordsResponse, ['records']) || {};
    const services = isSuccessResponse(servicesResponse)
      ? sortServices(normalizeCollection(servicesPayload.rooms).map(mapRoomToService))
      : fallbackServices;
    const records = isSuccessResponse(recordsResponse)
      ? normalizeCollection(recordsPayload.records).map(mapRecord)
      : fallbackRecords;

    return {
      services,
      records,
      stats: buildStats(services),
    };
  } catch (error) {
    return {
      services: fallbackServices,
      records: fallbackRecords,
      stats: buildStats(fallbackServices),
    };
  }
}
