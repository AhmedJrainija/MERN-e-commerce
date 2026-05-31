export interface loginRequest {
  email: string,
  password: string
}

export interface registerRequest {
  email: string,
  password: string,
  firstName: string,
  lastName: string
}


export interface editAccountReques {
  email: string,
  password: string,
  newPassword: string,
  confirmPassword: string,
  firstName: string,
  lastName: string
}