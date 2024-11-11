import { FieldValues } from "react-hook-form";
import IUser from "../types/IUser";

export function convertFieldValuesToUser(fields: FieldValues): IUser {
    return {
      _id: fields.id || "",
      email: fields.email || "",
      username: fields.username || "",
      password: fields.password || "",
      firstname: fields.firstname || "",
      lastname: fields.lastname || "",
      phone: fields.phone || "",
      sex: fields.sex || "otro",
      role: fields.role || "usuario",
    };
  }