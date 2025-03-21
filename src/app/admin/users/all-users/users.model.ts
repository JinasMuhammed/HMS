export class Users {
  id: number;
  username: string;
  email: string;
  password: string;
  email_status: string;
  role: string ;
  firstName: string ;
  lastName: string ;
  img: string ;

  constructor(user: Partial<Users>) {
    this.id = user.id || 0;
    this.username = user.username || '';
    this.email = user.email || '';
    this.password = user.password || '';
    this.email_status = user.email_status || 'unverified';  // Default to 'unverified' if not provided
    this.role = user.role || '';  // Default to 'User' if no role is provided
    this.firstName = user.firstName || '';  // Default to empty string
    this.lastName = user.lastName || '';  // Default to empty string
    this.img = user.img || '';  // Default image if not provided
  }
}
