export class Appointments {
  id: number;
  patient_name: string;
  department: string;
  doctor_name: string;
  date: string;
  time: string;
  email: string;
  phone: string;

  constructor(appointment: Partial<Appointments>) {
    this.id = appointment.id || 0;
    this.patient_name = appointment.patient_name || '';
    this.department = appointment.department || '';
    this.doctor_name = appointment.doctor_name || '';
    this.date = appointment.date || '';
    this.time = appointment.time || '';
    this.email = appointment.email || '';
    this.phone = appointment.phone || '';
  }
}
