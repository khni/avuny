import { User } from "@avuny/db/types";
import { LocalAuthService } from "../lib/services/LocalAuthService.js";
import { UserRepository } from "../repositories/UserRepository.js";

const localAuthservce = new LocalAuthService(new UserRepository());
