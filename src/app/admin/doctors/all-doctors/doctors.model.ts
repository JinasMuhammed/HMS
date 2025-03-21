export class Doctors {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  image: string;
  department: string;
  biography: string;

  constructor(doctor: Partial<Doctors>) {
    this.id = doctor.id || 0;
    this.first_name = doctor.first_name || '';
    this.last_name = doctor.last_name || '';
    this.email = doctor.email || '';
    this.dob = doctor.dob || '';
    this.gender = doctor.gender || '';
    this.address = doctor.address || '';
    this.phone = doctor.phone || '';
    this.image = doctor.image || 'default-user-image.jpg'; // Default image
    this.department = doctor.department || '';
    this.biography = doctor.biography || '';
  }
}
